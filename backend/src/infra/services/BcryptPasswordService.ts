import bcrypt from "bcrypt";
import { IPasswordService } from "../../core/application/services/IPasswordService";
import { injectable } from "inversify";

@injectable()
export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds: number;
  constructor() {
    let rounds = process.env.BCRYPT_SALT_ROUNDS;
    if (!rounds) {
      throw new Error(
        "BCRYPT_SALT_ROUNDS is not defined in enviaronment variables",
      );
    }

    this.saltRounds = Number(rounds);

    if (Number.isNaN(this.saltRounds)) {
      throw new Error("BCRYPT_SALT_ROUNDS must be a number");
    }
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
