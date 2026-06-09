import { notFound } from 'next/navigation';
import { readPosterDrafts } from '@/lib/poster-admin';
import { buildVariants, PosterFormat } from '@/data/products';
import ProductPageClient from './ProductPageClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const drafts = await readPosterDrafts();
  const draft = drafts.find((d) => d.slug === slug && d.status === 'ready-to-publish');

  if (!draft) notFound();

  const format = (draft.format ?? 'a-series') as PosterFormat;

  const product = {
    id: draft.id,
    slug: draft.slug,
    name: draft.name,
    artist: draft.artist,
    artistSlug: draft.artistSlug,
    description: draft.description,
    descriptions: draft.descriptions,
    images: [draft.images.flat, ...draft.images.lifestyle].filter(Boolean),
    printFileUrl: draft.printFileUrl,
    format,
    variants: buildVariants(format, draft.basePrices ?? {}),
  };

  return <ProductPageClient product={product} />;
}
