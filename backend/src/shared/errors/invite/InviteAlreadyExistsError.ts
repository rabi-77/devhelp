import { AppError } from "../common/AppError";

export class InviteAlreadyExistsError extends AppError {
  constructor(message: string = "Invite already exists") {
    super(400, "INVITE_EXISTS", message);
  }
}
