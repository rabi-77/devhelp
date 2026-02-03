import {
  SendCompanyInviteRequestDTO,
  SendCompanyInviteResponseDTO,
} from "../../dto/invite/SendCompanyInviteDTO";
import { inject, injectable } from "inversify";
import { Types } from "../../../../infra/container/types";
import { IInviteRepository } from "../../../domain/repositories/IInviteRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { v4 as uuidv4 } from "uuid";
import { IEmailService } from "../../services/IEmailService";
import { sendCompanyInviteTemplate } from "../../../../shared/emailTemplates/invite";
import { ILogger } from "../../services/ILogger";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import {
  CannotInviteSelfError,
  CompanyNotFoundError,
  EmailAlreadyExistsError,
  InviteAlreadyExistsError,
  InviteAlreadySentError,
  UserNotFoundError,
} from "../../../../shared/errors";

@injectable()
export class SendCompanyInviteUseCase {
  constructor(
    @inject(Types.InviteRepository)
    private inviteRepository: IInviteRepository,
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(Types.EmailService)
    private emailService: IEmailService,
    @inject(Types.Logger)
    private logger: ILogger,
  ) { }

  async execute(
    req: SendCompanyInviteRequestDTO,
    userId: string,
    companyId: string,
  ): Promise<{ response: SendCompanyInviteResponseDTO }> {
    let invitedBy = await this.userRepository.findById(userId);
    if (!invitedBy) {
      throw new UserNotFoundError("User not found");
    }

    if (req.email.toLocaleLowerCase() === invitedBy.email.toLocaleLowerCase()) {
      throw new CannotInviteSelfError("You cannot invite yourself");
    }

    let company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new CompanyNotFoundError("Company not found");
    }

    const user = await this.userRepository.findByEmailAndCompanyId(
      req.email,
      companyId,
    );

    if (user) {
      if (user.status === "active") {
        throw new EmailAlreadyExistsError(
          "User with this email is already active in your company",
        );
      } else if (user.status === "invited") {
        throw new InviteAlreadyExistsError(
          "User already has a pending invitation. Use resend feature instead.",
        );
      }
    }

    const invite = await this.inviteRepository.findByEmailAndCompany(
      req.email,
      companyId,
      "pending",
    );

    if (invite) {
      if (invite.expiresAt > new Date()) {
        throw new InviteAlreadySentError(
          "Invite already sent. Use resend feature",
        );
      } else {
        await this.inviteRepository.delete(invite.id);
      }
    }

    let expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    let token = uuidv4();

    const inviteData = {
      token,
      email: req.email,
      firstName: req.firstName,
      lastName: req.lastName,
      role: "member" as "member",
      companyId,
      invitedBy: userId,
      status: "pending" as "pending",
      expiresAt,
    };

    let inviteCreated = await this.inviteRepository.create(inviteData);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteLink = `${frontendUrl}/accept-invite?token=${token}`;

    const { subject, html } = sendCompanyInviteTemplate({
      firstName: req.firstName,
      inviterName: `${invitedBy.firstName} ${invitedBy.lastName}`,
      companyName: company.name,
      inviteLink,
      expiresInDays: 7,
    });

    try {
      await this.emailService.sendMail({
        to: req.email,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error("Failed to send invite email", {
        email: req.email,
        companyId,
        error,
      });
    }

    return {
      response: {
        success: true,
        message: "Invitation sent successfully",
        data: {
          invitation: {
            id: inviteCreated.id,
            email: inviteCreated.email,
            firstName: inviteCreated.firstName,
            lastName: inviteCreated.lastName,
            role: inviteCreated.role,
            status: inviteCreated.status,
            company: {
              id: company.id,
              name: company.name,
            },
            invitedBy: {
              id: invitedBy.id,
              name: `${invitedBy.firstName} ${invitedBy.lastName}`,
              role: invitedBy.role,
            },
            invitedAt: inviteCreated.createdAt.toISOString(),
            expiresAt: inviteCreated.expiresAt.toISOString(),
          },
        },
      },
    };
  }
}
