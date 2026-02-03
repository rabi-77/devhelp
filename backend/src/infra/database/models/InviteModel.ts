import { Schema, model } from "mongoose";

interface IInvite {
  _id: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "member";
  companyId: string;
  invitedBy: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    _id: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ["member"],
      required: true,
    },
    companyId: { type: String, required: true },
    invitedBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "cancelled"],
      default: "pending",
      required: true,
    },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true, _id: false },
);

InviteSchema.index({ email: 1, companyId: 1 });
InviteSchema.index({ companyId: 1, status: 1 });
InviteSchema.index({ expiresAt: 1 });
InviteSchema.index({ token: 1 });

const InviteModel = model<IInvite>("Invite", InviteSchema);

export default InviteModel;
