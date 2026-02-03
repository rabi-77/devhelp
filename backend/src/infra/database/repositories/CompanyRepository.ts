import { injectable } from "inversify";
import { Model } from "mongoose";
import { Company } from "../../../core/domain/entities/Company";
import { ICompanyRepository } from "../../../core/domain/repositories/ICompanyRepository";
import CompanyModel from "../models/CompanyModel";
import { v4 as uuidv4 } from "uuid";
import { IUnitWork } from "../../../core/application/uow/IUnitWork";
import { MongooseUnitOfWork } from "../../uow/MongooseUnitOfWork";
import UserModel from "../models/UserModel";
import { CompanyNotFoundError } from "../../../shared/errors/company/CompanyNotFoundError";

@injectable()
export class CompanyRepository implements ICompanyRepository {
  async create(
    company: Omit<Company, "id" | "createdAt" | "updatedAt">,
    uow?: IUnitWork,
  ): Promise<Company> {
    // Only use session if transactions are enabled and UoW is provided
    const useTransactions = process.env.USE_TRANSACTIONS === "true";
    const session =
      useTransactions && uow instanceof MongooseUnitOfWork
        ? uow.getSession()
        : undefined;

    const doc = new CompanyModel({
      _id: uuidv4(),
      ...company,
    });

    await doc.save({ session });
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<Company | null> {
    return this.findOne({ email });
  }

  // IBaseRepository methods
  async findById(id: string): Promise<Company | null> {
    const doc = await CompanyModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filter: any = {}): Promise<Company[]> {
    const docs = await CompanyModel.find(filter);
    return docs.map((doc) => this.toEntity(doc));
  }

  async findOne(filter: any): Promise<Company | null> {
    const doc = await CompanyModel.findOne(filter);
    return doc ? this.toEntity(doc) : null;
  }

  async count(filter: any = {}): Promise<number> {
    return await CompanyModel.countDocuments(filter);
  }

  async delete(id: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(id);
  }

  async deleteMany(filter: any): Promise<number> {
    const result = await CompanyModel.deleteMany(filter);
    return result.deletedCount || 0;
  }

  async exists(filter: any): Promise<boolean> {
    const count = await CompanyModel.countDocuments(filter).limit(1);
    return count > 0;
  }

  async findAllWithPagination(
    filters: any,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
  ): Promise<{ companies: Company[]; total: number }> {
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [doc, total] = await Promise.all([
      CompanyModel.find(filters)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit),
      CompanyModel.countDocuments(filters),
    ]);

    return {
      companies: doc.map((x) => this.toEntity(x)),
      total,
    };
  }

  async getCompanyStats(companyId: string): Promise<{
    totalUser: number;
    activeUsers: number;
    totalProjects: number;
    activeProjects: number;
  }> {
    //TODO: total projects should be added when project entity is created
    const totalProjects = 0;
    const activeProjects = 0;

    const [totalUser, activeUsers] = await Promise.all([
      UserModel.countDocuments({ companyId }),
      UserModel.countDocuments({ companyId, status: "active" }),
    ]);

    return {
      totalUser,
      activeUsers,
      totalProjects,
      activeProjects,
    };
  }

  async getPlatformStatus(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    inactiveCompanies: number;
    suspendedCompanies: number;
    trialCompanies: number;
    totalUsers: number;
    totalProjects: number;
  }> {
    const [
      totalCompanies,
      activeCompanies,
      inactiveCompanies,
      suspendedCompanies,
      trialCompanies,
      totalUsers,
    ] = await Promise.all([
      CompanyModel.countDocuments({}),
      CompanyModel.countDocuments({ status: "active" }),
      CompanyModel.countDocuments({ status: "inactive" }),
      CompanyModel.countDocuments({ status: "suspended" }),
      CompanyModel.countDocuments({ status: "trial" }),
      UserModel.countDocuments({}),
    ]);

    //TODO: Add totalProjects when project entity is created
    const totalProjects = 0;

    return {
      totalCompanies,
      activeCompanies,
      inactiveCompanies,
      suspendedCompanies,
      trialCompanies,
      totalUsers,
      totalProjects,
    };
  }

  async update(companyId: string, data: Partial<Company>): Promise<Company> {
    const company = await CompanyModel.findByIdAndUpdate(
      companyId,
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!company) {
      throw new CompanyNotFoundError();
    }

    return this.toEntity(company);
  }

  async updateStatus(companyId: string, status: string): Promise<Company> {
    const company = await CompanyModel.findByIdAndUpdate(
      companyId,
      { $set: { status } },
      { new: true, runValidators: true },
    );

    if (!company) {
      throw new CompanyNotFoundError();
    }

    return this.toEntity(company);
  }

  protected toEntity(doc: any): Company {
    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      status: doc.status,
      phone: doc.phone,
      website: doc.website,
      address: doc.address,
      storageUsed: doc.storageUsed,
      storageLimit: doc.storageLimit,
      lastActiveAt: doc.lastActiveAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
