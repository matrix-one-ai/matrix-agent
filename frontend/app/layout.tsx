import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

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
      <body>
        <main className="flex flex-col p-6 pt-10 pb-16 h-full items-center">
          <Link className="text-6xl font-normal text-center mb-10" href="/">
            Sami
          </Link>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
