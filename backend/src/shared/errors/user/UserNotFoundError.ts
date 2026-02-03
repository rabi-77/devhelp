import { AppError } from "../common/AppError";

export class UserNotFoundError extends AppError {
  constructor(message: string = "User not found") {
    super(404, "USER_NOT_FOUND", message);
  }
}
