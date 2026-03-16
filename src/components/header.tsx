import Link from "next/link"
import { Calculator, Table2 } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              LLM Pricing
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </Link>
            <Link
              href="/calculator"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
