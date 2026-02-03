import { PasswordReset } from "../entities/PasswordReset";
import { IUnitWork } from "../../application/uow/IUnitWork";
import { IBaseRepository } from "./IBaseRepository";

export interface IPasswordResetRepository extends IBaseRepository<PasswordReset> {
  create(
    passwordReset: Omit<PasswordReset, "id" | "createdAt" | "updatedAt">,
  ): Promise<PasswordReset>;

  update(
    id: string,
    passwordReset: Partial<PasswordReset>,
    uow?: IUnitWork,
  ): Promise<PasswordReset>;

  findByToken(token: string): Promise<PasswordReset | null>;

  findByUserId(userId: string): Promise<PasswordReset | null>;

  markAsUsed(id: string): Promise<void>;

  deleteExpired(): Promise<void>;

  deleteAllByUserId(userId: string): Promise<void>;
}
