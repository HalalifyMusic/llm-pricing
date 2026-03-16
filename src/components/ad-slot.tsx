interface AdSlotProps {
  placement: "top" | "sidebar" | "between"
  className?: string
}

export function AdSlot({ placement, className }: AdSlotProps) {
  // Carbon Ads / EthicalAds integration point
  // Replace the placeholder with actual ad script when ready:
  //   <script async src="//cdn.carbonads.com/carbon.js?serve=XXXXX&placement=llm-pricing" id="_carbonads_js"></script>
  // Or EthicalAds:
  //   <div data-ea-publisher="llm-pricing" data-ea-type="text"></div>

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
