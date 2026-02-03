import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { ILogger } from "../../services/ILogger";
import {
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
} from "../../dto/auth/ResetPasswordDTO";
import { IPasswordResetRepository } from "../../../domain/repositories/IPasswordResetRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { IUnitWork } from "../../uow/IUnitWork";
import { IEmailService } from "../../services/IEmailService";
import { passwordChangedTemplate } from "../../../../shared/emailTemplates/auth";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import {
  InvalidTokenError,
  PasswordReuseError,
  TokenAlreadyUsedError,
  TokenExpiredError,
  UserInactiveError,
  UserInvitedError,
  UserNotFoundError,
} from "../../../../shared/errors";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(Types.PasswordResetRepository)
    private passwordResetRepository: IPasswordResetRepository,

    @inject(Types.Logger)
    private logger: ILogger,

    @inject(Types.PasswordService)
    private passwordService: IPasswordService,

    @inject(Types.UserRepository)
    private userRepository: IUserRepository,

    @inject(Types.UnitOfWork)
    private uow: IUnitWork,

    @inject(Types.EmailService)
    private emailService: IEmailService,

    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
  ) { }

  async execute(
    req: ResetPasswordRequestDTO,
  ): Promise<{ response: ResetPasswordResponseDTO }> {
    const passwordReset = await this.passwordResetRepository.findByToken(
      req.token,
    );

    if (!passwordReset) {
      throw new InvalidTokenError(
        "Invalid reset token. Please request a new password reset.",
      );
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new TokenExpiredError(
        "Reset link has expired. Please request a new password reset.",
      );
    }

    if (passwordReset.isUsed) {
      throw new TokenAlreadyUsedError(
        "This reset link has already been used. Please request a new password reset if needed.",
      );
    }

    let user = await this.userRepository.findById(passwordReset.userId);

    if (!user) {
      this.logger.error("Token exists but user does not exist", {
        userId: passwordReset.userId,
        token: req.token,
      });
      throw new UserNotFoundError("User account not found.");
    }

    if (user.status === "inactive") {
      throw new UserInactiveError(
        "Your account is deactivated. Please contact support.",
      );
    }

    if (user.status === "invited") {
      throw new UserInvitedError(
        "Please accept your invitation first to set your password.",
      );
    }

    if (await this.passwordService.compare(req.newPassword, user.password)) {
      throw new PasswordReuseError(
        "Please choose a different password. You cannot reuse your current password",
      );
    }

    await this.uow.begin();

    try {
      let hashedPassword = await this.passwordService.hash(req.newPassword);

      await this.userRepository.update(
        user.id,
        { password: hashedPassword, updatedAt: new Date() },
        this.uow,
      );

      await this.passwordResetRepository.update(
        passwordReset.id,
        {
          isUsed: true,
          usedAt: new Date(),
        },
        this.uow,
      );

      await this.uow.commit();
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }


    if (!user.companyId) {
      this.logger.error("User has no companyId after password reset", {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
      throw new Error("User is not associated with a company");
    }

    const company = await this.companyRepository.findById(user.companyId);

    if (!company) {
      this.logger.error("Company not found after password reset", {
        userId: user.id,
        companyId: user.companyId,
        timestamp: new Date().toISOString(),
      });

      return {
        response: {
          success: true,
          message:
            "Password reset successfully. You can now login with your new password.",
          redirectTo: "/login",
        },
      };
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const { subject, html } = passwordChangedTemplate({
      firstName: user.firstName,
      companyName: company.name,
      loginLink: `${frontendUrl}/login`,
      timestamp: new Date().toLocaleString(),
    });

    try {
      await this.emailService.sendMail({
        to: user.email,
        subject,
        html,
      });

      this.logger.info("Password change confirmation email sent", {
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      this.logger.error("Failed to send password change confirmation email", {
        userId: user.id,
        timestamp: new Date().toISOString(),
        error,
      });
    }

    return {
      response: {
        success: true,
        message:
          "Password reset successfully. You can now login with your new password.",
        redirectTo: `${frontendUrl}/login`,
      },
    };
  }
}
