import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_URL = 'https://arguslabs.in'
const SITE_TITLE = 'ARGUS — Forensic Observability for AI Agent Pipelines'
const SITE_DESC =
  'ARGUS detects silent failures, explains root causes, and helps you ship AI pipelines you can trust. LangGraph-first, framework-agnostic.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | ARGUS',
  },
  description: SITE_DESC,
  keywords: [
    'AI agent monitoring',
    'LangGraph debugging',
    'AI pipeline testing',
    'silent failure detection',
    'LLM observability',
    'agent pipeline reliability',
    'semantic degradation',
    'AI production readiness',
    'LangChain monitoring',
    'AI agent debugging',
  ],
  authors: [{ name: 'ARGUS Labs' }],
  creator: 'ARGUS Labs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ARGUS',
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
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
        <Analytics />
      </body>
    </html>
  );
}
