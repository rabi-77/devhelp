import { injectable } from "inversify";
import { ILogger } from "../../core/application/services/ILogger";
import pino from "pino";

@injectable()
export class PinoService implements ILogger {
  logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
      process.env.NODE_ENV !== "production"
        ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
        : undefined,
  });

  debug(message: string, meta?: unknown): void {
    this.logger.debug(meta, message);
  }

  info(message: string, meta?: unknown): void {
    this.logger.info(meta, message);
  }

  warn(message: string, meta?: unknown): void {
    this.logger.warn(meta, message);
  }

  error(message: string, meta?: unknown): void {
    this.logger.error(meta, message);
  }
}
