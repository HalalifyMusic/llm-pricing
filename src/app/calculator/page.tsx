import { Suspense } from "react"
import { CostCalculator } from "@/components/cost-calculator"
import { AdSlot } from "@/components/ad-slot"
import models from "@/data/models.json"
import providers from "@/data/providers.json"
import type { LLMModel, Provider } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LLM Cost Calculator",
  description:
    "Calculate your actual monthly cost across all LLM providers based on your real usage. Input your tokens and requests to compare prices.",
}

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Cost Calculator
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Enter your usage pattern to see what each LLM API will actually cost
          you per month. Output tokens typically cost 3-5x more than input.
        </p>
      </div>

      <AdSlot placement="top" className="mb-6" />

      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <CostCalculator
          models={models as LLMModel[]}
          providers={providers as Provider[]}
        />
      </Suspense>

      <AdSlot placement="between" className="mt-6" />
    </div>
  )
}
