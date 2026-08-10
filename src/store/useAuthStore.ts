import { create } from "zustand";

import { secureStorage } from "@/services/storage/secureStorage";
import { userStorage } from "@/services/storage/userStorage";
import { AuthUser } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  authenticated: boolean;

  isHydrated: boolean;

  setToken: (token: string | null) => Promise<void>;
  setUser: (user: AuthUser | null) => Promise<void>;
  bootstrapAsync: () => Promise<void>;

  logout: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    token: null,
    user: null,
    authenticated: false,

    isHydrated: false,

    setToken: async (token) => {
      if (token) {
        await secureStorage.saveToken(token);
      } else {
        await secureStorage.clearToken();
      }

      set({
        token,
        authenticated: !!token,
      });
    },

    setUser: async (user) => {
      if (user) await userStorage.saveUser(user);
      else await userStorage.clearUser();

      set({ user });
    },

    bootstrapAsync: async () => {
      try {
        const token = await secureStorage.getToken();
        const user = await userStorage.getUser();
        set({
          token,
          user,
          authenticated: !!token && !!user,
          isHydrated: true,
        });
      } catch {
        set({
          token: null,
          user: null,
          authenticated: false,
          isHydrated: true,
        });
      }
    },

    logout: async () => {
      await secureStorage.clearToken();
      await userStorage.clearUser();

      set({
        token: null,
        user: null,
        authenticated: false,
      });
    },
  }));