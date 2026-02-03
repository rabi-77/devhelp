import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../shared/errors/common/ValidationError";
import { AppError } from "../../../shared/errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        fields: error.fields,
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  if (error.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
      },
    });
    return;
  }

  if (error.name === "MongoServerError" && (error as any).code === 11000) {
    res.status(400).json({
      success: false,
      error: {
        code: "DUPLICATE_KEY",
        message: "Resource already exists",
      },
    });
    return;
  }

  console.log("unhandled error:", error);

  res.status(500).json({
    success: false,
    error: {
      code: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    },
  });
};
