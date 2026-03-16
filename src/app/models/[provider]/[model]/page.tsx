import { notFound } from "next/navigation"
import Link from "next/link"
import models from "@/data/models.json"
import providers from "@/data/providers.json"
import type { LLMModel, Provider } from "@/types"
import { PriceCell } from "@/components/price-cell"
import { ProviderBadge } from "@/components/provider-badge"
import { formatTokens } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calculator, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ provider: string; model: string }>
}

function findModel(provider: string, model: string): LLMModel | undefined {
  const id = `${provider}/${model}`
  return (models as LLMModel[]).find((m) => m.id === id)
}

function findProvider(name: string): Provider | undefined {
  return (providers as Provider[]).find(
    (p) => p.name.toLowerCase() === name.toLowerCase() || p.id === name.toLowerCase()
  )
}

export async function generateStaticParams() {
  return (models as LLMModel[]).map((m) => {
    const [provider, model] = m.id.split("/")
    return { provider, model }
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provider, model: modelSlug } = await params
  const model = findModel(provider, modelSlug)
  if (!model) return { title: "Model Not Found" }

  return {
    title: `${model.name} Pricing - ${model.provider}`,
    description: `${model.name} by ${model.provider}: $${model.inputPricePer1M}/1M input tokens, $${model.outputPricePer1M}/1M output tokens. ${formatTokens(model.contextWindow)} context window. Compare with other LLM APIs.`,
  }
}

export default async function ModelPage({ params }: PageProps) {
  const { provider, model: modelSlug } = await params
  const model = findModel(provider, modelSlug)
  if (!model) notFound()

  const providerInfo = findProvider(model.provider)
  const allModels = models as LLMModel[]

  const alternatives = allModels
    .filter((m) => m.id !== model.id)
    .map((m) => ({
      ...m,
      avgPrice: (m.inputPricePer1M + m.outputPricePer1M) / 2,
    }))
    .sort((a, b) => {
      const modelAvg = (model.inputPricePer1M + model.outputPricePer1M) / 2
      return Math.abs(a.avgPrice - modelAvg) - Math.abs(b.avgPrice - modelAvg)
    })
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all models
      </Link>

      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
          {providerInfo && (
            <ProviderBadge name={model.provider} color={providerInfo.color} />
          )}
        </div>
        {model.notes && (
          <p className="text-muted-foreground">{model.notes}</p>
        )}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Input Price
          </p>
          <p className="mt-1 text-2xl font-bold">
            <PriceCell price={model.inputPricePer1M} className="text-2xl" />
          </p>
          <p className="text-xs text-muted-foreground">per 1M tokens</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Output Price
          </p>
          <p className="mt-1 text-2xl font-bold">
            <PriceCell price={model.outputPricePer1M} className="text-2xl" />
          </p>
          <p className="text-xs text-muted-foreground">per 1M tokens</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Context Window
          </p>
          <p className="mt-1 text-2xl font-bold font-mono">
            {formatTokens(model.contextWindow)}
          </p>
          <p className="text-xs text-muted-foreground">tokens</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Max Output
          </p>
          <p className="mt-1 text-2xl font-bold font-mono">
            {formatTokens(model.maxOutput)}
          </p>
          <p className="text-xs text-muted-foreground">tokens</p>
        </Card>
      </div>

      {(model.cachedInputPricePer1M || model.batchInputPricePer1M) && (
        <Card className="mb-8 p-4">
          <h2 className="mb-3 text-lg font-semibold">Additional Pricing</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {model.cachedInputPricePer1M != null && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Cached Input / 1M
                </p>
                <PriceCell
                  price={model.cachedInputPricePer1M}
                  className="text-lg"
                />
              </div>
            )}
            {model.batchInputPricePer1M != null && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Batch Input / 1M
                </p>
                <PriceCell
                  price={model.batchInputPricePer1M}
                  className="text-lg"
                />
              </div>
            )}
            {model.batchOutputPricePer1M != null && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Batch Output / 1M
                </p>
                <PriceCell
                  price={model.batchOutputPricePer1M}
                  className="text-lg"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        <Badge variant="outline">{model.speed} speed</Badge>
        {model.modality.map((m) => (
          <Badge key={m} variant="outline">
            {m}
          </Badge>
        ))}
        <Badge variant="outline">Released {model.released}</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/calculator?input=500&output=2000&requests=100`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Calculator className="h-4 w-4" />
          Calculate cost
        </Link>
        {providerInfo && (
          <a
            href={providerInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Official pricing
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">
          Similar Price Range
        </h2>
        <div className="space-y-2">
          {alternatives.map((alt) => (
            <Link
              key={alt.id}
              href={`/models/${alt.id}`}
              className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 transition-colors hover:border-border hover:bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{alt.name}</span>
                <ProviderBadge
                  name={alt.provider}
                  color={
                    (providers as Provider[]).find(
                      (p) =>
                        p.name.toLowerCase() === alt.provider.toLowerCase()
                    )?.color ?? "#888"
                  }
                />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground">
                  In: <PriceCell price={alt.inputPricePer1M} />
                </span>
                <span className="text-muted-foreground">
                  Out: <PriceCell price={alt.outputPricePer1M} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
