import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    public readonly fields?: Record<string, string>,
  ) {
    super(400, "VALIDATION_ERROR", message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
