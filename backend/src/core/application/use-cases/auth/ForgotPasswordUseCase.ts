import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { IEmailService } from "../../services/IEmailService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import {
  ForgotPasswordRequestDTO,
  ForgotPasswordResponseDTO,
} from "../../dto/auth";
import { IPasswordResetRepository } from "../../../domain/repositories/IPasswordResetRepository";
import { v4 as uuidv4 } from "uuid";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { resetPasswordTemplate } from "../../../../shared/emailTemplates/auth";
import { ILogger } from "../../services/ILogger";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(Types.EmailService)
    private emailService: IEmailService,
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
    @inject(Types.PasswordResetRepository)
    private passwordResetRepository: IPasswordResetRepository,
    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(Types.Logger)
    private logger: ILogger,
  ) { }

  async execute(
    req: ForgotPasswordRequestDTO,
  ): Promise<{ response: ForgotPasswordResponseDTO }> {
    let res = {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions. Please check your inbox.",
    };

    let user = await this.userRepository.findByEmail(req.email);

    if (!user) {
      return {
        response: res,
      };
    }

    if (user.status === "invited" || user.status === "inactive") {
      return {
        response: res,
      };
    }

    await this.passwordResetRepository.deleteAllByUserId(user.id);

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.passwordResetRepository.create({
      userId: user.id,
      token,
      expiresAt,
      isUsed: false,
    });


    if (!user.companyId) {
      this.logger.error("User has no companyId during password reset", {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
      return { response: res };
    }

    let company = await this.companyRepository.findById(user.companyId);

    if (!company) {
      this.logger.error("Company not found for user during password reset", {
        userId: user.id,
        companyId: user.companyId,
        timestamp: new Date().toISOString(),
      });
      return {
        response: res,
      };
    }


    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    let link = `${frontendUrl}/reset-password?token=${token}`;

    let { subject, html } = resetPasswordTemplate({
      firstName: user.firstName,
      companyName: company.name,
      resetLink: link,
    });

    try {
      await this.emailService.sendMail({
        to: req.email,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error("Failed to send password reset email", {
        userId: user.id,
        timestamp: new Date().toISOString(),
        error,
      });
    }

    return {
      response: res,
    };
  }
}
