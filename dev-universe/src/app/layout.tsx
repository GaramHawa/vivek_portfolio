import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Changela Vivek — Dev Universe Portfolio",
  description:
    "A retro-futuristic, space-themed interactive portfolio by Changela Vivek. Explore projects as celestial bodies orbiting a central star.",
  keywords: [
    "portfolio",
    "developer",
    "Changela Vivek",
    "full-stack",
    "react",
    "next.js",
    "three.js",
    "space",
  ],
  openGraph: {
    title: "Changela Vivek — Dev Universe",
    description:
      "Enter the terminal. Type your mantra. Explore the universe of projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030108] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
