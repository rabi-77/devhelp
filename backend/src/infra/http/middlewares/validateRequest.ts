import z, { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../shared/errors/common/ValidationError";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req.method === "GET" ? req.query : req.body;

      const validatedData = schema.parse(dataToValidate);

      if (req.method === "GET") {
        req.query = validatedData as any;
      } else {
        req.body = validatedData;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce(
          (acc, err) => {
            const field = err.path.join(".");
            acc[field] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        );

        const validationError = new ValidationError(
          "Validation failed",
          errors,
        );

        next(validationError);
        return;
      } else {
        next(error);
      }
    }
  };
};
