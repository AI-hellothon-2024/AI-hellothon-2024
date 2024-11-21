import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import QueryProvider from "@/components/provider/QueryProvider";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
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
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className} antialiased`}>
        <QueryProvider>
          <main className="max-w-[600px] mx-auto h-dvh shadow-lg max-h-dvh flex flex-col">
            {children}
          </main>
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId="G-BXMPGJ5BMX" />
    </html>
  );
}
