import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ILogger } from "../../services/ILogger";
import {
    UpdateCompanyStatusRequestDTO,
    UpdateCompanyStatusResponseDTO,
} from "../../dto/super-admin/UpdateCompanyStatusDTO";
import { CompanyNotFoundError } from "../../../../shared/errors";

@injectable()
export class UpdateCompanyStatusUseCase {
    constructor(
        @inject(Types.CompanyRepository)
        private companyRepository: ICompanyRepository,
        @inject(Types.Logger)
        private logger: ILogger,
    ) { }

    async execute(
        req: UpdateCompanyStatusRequestDTO,
    ): Promise<{ response: UpdateCompanyStatusResponseDTO }> {
        const { companyId, status } = req;

        const company = await this.companyRepository.findById(companyId);

        if (!company) {
            throw new CompanyNotFoundError();
        }

        const updatedCompany = await this.companyRepository.updateStatus(
            companyId,
            status,
        );

        this.logger.info("Company status updated by super admin", {
            companyId,
            oldStatus: company.status,
            newStatus: status,
        });

        return {
            response: {
                success: true,
                message: `Company status updated to ${status}`,
                data: {
                    id: updatedCompany.id,
                    status: updatedCompany.status,
                },
            },
        };
    }
}
