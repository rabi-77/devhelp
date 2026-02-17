import { Schema, model } from "mongoose";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "member" | "super_admin";
  status: "active" | "inactive" | "invited" | "blocked";
  companyId?: string;
  phone?: string;
  profile?: {
    avatar?: string;
    bio?: string;
    location?: string;
    department?: string;
    timezone?: string;
    language?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklySummary?: boolean;
    theme?: string;
  };
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "member", "super_admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "invited", "blocked"],
      default: "active",
    },
    companyId: { type: String, required: false },
    phone: { type: String },
    profile: {
      avatar: { type: String },
      bio: { type: String },
      location: { type: String },
      department: { type: String },
      timezone: { type: String },
      language: { type: String },
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: false },
      theme: { type: String, default: "light" },
    },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    _id: false,
  },
);

UserSchema.index({ email: 1, companyId: 1 });
UserSchema.index({ companyId: 1, status: 1 });

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
