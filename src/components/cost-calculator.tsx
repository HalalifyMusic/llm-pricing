"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import type { LLMModel, Provider } from "@/types"
import { calculateMonthlyCost, costPer1KRequests } from "@/lib/pricing"
import { getProviderSignupUrl } from "@/lib/affiliate"
import { formatCurrency } from "@/lib/format"
import { getProviderColor, getProviderId, getProviderUrl } from "@/lib/providers"
import { ProviderBadge } from "./provider-badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Trophy, TrendingDown, ExternalLink, Zap } from "lucide-react"

interface WorkloadPreset {
  name: string
  description: string
  inputTokens: number
  outputTokens: number
  requestsPerDay: number
}

const WORKLOAD_PRESETS: WorkloadPreset[] = [
  {
    name: "Chatbot",
    description: "Customer support or conversational AI",
    inputTokens: 500,
    outputTokens: 2000,
    requestsPerDay: 1000,
  },
  {
    name: "RAG Pipeline",
    description: "Document retrieval and synthesis",
    inputTokens: 8000,
    outputTokens: 500,
    requestsPerDay: 500,
  },
  {
    name: "Code Assistant",
    description: "IDE copilot or code review",
    inputTokens: 2000,
    outputTokens: 4000,
    requestsPerDay: 200,
  },
  {
    name: "Content Generator",
    description: "Blog posts, marketing copy, reports",
    inputTokens: 1000,
    outputTokens: 3000,
    requestsPerDay: 100,
  },
  {
    name: "Data Extraction",
    description: "Parsing documents, structured output",
    inputTokens: 5000,
    outputTokens: 200,
    requestsPerDay: 2000,
  },
]

interface CostCalculatorProps {
  models: LLMModel[]
  providers: Provider[]
}

