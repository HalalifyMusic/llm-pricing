import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "LLM Pricing - Compare AI API Costs",
    template: "%s | LLM Pricing",
  },
  description:
    "Compare pricing across 50+ LLM APIs. Calculate your actual monthly cost based on real usage. Find the cheapest AI model for your workload.",
  keywords: [
    "LLM pricing",
    "AI API costs",
    "GPT-4 pricing",
    "Claude pricing",
    "Gemini pricing",
    "LLM cost calculator",
    "AI model comparison",
  ],
  openGraph: {
    title: "LLM Pricing - Compare AI API Costs",
    description:
      "Compare pricing across 50+ LLM APIs. Calculate your actual monthly cost based on real usage.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Pricing - Compare AI API Costs",
    description:
      "Compare pricing across 50+ LLM APIs. Calculate your actual monthly cost.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        {process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER && (
          <script async src="https://media.ethicalads.io/media/client/ethicalads.min.js" />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
