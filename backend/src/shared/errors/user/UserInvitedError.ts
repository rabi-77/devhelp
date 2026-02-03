import { AppError } from "../common/AppError";

export class UserInvitedError extends AppError {
  constructor(message: string = "User already invited") {
    super(403, "USER_INVITED", message);
  }
}
