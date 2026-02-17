import { SignupRequestDTO, SignupResponseDTO } from "../../dto/auth/SignupDTO";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { ITokenService } from "../../services/ITokenService";
import { Types } from "../../../../infra/container/types";
import { inject, injectable } from "inversify";
import { IUnitWork } from "../../uow/IUnitWork";
import { getPermissions, getRedirectPath } from "./authHelpers";
import {
  EmailAlreadyExistsError,
} from "../../../../shared/errors";

@injectable()
export class SignupUseCase {
  constructor(
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,

    @inject(Types.CompanyRepository)
    private companyRepository: ICompanyRepository,

    @inject(Types.PasswordService)
    private passwordService: IPasswordService,

    @inject(Types.TokenService)
    private tokenService: ITokenService,

    @inject(Types.UnitOfWork)
    private uow: IUnitWork,
  ) { }

  async execute(req: SignupRequestDTO): Promise<{
    response: SignupResponseDTO;
    refreshToken: string;
  }> {
    const existingCompany = await this.companyRepository.findByEmail(
      req.companyEmail,
    );
    if (existingCompany) {
      throw new EmailAlreadyExistsError("Company email already registered");
    }



    const existingUser = await this.userRepository.findByEmail(req.adminEmail);
    if (existingUser) {
      throw new EmailAlreadyExistsError("Admin email already registered");
    }

    const hashedPassword = await this.passwordService.hash(req.password);

    // Only use transactions if enabled in environment
    const useTransactions = process.env.USE_TRANSACTIONS === "true";

    if (useTransactions) {
      await this.uow.begin();
    }

    try {
      const company = await this.companyRepository.create(
        {
          name: req.companyName,
          email: req.companyEmail,
          status: "active",
        },
        useTransactions ? this.uow : undefined,
      );

      const user = await this.userRepository.create(
        {
          firstName: req.adminFirstName,
          lastName: req.adminLastName,
          email: req.adminEmail,
          password: hashedPassword,
          role: "admin",
          status: "active",
          companyId: company.id,
        },
        useTransactions ? this.uow : undefined,
      );

      const tokens = this.tokenService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      });

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      if (useTransactions) {
        await this.uow.commit();
      }

      return {
        response: {
          success: true,
          message: "Company created successfully",
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              status: user.status,
              company: {
                id: company.id,
                name: company.name,
              },
              permissions: getPermissions(user.role),
            },
            token: tokens.accessToken,
            expiresAt: expiresAt.toISOString(),
            redirectTo: getRedirectPath(user.role),
          },
        },
        refreshToken: tokens.refreshToken,
      };
    } catch (error: any) {
      if (useTransactions) {
        await this.uow.rollback();
      }

      if (error.code === 11000) {
        // Duplicate key error from MongoDB
        const duplicateField = error.keyPattern;

        if (duplicateField?.email) {
          // Check if it's from Company or User collection
          const errorMessage = error.message || '';
          if (errorMessage.includes('Company')) {
            throw new EmailAlreadyExistsError("Company email already registered");
          } else if (errorMessage.includes('User')) {
            throw new EmailAlreadyExistsError("Admin email already registered");
          }
        }

        // Generic fallback
        throw new EmailAlreadyExistsError("Email already registered");
      }

      throw error;
    }
  }
}
