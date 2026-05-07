"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/config/site";
// Icons
import { Sun, Moon, BookOpen, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Initials dari nama user untuk avatar placeholder
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 border-b border-base-200">
      <div className="container mx-auto px-4 flex items-center justify-between w-full">
        <Link href="/" className="btn btn-ghost text-xl font-bold gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{siteConfig.short_name}</span>
        </Link>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Ganti tema"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}

          {status === "authenticated" && session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar avatar-online avatar-placeholder"
              >
                <div className="bg-primary text-primary-content w-9 rounded-full">
                  <span className="text-lg">{initials}</span>
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-100 w-56 p-2 shadow-lg border border-base-200 mt-2"
              >
                {/* User info */}
                <li className="py-2 mb-1 border-b border-base-200">
                  <div className="flex items-center gap-2 hover:bg-transparent cursor-default active:bg-transparent focus:bg-transparent">
                    <div className="avatar avatar-placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-xs font-semibold">{initials}</span>
                      </div>
                    </div>
                    <div className="leading-tight overflow-hidden">
                      <p className="font-semibold text-sm truncate">{session.user.name}</p>
                      <p className="text-xs text-base-content/50 truncate">{session.user.email}</p>
                    </div>
                  </div>
                </li>

                <li>
                  <Link href="/dashboard/posts" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>

                <li className="mt-1 border-t border-base-200 pt-1">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="gap-2 text-error hover:bg-error/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm gap-1">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm gap-1">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
