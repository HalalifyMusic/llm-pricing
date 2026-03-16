export interface LLMModel {
  id: string
  provider: string
  name: string
  inputPricePer1M: number
  outputPricePer1M: number
  contextWindow: number
  maxOutput: number
  cachedInputPricePer1M?: number
  batchInputPricePer1M?: number
  batchOutputPricePer1M?: number
  speed: "fast" | "medium" | "slow"
  modality: ("text" | "image" | "audio")[]
  released: string
  notes?: string
}

export interface Provider {
  id: string
  name: string
  logo: string
  url: string
  color: string
}
