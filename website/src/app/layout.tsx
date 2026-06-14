import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";
import { mainPage } from "../constants/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gtWalsheim = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Walsheim-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gt-walsheim",
});

export const metadata: Metadata = mainPage;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gtWalsheim.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${gtWalsheim.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
