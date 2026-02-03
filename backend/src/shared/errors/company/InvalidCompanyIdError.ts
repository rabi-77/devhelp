import { AppError } from "../common/AppError";

export class InvalidCompanyIdError extends AppError {
  constructor(
    message: string = "The provided company ID is invalid or does not exist",
  ) {
    super(400, "INVALID_COMPANY_ID", message);
  }
}
