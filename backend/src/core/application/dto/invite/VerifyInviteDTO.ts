export interface VerifyInviteRequestDTO {
  token: string;
}

export interface VerifyInviteResponseDTO {
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
