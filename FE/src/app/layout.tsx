import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import QueryProvider from "@/components/provider/QueryProvider";
import KakaoScript from "@/components/script/KakaoScript";

import "./globals.css";

const dungGeunMo = localFont({
  src: "./fonts/DungGeunMo.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-dungGeunMo",
});
const minSans = localFont({
  src: "./fonts/MinSansVF.ttf",
  display: "swap",
  weight: "45 920",
  variable: "--font-minsans",
});

export const metadata: Metadata = {
  title: "AImigo",
  description: "신입사원의 빠른 온보딩과 대화 스킬 학습을 위한 AI 파트너",
  openGraph: {
    title: "AImigo",
    description: "신입사원의 빠른 온보딩과 대화 스킬 학습을 위한 AI 파트너",
  },
};
export const viewport: Viewport = {
  themeColor: "#1E1E1E",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${minSans.variable} ${dungGeunMo.variable}`}>
      <body className={`${minSans.className} antialiased`}>
        <QueryProvider>
          <main className="max-w-[600px] mx-auto min-h-dvh shadow-lg flex flex-col">
            {children}
          </main>
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId="G-BXMPGJ5BMX" />
      <KakaoScript />
    </html>
  );
}
