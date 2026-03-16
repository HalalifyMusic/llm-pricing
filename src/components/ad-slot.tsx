"use client"

import { useEffect, useRef } from "react"

interface AdSlotProps {
  placement: "top" | "sidebar" | "between"
  className?: string
}

/**
 * Carbon Ads integration.
 *
 * To activate: set NEXT_PUBLIC_CARBON_SERVE_ID in your environment.
 * Get your serve ID by signing up at https://www.carbonads.net/
 *
 * The serve ID format is typically: CEXXXXXXX
 * The placement is automatically set to "llm-pricing" for tracking.
 */
const CARBON_SERVE_ID = process.env.NEXT_PUBLIC_CARBON_SERVE_ID ?? ""

function CarbonAd({ placement }: { placement: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!CARBON_SERVE_ID || loadedRef.current || !containerRef.current) return

    // Carbon Ads only allows one ad per page
    if (document.getElementById("_carbonads_js")) return

    loadedRef.current = true
    const script = document.createElement("script")
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE_ID}&placement=llm-pricing-${placement}`
    script.id = "_carbonads_js"
    script.async = true
    containerRef.current.appendChild(script)
  }, [placement])

  return <div ref={containerRef} />
}

export function AdSlot({ placement, className }: AdSlotProps) {
  // When Carbon Ads is configured, render the actual ad script
  if (CARBON_SERVE_ID) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-border/30 bg-muted/10 px-4 py-3 [&_#carbonads]:flex [&_#carbonads]:items-center [&_#carbonads]:gap-4 [&_#carbonads]:text-sm [&_.carbon-wrap]:flex [&_.carbon-wrap]:items-center [&_.carbon-wrap]:gap-3 [&_.carbon-text]:text-muted-foreground [&_.carbon-poweredby]:text-xs [&_.carbon-poweredby]:text-muted-foreground/60 [&_.carbon-img]:block [&_.carbon-img_img]:rounded">
          <CarbonAd placement={placement} />
        </div>
      </div>
    )
  }

  // Fallback placeholder when no ad provider is configured
  if (placement === "top") {
    return (
      <div className={className}>
        <div
          id="ad-top"
          className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-3">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Sponsored
            </span>
            <span className="text-muted-foreground">
              Your ad here — reach developers comparing LLM APIs.{" "}
              <a
                href="mailto:ads@llm-pricing.com"
                className="text-foreground underline underline-offset-4"
              >
                Advertise
              </a>
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (placement === "between") {
    return (
      <div className={className}>
        <div
          id="ad-between"
          className="flex items-center justify-center rounded-lg border border-border/30 bg-muted/10 px-4 py-2.5 text-xs text-muted-foreground"
        >
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
            Ad
          </span>
          <span className="ml-2">
            Sponsor this spot —{" "}
            <a
              href="mailto:ads@llm-pricing.com"
              className="text-foreground underline underline-offset-4"
            >
              learn more
            </a>
          </span>
        </div>
      </div>
    )
  }

  return null
}
