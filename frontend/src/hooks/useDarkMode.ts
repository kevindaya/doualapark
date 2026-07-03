// src/hooks/useDarkMode.ts
import { useState, useEffect } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("dp-dark");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // IMPORTANT: on cible document.documentElement = <html>
    // pour que html[data-theme="dark"] fonctionne en CSS
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("dp-dark", String(dark));
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}