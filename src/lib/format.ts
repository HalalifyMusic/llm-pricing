export function formatCurrency(value: number): string {
  if (value < 0.01) {
    return `$${value.toFixed(4)}`
  }
  if (value < 1) {
    return `$${value.toFixed(3)}`
  }
  if (value < 100) {
    return `$${value.toFixed(2)}`
  }
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatTokens(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`
  }
  return value.toString()
}

export function formatPrice(pricePer1M: number): string {
  if (pricePer1M === 0) return "Free"
  if (pricePer1M < 0.1) return `$${pricePer1M.toFixed(3)}`
  if (pricePer1M < 1) return `$${pricePer1M.toFixed(2)}`
  return `$${pricePer1M.toFixed(2)}`
}
