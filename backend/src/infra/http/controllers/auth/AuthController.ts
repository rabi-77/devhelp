import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { Types } from "../../../container/types";
import {
  ForgotPasswordUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  SignupUseCase,
} from "../../../../core/application/use-cases/auth";

@injectable()
export class AuthController {
  constructor(
    @inject(Types.SignupUseCase)
    private signupUseCase: SignupUseCase,

    @inject(Types.LoginUseCase)
    private loginUseCase: LoginUseCase,

    @inject(Types.RefreshTokenUseCase)
    private refreshTokenUseCase: RefreshTokenUseCase,

    @inject(Types.ForgotPasswordUseCase)
    private forgotPasswordUseCase: ForgotPasswordUseCase,

    @inject(Types.ResetPasswordUseCase)
    private resetPasswordUseCase: ForgotPasswordUseCase,
  ) { }

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.signupUseCase.execute(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(201).json(result.response);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);

      const cookieMaxAge = req.body.rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: cookieMaxAge,
        path: "/",
      });

      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: {
            code: "NO_REFRESH_TOKEN",
            message: "Refresh token not found",
          },
        });
        return;
      }

      const result = await this.refreshTokenUseCase.execute({ refreshToken });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let result = await this.forgotPasswordUseCase.execute(req.body);
      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let result = await this.resetPasswordUseCase.execute(req.body);
      res.status(200).json(result.response);
    } catch (error) {
      next(error);
    }
  };
}
