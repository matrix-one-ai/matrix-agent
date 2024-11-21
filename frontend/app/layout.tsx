import type { Metadata } from "next";
import { Tilt_Neon } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const tiltNeon = Tilt_Neon({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAMI",
  description: "SAMI - Matrix Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tiltNeon.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
