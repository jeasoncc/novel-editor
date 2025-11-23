import { useEffect, useState } from "react";
import { themes } from "@/lib/themes";

type ThemeMode = "light" | "dark" | "system";
type ThemeColor = string;

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme-mode") as ThemeMode) || "system";
    }
    return "system";
  });

  const [theme, setTheme] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme-color") || "slate";
    }
    return "slate";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle Mode
    root.classList.remove("light", "dark");
    
    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }

    // Handle Color Theme
    const selectedTheme = themes.find((t) => t.key === theme);
    if (selectedTheme) {
      const vars = selectedTheme.css.split(";").filter(Boolean);
      vars.forEach((v) => {
        const [key, rawVal] = v.split(":").map((s) => s.trim());
        if (!key || !rawVal) return;

        // Only apply accent-related variables to avoid breaking Dark/Light mode backgrounds
        // and structural styles defined in styles.css
        if (!['--primary', '--primary-foreground', '--ring'].includes(key)) {
            return;
        }

        let val = rawVal;
        // Convert raw HSL channels (e.g. "222.2 84% 4.9%") to valid CSS hsl() function
        // styles.css expects valid color values for var(--primary), etc.
        if (!val.startsWith("hsl") && !val.startsWith("#") && !val.startsWith("oklch")) {
             val = `hsl(${val})`;
        }
        
        root.style.setProperty(key, val);
      });
    }

    // Persist
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-color", theme);

  }, [mode, theme]);

  return { mode, setMode, theme, setTheme };
}
