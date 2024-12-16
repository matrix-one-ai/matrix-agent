import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Just a Plant",
  description: "Just a Plant.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col p-6 pt-10 pb-16 h-full items-center">
          <Link
            className="text-6xl font-normal text-center mb-10"
            href="/"
            style={{
              color: "#70C238",
              textShadow:
                "1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000",
                textDecoration: "underline"
            }}
          >
            Just a Plant
          </Link>
          {children}
          {modal}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
