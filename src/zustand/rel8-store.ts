import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Rel8User = {
  token: string;
  user_type: string;
  chapter: null | string | number;
  council: null | string | number;
  commitee: string[];
  userSecret: string;
  userName: string;
  user_id: number;
  member_id: null | string | number;
  profile_image: string;
};

type Store = {
  user: Rel8User | null;
};

type Actions = {
  setUser: (user: Rel8User) => void;
  delUser: () => void;
};

const useRel8AuthStore = create<Store & Actions>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user })),
      delUser: () => set(() => ({ user: null })),
    }),
    {
      name: "rel8global",
    }
  )
);

export default useRel8AuthStore;
