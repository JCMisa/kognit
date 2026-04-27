"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useThemeStore } from "@/store/useThemeStore";

export function DynamicThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    // 1. Set the primary color
    root.style.setProperty("--primary", `oklch(${primaryColor})`);

    // 2. Align Primary Foreground (Text Color Calculation)
    // Extract Lightness value from the OKLCH string (e.g., "85.35%")
    const lightness = parseFloat(primaryColor.split("%")[0]);

    // If color is bright (L > 65), use dark text. If dark, use light text.
    const foreground =
      lightness > 65
        ? "oklch(0.145 0 0)" // Dark (matches your --foreground)
        : "oklch(0.985 0 0)"; // Light (matches your dark mode --foreground)

    root.style.setProperty("--primary-foreground", foreground);

    // 3. Sync Claymorphism shadows
    root.style.setProperty(
      "--clay-shadow",
      resolvedTheme === "dark" ? "#030303" : "#c8d0e7",
    );
  }, [primaryColor, resolvedTheme]);

  return <>{children}</>;
}
