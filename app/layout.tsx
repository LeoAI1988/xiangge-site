import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "亚里士多翔的 AI 世界：搭建 AI 复利系统，沉淀个人成长，创造数字资产。";

  return {
    title: "亚里士多翔的 AI 世界｜有用的AI课",
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "亚里士多翔的 AI 世界",
      description,
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1734, height: 910, alt: "亚里士多翔的 AI 世界" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "亚里士多翔的 AI 世界",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

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
