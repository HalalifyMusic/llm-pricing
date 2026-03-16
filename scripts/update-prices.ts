/**
 * Price update script — MANUAL ONLY
 *
 * This script validates the structure of models.json and reports
 * which models may need price updates based on their release dates.
 *
 * Automated price fetching is not implemented because provider
 * pricing pages are dynamic SPAs that require headless browsers
 * to scrape reliably. Prices should be updated manually by
 * checking each provider's pricing page.
 *
 * Run: npx tsx scripts/update-prices.ts
 */

import { readFileSync } from "fs"
import { join } from "path"

const MODELS_PATH = join(__dirname, "../src/data/models.json")

interface Model {
  id: string
  provider: string
  name: string
  inputPricePer1M: number
  outputPricePer1M: number
  contextWindow: number
  maxOutput: number
  released: string
}

const PROVIDER_PRICING_URLS: Record<string, string> = {
  OpenAI: "https://openai.com/api/pricing/",
  Anthropic: "https://www.anthropic.com/pricing",
  Google: "https://ai.google.dev/pricing",
  DeepSeek: "https://platform.deepseek.com/api-docs/pricing",
  Mistral: "https://mistral.ai/products/",
  xAI: "https://docs.x.ai/docs/models",
  Amazon: "https://aws.amazon.com/bedrock/pricing/",
  Cohere: "https://cohere.com/pricing",
  "Together AI": "https://www.together.ai/pricing",
  "Fireworks AI": "https://fireworks.ai/pricing",
  Groq: "https://groq.com/pricing/",
}

function main() {
  const models: Model[] = JSON.parse(readFileSync(MODELS_PATH, "utf-8"))
  const today = new Date().toISOString().split("T")[0]

  console.log(`Price audit — ${today}`)
  console.log(`Total models: ${models.length}\n`)

  // Validate structure
  let errors = 0
  for (const model of models) {
    if (!model.id || !model.provider || !model.name) {
      console.error(`  INVALID: Missing required fields in ${JSON.stringify(model)}`)
      errors++
    }
    if (model.inputPricePer1M < 0 || model.outputPricePer1M < 0) {
      console.error(`  INVALID: Negative price for ${model.name}`)
      errors++
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} validation error(s) found.`)
    process.exit(1)
  }

  console.log("All models pass structural validation.\n")

  // Group by provider for manual review
  const byProvider = new Map<string, Model[]>()
  for (const model of models) {
    const existing = byProvider.get(model.provider) ?? []
    byProvider.set(model.provider, [...existing, model])
  }

  console.log("Provider pricing pages to check:")
  for (const [provider, providerModels] of byProvider) {
    const url = PROVIDER_PRICING_URLS[provider] ?? "(no URL configured)"
    console.log(`\n  ${provider} (${providerModels.length} models)`)
    console.log(`  ${url}`)
    for (const m of providerModels) {
      console.log(`    - ${m.name}: $${m.inputPricePer1M}/$${m.outputPricePer1M} per 1M tokens`)
    }
  }

  console.log(`\nTo update prices, edit src/data/models.json directly.`)
}

main()
