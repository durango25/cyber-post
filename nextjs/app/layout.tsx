import type { Metadata } from "next";
// Provider
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Config
import { geistSans, geistMono } from '@/config/fonts';
// Styles
import "./globals.css";
import { siteConfig } from "@/config/site";

const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.site_name,
    template: `%s — ${siteConfig.site_name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(", "),
  authors: [{ name: siteConfig.developer }],
  openGraph: {
    type: "website",
    siteName: siteConfig.site_name,
    title: siteConfig.site_name,
    description: siteConfig.description,
    url: siteUrl,
    images: [
      {
        url: `/image.jpg`,
        width: 500,
        height: 500,
        type: "image/png",
        alt: siteConfig.site_name
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
