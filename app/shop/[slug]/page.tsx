import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readPosterDrafts } from '@/lib/poster-admin';
import { buildVariants, PosterFormat } from '@/data/products';
import ProductPageClient from './ProductPageClient';
import ReadyToHangSection from '@/components/ReadyToHangSection';
import MuseumQualitySection from '@/components/MuseumQualitySection';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const drafts = await readPosterDrafts();
  const draft = drafts.find((d) => d.slug === slug && d.status === 'ready-to-publish');

  if (!draft) return { title: 'Print Not Found' };

  const title = `${draft.name} by ${draft.artist}`;
  const description = `${draft.name} by ${draft.artist} — a museum-quality fine art print, made to order and ready to hang.`;
  const image = draft.images?.flat;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Stasera`,
      description,
      type: 'website',
      images: image ? [image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Stasera`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

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
    variants: buildVariants(format, draft.basePrices ?? {}, draft.stripePriceIds ?? {}),
  };

  return (
    <>
      <ProductPageClient product={product} />
      <ReadyToHangSection />
      <MuseumQualitySection />
    </>
  );
}
