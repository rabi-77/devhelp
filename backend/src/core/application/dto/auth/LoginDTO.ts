import { loginInput } from "../../../../shared/validation/authSchemas";
import { AuthUser } from "./SharedAuthTypes";

export type LoginRequestDTO = loginInput;

export interface LoginResponseDTO {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
