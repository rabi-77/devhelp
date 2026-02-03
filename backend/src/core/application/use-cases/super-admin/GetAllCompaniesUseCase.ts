import { Types } from "../../../../infra/container/types";
import {
  CompanySummary,
  GetAllCompaniesRequestDTO,
  GetAllCompaniesResponseDTO,
} from "../../dto/super-admin/GetAllCompaniesDTO";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ILogger } from "../../services/ILogger";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllCompaniesUseCase {
  constructor(
    @inject(Types.Logger)
    private logger: ILogger,
    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
  ) { }

  async execute(
    req: GetAllCompaniesRequestDTO,
  ): Promise<{ response: GetAllCompaniesResponseDTO }> {
    const { page, limit, search, status, sortBy, sortOrder } = req;

    const filters: any = {};

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filters.status = status;
    }

    const skip = (page - 1) * limit;

    const { companies, total } =
      await this.companyRepository.findAllWithPagination(
        filters,
        skip,
        limit,
        sortBy,
        sortOrder,
      );

    const companiesWithStats: CompanySummary[] = await Promise.all(
      companies.map(async (company) => {
        const stats = await this.companyRepository.getCompanyStats(company.id);

        return {
          id: company.id,
          name: company.name,
          email: company.email,
          status: company.status,
          totalUsers: stats.totalUser,
          totalProjects: stats.totalProjects,
          monthlyRevenue: 0,
          lastActiveAt: (
            company.lastActiveAt || company.updatedAt
          ).toISOString(),
          createdAt: company.createdAt.toISOString(),
        };
      }),
    );

    const platformStats = await this.companyRepository.getPlatformStatus();

    const totalPages = Math.ceil(total / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    this.logger.info("Fetched companies for super admin", {
      page,
      limit,
      total,
      filters,
      timestamp: new Date().toISOString(),
    });

    return {
      response: {
        success: true,
        data: {
          companies: companiesWithStats,
          pagination,
          stats: platformStats,
        },
      },
    };
  }


}
