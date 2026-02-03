import { AppError } from "../common/AppError";

export class InvalidInviteStatusError extends AppError {
  constructor(message: string = "Invalid invite status") {
    super(400, "INVALID_INVITE_STATUS", message);
  }
}
