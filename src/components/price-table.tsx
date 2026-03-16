"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { LLMModel, Provider } from "@/types"
import { PriceCell } from "./price-cell"
import { ProviderBadge } from "./provider-badge"
import { formatTokens } from "@/lib/format"
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SortField = "name" | "inputPrice" | "outputPrice" | "context" | "speed"
type SortDir = "asc" | "desc"

interface PriceTableProps {
  models: LLMModel[]
  providers: Provider[]
}

function getProviderColor(providers: Provider[], providerId: string): string {
  const match = providers.find((p) => p.id === providerId.toLowerCase())
  return match?.color ?? "#888"
}

function speedLabel(speed: string) {
  switch (speed) {
    case "fast":
      return { text: "Fast", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
    case "medium":
      return { text: "Med", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" }
    case "slow":
      return { text: "Slow", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" }
    default:
      return { text: speed, className: "" }
  }
}

export function PriceTable({ models, providers }: PriceTableProps) {
  const [sortField, setSortField] = useState<SortField>("inputPrice")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [search, setSearch] = useState("")
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set())

  const providerIds = useMemo(
    () => [...new Set(models.map((m) => m.provider))],
    [models]
  )

  const toggleProvider = (id: string) => {
    setSelectedProviders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    let result = models

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      )
    }

    if (selectedProviders.size > 0) {
      result = result.filter((m) => selectedProviders.has(m.provider))
    }

    return result
  }, [models, search, selectedProviders])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    const dir = sortDir === "asc" ? 1 : -1

    arr.sort((a, b) => {
      switch (sortField) {
        case "name":
          return dir * a.name.localeCompare(b.name)
        case "inputPrice":
          return dir * (a.inputPricePer1M - b.inputPricePer1M)
        case "outputPrice":
          return dir * (a.outputPricePer1M - b.outputPricePer1M)
        case "context":
          return dir * (a.contextWindow - b.contextWindow)
        case "speed": {
          const order = { fast: 0, medium: 1, slow: 2 }
          return dir * (order[a.speed] - order[b.speed])
        }
        default:
          return 0
      }
    })

    return arr
  }, [filtered, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {sorted.length} model{sorted.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {providerIds.map((id) => {
          const active = selectedProviders.size === 0 || selectedProviders.has(id)
          return (
            <button
              key={id}
              onClick={() => toggleProvider(id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                active
                  ? "border-foreground/20 bg-foreground/5 text-foreground"
                  : "border-transparent bg-muted/50 text-muted-foreground/50"
              )}
            >
              {id}
            </button>
          )
        })}
        {selectedProviders.size > 0 && (
          <button
            onClick={() => setSelectedProviders(new Set())}
            className="rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">
                <button
                  onClick={() => handleSort("name")}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Model <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">Provider</th>
              <th className="px-4 py-3 text-right font-medium">
                <button
                  onClick={() => handleSort("inputPrice")}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Input/1M <SortIcon field="inputPrice" />
                </button>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <button
                  onClick={() => handleSort("outputPrice")}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Output/1M <SortIcon field="outputPrice" />
                </button>
              </th>
              <th className="hidden px-4 py-3 text-right font-medium md:table-cell">
                <button
                  onClick={() => handleSort("context")}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Context <SortIcon field="context" />
                </button>
              </th>
              <th className="hidden px-4 py-3 text-center font-medium lg:table-cell">
                <button
                  onClick={() => handleSort("speed")}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Speed <SortIcon field="speed" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((model) => {
              const speed = speedLabel(model.speed)
              const slug = model.id.replace("/", "/")
              return (
                <tr
                  key={model.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/models/${slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {model.name}
                    </Link>
                    {model.notes && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {model.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ProviderBadge
                      name={model.provider}
                      color={getProviderColor(providers, model.provider)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <PriceCell price={model.inputPricePer1M} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <PriceCell price={model.outputPricePer1M} />
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-sm text-muted-foreground md:table-cell">
                    {formatTokens(model.contextWindow)}
                  </td>
                  <td className="hidden px-4 py-3 text-center lg:table-cell">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", speed.className)}
                    >
                      {speed.text}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
