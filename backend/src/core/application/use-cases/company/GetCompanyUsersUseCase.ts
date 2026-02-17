import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IInviteRepository } from "../../../domain/repositories/IInviteRepository";
import { ILogger } from "../../services/ILogger";
import {
    GetCompanyUsersRequestDTO,
    GetCompanyUsersResponseDTO,
} from "../../dto/company/GetCompanyUsersDTO";

@injectable()
export class GetCompanyUsersUseCase {
    constructor(
        @inject(Types.UserRepository)
        private userRepository: IUserRepository,
        @inject(Types.InviteRepository)
        private inviteRepository: IInviteRepository,
        @inject(Types.Logger)
        private logger: ILogger,
    ) { }

    async execute(
        req: GetCompanyUsersRequestDTO,
    ): Promise<{ response: GetCompanyUsersResponseDTO }> {
        const { companyId, page, limit, search, status, role } = req;

        // Special handling for "invited" status - fetch from Invites collection
        if (status === "invited") {
            const { invites, total } = await this.inviteRepository.findPendingByCompany(
                companyId,
                page,
                limit,
            );

            // Apply search filter on invites if provided
            let filteredInvites = invites;
            if (search) {
                const searchLower = search.toLowerCase();
                filteredInvites = invites.filter(
                    (invite) =>
                        invite.firstName.toLowerCase().includes(searchLower) ||
                        invite.lastName.toLowerCase().includes(searchLower) ||
                        invite.email.toLowerCase().includes(searchLower)
                );
            }

            const totalPages = Math.ceil(total / limit);
            const pagination = {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };

            // Format invites to match user summary structure
            const inviteSummaries = filteredInvites.map((invite) => ({
                id: invite.id,
                firstName: invite.firstName,
                lastName: invite.lastName,
                email: invite.email,
                role: invite.role,
                status: "invited" as const,
                lastLogin: undefined,
                createdAt: invite.createdAt?.toISOString() || new Date().toISOString(),
            }));

            this.logger.info("Fetched pending invites for company", {
                companyId,
                page,
                limit,
                total,
                search,
            });

            return {
                response: {
                    success: true,
                    data: {
                        users: inviteSummaries,
                        pagination,
                    },
                },
            };
        }

        // Regular user fetching for other statuses
        const filters: any = {};
        if (search) {
            filters.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (status) filters.status = status;
        if (role) filters.role = role;

        const { users, total } = await this.userRepository.findAllByCompanyId(
            companyId,
            page,
            limit,
            filters,
        );

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };

        const userSummaries = users.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin?.toISOString(),
            createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        }));

        this.logger.info("Fetched users for company", {
            companyId,
            page,
            limit,
            total,
            filters,
        });

        return {
            response: {
                success: true,
                data: {
                    users: userSummaries,
                    pagination,
                },
            },
        };
    }
}
