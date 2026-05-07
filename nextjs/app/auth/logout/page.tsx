"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-md w-full max-w-sm">
        <div className="card-body items-center text-center gap-4">
          <LogOut className="w-10 h-10 text-primary" />
          <h2 className="card-title">Signing out...</h2>
          <p className="text-base-content/60 text-sm">
            Anda sedang keluar. Akan dialihkan sebentar lagi.
          </p>
          <span className="loading loading-dots loading-md text-primary" />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push("/")}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
