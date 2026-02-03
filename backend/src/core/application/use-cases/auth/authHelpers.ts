import { UserPermissions } from "../../dto/auth/SharedAuthTypes";

export function getPermissions(role: string): UserPermissions {
  const defaultPermissions: UserPermissions = {
    manageUsers: false,
    manageProjects: false,
    manageTasks: false,
    viewAnalytics: false,
  };

  if (role === "admin") {
    return {
      manageUsers: true,
      manageProjects: true,
      manageTasks: true,
      viewAnalytics: true,
    };
  }

  return defaultPermissions;
}

export function getRedirectPath(role: string): string {
  const roleRedirects: Record<string, string> = {
    admin: "/admin/dashboard",
    member: "/member/dashboard",
  };

  return roleRedirects[role] || "/member/dashboard";
}
