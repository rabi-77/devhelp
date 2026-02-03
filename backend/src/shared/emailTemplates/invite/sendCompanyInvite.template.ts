export interface SendCompanyInviteProps {
  firstName: string;
  inviterName: string;
  companyName: string;
  inviteLink: string;
  expiresInDays: number;
}

export const sendCompanyInviteTemplate = (props: SendCompanyInviteProps) => {
  const { firstName, inviterName, companyName, inviteLink, expiresInDays } =
    props;

  return {
    subject: `You've been invited to join ${companyName} on devHelp`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">You're Invited to Join ${companyName}!</h2>
          
          <p>Hi <strong>${firstName}</strong>,</p>

          <p>
            <strong>${inviterName}</strong> has invited you to join
            <strong>${companyName}</strong> on <strong>devHelp</strong>.
          </p>

          <p style="margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Accept Invitation
            </a>
          </p>

          <p style="color: #666; font-size: 14px;">
            This invitation will expire in <strong>${expiresInDays} days</strong>.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="font-size: 14px; color: #666;">
            <strong>What's devHelp?</strong><br>
            devHelp helps teams collaborate, manage projects, and track tasks efficiently.
          </p>

          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Need help? Reply to this email or contact ${inviterName}.
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
