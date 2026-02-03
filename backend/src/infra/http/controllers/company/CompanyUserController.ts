import { inject, injectable } from "inversify";
import { Types } from "../../../container/types";
import {
    GetCompanyUsersUseCase,
    UpdateUserStatusUseCase,
} from "../../../../core/application/use-cases/company";
import { NextFunction, Request, Response } from "express";

@injectable()
export class CompanyUserController {
    constructor(
        @inject(Types.GetCompanyUsersUseCase)
        private getCompanyUsersUseCase: GetCompanyUsersUseCase,
        @inject(Types.UpdateUserStatusUseCase)
        private updateUserStatusUseCase: UpdateUserStatusUseCase,
    ) { }

    getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const companyId = req.user!.companyId as string;
            const { page = 1, limit = 10, search, status, role } = req.query;

            const result = await this.getCompanyUsersUseCase.execute({
                companyId,
                page: Number(page),
                limit: Number(limit),
                search: search as string,
                status: status as string,
                role: role as string,
            });

            res.status(200).json(result.response);
        } catch (error) {
            next(error);
        }
    };

    updateUserStatus = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const companyId = req.user!.companyId as string;
            const { id } = req.params;
            const { status } = req.body;

            const result = await this.updateUserStatusUseCase.execute({
                userId: id,
                status,
                companyId,
            });

            res.status(200).json(result.response);
        } catch (error) {
            next(error);
        }
    };
}
