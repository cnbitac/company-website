import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import { metadataFor } from "./site-metadata";
export const metadata: Metadata = {
  ...metadataFor("home", "zh"),
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
