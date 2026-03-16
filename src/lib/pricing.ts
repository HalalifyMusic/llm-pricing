import type { LLMModel } from "@/types"

export function calculateMonthlyCost(
  model: LLMModel,
  inputTokensPerRequest: number,
  outputTokensPerRequest: number,
  requestsPerDay: number,
  cachedPercent: number = 0
): number {
  const requestsPerMonth = requestsPerDay * 30

  const inputTokensPerMonth = inputTokensPerRequest * requestsPerMonth
  const outputTokensPerMonth = outputTokensPerRequest * requestsPerMonth

  const cachedFraction = cachedPercent / 100
  const uncachedFraction = 1 - cachedFraction

  const cachedInputPrice = model.cachedInputPricePer1M ?? model.inputPricePer1M
  const inputCost =
    (inputTokensPerMonth / 1_000_000) *
    (uncachedFraction * model.inputPricePer1M + cachedFraction * cachedInputPrice)

  const outputCost = (outputTokensPerMonth / 1_000_000) * model.outputPricePer1M

  return inputCost + outputCost
}

export function costPer1KRequests(
  model: LLMModel,
  inputTokensPerRequest: number,
  outputTokensPerRequest: number
): number {
  const inputCost = (inputTokensPerRequest / 1_000_000) * model.inputPricePer1M * 1000
  const outputCost = (outputTokensPerRequest / 1_000_000) * model.outputPricePer1M * 1000
  return inputCost + outputCost
}

export function effectivePricePerToken(model: LLMModel): number {
  return (model.inputPricePer1M + model.outputPricePer1M) / 2
}
