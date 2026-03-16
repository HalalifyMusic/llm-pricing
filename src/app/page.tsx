import { PriceTable } from "@/components/price-table"
import models from "@/data/models.json"
import providers from "@/data/providers.json"
import type { LLMModel, Provider } from "@/types"
import Link from "next/link"
import { Calculator } from "lucide-react"

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          LLM API Pricing
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Compare pricing across {models.length} models from{" "}
          {new Set(models.map((m) => m.provider)).size} providers. All prices
          are per 1 million tokens.
        </p>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Calculator className="h-4 w-4" />
          Calculate your actual cost
        </Link>
      </div>

      <PriceTable
        models={models as LLMModel[]}
        providers={providers as Provider[]}
      />
    </div>
  )
}
