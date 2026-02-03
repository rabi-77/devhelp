import {
  VerifyInviteRequestDTO,
  VerifyInviteResponseDTO,
} from "../../dto/invite/VerifyInviteDTO";
import { IInviteRepository } from "../../../domain/repositories/IInviteRepository";
import { injectable, inject } from "inversify";
import { Types } from "../../../../infra/container/types";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ILogger } from "../../services/ILogger";
import {
  CompanyInactiveError,
  CompanyNotFoundError,
  CompanySuspendedError,
  InvalidInviteTokenError,
  InvalidTokenFormatError,
  InvitationAlreadyAcceptedError,
  InviteCancelledError,
  InviteExpiredError,
} from "../../../../shared/errors";

@injectable()
export class VerifyTokenUseCase {
  constructor(
    @inject(Types.InviteRepository)
    private inviteRepository: IInviteRepository,
    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
    @inject(Types.Logger)
    private logger: ILogger,
  ) { }

  async execute(
    req: VerifyInviteRequestDTO,
  ): Promise<{ response: VerifyInviteResponseDTO }> {
    const { token: rawToken } = req;

    if (!rawToken || !rawToken.trim()) {
      throw new InvalidInviteTokenError(
        "Invalid invitation link. This invitation does not exist.",
      );
    }

    const token = rawToken.trim().toLowerCase();
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Regex.test(token)) {
      throw new InvalidTokenFormatError("Invalid invitation link format");
    }

    const invitation = await this.inviteRepository.findByToken(token);

    if (!invitation) {
      this.logger.warn("Invite verification failed - token not found", {
        token: token.substring(0, 8) + "...",
      });
      throw new InvalidInviteTokenError("Invalid invite token");
    }

    if (invitation.status === "accepted") {
      throw new InvitationAlreadyAcceptedError(
        "This invitation has already been used. Please login to your account.",
      );
    }

    if (invitation.status === "cancelled") {
      throw new InviteCancelledError(
        "This invitation has been cancelled. Please contact your company administrator if you believe this is a mistake.",
      );
    }

    if (invitation.status === "expired") {
      throw new InviteExpiredError(
        "This invitation has expired. Please contact the person who invited you to request a new invitation.",
      );
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
      throw new CompanyNotFoundError("Company not found");
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

    const inviter = await this.userRepository.findById(invitation.invitedBy);

    const inviterInfo = inviter
      ? {
        id: inviter.id,
        name: `${inviter.firstName} ${inviter.lastName}`,
        role: inviter.role,
      }
      : {
        id: invitation.invitedBy,
        name: "Former Team Member",
        role: "unknown",
      };

    this.logger.info("Invite verified successfully", {
      invitationId: invitation.id,
      email: invitation.email,
      companyId: invitation.companyId,
    });

    return {
      response: {
        success: true,
        data: {
          email: invitation.email,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          role: invitation.role,
          company: {
            id: company.id,
            name: company.name,
          },
          invitedBy: inviterInfo,
          invitedAt: invitation.createdAt.toISOString(),
          expiresAt: invitation.expiresAt.toISOString(),
        },
      },
    };
  }
}
