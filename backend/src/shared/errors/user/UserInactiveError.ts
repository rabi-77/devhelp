import { AppError } from "../common/AppError";

export class UserInactiveError extends AppError {
  constructor(message: string = "User is inactive") {
    super(403, "USER_INACTIVE", message);
  }
}
