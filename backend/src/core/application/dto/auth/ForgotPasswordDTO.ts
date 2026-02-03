import { forgotPasswordInput } from "../../../../shared/validation/authSchemas";
export type ForgotPasswordRequestDTO = forgotPasswordInput;

export interface ForgotPasswordResponseDTO {
  success: boolean;
  message: string;
}
