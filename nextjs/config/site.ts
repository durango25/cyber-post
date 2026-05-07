import LogoFavicon from "@/public/images/favicon.ico";
import LogoIcon from "@/public/images/icon.png";

export const siteConfig = {
  site_name: 'CyberPost',
  short_name: 'CyberPost',
  description: 'Technical Tes Programmer 2026 Garuda Cyber',
  keywords: [
    'cyberpost',
    'cyberpost pekanbaru',
  ],
  logo_favicon: LogoFavicon,
  logo_icon: LogoIcon,
  developer: "Hanggara Bima Pramesti",
  version: '1.0'
} as const;

export type SiteConfig = typeof siteConfig;
