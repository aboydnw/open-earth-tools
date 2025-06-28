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
  title: "Open Earth Tools Directory",
  description: "Curated open source Earth science visualization tools ready for safe embedding and storytelling. Quality-vetted tools from NASA, USGS, NOAA and the community.",
  keywords: [
    "earth science",
    "visualization tools",
    "open source",
    "NASA",
    "USGS",
    "NOAA",
    "climate",
    "satellite imagery",
    "environmental data",
    "embedding",
    "iframe",
    "development seed"
  ],
  authors: [{ name: "Development Seed" }],
  openGraph: {
    title: "Open Earth Tools Directory",
    description: "Curated open source Earth science visualization tools ready for safe embedding and storytelling.",
    type: "website",
    siteName: "Open Earth Tools Directory"
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Earth Tools Directory",
    description: "Curated open source Earth science visualization tools ready for safe embedding and storytelling."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
