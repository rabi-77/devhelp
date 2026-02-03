import { Schema, model } from "mongoose";

interface IPasswordReset {
  _id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IPasswordSchema = new Schema<IPasswordReset>(
  {
    _id: { type: String, required: true },
    token: { type: String, required: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
  },
  {
    timestamps: true,
    _id: false,
  },
);

IPasswordSchema.index({ token: 1 }, { unique: true });
IPasswordSchema.index({ userId: 1 });
IPasswordSchema.index({ expiresAt: 1 });
IPasswordSchema.index({ userId: 1, isUsed: 1, expiresAt: 1 });

const PasswordResetModel = model<IPasswordReset>(
  "PasswordReset",
  IPasswordSchema,
);

export default PasswordResetModel;
