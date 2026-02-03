import { AppError } from "../common/AppError";

export class InviterNotFoundError extends AppError {
  constructor(message: string = "Inviter not found") {
    super(404, "INVITER_NOT_FOUND", message);
  }
}
