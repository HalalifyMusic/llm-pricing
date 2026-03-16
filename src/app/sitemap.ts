import type { MetadataRoute } from "next"
import models from "@/data/models.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://llm-pricing-theta.vercel.app"

  const modelPages = models.map((model) => ({
    url: `${baseUrl}/models/${model.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...modelPages,
  ]
}
