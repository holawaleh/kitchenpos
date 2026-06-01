import { create } from "zustand";

import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

import { User } from "@/types/auth";

interface AuthState {
  accessToken: string | null;

  refreshToken: string | null;

  user: User | null;

  mustChangePassword: boolean;

  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: User,
    mustChangePassword?: boolean
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        accessToken: null,

        refreshToken: null,

        user: null,

        mustChangePassword: false,

        setAuth: (
          accessToken,
          refreshToken,
          user,
          mustChangePassword = false
        ) =>
          set({
            accessToken,
            refreshToken,
            user,
            mustChangePassword,
          }),

        logout: () =>
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            mustChangePassword: false,
          }),
      }),
      {
        name: "auth-storage",

        storage:
          createJSONStorage(
            () => localStorage
          ),
      }
    )
  );
