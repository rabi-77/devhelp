import { Invite } from "../../../core/domain/entities/Invite";
import { IInviteRepository } from "../../../core/domain/repositories/IInviteRepository";
import InviteModel from "../models/InviteModel";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { IUnitWork } from "../../../core/application/uow/IUnitWork";
import { MongooseUnitOfWork } from "../../uow/MongooseUnitOfWork";
import { InviteNotFoundError } from "../../../shared/errors";

@injectable()
export class InviteRepository implements IInviteRepository {
  async create(
    inviteData: Omit<Invite, "id" | "createdAt" | "updatedAt">,
  ): Promise<Invite> {
    const doc = new InviteModel({
      _id: uuidv4(),
      ...inviteData,
    });
    await doc.save();
    return this.toEntity(doc);
  }

  async findByToken(token: string): Promise<Invite | null> {
    return this.findOne({ token });
  }

  async findByEmailAndCompany(
    email: string,
    companyId: string,
    status?: string,
  ): Promise<Invite | null> {
    return this.findOne({
      email,
      companyId,
      status,
    });
  }

  // IBaseRepository methods
  async findById(id: string): Promise<Invite | null> {
    const doc = await InviteModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filter: any = {}): Promise<Invite[]> {
    const docs = await InviteModel.find(filter);
    return docs.map((doc) => this.toEntity(doc));
  }

  async findOne(filter: any): Promise<Invite | null> {
    const doc = await InviteModel.findOne(filter);
    return doc ? this.toEntity(doc) : null;
  }

  async count(filter: any = {}): Promise<number> {
    return await InviteModel.countDocuments(filter);
  }

  async delete(id: string): Promise<void> {
    const result = await InviteModel.findByIdAndDelete(id);
    if (!result) {
      throw new InviteNotFoundError();
    }
  }

  async deleteMany(filter: any): Promise<number> {
    const result = await InviteModel.deleteMany(filter);
    return result.deletedCount || 0;
  }

  async exists(filter: any): Promise<boolean> {
    const count = await InviteModel.countDocuments(filter).limit(1);
    return count > 0;
  }

  async findPendingByCompany(
    companyId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ invites: Invite[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      InviteModel.find({ companyId, status: "pending" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      InviteModel.countDocuments({ companyId, status: "pending" }),
    ]);

    return { invites: docs.map((x) => this.toEntity(x)), total };
  }

  async update(
    inviteId: string,
    inviteData: Partial<Invite>,
    uow?: IUnitWork,
  ): Promise<Invite> {
    // Only use session if transactions are enabled and UoW is provided
    const useTransactions = process.env.USE_TRANSACTIONS === "true";
    const session =
      useTransactions && uow instanceof MongooseUnitOfWork
        ? uow.getSession()
        : undefined;

    const doc = await InviteModel.findByIdAndUpdate(
      inviteId,
      { $set: inviteData },
      { new: true, runValidators: true, session },
    );

    if (!doc) {
      throw new InviteNotFoundError();
    }

    return this.toEntity(doc);
  }

  private toEntity(doc: any): Invite {
    return {
      id: doc._id,
      token: doc.token,
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      role: doc.role,
      companyId: doc.companyId,
      invitedBy: doc.invitedBy,
      status: doc.status,
      expiresAt: doc.expiresAt,
      acceptedAt: doc.acceptedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
