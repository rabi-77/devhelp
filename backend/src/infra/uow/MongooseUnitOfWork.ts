import { IUnitWork } from "../../core/application/uow/IUnitWork";
import mongoose from "mongoose";

export class MongooseUnitOfWork implements IUnitWork {
  private session!: mongoose.ClientSession;

  async begin(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
  }

  async commit(): Promise<void> {
    await this.session.commitTransaction();
    await this.session.endSession();
  }

  async rollback(): Promise<void> {
    await this.session.abortTransaction();
    await this.session.endSession();
  }

  getSession(): mongoose.ClientSession {
    return this.session;
  }
}
