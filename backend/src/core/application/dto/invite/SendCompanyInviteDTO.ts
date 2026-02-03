import { sendCompanyInviteInput } from "../../../../shared/validation/inviteSchema";

export type SendCompanyInviteRequestDTO = sendCompanyInviteInput;

export interface SendCompanyInviteResponseDTO {
  success: boolean;
  message: string;
  data: {
    invitation: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      status: string;
      company: {
        id: string;
        name: string;
      };
      invitedBy: {
        id: string;
        name: string;
        role: string;
      };
      invitedAt: string;
      expiresAt: string;
    };
  };
}
