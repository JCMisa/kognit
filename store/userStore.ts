import { UserType } from "@/config/schema";
import { create } from "zustand";

interface UserState {
  userDetails: UserType | null;
  isLoading: boolean;
  setUserDetails: (user: UserType | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userDetails: null,
  isLoading: true,
  setUserDetails: (user) => set({ userDetails: user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
