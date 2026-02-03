import { AppError } from "../common/AppError";

export class InvitationAlreadyAcceptedError extends AppError {
  constructor(message: string = "Invitation already accepted") {
    super(400, "INVITATION_ALREADY_ACCEPTED", message);
  }
}
