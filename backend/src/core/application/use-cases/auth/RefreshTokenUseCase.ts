import {
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
} from "../../dto/auth/RefreshTokenDTO";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../services/ITokenService";

import { Types } from "../../../../infra/container/types";
import { inject, injectable } from "inversify";
import { UnauthorizedError } from "../../../../shared/errors";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(Types.TokenService)
    private tokenService: ITokenService,

    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
  ) { }

  async execute(req: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const decoded = this.tokenService.verifyRefreshToken(req.refreshToken);

    if (!decoded) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (!decoded.userId) {
      throw new UnauthorizedError("Invalid token payload - userId missing");
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.status !== "active") {
      throw new UnauthorizedError("User account is not active");
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
        expiresIn: 15 * 60,
        tokenType: "Bearer",
      },
    };
  }
}
