import { NextFunction, Response, Request } from "express";
import { UnauthorizedSuperAdminError } from "../../../shared/errors/super-admin";

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new UnauthorizedSuperAdminError("User authenticated"));
  }

  if (req.user.role !== "super_admin") {
    return next(new UnauthorizedSuperAdminError("Super admin access required"));
  }
  next();
};
