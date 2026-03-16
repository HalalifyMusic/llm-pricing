import { cn } from "@/lib/utils"

interface ProviderBadgeProps {
  name: string
  color: string
  className?: string
}

export function ProviderBadge({ name, color, className }: ProviderBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: `${color}15`,
        color: color === "#FFFFFF" ? "#e5e7eb" : color,
        borderColor: `${color}30`,
        borderWidth: "1px",
      }}
    >
      {name}
    </span>
  )
}
