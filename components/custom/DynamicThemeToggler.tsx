"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Check } from "lucide-react"; // Optional: for showing active state

const PRESET_COLORS = [
  { name: "Gold", value: "85.35% 0.17435 88.778" },
  { name: "Sky", value: "70% 0.12 230" },
  { name: "Rose", value: "65% 0.2 10" },
  { name: "Emerald", value: "65% 0.2 160" },
  { name: "Violet", value: "60% 0.2 300" },
  { name: "Amber", value: "75% 0.18 70" },
  { name: "Slate", value: "55% 0.05 250" },
  { name: "Crimson", value: "50% 0.22 25" },
  { name: "Cyan", value: "75% 0.15 200" },
  { name: "Mint", value: "90% 0.1 165" },
];

export function DynamicThemeToggler() {
  const { primaryColor, setPrimaryColor } = useThemeStore();

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-tight">App Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Select a primary accent color for your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 p-4 clay-card">
        {PRESET_COLORS.map((color) => {
          const isActive = primaryColor === color.value;
          return (
            <button
              key={color.name}
              title={color.name}
              onClick={() => setPrimaryColor(color.value)}
              style={{ backgroundColor: `oklch(${color.value})` }}
              className={`
                h-10 w-10 rounded-full transition-all duration-200 
                hover:scale-110 active:scale-95 flex items-center justify-center
                shadow-[0_4px_10px_rgba(0,0,0,0.1)]
                ${isActive ? "ring-2 ring-offset-2 ring-foreground scale-110" : "opacity-80 hover:opacity-100"}
              `}
            >
              {isActive && (
                <Check className="h-5 w-5 text-[oklch(var(--primary-foreground))]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
