import type { Provider } from "@/types"

export function findProvider(providers: Provider[], name: string): Provider | undefined {
  return providers.find(
    (p) => p.name.toLowerCase() === name.toLowerCase() || p.id === name.toLowerCase()
  )
}

export function getProviderColor(providers: Provider[], name: string): string {
  return findProvider(providers, name)?.color ?? "#888"
}

export function getProviderId(providers: Provider[], name: string): string {
  return findProvider(providers, name)?.id ?? name.toLowerCase()
}

export function getProviderUrl(providers: Provider[], name: string): string {
  return findProvider(providers, name)?.url ?? "#"
}
