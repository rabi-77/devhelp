import { signupInput } from "../../../../shared/validation/authSchemas";
import { AuthUser } from "./SharedAuthTypes";

export type SignupRequestDTO = signupInput;

export interface SignupResponseDTO {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
