import { Invite } from "../entities/Invite";
import { IUnitWork } from "../../application/uow/IUnitWork";
import { IBaseRepository } from "./IBaseRepository";

export interface IInviteRepository extends IBaseRepository<Invite> {
  create(
    inviteData: Omit<Invite, "id" | "createdAt" | "updatedAt">,
  ): Promise<Invite>;

  findByToken(token: string): Promise<Invite | null>;

  findByEmailAndCompany(
    email: string,
    companyId: string,
    status?: string,
  ): Promise<Invite | null>;

  findPendingByCompany(
    companyId: string,
    page?: number,
    limit?: number,
  ): Promise<{ invites: Invite[]; total: number }>;

  update(
    inviteId: string,
    inviteData: Partial<Invite>,
    uow?: IUnitWork,
  ): Promise<Invite>;
}
