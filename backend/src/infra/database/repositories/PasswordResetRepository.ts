import { PasswordReset } from "../../../core/domain/entities/PasswordReset";
import { IPasswordResetRepository } from "../../../core/domain/repositories/IPasswordResetRepository";
import PasswordResetModel from "../models/PasswordResetModel";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { MongooseUnitOfWork } from "../../uow/MongooseUnitOfWork";
import { IUnitWork } from "../../../core/application/uow/IUnitWork";

@injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  async create(
    passwordReset: Omit<PasswordReset, "id" | "createdAt" | "updatedAt">,
  ): Promise<PasswordReset> {
    const doc = new PasswordResetModel({
      _id: uuidv4(),
      ...passwordReset,
    });

    await doc.save();
    return this.toEntity(doc);
  }

  async update(
    id: string,
    passwordReset: Partial<PasswordReset>,
    uow?: IUnitWork,
  ): Promise<PasswordReset> {
    // Only use session if transactions are enabled and UoW is provided
    const useTransactions = process.env.USE_TRANSACTIONS === "true";
    const session =
      useTransactions && uow instanceof MongooseUnitOfWork
        ? uow.getSession()
        : undefined;

    const doc = await PasswordResetModel.findByIdAndUpdate(
      id,
      { $set: passwordReset },
      { new: true, runValidators: true, session },
    );

    if (!doc) {
      throw new Error("PasswordReset not found");
    }
    return this.toEntity(doc);
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    return this.findOne({ token });
  }

  async findByUserId(userId: string): Promise<PasswordReset | null> {
    return this.findOne({ userId });
  }

  // IBaseRepository methods
  async findById(id: string): Promise<PasswordReset | null> {
    const doc = await PasswordResetModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filter: any = {}): Promise<PasswordReset[]> {
    const docs = await PasswordResetModel.find(filter);
    return docs.map((doc) => this.toEntity(doc));
  }

  async findOne(filter: any): Promise<PasswordReset | null> {
    const doc = await PasswordResetModel.findOne(filter);
    return doc ? this.toEntity(doc) : null;
  }

  async count(filter: any = {}): Promise<number> {
    return await PasswordResetModel.countDocuments(filter);
  }

  async delete(id: string): Promise<void> {
    await PasswordResetModel.findByIdAndDelete(id);
  }

  async deleteMany(filter: any): Promise<number> {
    const result = await PasswordResetModel.deleteMany(filter);
    return result.deletedCount || 0;
  }

  async exists(filter: any): Promise<boolean> {
    const count = await PasswordResetModel.countDocuments(filter).limit(1);
    return count > 0;
  }

  async markAsUsed(id: string): Promise<void> {
    await PasswordResetModel.updateOne({ _id: id }, { isUsed: true });
  }

  async deleteExpired(): Promise<void> {
    await PasswordResetModel.deleteMany({ expiresAt: { $lt: new Date() } });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await PasswordResetModel.deleteMany({ userId });
  }

  private toEntity(doc: any): PasswordReset {
    return {
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      isUsed: doc.isUsed,
      createdAt: doc.createdAt,
      usedAt: doc.usedAt,
      updatedAt: doc.updatedAt,
    };
  }
}
