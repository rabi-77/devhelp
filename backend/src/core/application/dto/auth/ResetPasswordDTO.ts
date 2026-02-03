import { resetPasswordInput } from "../../../../shared/validation/authSchemas";

export type ResetPasswordRequestDTO = resetPasswordInput;

export interface ResetPasswordResponseDTO {
  success: boolean;
  message: string;
  redirectTo: string;
}
