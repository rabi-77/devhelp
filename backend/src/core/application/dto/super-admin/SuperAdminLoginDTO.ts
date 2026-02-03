import { superAdminLoginInput } from "../../../../shared/validation/superAdminSchemas";
import { SuperAdminUser } from "./SharedSuperAdminTypes";

export type SuperAdminLoginRequestDTO = superAdminLoginInput;

export interface SuperAdminLoginResponseDTO {
  success: boolean;
  message: string;
  data: {
    user: SuperAdminUser;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
