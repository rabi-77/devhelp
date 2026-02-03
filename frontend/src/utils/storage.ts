import type { User } from "../api/auth.api";
import type { SuperAdminUser } from "../api/superAdmin.api";
type AuthUser = User | SuperAdminUser;
export const storage = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
  removeToken: () => {
    return localStorage.removeItem("token");
  },
  setUser: (user: AuthUser) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser: (): AuthUser | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => {
    localStorage.removeItem("user");
  },
  clear: () => {
    localStorage.clear();
  },
};
