import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p>
          Prices sourced from official provider pricing pages. Last updated:{" "}
          <time dateTime="2026-03-16" className="font-medium text-foreground">
            March 16, 2026
          </time>
        </p>
        <p className="mt-1">
          Found an error?{" "}
          <a
            href="https://github.com/alfani110/llm-pricing/issues"
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
