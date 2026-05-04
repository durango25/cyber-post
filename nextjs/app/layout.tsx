import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: { default: "CyberPost", template: "%s — CyberPost" },
  description: "A post management app with dark and light themes.",
  openGraph: { siteName: "CyberPost", type: "website" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

