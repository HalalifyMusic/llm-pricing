import type { Provider } from "@/types"

const UTM_SOURCE = "llm-pricing"
const UTM_MEDIUM = "referral"

/**
 * Provider signup/console URLs for "Try it" CTAs.
 * These point to where a developer can actually start using the API.
 */
const PROVIDER_SIGNUP_URLS: Record<string, string> = {
  openai: "https://platform.openai.com/signup",
  anthropic: "https://console.anthropic.com/",
  google: "https://aistudio.google.com/",
  deepseek: "https://platform.deepseek.com/",
  mistral: "https://console.mistral.ai/",
  xai: "https://console.x.ai/",
  amazon: "https://aws.amazon.com/bedrock/",
  cohere: "https://dashboard.cohere.com/",
  together: "https://api.together.ai/signin",
  fireworks: "https://fireworks.ai/login",
  groq: "https://console.groq.com/",
}

function appendUtmParams(
  url: string,
  campaign: string
): string {
  const separator = url.includes("?") ? "&" : "?"
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: campaign,
  })
  return `${url}${separator}${params.toString()}`
}

/**
 * Get the provider's pricing page URL with UTM tracking params.
 */
export function getProviderPricingUrl(
  provider: Provider,
  campaign: string = "model-page"
): string {
  return appendUtmParams(provider.url, campaign)
}

/**
 * Get the provider's signup/console URL with UTM tracking params.
 * Falls back to pricing page if no signup URL is configured.
 */
export function getProviderSignupUrl(
  providerId: string,
  pricingUrl: string,
  campaign: string = "calculator-cta"
): string {
  const signupUrl = PROVIDER_SIGNUP_URLS[providerId.toLowerCase()] ?? pricingUrl
  return appendUtmParams(signupUrl, campaign)
}
