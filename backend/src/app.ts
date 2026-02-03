import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./infra/http/middlewares/errorHandler";
import routes from "./infra/http/routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use(errorHandler);

export default app;
