"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import { useHedera, HederaProvider } from "./hederacontext";

// Initialize the font
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <HederaProvider>
          {children}
        </HederaProvider>
      </body>
    </html>
  );
}
