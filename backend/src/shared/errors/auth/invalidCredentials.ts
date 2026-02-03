import { AppError } from "../common/AppError";

export class InvalidCredentialsError extends AppError {
  constructor(message: string = "invalid credentials") {
    super(401, "INVALID_CREDENTIALS", message);
  }
}
