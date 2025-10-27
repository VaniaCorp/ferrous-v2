import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { DM_Sans, DM_Mono } from "next/font/google";
import LenisProvider from "@/providers/lenis-provider";
import "./globals.css"; 
import { Toaster } from "sonner";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: "300"
});

export const metadata: Metadata = {
  title: "Ferrous",
  description: "Ferrous bridges blocked economies to the global money pool turning local currency into smart investments using AI and DeFi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Maesiez.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        {/* <link rel="preload" href="/videos/intro-vid.mp4" as="video" type="video/mp4" /> */}
      </head>
      <LenisProvider>
        <body
          className={`${dmSans.variable} ${robotoMono.variable} ${dmMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <Toaster richColors position="top-right" />
          {children}
        </body>
      </LenisProvider>
    </html>
  );
}
