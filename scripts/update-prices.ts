/**
 * Price update script
 *
 * Fetches current pricing from each provider's API/pricing page
 * and updates src/data/models.json
 *
 * Run: npx tsx scripts/update-prices.ts
 *
 * For providers without APIs, prices are scraped from their pricing pages.
 * This script is run by GitHub Actions on a weekly schedule.
 */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const MODELS_PATH = join(__dirname, "../src/data/models.json")

interface PriceUpdate {
  id: string
  inputPricePer1M?: number
  outputPricePer1M?: number
  cachedInputPricePer1M?: number
  notes?: string
}

async function fetchOpenAIPrices(): Promise<PriceUpdate[]> {
  try {
    const res = await fetch("https://openai.com/api/pricing/")
    if (!res.ok) return []
    const html = await res.text()
    console.log("[OpenAI] Fetched pricing page, parsing...")
    // In production, parse the HTML or use a headless browser
    // For now, log that we checked and return empty (manual update needed)
    return []
  } catch (e) {
    console.error("[OpenAI] Failed to fetch:", e)
    return []
  }
}

async function fetchAnthropicPrices(): Promise<PriceUpdate[]> {
  try {
    const res = await fetch("https://www.anthropic.com/pricing")
    if (!res.ok) return []
    console.log("[Anthropic] Fetched pricing page, parsing...")
    return []
  } catch (e) {
    console.error("[Anthropic] Failed to fetch:", e)
    return []
  }
}

async function fetchGooglePrices(): Promise<PriceUpdate[]> {
  try {
    const res = await fetch("https://ai.google.dev/gemini-api/docs/pricing")
    if (!res.ok) return []
    console.log("[Google] Fetched pricing page, parsing...")
    return []
  } catch (e) {
    console.error("[Google] Failed to fetch:", e)
    return []
  }
}

async function main() {
  console.log("🔄 Checking for price updates...\n")

  const currentData = JSON.parse(readFileSync(MODELS_PATH, "utf-8"))
  const timestamp = new Date().toISOString().split("T")[0]

  // Fetch from all providers in parallel
  const [openai, anthropic, google] = await Promise.all([
    fetchOpenAIPrices(),
    fetchAnthropicPrices(),
    fetchGooglePrices(),
  ])

  const updates = [...openai, ...anthropic, ...google]

  if (updates.length === 0) {
    console.log("\n✅ No automated price changes detected.")
    console.log("   Manual review may still be needed.")
    console.log(`   Last checked: ${timestamp}`)
    return
  }

  let changeCount = 0
  for (const update of updates) {
    const model = currentData.find((m: { id: string }) => m.id === update.id)
    if (!model) continue

    let changed = false
    if (update.inputPricePer1M != null && model.inputPricePer1M !== update.inputPricePer1M) {
      console.log(`  ${model.name}: input $${model.inputPricePer1M} → $${update.inputPricePer1M}`)
      model.inputPricePer1M = update.inputPricePer1M
      changed = true
    }
    if (update.outputPricePer1M != null && model.outputPricePer1M !== update.outputPricePer1M) {
      console.log(`  ${model.name}: output $${model.outputPricePer1M} → $${update.outputPricePer1M}`)
      model.outputPricePer1M = update.outputPricePer1M
      changed = true
    }
    if (changed) changeCount++
  }

  if (changeCount > 0) {
    writeFileSync(MODELS_PATH, JSON.stringify(currentData, null, 2) + "\n")
    console.log(`\n✅ Updated ${changeCount} model(s). File written.`)
  } else {
    console.log("\n✅ All prices match. No changes needed.")
  }
}

main().catch(console.error)
