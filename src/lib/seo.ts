import type { LLMModel } from "@/types"

const BASE_URL = "https://llm-pricing.vercel.app"

export function generateModelJsonLd(model: LLMModel) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${model.name} API`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cloud API",
    offers: {
      "@type": "Offer",
      price: model.inputPricePer1M,
      priceCurrency: "USD",
      description: `$${model.inputPricePer1M}/1M input tokens, $${model.outputPricePer1M}/1M output tokens`,
    },
    author: {
      "@type": "Organization",
      name: model.provider,
    },
    description: `${model.name} by ${model.provider}. Input: $${model.inputPricePer1M}/1M tokens, Output: $${model.outputPricePer1M}/1M tokens. ${model.contextWindow ? `${(model.contextWindow / 1000).toFixed(0)}K context window.` : ""} ${model.notes ?? ""}`,
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LLM Pricing",
    url: BASE_URL,
    description:
      "Compare pricing across 50+ LLM APIs. Calculate your actual monthly cost based on real usage patterns.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}
