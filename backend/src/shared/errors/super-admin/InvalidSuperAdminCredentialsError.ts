import { AppError } from "../common/AppError";

export class InvalidSuperAdminCredentialsError extends AppError {
  constructor(message: string = "Invalid Super Admin Credentials") {
    super(401, "INVALID_SUPER_ADMIN_CREDENTIALS", message);
  }
}
