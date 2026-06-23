"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(initial);
    setTheme(initial);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-md border border-theme transition-smooth hover-glow bg-theme text-theme">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
