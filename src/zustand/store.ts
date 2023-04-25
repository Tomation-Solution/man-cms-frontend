import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  email: string;
  token: {
    access: string;
    refresh: string;
  };
};

type Store = {
  user: User | null;
};

type Actions = {
  setUser: (userData: User) => void;
  delUser: () => void;
};

export const useAuthStore = create<Store & Actions>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user })),
      delUser: () => set(() => ({ user: null })),
    }),
    {
      name: "global",
    }
  )
);
