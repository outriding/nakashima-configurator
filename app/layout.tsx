import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nakashima-configurator.vercel.app"),
  title: "Nakashima Lounge Chair — Configurator",
  description:
    "Configure a mid-century lounge chair in real-time 3D: walnut, oak, or ebony frame with linen, velvet, or leather.",
  openGraph: {
    title: "Nakashima Lounge Chair — Configurator",
    description:
      "Configure a mid-century lounge chair in real-time 3D — walnut, oak, or ebony frame with linen, velvet, or leather.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Nakashima lounge chair configurator",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
