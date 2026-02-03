import { AppError } from "../common/AppError";

export class UnauthorizedError extends AppError {
  constructor(message: string = "not authorized to go here") {
    super(401, "UNAUTHORIZED", message);
  }
}
