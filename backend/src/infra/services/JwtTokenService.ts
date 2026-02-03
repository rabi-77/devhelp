import jwt from "jsonwebtoken";
import {
  ITokenService,
  TokenPayload,
  TokenResponse,
} from "../../core/application/services/ITokenService";
import type { StringValue } from "ms";
import { injectable } from "inversify";
import { TokenExpiredError, UnauthorizedError } from "../../shared/errors";

@injectable()
export class JwtTokenService implements ITokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: StringValue;
  private readonly refreshTokenExpiry: StringValue;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in enviaronment variables");
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in enviaronment variables",
      );
    }

    if (!process.env.JWT_EXPIRES_IN) {
      throw new Error("JWT_EXPIRES_IN is not defined");
    }

    if (!process.env.JWT_REFRESH_EXPIRES_IN) {
      throw new Error("JWT_REFRESH_EXPIRES_IN is not defined");
    }

    this.accessTokenSecret = process.env.JWT_SECRET as string;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN as StringValue;
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN as StringValue;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload, type: "access" }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload, type: "refresh" }, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  generateTokenPair(payload: TokenPayload): TokenResponse {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      tokenType: "Bearer",
    };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as TokenPayload;

      if (decoded.type !== "access") {
        throw new UnauthorizedError("Invalid token type");
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid token");
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        this.refreshTokenSecret,
      ) as TokenPayload;

      if (decoded.type !== "refresh") {
        throw new UnauthorizedError("Invalid token type");
      }
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError("Refresh token has expired");
      }
      return null;
    }
  }
}
