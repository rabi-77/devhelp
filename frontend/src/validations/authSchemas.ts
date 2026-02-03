import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});
export type LoginInput = z.infer<typeof loginSchema>;
export const signupSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  companyEmail: z
    .string()
    .trim()
    .email("Invalid company email address")
    .toLowerCase(),
  adminFirstName: z
    .string()
    .trim()
    .min(2, "First Name must be at least 2 characters")
    .max(100, "First Name must not exceed 100 characters"),
  adminLastName: z
    .string()
    .trim()
    .min(2, "Last Name must be at least 2 characters")
    .max(100, "Last Name must not exceed 100 characters"),
  adminEmail: z
    .string()
    .trim()
    .email("Invalid admin email address")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(120, "Password must not exceed 120 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});
export type signupInput = z.infer<typeof signupSchema>;
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
});
export type forgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(120, "Password must not exceed 120 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;
