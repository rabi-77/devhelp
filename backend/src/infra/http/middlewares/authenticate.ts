import { NextFunction, Response, Request } from "express";
import { container } from "../../container/inversify.container";
import { Types } from "../../container/types";
import { ITokenService } from "../../../core/application/services/ITokenService";
import { UnauthorizedError, TokenExpiredError } from "../../../shared/errors";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("No authorization header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Invalid authorization format");
    }

    const tokenService = container.get<ITokenService>(Types.TokenService);
    const decoded = tokenService.verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(new TokenExpiredError("Token has expired. Please refresh."));
    } else if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Invalid token"));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new UnauthorizedError("User not authenticated"));
  }

  if (req.user.role !== "admin") {
    return next(new UnauthorizedError("Admin access required"));
  }
  next();
};

export const requireMember = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new UnauthorizedError("User not authenticated"));
  }

  if (req.user.role !== "member" && req.user.role !== "admin") {
    return next(new UnauthorizedError("Member or admin access required"));
  }
  next();
};

export const requireAuth = authenticate;
