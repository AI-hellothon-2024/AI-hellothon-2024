import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import QueryProvider from "@/components/provider/QueryProvider";
import KakaoScript from "@/components/script/KakaoScript";

import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});
const dungGeunMo = localFont({
  src: "./fonts/DungGeunMo.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-dungGeunMo",
});

export const metadata: Metadata = {
  title: "AImigo",
  description: "IT업계 신입사원을 위한 시뮬레이션",
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
    <html lang="ko" className={`${pretendard.variable} ${dungGeunMo.variable}`}>
      <body className={`${pretendard.className} antialiased`}>
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
