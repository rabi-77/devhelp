import { IUserRepository } from "../../../core/domain/repositories/IUserRepository";
import UserModel from "../models/UserModel";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../../core/domain/entities/User";
import { injectable } from "inversify";
import { IUnitWork } from "../../../core/application/uow/IUnitWork";
import { MongooseUnitOfWork } from "../../uow/MongooseUnitOfWork";
import { UserNotFoundError } from "../../../shared/errors";

@injectable()
export class UserRepository implements IUserRepository {
  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    uow?: IUnitWork,
  ): Promise<User> {
    // Only use session if transactions are enabled and UoW is provided
    const useTransactions = process.env.USE_TRANSACTIONS === "true";
    const session =
      useTransactions && uow instanceof MongooseUnitOfWork
        ? uow.getSession()
        : undefined;

    const doc = new UserModel({
      _id: uuidv4(),
      ...userData,
    });
    await doc.save({ session });
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findByEmailAndCompanyId(
    email: string,
    companyId: string,
  ): Promise<User | null> {
    return this.findOne({ email, companyId });
  }

  // IBaseRepository methods
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filter: any = {}): Promise<User[]> {
    const docs = await UserModel.find(filter);
    return docs.map((doc) => this.toEntity(doc));
  }

  async findOne(filter: any): Promise<User | null> {
    const doc = await UserModel.findOne(filter);
    return doc ? this.toEntity(doc) : null;
  }

  async count(filter: any = {}): Promise<number> {
    return await UserModel.countDocuments(filter);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async deleteMany(filter: any): Promise<number> {
    const result = await UserModel.deleteMany(filter);
    return result.deletedCount || 0;
  }

  async exists(filter: any): Promise<boolean> {
    const count = await UserModel.countDocuments(filter).limit(1);
    return count > 0;
  }

  async update(
    userId: string,
    data: Partial<User>,
    uow?: IUnitWork,
  ): Promise<User> {
    // Only use session if transactions are enabled and UoW is provided
    const useTransactions = process.env.USE_TRANSACTIONS === "true";
    const session =
      useTransactions && uow instanceof MongooseUnitOfWork
        ? uow.getSession()
        : undefined;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true, session },
    );

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.toEntity(user);
  }

  async findCompanyAdmin(companyId: string): Promise<User | null> {
    return this.findOne({
      companyId,
      role: "admin",
      status: "active",
    });
  }

  async findAllByCompanyId(
    companyId: string,
    page: number,
    limit: number,
    filters: any = {},
  ): Promise<{ users: User[]; total: number }> {
    const query: any = { companyId, ...filters };
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(query),
    ]);

    return {
      users: docs.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  async countActiveUser(companyId: string, days: number): Promise<number> {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    return await UserModel.find({
      $and: [{ companyId }, { updatedAt: { $gte: startDate } }],
    }).countDocuments();
  }

  private toEntity(doc: any): User {
    return {
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      status: doc.status,
      companyId: doc.companyId,
      phone: doc.phone,
      profile: doc.profile,
      preferences: doc.preferences,
      lastLogin: doc.lastLogin,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
