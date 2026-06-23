"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <nav className="w-full glass">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-xl text-theme">KnowUr College</Link>
          <Link href="/feed" className="text-sm muted hover:text-theme transition">Feed</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="px-3 py-2 rounded-md text-sm btn-accent shadow-sm">Login</Link>
          <Link href="/register" className="px-3 py-2 rounded-md text-sm border border-theme hover:scale-105 transition">Register</Link>
          <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm text-theme/80 hover:text-theme">Logout</button>
        </div>
      </div>
    </nav>
  );
}
