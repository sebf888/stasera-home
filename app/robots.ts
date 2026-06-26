import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.stasera.digital';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/internal/', '/api/', '/checkout/', '/cart'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
