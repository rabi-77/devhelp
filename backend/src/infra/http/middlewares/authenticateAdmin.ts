import { Response, NextFunction, Request } from "express";
import { ForbiddenError } from "../../../shared/errors";

export const requireAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    if (!req.user || req.user.role !== "admin") {
        return next(new ForbiddenError("Access denied. Admin role required."));
    }
    next();
};
