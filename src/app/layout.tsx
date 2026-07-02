import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { DM_Sans, DM_Mono } from "next/font/google";
import LenisProvider from "@/providers/lenis-provider";
import "./globals.css";
import { Toaster } from "sonner";
import ReactDevtoolsVersionPatch from "@/components/ReactDevtoolsVersionPatch";

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
  weight: "300",
});

const siteUrl = new URL("https://ferrous.app");
const xProfileUrl = new URL("https://x.com/FerrousApp");
const xPostUrl = new URL(
  "https://x.com/FerrousApp/status/2070132184451616901?s=20",
);
const socialImage =
  "https://res.cloudinary.com/dgtoh3s2a/image/upload/v1783017625/47707bef-1e84-4bb2-b12d-d2f9a9674201.png";

export const metadata: Metadata = {
  title: "Ferrous",
  description:
    "Ferrous bridges blocked economies to the global money pool turning local currency into smart investments using AI and DeFi",
  metadataBase: siteUrl,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ferrous",
    description:
      "Ferrous bridges blocked economies to the global money pool turning local currency into smart investments using AI and DeFi",
    type: "website",
    url: xPostUrl,
    siteName: "Ferrous",
    locale: "en-US",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Ferrous social preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferrous",
    description:
      "Ferrous bridges blocked economies to the global money pool turning local currency into smart investments using AI and DeFi",
    site: "@FerrousApp",
    creator: "@FerrousApp",
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <LenisProvider>
        <body
          className={`${dmSans.variable} ${robotoMono.variable} ${dmMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <ReactDevtoolsVersionPatch />
          <Toaster richColors position="top-right" />
          {children}
        </body>
      </LenisProvider>
    </html>
  );
}
