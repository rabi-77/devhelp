import { AppError } from "../common/AppError";

export class CompanyInactiveError extends AppError {
  constructor(message: string = "This company is inactive") {
    super(403, "COMPANY_INACTIVE", message);
  }
}
