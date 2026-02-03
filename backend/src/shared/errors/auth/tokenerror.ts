import { AppError } from "../common/AppError";

export class TokenAlreadyUsedError extends AppError {
  constructor(message: string = "link has already been used") {
    super(400, "TOKEN_ALREADY_USED", message);
  }
}
