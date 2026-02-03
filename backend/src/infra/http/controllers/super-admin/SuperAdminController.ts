import { inject, injectable } from "inversify";
import { Types } from "../../../container/types";
import { SuperAdminLoginUseCase } from "../../../../core/application/use-cases/super-admin/SuperAdminLoginUseCase";
import { NextFunction, Request, Response } from "express";
import {
  GetAllCompaniesUseCase,
  UpdateCompanyStatusUseCase,
} from "../../../../core/application/use-cases/super-admin";
import { GetCompanyUseCase } from "../../../../core/application/use-cases/super-admin/GetCompanyUseCase";

@injectable()
export class SuperAdminController {
  constructor(
    @inject(Types.SuperAdminLoginUseCase)
    private superAdminLoginUseCase: SuperAdminLoginUseCase,

    @inject(Types.GetAllCompaniesUseCase)
    private getAllCompaniesUseCase: GetAllCompaniesUseCase,

    @inject(Types.GetCompanyUseCase)
    private getCompanyUseCase: GetCompanyUseCase,

    @inject(Types.UpdateCompanyStatusUseCase)
    private updateCompanyStatusUseCase: UpdateCompanyStatusUseCase,
  ) { }

  loginSuperAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.superAdminLoginUseCase.execute(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };

  getAllCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.getAllCompaniesUseCase.execute(
        req.query as any,
      );
      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };

  getCompany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.getCompanyUseCase.execute(req.params.id);

      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };

  updateCompanyStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await this.updateCompanyStatusUseCase.execute({
        companyId: id,
        status,
      });

      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };
}
