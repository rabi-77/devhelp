export interface IEmailService {
  sendMail(data: { to: string; subject: string; html: string }): Promise<void>;
}
