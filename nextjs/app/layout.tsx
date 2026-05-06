import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/app/Providers";

const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CyberPost",
    template: "%s — CyberPost"
  },
  description: "Technical Tes Programmer 2026 Garuda Cyber",
  keywords: [
    'cyber post',
    'cyber post pekanbaru',
  ],
  authors: [{ name: 'Hanggara Bima Pramesti' }],
  openGraph: {
    type: "website",
    siteName: "CyberPost",
    title: "CyberPost",
    description: "Technical Tes Programmer 2026 Garuda Cyber",
    url: siteUrl,
    images: [
      {
        url: `/image.jpg`,
        width: 500,
        height: 500,
        type: "image/png",
        alt: 'CyberPost'
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="id" data-theme={theme} suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/ico" />
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

