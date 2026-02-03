export interface UserPermissions {
  manageUsers: boolean;
  manageProjects: boolean;
  manageTasks: boolean;
  viewAnalytics: boolean;
}

export interface AuthUser {
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

export interface AuthResponseData {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
