import { AppError } from "../common/AppError";

export class InvalidTokenFormatError extends AppError {
  constructor(message: string = "Invalid token format") {
    super(400, "INVALID_TOKEN_FORMAT", message);
  }
}
