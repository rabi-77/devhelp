import { AppError } from "../common/AppError";

export class InviteExpiredError extends AppError {
  constructor(message: string = "Invite has expired") {
    super(410, "INVITE_EXPIRED", message);
  }
}
