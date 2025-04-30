import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStoreData } from "@@types/auth";

interface AuthState extends AuthStoreData {
  setAuth: (data: Omit<AuthStoreData, "setAuth">) => void;
  resetAuth: () => void;
}

const initialState: Omit<AuthState, "setAuth" | "resetAuth"> = {
  session: "",
  token: "",
  user: undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (data) => set(data),
      resetAuth: () => set(initialState),
    }),
    {
      name: "auth-storage",
    }
  )
);
