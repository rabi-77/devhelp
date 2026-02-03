import { AppError } from "../common/AppError";

export class InvalidInviteTokenError extends AppError {
  constructor(message: string = "Invalid invite token") {
    super(404, "INVALID_INVITE_TOKEN", message);
  }
}
