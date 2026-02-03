import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ILogger } from "../../services/ILogger";
import { IUnitWork } from "../../uow/IUnitWork";
import {
    UpdateUserStatusRequestDTO,
    UpdateUserStatusResponseDTO,
} from "../../dto/company/UpdateUserStatusDTO";
import { UserNotFoundError, UnauthorizedError } from "../../../../shared/errors";

@injectable()
export class UpdateUserStatusUseCase {
    constructor(
        @inject(Types.UserRepository)
        private userRepository: IUserRepository,
        @inject(Types.UnitOfWork)
        private uow: IUnitWork,
        @inject(Types.Logger)
        private logger: ILogger,
    ) { }

    async execute(
        req: UpdateUserStatusRequestDTO,
    ): Promise<{ response: UpdateUserStatusResponseDTO }> {
        const { userId, status, companyId } = req;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        // Ensure user belongs to the requester's company
        if (user.companyId !== companyId) {
            throw new UnauthorizedError(
                "You do not have permission to manage this user.",
            );
        }

        // Prevent blocking self or other admins if needed (optional rule)
        // For now, allowing admin to block other members/admins, but usually self-blocking is prevented in FE or here.
        // Let's prevent blocking SELF if userId matches requester userId (would need requesterId in DTO if we want to enforce this).

        const updatedUser = await this.userRepository.update(
            userId,
            { status },
            this.uow,
        );

        this.logger.info("User status updated", {
            userId,
            oldStatus: user.status,
            newStatus: status,
            updatedByCompany: companyId,
        });

        return {
            response: {
                success: true,
                message: `User ${status === "active" ? "unblocked" : "blocked"} successfully`,
                data: {
                    id: updatedUser.id,
                    status: updatedUser.status,
                },
            },
        };
    }
}
