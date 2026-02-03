import { Company } from "../entities/Company";
import { IUnitWork } from "../../application/uow/IUnitWork";
import { IBaseRepository } from "./IBaseRepository";

export interface ICompanyRepository extends IBaseRepository<Company> {
  create(
    company: Omit<Company, "id" | "createdAt" | "updatedAt">,
    uow?: IUnitWork,
  ): Promise<Company>;
  findByEmail(email: string): Promise<Company | null>;
  findAllWithPagination(
    filters: any,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
  ): Promise<{ companies: Company[]; total: number }>;

  getCompanyStats(companyId: string): Promise<{
    totalUser: number;
    activeUsers: number;
    totalProjects: number;
    activeProjects: number;
  }>;

  getPlatformStatus(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    inactiveCompanies: number;
    suspendedCompanies: number;
    trialCompanies: number;
    totalUsers: number;
    totalProjects: number;
  }>;

  update(companyId: string, data: Partial<Company>): Promise<Company>;
  updateStatus(companyId: string, status: string): Promise<Company>;
}
