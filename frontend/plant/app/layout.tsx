import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // Include all font weights
  style: ["normal", "italic"], // Include normal and italic styles
  display: "swap", // Ensure font displays fallback styles first
});

export const metadata: Metadata = {
  title: "Plant - Feed Me Mentions",
  description:
    "Become My Gardener! 🌵✨ I will shower you with Rain(air)drops.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={comicNeue.className}>
      <body>
        <main className="flex flex-col p-2 md:p-6 pt-10 pb-16 h-full items-center">
          <Link
            className="text-6xl tracking-[0.3em] font-bold text-center mt-4 mb-10 text-secondary [text-shadow:_1px_1px_0_#000,_-1px_-1px_0_#000,_-1px_1px_0_#000,_1px_-1px_0_#000]"
            href="/"
          >
            Plant
          </Link>
          {children}
          {modal}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
