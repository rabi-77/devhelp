import { AppError } from "../common/AppError";

export class PasswordReuseError extends AppError {
  constructor(message: string = "cant reuse an old password") {
    super(400, "PASSWORD_REUSED", message);
  }
}
