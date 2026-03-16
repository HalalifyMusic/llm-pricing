"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface PricePoint {
  date: string
  input: number
  output: number
}

interface PriceHistoryChartProps {
  history: PricePoint[]
  modelName: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) {
  if (!active || !payload?.length || !label) return null

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: ${entry.value < 1 ? entry.value.toFixed(3) : entry.value.toFixed(2)}/1M
        </p>
      ))}
    </div>
  )
}

export function PriceHistoryChart({
  history,
  modelName,
}: PriceHistoryChartProps) {
  if (history.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border/50 bg-muted/10 text-sm text-muted-foreground">
        Price history will appear after the next price change
      </div>
    )
  }

  const data = history.map((p) => ({
    date: formatDate(p.date),
    Input: p.input,
    Output: p.output,
  }))

  const firstInput = history[0].input
  const lastInput = history[history.length - 1].input
  const inputChange = firstInput > 0 ? ((lastInput - firstInput) / firstInput) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Price History</h3>
        {inputChange !== 0 && (
          <span
            className={`text-sm font-medium ${inputChange < 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {inputChange > 0 ? "+" : ""}
            {inputChange.toFixed(0)}% input since launch
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            stroke="hsl(var(--border))"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            stroke="hsl(var(--border))"
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
          />
          <Line
            type="stepAfter"
            dataKey="Input"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, fill: "#10b981" }}
            name="Input /1M"
          />
          <Line
            type="stepAfter"
            dataKey="Output"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4, fill: "#f59e0b" }}
            name="Output /1M"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
