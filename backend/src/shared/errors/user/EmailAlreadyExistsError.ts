import { AppError } from "../common/AppError";

export class EmailAlreadyExistsError extends AppError {
  constructor(message: string = "Email already exists") {
    super(400, "EMAIL_EXISTS", message);
  }
}
