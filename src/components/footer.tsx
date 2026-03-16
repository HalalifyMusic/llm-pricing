import { ExternalLink } from "lucide-react"
import models from "@/data/models.json"

function getLastUpdatedDate(): string {
  const dates = models
    .map((m) => m.released)
    .filter(Boolean)
    .sort()
    .reverse()
  return dates[0] ?? new Date().toISOString().split("T")[0]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function Footer() {
  const lastUpdated = getLastUpdatedDate()

  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p>
          Prices sourced from official provider pricing pages. Last updated:{" "}
          <time dateTime={lastUpdated} className="font-medium text-foreground">
            {formatDate(lastUpdated)}
          </time>
        </p>
        <p className="mt-1">
          Found an error?{" "}
          <a
            href="https://github.com/halalifymusic/llm-pricing/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:text-primary"
          >
            Suggest a correction
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </footer>
  )
}
