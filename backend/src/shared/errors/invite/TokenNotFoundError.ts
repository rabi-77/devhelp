import { AppError } from "../common/AppError";

export class TokenNotFoundError extends AppError {
  constructor(message: string = "Token not found") {
    super(404, "TOKEN_NOT_FOUND", message);
  }
}
