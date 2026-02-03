import { AppError } from "../common/AppError";

export class CannotInviteSelfError extends AppError {
  constructor(message: string = "You cannot invite yourself") {
    super(400, "CANNOT_INVITE_SELF", message);
  }
}
