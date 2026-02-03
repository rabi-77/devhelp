import { AppError } from "../common/AppError";

export class InviteCancelledError extends AppError {
  constructor(message: string = "Invite has been cancelled") {
    super(410, "INVITE_CANCELLED", message);
  }
}
