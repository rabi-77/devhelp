import { z } from "zod";
import { version as uuidVersion } from "uuid";

export const sendCompanyInviteSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  firstName: z
    .string()
    .trim()
    .min(2, "First Name must be at least 2 characters")
    .max(100, "First Name must not exceed 100 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last Name must be at least 2 characters")
    .max(100, "Last Name must not exceed 100 characters"),
});

export type sendCompanyInviteInput = z.infer<typeof sendCompanyInviteSchema>;

export const acceptInviteSchema = z
  .object({
    token: z
      .string({ message: "Invitation token is required" })
      .trim()
      .toLowerCase()
      .uuid({ message: "Invalid invitation token format" })
      .refine((val) => uuidVersion(val) === 4, {
        message: "Invalid Invitation token format",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(120, "Password must not exceed 120 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type acceptInviteInput = z.infer<typeof acceptInviteSchema>;
