export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
  };
}
