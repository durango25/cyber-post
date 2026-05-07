import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, List } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-56 hidden md:flex flex-col bg-base-200 border-r border-base-300 py-6">
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/40">
            Dashboard
          </p>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <Link
            href="/dashboard/posts"
            className="btn btn-ghost btn-sm justify-start gap-2"
          >
            <List className="w-4 h-4" />
            Data Post
          </Link>
          <Link
            href="/dashboard/posts/create"
            className="btn btn-ghost btn-sm justify-start gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Buat Post
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-x-auto">
        {/* Mobile nav */}
        <div className="md:hidden bg-base-200 border-b border-base-300 px-4 py-2 flex gap-2">
          <Link href="/dashboard/posts" className="btn btn-ghost btn-xs gap-1">
            <LayoutDashboard className="w-3 h-3" />
            Postingan
          </Link>
          <Link href="/dashboard/posts/create" className="btn btn-primary btn-xs gap-1">
            <PlusCircle className="w-3 h-3" />
            Baru
          </Link>
        </div>
        <div className="p-6 flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
