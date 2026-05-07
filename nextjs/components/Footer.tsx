// import Link from "next/link";
import { BookOpen } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-6 mt-auto">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{siteConfig.short_name}</span>
        </div>
        <p className="text-sm text-base-content/60">
          Copyright &copy; {new Date().getFullYear()} {siteConfig.short_name}. All rights reserved. <br />
          <span>Developed by {siteConfig.developer}</span>
        </p>
        {/* <div className="flex gap-4 text-sm">
          <Link href="/" className="link link-hover">Home</Link>
          <Link href="/auth/login" className="link link-hover">Login</Link>
          <Link href="/auth/register" className="link link-hover">Register</Link>
        </div> */}
      </div>
    </footer>
  );
}
