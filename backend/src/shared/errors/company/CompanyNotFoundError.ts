import { AppError } from "../common/AppError";

export class CompanyNotFoundError extends AppError {
  constructor(message: string = "Company not found") {
    super(404, "COMPANY_NOT_FOUND", message);
  }
}
