import { Request } from "express";
import { TokenPayload } from "../core/application/services/ITokenService";

declare global {
  namespace Express {
    interface Request {
      subdomain?: string;
      user?: TokenPayload;
    }
  }
}

export { };
