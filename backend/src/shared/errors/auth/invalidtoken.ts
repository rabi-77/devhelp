import { AppError } from "../common/AppError";

export class InvalidTokenError extends AppError {
  constructor(message: string = "Invalid token") {
    super(400, "INVALID_TOKEN", message);
  }
}
