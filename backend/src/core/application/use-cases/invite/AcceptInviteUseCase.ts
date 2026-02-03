import { Types } from "../../../../infra/container/types";
import {
  AcceptInviteRequestDTO,
  AcceptInviteResponseDTO,
} from "../../dto/invite/AcceptInviteDTO";
import { inject, injectable } from "inversify";
import { IInviteRepository } from "../../../domain/repositories/IInviteRepository";
import { ILogger } from "../../services/ILogger";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IUnitWork } from "../../uow/IUnitWork";
import { IPasswordService } from "../../services/IPasswordService";
import { ITokenService } from "../../services/ITokenService";
import { User } from "../../../domain/entities/User";
import { IEmailService } from "../../services/IEmailService";
import { getPermissions, getRedirectPath } from "../auth/authHelpers";
import {
  CompanyInactiveError,
  CompanyNotFoundError,
  CompanySuspendedError,
  EmailAlreadyExistsError,
  InvalidInviteStatusError,
  InvalidInviteTokenError,
  InvitationAlreadyAcceptedError,
  InviteCancelledError,
  InviteExpiredError,
} from "../../../../shared/errors";

@injectable()
export class AcceptInviteUseCase {
  constructor(
    @inject(Types.InviteRepository)
    private inviteRepository: IInviteRepository,
    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
    @inject(Types.UnitOfWork)
    private uow: IUnitWork,
    @inject(Types.PasswordService)
    private passwordService: IPasswordService,
    @inject(Types.TokenService)
    private tokenService: ITokenService,
    @inject(Types.EmailService)
    private emailService: IEmailService,
    @inject(Types.Logger)
    private logger: ILogger,
  ) { }

  async execute(
    req: AcceptInviteRequestDTO,
  ): Promise<{ response: AcceptInviteResponseDTO; refreshToken: string }> {
    const invitation = await this.inviteRepository.findByToken(req.token);

    if (!invitation) {
      this.logger.warn("Invite acceptance failed - token not found", {
        token: req.token.substring(0, 8) + "...",
      });
      throw new InvalidInviteTokenError(
        "Invalid invitation link. This invitation does not exist.",
      );
    }

    if (invitation.status === "accepted") {
      throw new InvitationAlreadyAcceptedError(
        "This invitation has already been used. Please login to your account.",
      );
    }

    if (invitation.status === "cancelled") {
      throw new InviteCancelledError(
        "This invitation has been cancelled. Please contact your administrator.",
      );
    }

    if (invitation.status === "expired") {
      throw new InviteExpiredError(
        "This invitation has expired. Please request a new invitation.",
      );
    }

    if (invitation.status !== "pending") {
      throw new InvalidInviteStatusError("Invalid invitation status");
    }

    const now = new Date();

    if (invitation.expiresAt < now) {
      await this.inviteRepository.update(invitation.id, { status: "expired" });
      throw new InviteExpiredError(
        "This invitation has expired. Please contact the person who invited you to request a new invitation.",
      );
    }

    const company = await this.companyRepository.findById(invitation.companyId);

    if (!company) {
      this.logger.error("Company not found for invitation", {
        invitationId: invitation.id,
        companyId: invitation.companyId,
      });
      throw new CompanyNotFoundError(
        "The company associated with this invitation no longer exists.",
      );
    }

    if (company.status === "inactive") {
      throw new CompanyInactiveError(
        "The company account is currently inactive. Please contact support for assistance.",
      );
    }

    if (company.status === "suspended") {
      throw new CompanySuspendedError(
        "The company account is currently suspended. Please contact support for assistance.",
      );
    }

    if (company.status === "deleted") {
      throw new CompanyNotFoundError(
        "The company associated with this invitation no longer exists.",
      );
    }

    const existingUser = await this.userRepository.findByEmailAndCompanyId(
      invitation.email,
      invitation.companyId,
    );

    if (existingUser && existingUser.status === "active") {
      throw new EmailAlreadyExistsError(
        "An account with this email already exists in this company. Please login instead.",
      );
    }

    const existingUserId = existingUser?.id;
    const isReactivation =
      existingUser &&
      (existingUser.status === "invited" || existingUser.status === "inactive");

    if (invitation.status !== "pending") {
      throw new InvitationAlreadyAcceptedError(
        "This invitation has already been used. Please login to your account.",
      );
    }

    await this.uow.begin();

    try {
      const hashedPassword = await this.passwordService.hash(req.password);

      let finalUser: User;

      if (existingUserId) {
        finalUser = await this.userRepository.update(
          existingUserId,
          {
            password: hashedPassword,
            firstName: invitation.firstName,
            lastName: invitation.lastName,
            role: invitation.role,
            status: "active",
            updatedAt: now,
          },
          this.uow,
        );

        this.logger.info("Existing user reactivated", {
          userId: finalUser.id,
          email: finalUser.email,
          wasStatus: existingUser!.status,
        });
      } else {
        finalUser = await this.userRepository.create(
          {
            firstName: invitation.firstName,
            lastName: invitation.lastName,
            email: invitation.email,
            password: hashedPassword,
            role: invitation.role,
            companyId: invitation.companyId,
            status: "active",
          },
          this.uow,
        );

        this.logger.info("New user created", {
          userId: finalUser.id,
          email: finalUser.email,
          role: finalUser.role,
        });
      }

      await this.inviteRepository.update(
        invitation.id,
        {
          status: "accepted",
          acceptedAt: now,
        },
        this.uow,
      );

      await this.uow.commit();

      const tokens = this.tokenService.generateTokenPair({
        userId: finalUser.id,
        email: finalUser.email,
        role: finalUser.role,
        companyId: finalUser.companyId,
      });

      const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

      this.emailService
        .sendMail({
          to: finalUser.email,
          subject: `Welcome to ${company.name}!`,
          html: `<p>Hi ${finalUser.firstName},</p><p>Your account is now active. Start collaborating!</p>`,
        })
        .catch((error) => {
          this.logger.error("Failed to send welcome email", {
            userId: finalUser.id,
            email: finalUser.email,
            error,
          });
        });

      this.logger.info("Invitation accepted successfully", {
        invitationId: invitation.id,
        userId: finalUser.id,
        email: finalUser.email,
        companyId: company.id,
        isReactivation,
      });

      const permissions = getPermissions(finalUser.role);
      const redirectPath = getRedirectPath(finalUser.role);
      const redirectTo = `https://devHelp.app${redirectPath}`;

      return {
        response: {
          success: true,
          message: `Account activated successfully. Welcome to ${company.name}!`,
          data: {
            user: {
              id: finalUser.id,
              email: finalUser.email,
              firstName: finalUser.firstName,
              lastName: finalUser.lastName,
              role: finalUser.role,
              status: finalUser.status,
              company: {
                id: company.id,
                name: company.name,
              },
              permissions,
            },
            token: tokens.accessToken,
            expiresAt: expiresAt.toISOString(),
            redirectTo,
          },
        },
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      await this.uow.rollback();

      this.logger.error("Invitation acceptance failed", {
        invitationId: invitation.id,
        email: invitation.email,
        error,
      });

      throw error;
    }
  }
}
