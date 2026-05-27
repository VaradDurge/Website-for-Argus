import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARGUS — Forensic observability for AI agents",
  description:
    "ARGUS detects silent failures, explains root causes, and helps you ship AI pipelines you can trust.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable} ${serif.variable} antialiased`}
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
