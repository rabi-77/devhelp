export interface ResetPasswordEmailProps {
  firstName: string;
  companyName: string;
  resetLink: string;
}

export const resetPasswordTemplate = (props: ResetPasswordEmailProps) => {
  const { firstName, companyName, resetLink } = props;

  return {
    subject: "Reset Your Password - devHelp",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Reset Your Password</h2>
          
          <p>Hi <strong>${firstName}</strong>,</p>

          <p>We received a request to reset your password for your account at <strong>${companyName}</strong>.</p>

          <p>
            You can reset your password by clicking the button below. This link is valid for <strong>1 hour</strong>.
          </p>

          <p style="margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>

          <p style="color: #666; font-size: 14px;">
            Or copy and paste this URL into your browser:<br />
            <a href="${resetLink}" style="color: #2563eb; text-decoration: none; word-break: break-all;">
              ${resetLink}
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="font-size: 14px; color: #666;">
            <strong>Security Note:</strong> If you didn't request a password reset, you can safely ignore this email. Your password will not change.
          </p>

          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Need help? Reply to this email or contact support.
          </p>

          <p style="font-size: 12px; color: #999;">
            © 2025 devHelp. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
  };
};
