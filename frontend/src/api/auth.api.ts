import type {
  forgotPasswordInput,
  LoginInput,
  resetPasswordInput,
  signupInput,
} from "../validations/authSchemas";
import apiClient from "./axios.config";
export interface UserPermissions {
  manageUsers: boolean;
  manageProjects: boolean;
  manageTasks: boolean;
  viewAnalytics: boolean;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  company: {
    id: string;
    name: string;
  };
  permissions: UserPermissions;
}
export type LoginRequest = LoginInput;
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
export type SignupRequest = signupInput;
export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
export type ForgotPasswordRequest = forgotPasswordInput;
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
export type ResetPasswordRequest = resetPasswordInput;
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  redirectTo: string;
}
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      data,
    );
    return response.data;
  },
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data,
    );
    return response.data;
  },
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  },
};
