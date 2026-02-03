import { AppError } from "../common/AppError";

export class UnauthorizedSuperAdminError extends AppError {
  constructor(message: string = "Super admin access required") {
    super(403, "UNAUTHORIZED_SUPER_ADMIN", message);
  }
}
