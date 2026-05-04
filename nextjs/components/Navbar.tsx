"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import api from "@/lib/api";

export function Navbar() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      // Revoke the Bearer token on Laravel side
      await api.post("/logout");
    } catch {
      // Ignore — proceed with client-side logout regardless
    }
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="navbar bg-base-300 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          ⚡ CyberPost
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {session?.user && (
          <span className="text-sm hidden sm:inline opacity-70">
            {session.user.name}
          </span>
        )}
        <ThemeToggle />
        {session?.user && (
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
