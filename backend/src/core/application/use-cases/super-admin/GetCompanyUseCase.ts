import { Types } from "../../../../infra/container/types";
import { inject, injectable } from "inversify";
import {
  CompanyNotFoundError,
  InvalidCompanyIdError,
} from "../../../../shared/errors";
import { GetCompanyResponseDTO } from "../../dto/super-admin/GetCompanyDTO";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ILogger } from "../../services/ILogger";

@injectable()
export class GetCompanyUseCase {
  constructor(
    @inject(Types.Logger)
    private logger: ILogger,
    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
  ) { }

  async execute(
    companyId: string,
  ): Promise<{ response: GetCompanyResponseDTO }> {
    if (!companyId || !companyId.trim()) {
      throw new InvalidCompanyIdError(
        "The provided company ID is invalid or does not exist",
      );
    }

    const id = companyId.trim().toLowerCase();

    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Regex.test(id)) {
      throw new InvalidCompanyIdError("Invalid company ID format");
    }

    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new CompanyNotFoundError("Company not found");
    }

    if (company.status === "deleted") {
      throw new CompanyNotFoundError("Company has been deleted");
    }

    const companyStats = await this.companyRepository.getCompanyStats(id);

    const companyAdmin = await this.userRepository.findCompanyAdmin(id);

    let companyAdminData = null;

    if (companyAdmin) {
      companyAdminData = {
        id: companyAdmin.id,
        name: `${companyAdmin.firstName} ${companyAdmin.lastName}`,
        email: companyAdmin.email,
        lastLogin: companyAdmin.lastLogin
          ? companyAdmin.lastLogin.toISOString()
          : companyAdmin.updatedAt
            ? companyAdmin.updatedAt.toISOString()
            : new Date().toISOString(),
      };
    } else {
      this.logger.warn("Company has no admin", {
        companyId: id,
        timestamp: new Date().toISOString(),
      });
    }

    const monthlyRevenue = 0;

    this.logger.info("Super admin viewed company details", {
      companyId: id,
      companyName: company.name,
      timestamp: new Date().toISOString(),
    });

    return {
      response: {
        success: true,
        data: {
          company: {
            id: company.id,
            name: company.name,
            email: company.email,
            monthlyRevenue: 0,
            phone: company.phone || null,
            website: company.website || null,
            address: company.address || null,
            status: company.status,
            totalUsers: companyStats.totalUser,
            activeUsers: companyStats.activeUsers,
            totalProjects: companyStats.totalProjects,
            activeProjects: companyStats.activeProjects,
            storageUsed: company.storageUsed || 0,
            storageLimit: company.storageLimit || 5368709120,
            admin: companyAdminData,
            stats: {
              totalTasks: 0,
              completedTasks: 0,
            },
            billing: {
              monthlyRevenue,
              lastPaymentDate: null,
              nextBillingDate: null,
            },
            createdAt: company.createdAt.toISOString(),
            lastActiveAt: (
              company.lastActiveAt || company.updatedAt
            ).toISOString(),
          },
        },
      },
    };
  }
}
