import { Schema, model } from "mongoose";

interface ICompany {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status: "active" | "inactive" | "trial" | "suspended" | "deleted";

  subscriptionPlan:
  | "free"
  | "trial"
  | "starter"
  | "professional"
  | "enterprise";
  subscriptionStatus?: "active" | "cancelled" | "expired";
  billingCycle?: "monthly" | "annual";
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  nextBillingDate?: Date;
  monthlyPrice?: number;

  storageUsed?: number;
  storageLimit?: number;

  lastActiveAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    website: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "trial", "suspended", "deleted"],
      default: "active",
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "trial", "starter", "professional", "enterprise"],
      default: "trial",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
    },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    nextBillingDate: { type: Date },
    monthlyPrice: { type: Number },

    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 5368709120 }, // 5GB in bytes

    lastActiveAt: { type: Date },
  },
  {
    timestamps: true,
    _id: false,
  },
);

CompanySchema.index({ status: 1 });
CompanySchema.index({ subscriptionPlan: 1 });

const CompanyModel = model<ICompany>("Company", CompanySchema);

export default CompanyModel;
