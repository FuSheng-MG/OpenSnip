import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", setTheme: () => {}, resolved: "dark" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("opensnip-theme") as Theme) || "dark";
  });
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => {
        const isDark = mq.matches;
        root.classList.toggle("dark", isDark);
        setResolved(isDark ? "dark" : "light");
      };
      apply();
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }

    root.classList.toggle("dark", theme === "dark");
    setResolved(theme === "dark" ? "dark" : "light");
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("opensnip-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
