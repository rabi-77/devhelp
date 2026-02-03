import { AppError } from "../common/AppError";

export class InviteAlreadySentError extends AppError {
  constructor(message: string = "Invite already sent") {
    super(400, "INVITE_ALREADY_SENT", message);
  }
}
