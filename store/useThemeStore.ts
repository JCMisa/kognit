import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  primaryColor: string; // Storing the "L C H" values
  setPrimaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Default: 85.35% 0.17435 88.778
      primaryColor: "85.35% 0.17435 88.778",
      setPrimaryColor: (color) => set({ primaryColor: color }),
    }),
    { name: "theme-storage" },
  ),
);