export function CostCalculator({ models, providers }: CostCalculatorProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [inputTokens, setInputTokens] = useState(
    Number(searchParams.get("input")) || 500
  )
  const [outputTokens, setOutputTokens] = useState(
    Number(searchParams.get("output")) || 2000
  )
  const [requestsPerDay, setRequestsPerDay] = useState(
    Number(searchParams.get("requests")) || 100
  )
  const [cachedPercent, setCachedPercent] = useState(
    Number(searchParams.get("cached")) || 0
  )
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const applyPreset = (preset: WorkloadPreset) => {
    setInputTokens(preset.inputTokens)
    setOutputTokens(preset.outputTokens)
    setRequestsPerDay(preset.requestsPerDay)
    updateUrl(preset.inputTokens, preset.outputTokens, preset.requestsPerDay, cachedPercent)
    // Set after updateUrl (which clears it)
    setActivePreset(preset.name)
  }

  const updateUrl = (
    input: number,
    output: number,
    requests: number,
    cached: number
  ) => {
    setActivePreset(null)
    const params = new URLSearchParams()
    params.set("input", String(input))
    params.set("output", String(output))
    params.set("requests", String(requests))
    if (cached > 0) params.set("cached", String(cached))
    router.replace(`/calculator?${params.toString()}`, { scroll: false })
  }

  const results = useMemo(() => {
    return models
      .map((model) => ({
        model,
        monthly: calculateMonthlyCost(
          model,
          inputTokens,
          outputTokens,
          requestsPerDay,
          cachedPercent
        ),
        per1k: costPer1KRequests(model, inputTokens, outputTokens),
      }))
      .sort((a, b) => a.monthly - b.monthly)
  }, [models, inputTokens, outputTokens, requestsPerDay, cachedPercent])

  const mostExpensive = results[results.length - 1]?.monthly ?? 1

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Quick presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {WORKLOAD_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left transition-all",
                activePreset === preset.name
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/50 hover:border-border hover:bg-muted/30"
              )}
            >
              <span className="block text-sm font-medium">{preset.name}</span>
              <span className="block text-xs text-muted-foreground">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Input tokens per request
          </label>
          <div className="flex items-center gap-3">
            <Slider
              value={[inputTokens]}
              onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val;
                setInputTokens(v)
                updateUrl(v, outputTokens, requestsPerDay, cachedPercent)
              }}
              min={10}
              max={100000}
              step={10}
              className="flex-1"
            />
            <Input
              type="number"
              value={inputTokens}
              onChange={(e) => {
                const v = Number(e.target.value) || 0
                setInputTokens(v)
                updateUrl(v, outputTokens, requestsPerDay, cachedPercent)
              }}
              className="w-24 font-mono text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ~{Math.round(inputTokens / 4)} words
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Output tokens per response
          </label>
          <div className="flex items-center gap-3">
            <Slider
              value={[outputTokens]}
              onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val;
                setOutputTokens(v)
                updateUrl(inputTokens, v, requestsPerDay, cachedPercent)
              }}
              min={10}
              max={32000}
              step={10}
              className="flex-1"
            />
            <Input
              type="number"
              value={outputTokens}
              onChange={(e) => {
                const v = Number(e.target.value) || 0
                setOutputTokens(v)
                updateUrl(inputTokens, v, requestsPerDay, cachedPercent)
              }}
              className="w-24 font-mono text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ~{Math.round(outputTokens / 4)} words
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Requests per day</label>
          <div className="flex items-center gap-3">
            <Slider
              value={[requestsPerDay]}
              onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val;
                setRequestsPerDay(v)
                updateUrl(inputTokens, outputTokens, v, cachedPercent)
              }}
              min={1}
              max={10000}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={requestsPerDay}
              onChange={(e) => {
                const v = Number(e.target.value) || 0
                setRequestsPerDay(v)
                updateUrl(inputTokens, outputTokens, v, cachedPercent)
              }}
              className="w-24 font-mono text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {(requestsPerDay * 30).toLocaleString()} / month
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Context caching %
          </label>
          <div className="flex items-center gap-3">
            <Slider
              value={[cachedPercent]}
              onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val;
                setCachedPercent(v)
                updateUrl(inputTokens, outputTokens, requestsPerDay, v)
              }}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="w-24 text-right font-mono text-sm">
              {cachedPercent}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            % of input tokens served from cache
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {results.map((r, i) => {
          const barWidth =
            mostExpensive > 0
              ? Math.max(2, (r.monthly / mostExpensive) * 100)
              : 2
          const savings =
            mostExpensive > 0
              ? ((1 - r.monthly / mostExpensive) * 100).toFixed(0)
              : "0"
          const isFirst = i === 0

          return (
            <div
              key={r.model.id}
              className={cn(
                "group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                isFirst
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border/50 hover:border-border"
              )}
            >
              <Link href={`/models/${r.model.id}`} className="w-40 shrink-0 sm:w-52">
                <div className="flex items-center gap-2">
                  {isFirst && <Trophy className="h-4 w-4 text-emerald-400" />}
                  <span className="text-sm font-medium hover:underline">{r.model.name}</span>
                </div>
                <ProviderBadge
                  name={r.model.provider}
                  color={getProviderColor(providers, r.model.provider)}
                  className="mt-1"
                />
              </Link>

              <div className="hidden flex-1 sm:block">
                <div
                  className={cn(
                    "h-6 rounded-sm transition-all",
                    isFirst ? "bg-emerald-500/30" : "bg-muted"
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="ml-auto flex items-center gap-4 text-right">
                <div>
                  <p className="font-mono text-sm font-medium">
                    {formatCurrency(r.monthly)}
                    <span className="text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(r.per1k)}/1K req
                  </p>
                </div>
                {!isFirst && Number(savings) > 0 && (
                  <Badge
                    variant="outline"
                    className="hidden text-xs sm:inline-flex"
                  >
                    <TrendingDown className="mr-1 h-3 w-3" />
                    {savings}% more
                  </Badge>
                )}
                {isFirst && (
                  <Badge className="hidden bg-emerald-500/20 text-xs text-emerald-400 sm:inline-flex">
                    Best value
                  </Badge>
                )}
                <a
                  href={getProviderSignupUrl(
                    getProviderId(providers, r.model.provider),
                    getProviderUrl(providers, r.model.provider),
                    "calculator"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1 rounded-md border border-border/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:inline-flex"
                >
                  Try it
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
