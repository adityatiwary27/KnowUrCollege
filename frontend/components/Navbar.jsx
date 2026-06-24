"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists on mount or path change
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full flex justify-center py-4 px-4 sticky top-0 z-50">
      <nav className="glass squircle w-full max-w-5xl px-6 py-3 flex items-center justify-between shadow-2xl glow-theme">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">KnowUr College</Link>
          
          {/* Home button when logged in, or when on login/register pages */}
          {(isLoggedIn || pathname === "/login" || pathname === "/register") && (
            <Link href="/" className={`text-sm transition ${pathname === '/' ? 'text-theme font-semibold' : 'muted hover:text-theme'}`}>Home</Link>
          )}

          {isLoggedIn && (
            <>
              <Link href="/feed" className={`text-sm transition ${pathname === '/feed' ? 'text-theme font-semibold' : 'muted hover:text-theme'}`}>Feed</Link>
              <Link href="/profile" className={`text-sm transition ${pathname === '/profile' ? 'text-theme font-semibold' : 'muted hover:text-theme'}`}>Profile</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isLoggedIn && (
            <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm text-theme/80 hover:text-theme transition-smooth">Logout</button>
          )}
        </div>
      </nav>
    </div>
  );
}
