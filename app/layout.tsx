import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Open Earth Tools",
  description: "Earth-observation tools, mapped by how open they are. A curated directory of web maps and viewers for climate, hazards, oceans and land, each scored on six questions of openness.",
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
    title: "Open Earth Tools",
    description: "Earth-observation tools, mapped by how open they are.",
    type: "website",
    siteName: "Open Earth Tools"
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Earth Tools",
    description: "Earth-observation tools, mapped by how open they are."
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
        className={`${archivo.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
