import { User } from "../entities/User";
import { IUnitWork } from "../../application/uow/IUnitWork";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User> {
  create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    uow?: IUnitWork,
  ): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailAndCompanyId(
    email: string,
    companyId: string,
  ): Promise<User | null>;
  update(userId: string, data: Partial<User>, uow?: IUnitWork): Promise<User>;
  findCompanyAdmin(companyId: string): Promise<User | null>;
  findAllByCompanyId(
    companyId: string,
    page: number,
    limit: number,
    filters?: any,
  ): Promise<{ users: User[]; total: number }>;
  countActiveUser(companyId: string, days: number): Promise<number>;
}
