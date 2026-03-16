import { cn } from "@/lib/utils"

interface PriceCellProps {
  price: number
  className?: string
}

function getPriceColor(price: number): string {
  if (price === 0) return "text-emerald-400"
  if (price < 0.5) return "text-emerald-400"
  if (price < 1) return "text-emerald-300"
  if (price < 3) return "text-green-300"
  if (price < 5) return "text-yellow-300"
  if (price < 10) return "text-amber-300"
  if (price < 15) return "text-orange-300"
  if (price < 30) return "text-orange-400"
  return "text-red-400"
}

export function PriceCell({ price, className }: PriceCellProps) {
  if (price === 0) {
    return (
      <span className={cn("font-mono text-sm font-medium text-emerald-400", className)}>
        Free
      </span>
    )
  }

  return (
    <span className={cn("font-mono text-sm font-medium", getPriceColor(price), className)}>
      ${price < 0.1 ? price.toFixed(3) : price.toFixed(2)}
    </span>
  )
}
