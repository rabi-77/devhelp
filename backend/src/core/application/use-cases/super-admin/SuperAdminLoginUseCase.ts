import { inject, injectable } from "inversify";
import { ILogger } from "../../services/ILogger";
import { Types } from "../../../../infra/container/types";
import {
  SuperAdminLoginRequestDTO,
  SuperAdminLoginResponseDTO,
} from "../../dto/super-admin/SuperAdminLoginDTO";
import { InvalidSuperAdminCredentialsError } from "../../../../shared/errors/super-admin/InvalidSuperAdminCredentialsError";
import { IPasswordService } from "../../services/IPasswordService";
import { ITokenService } from "../../services/ITokenService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

@injectable()
export class SuperAdminLoginUseCase {
  constructor(
    @inject(Types.Logger)
    private logger: ILogger,
    @inject(Types.PasswordService)
    private passwordService: IPasswordService,
    @inject(Types.TokenService)
    private tokenService: ITokenService,
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
  ) { }

  async execute(
    req: SuperAdminLoginRequestDTO,
  ): Promise<{ response: SuperAdminLoginResponseDTO; refreshToken: string }> {
    // Find super admin user by email
    const user = await this.userRepository.findByEmail(req.email);

    if (!user || user.role !== "super_admin") {
      this.logger.warn("Invalid super admin login attempt", {
        email: req.email,
        timestamp: new Date().toISOString(),
      });
      throw new InvalidSuperAdminCredentialsError("Invalid email or password");
    }

    const isPasswordMatch = await this.passwordService.compare(
      req.password,
      user.password,
    );

    if (!isPasswordMatch) {
      this.logger.warn("Invalid super admin login attempt - wrong password", {
        email: req.email,
        timestamp: new Date().toISOString(),
      });
      throw new InvalidSuperAdminCredentialsError("Invalid email or password");
    }

    if (user.status !== "active") {
      throw new InvalidSuperAdminCredentialsError("Super admin account is not active");
    }

    const tokens = this.tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: "super_admin",
    });

    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    this.logger.info("Super admin logged in successfully", {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return {
      response: {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: "super_admin",
            status: user.status,
            permissions: {
              managePlatform: true,
              manageCompanies: true,
              viewAllData: true,
            },
          },
          token: tokens.accessToken,
          expiresAt: expiresAt.toISOString(),
          redirectTo: "/super-admin/dashboard",
        },
      },
      refreshToken: tokens.refreshToken,
    };
  }
}
