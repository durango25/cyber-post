"use client";

import { useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Restore persisted preference — only sets the checkbox state,
    // DaisyUI CSS handles the actual data-theme via :has()
    const match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
    if (ref.current && match?.[1] === "light") {
      ref.current.checked = true;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theme = e.target.checked ? "light" : "dark";
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <label className="btn btn-ghost btn-circle swap swap-rotate" aria-label="Toggle theme">
      {/* theme-controller tells DaisyUI to switch data-theme to value="light" when checked */}
      <input
        ref={ref}
        type="checkbox"
        className="theme-controller"
        value="light"
        onChange={handleChange}
      />
      {/* swap-off = shown when unchecked (dark) */}
      <Sun size={20} className="swap-off" />
      {/* swap-on = shown when checked (light) */}
      <Moon size={20} className="swap-on" />
    </label>
  );
}

