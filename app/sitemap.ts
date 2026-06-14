import type { MetadataRoute } from 'next'

const BASE = 'https://arguslabs.in'

const DOC_SLUGS = [
  'quickstart',
  'core-concepts',
  'configuration',
  'watchers',
  'detection-layers',
  'adaptive-learning',
  'cli-reference',
  'api-reference',
  'storage',
  'architecture',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const docPages: MetadataRoute.Sitemap = DOC_SLUGS.map((slug) => ({
    url: `${BASE}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...docPages,
  ]
}
