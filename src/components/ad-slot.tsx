"use client"

import { useEffect, useRef } from "react"

interface AdSlotProps {
  placement: "top" | "sidebar" | "between"
  className?: string
}

/**
 * Ad integration — supports Google AdSense, Carbon Ads, or EthicalAds.
 *
 * Priority order:
 * 1. Google AdSense (NEXT_PUBLIC_ADSENSE_CLIENT_ID) — free signup, no traffic minimum
 * 2. Carbon Ads (NEXT_PUBLIC_CARBON_SERVE_ID) — higher RPM, needs 10K+ monthly views
 * 3. EthicalAds (NEXT_PUBLIC_ETHICALADS_PUBLISHER) — privacy-focused, low threshold
 * 4. Placeholder fallback
 *
 * Sign up at:
 * - AdSense: https://adsense.google.com (free, cash out at $100)
 * - Carbon: https://www.carbonads.net
 * - EthicalAds: https://www.ethicalads.io
 */
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? ""
const CARBON_SERVE_ID = process.env.NEXT_PUBLIC_CARBON_SERVE_ID ?? ""
const ETHICALADS_PUB = process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER ?? ""

const AD_SLOT_MAP: Record<string, string> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
  between: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN ?? "",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
}

function GoogleAd({ placement }: { placement: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!ADSENSE_ID || pushedRef.current) return
    pushedRef.current = true

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
    } catch {
      // AdSense may not be loaded yet
    }
  }, [])

  const slotId = AD_SLOT_MAP[placement] || ""

  return (
    <div ref={containerRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

function CarbonAd({ placement }: { placement: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!CARBON_SERVE_ID || loadedRef.current || !containerRef.current) return
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

function EthicalAd() {
  return (
    <div
      data-ea-publisher={ETHICALADS_PUB}
      data-ea-type="text"
      data-ea-style="stickybox"
    />
  )
}

export function AdSlot({ placement, className }: AdSlotProps) {
  // Priority 1: Google AdSense with explicit slot IDs
  // When using Auto Ads (no slot IDs), the script in layout.tsx handles everything
  // We only render <ins> elements when explicit slot IDs are configured
  const slotId = AD_SLOT_MAP[placement] || ""
  if (ADSENSE_ID && slotId) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-border/30 bg-muted/10 px-4 py-3">
          <GoogleAd placement={placement} />
        </div>
      </div>
    )
  }

  // If AdSense is configured but using Auto Ads (no slot IDs), render nothing
  // Google Auto Ads places ads automatically via the script tag in layout.tsx
  if (ADSENSE_ID && !slotId) {
    return null
  }

  // Priority 2: Carbon Ads
  if (CARBON_SERVE_ID) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-border/30 bg-muted/10 px-4 py-3 [&_#carbonads]:flex [&_#carbonads]:items-center [&_#carbonads]:gap-4 [&_#carbonads]:text-sm [&_.carbon-wrap]:flex [&_.carbon-wrap]:items-center [&_.carbon-wrap]:gap-3 [&_.carbon-text]:text-muted-foreground [&_.carbon-poweredby]:text-xs [&_.carbon-poweredby]:text-muted-foreground/60 [&_.carbon-img]:block [&_.carbon-img_img]:rounded">
          <CarbonAd placement={placement} />
        </div>
      </div>
    )
  }

  // Priority 3: EthicalAds
  if (ETHICALADS_PUB) {
    return (
      <div className={className}>
        <EthicalAd />
      </div>
    )
  }

  // Fallback: placeholder
  if (placement === "top") {
    return (
      <div className={className}>
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Sponsored
            </span>
            <span className="text-muted-foreground">
              Your ad here — reach developers comparing LLM APIs.
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (placement === "between") {
    return (
      <div className={className}>
        <div className="flex items-center justify-center rounded-lg border border-border/30 bg-muted/10 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
            Ad
          </span>
        </div>
      </div>
    )
  }

  return null
}
