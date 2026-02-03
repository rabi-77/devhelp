import { acceptInviteInput, InviteInput } from "@/validations/inviteSchemas";
import apiClient from "./axios.config";
import { User } from "./auth.api";
export type InviteRequest = InviteInput;
export interface InviteResponse {
  success: boolean;
  message: string;
  data: {
    invitation: {
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
      invitedBy: {
        id: string;
        name: string;
        role: string;
      };
      invitedAt: string;
      expiresAt: string;
    };
  };
}
export type AcceptInviteRequest = acceptInviteInput;
export interface AcceptInviteResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresAt: string;
    redirectTo: string;
  };
}
export interface VerifyInviteResponse {
  success: boolean;
  data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    company: {
      id: string;
      name: string;
    };
    invitedBy: {
      id: string;
      name: string;
      role: string;
    };
    invitedAt: string;
    expiresAt: string;
  };
}
export const inviteApi = {
  inviteMember: async (data: InviteRequest): Promise<InviteResponse> => {
    const response = await apiClient.post("admin/members/invite", data);
    return response.data;
  },
  validateInvite: async (token: string): Promise<VerifyInviteResponse> => {
    const response = await apiClient.get(`auth/validate-invite?token=${token}`);
    return response.data;
  },
  acceptInvite: async (
    data: AcceptInviteRequest,
  ): Promise<AcceptInviteResponse> => {
    const response = await apiClient.post("auth/accept-invitation", data);
    console.log(response);
    return response.data;
  },
};
