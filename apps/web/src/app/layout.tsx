import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novel Editor - 专业的长篇小说写作工具",
  description: "Novel Editor 是一款现代化的跨平台写作环境，专为长篇小说创作而设计。支持 Linux、Windows 和 macOS。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
