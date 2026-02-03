import { AppError } from "../common/AppError";

export class CompanySuspendedError extends AppError {
  constructor(
    message: string = "The company account is currently suspended. Please contact support for assistance.",
  ) {
    super(403, "COMPANY_SUSPENDED", message);
  }
}
