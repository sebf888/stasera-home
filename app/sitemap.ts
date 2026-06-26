import type { MetadataRoute } from 'next';
import { readPosterDrafts } from '@/lib/poster-admin';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.stasera.digital';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/returns`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  let products: MetadataRoute.Sitemap = [];
  try {
    const drafts = await readPosterDrafts();
    products = drafts
      .filter((d) => d.status === 'ready-to-publish')
      .map((d) => ({
        url: `${baseUrl}/shop/${d.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch {
    // If drafts can't be read at build/request time, ship the static routes alone.
  }

  return [...staticRoutes, ...products];
}
