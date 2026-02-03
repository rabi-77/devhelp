export interface PasswordChangedEmailProps {
  firstName: string;
  companyName: string;
  loginLink: string;
  timestamp: string;
}

export const passwordChangedTemplate = (props: PasswordChangedEmailProps) => {
  const { firstName, companyName, loginLink, timestamp } = props;

  return {
    subject: "Your Password Was Changed - devHelp",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Password Changed Successfully</h2>
          
          <p>Hi <strong>${firstName}</strong>,</p>

          <p>This email is to confirm that the password for your account at <strong>${companyName}</strong> was successfully changed.</p>
          
          <p><strong>Time of change:</strong> ${timestamp}</p>

          <p>You can now log in to your dashboard using your new password.</p>

          <p style="margin: 30px 0;">
            <a href="${loginLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Login to Dashboard
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="font-size: 14px; color: #d93025; background-color: #fce8e6; padding: 15px; border-radius: 4px;">
            <strong>Security Warning:</strong> If you did NOT perform this change, please contact our support team immediately to lock your account.
          </p>

          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Need help? Reply to this email.
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
