import { AppError } from "../common/AppError";

export class InviteNotFoundError extends AppError {
  constructor(message: string = "Invite not found") {
    super(404, "INVITE_NOT_FOUND", message);
  }
}
