import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
    </div>
  );
}
