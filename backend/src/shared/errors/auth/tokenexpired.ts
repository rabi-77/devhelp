import { AppError } from "../common/AppError";

export class TokenExpiredError extends AppError {
  constructor(message: string = "Token has expired") {
    super(401, "TOKEN_EXPIRED", message);
  }
}
