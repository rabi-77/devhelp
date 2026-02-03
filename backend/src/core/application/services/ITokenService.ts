export interface TokenPayload {
  userId?: string;
  email: string;
  role: string;
  companyId?: string;
  type?: "access" | "refresh";
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  generateTokenPair(payload: TokenPayload): TokenResponse;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload | null;
}
