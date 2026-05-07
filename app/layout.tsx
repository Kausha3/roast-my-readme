import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roast My README 🔥",
  description: "Paste a GitHub URL. Get destroyed. AI-powered README roasts.",
  openGraph: {
    title: "Roast My README 🔥",
    description: "Paste a GitHub URL. Get destroyed.",
    siteName: "roastmyreadme.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My README 🔥",
    description: "Paste a GitHub URL. Get destroyed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
