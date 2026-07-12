import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "不是教你学 AI，而是让 AI 变成你的业务系统。领取课程赠品与 Skill 资产。";

  return {
    title: "翔哥 AI 业务工作流课",
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "翔哥 AI 工作流",
      description,
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1734, height: 910, alt: "翔哥 AI 工作流" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "翔哥 AI 工作流",
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
