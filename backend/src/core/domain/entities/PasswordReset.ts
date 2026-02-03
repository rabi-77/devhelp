export interface PasswordReset {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
