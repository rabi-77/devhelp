import { acceptInviteInput } from "../../../../shared/validation/inviteSchema";
import { AuthUser } from "../auth/SharedAuthTypes";

export type AcceptInviteRequestDTO = acceptInviteInput;

export interface AcceptInviteResponseDTO {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
