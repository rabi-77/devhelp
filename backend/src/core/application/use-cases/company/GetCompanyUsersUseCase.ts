import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
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
        @inject(Types.Logger)
        private logger: ILogger,
    ) { }

    async execute(
        req: GetCompanyUsersRequestDTO,
    ): Promise<{ response: GetCompanyUsersResponseDTO }> {
        const { companyId, page, limit, search, status, role } = req;

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
