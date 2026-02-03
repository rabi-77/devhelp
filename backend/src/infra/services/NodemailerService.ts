import { IEmailService } from "../../core/application/services/IEmailService";
import { createTransport } from "nodemailer";
import { injectable } from "inversify";

@injectable()
export class NodemailerService implements IEmailService {
  private transport;

  constructor() {
    this.transport = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }
  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transport.sendMail({
      from: `devHelp <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}
