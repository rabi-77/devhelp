import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../api/auth.api";
import type { SuperAdminUser } from "../api/superAdmin.api";
import { storage } from "../utils/storage";
type AuthUser = User | SuperAdminUser;
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        storage.setToken(token);
        storage.setUser(user);
        set(
          {
            user,
            token,
            isAuthenticated: true,
          },
          false,
          "auth/setAuth",
        );
      },
      logout: () => {
        storage.clear();
        set(
          {
            user: null,
            token: null,
            isAuthenticated: false,
          },
          false,
          "auth/logout",
        );
      },
      initAuth: () => {
        const token = storage.getToken();
        const user = storage.getUser();
        const hasRequiredData = token && user;
        if (hasRequiredData) {
          set(
            {
              user,
              token,
              isAuthenticated: true,
            },
            false,
            "auth/initAuth",
          );
        }
      },
    }),
    {
      name: "AuthStore",
    },
  ),
);
