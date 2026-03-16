import { PriceTable } from "@/components/price-table"
import { AdSlot } from "@/components/ad-slot"
import { EmailCapture } from "@/components/email-capture"
import models from "@/data/models.json"
import providers from "@/data/providers.json"
import type { LLMModel, Provider } from "@/types"
import { generateWebsiteJsonLd, generateFaqJsonLd } from "@/lib/seo"
import Link from "next/link"
import { Calculator } from "lucide-react"
import type { Metadata } from "next"

const providerCount = new Set(models.map((m) => m.provider)).size

export const metadata: Metadata = {
  title: "LLM API Pricing Comparison 2026 - Compare AI Model Costs",
  description: `Compare pricing across ${models.length} LLM APIs from ${providerCount} providers. GPT-5.4, Claude 4.6, Gemini 3.1, DeepSeek, Grok — find the cheapest model for your workload. Updated daily.`,
  keywords: [
    "LLM pricing comparison",
    "AI API costs 2026",
    "GPT-5 pricing",
    "Claude 4.6 pricing",
    "Gemini 3.1 pricing",
    "cheapest LLM API",
    "LLM cost calculator",
    "AI model pricing",
    "DeepSeek pricing",
    "Grok pricing",
    "OpenAI API cost",
    "Anthropic API pricing",
    "LLM token cost",
  ],
  alternates: {
    canonical: "https://llm-pricing.vercel.app",
  },
}

const faqs = [
  {
    question: "What is the cheapest LLM API in 2026?",
    answer: `Mistral Nemo is the cheapest at $0.02/1M input tokens. For frontier-class models, DeepSeek V3.2 at $0.28/$0.42 per 1M tokens is the best value. Amazon Nova Micro ($0.035/$0.14) is the cheapest from a major cloud provider.`,
  },
  {
    question: "How much does GPT-5.4 cost per token?",
    answer:
      "GPT-5.4 costs $2.50 per 1 million input tokens and $15.00 per 1 million output tokens. The Pro version costs $30.00/$180.00 per 1M tokens for maximum reasoning quality.",
  },
  {
    question: "How much does Claude 4.6 cost?",
    answer:
      "Claude Opus 4.6 costs $5.00/1M input and $25.00/1M output tokens with 1M context. Claude Sonnet 4.6 costs $3.00/$15.00. Cached input is 90% cheaper at $0.50 and $0.30 respectively.",
  },
  {
    question: "Which LLM has the largest context window?",
    answer:
      "xAI Grok 4.20 and Grok 4.1 Fast both offer 2 million token context windows. OpenAI GPT-5.4 offers 1.05M tokens. Google Gemini and Anthropic Claude offer 1M tokens.",
  },
  {
    question: "How do I calculate my LLM API cost?",
    answer:
      "Multiply your average input tokens per request by the input price, add your output tokens times the output price, then multiply by your daily request count and 30 days. Use our calculator for instant comparisons across all providers.",
  },
]

export default function Home() {
  const websiteJsonLd = generateWebsiteJsonLd()
  const faqJsonLd = generateFaqJsonLd(faqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            LLM API Pricing Comparison 2026
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Compare pricing across {models.length} models from {providerCount}{" "}
            providers including GPT-5.4, Claude 4.6, Gemini 3.1, DeepSeek, and
            Grok. All prices per 1 million tokens, updated daily.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Calculator className="h-4 w-4" />
            Calculate your actual monthly cost
          </Link>
        </div>

        <EmailCapture className="mb-6" />

        <AdSlot placement="top" className="mb-6" />

        <PriceTable
          models={models as LLMModel[]}
          providers={providers as Provider[]}
        />

        <AdSlot placement="between" className="mt-8" />

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-border px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-medium text-foreground">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
