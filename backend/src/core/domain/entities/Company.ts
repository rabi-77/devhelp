export interface Company {
  id: string;
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

  storageUsed?: number;
  storageLimit?: number;

  lastActiveAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
