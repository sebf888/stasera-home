import { readPosterDrafts } from '@/lib/poster-admin';
import { buildVariants, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const drafts = await readPosterDrafts();
  const published = drafts.filter((d) => d.status === 'ready-to-publish');

  const products: Product[] = published.map((draft) => ({
    id: draft.id,
    slug: draft.slug,
    name: draft.name,
    artist: draft.artist,
    artistSlug: draft.artistSlug,
    description: draft.description,
    descriptions: draft.descriptions,
    images: [draft.images.frame, draft.images.flat, ...draft.images.lifestyle].filter(Boolean),
    printFileUrl: draft.printFileUrl,
    format: draft.format ?? 'a-series',
    variants: buildVariants(draft.format ?? 'a-series', draft.basePrices ?? {}),
  }));

  if (products.length === 0) {
    return (
      <main className="px-5 sm:px-10 lg:px-[70px] py-16 flex-1">
        <p className="text-[13px] tracking-[-0.03em] text-[#4B4C4A] opacity-50">
          No prints available yet.
        </p>
      </main>
    );
  }

  return (
    <main className="px-5 sm:px-10 lg:px-[70px] py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-4 lg:gap-x-[5vw] gap-y-24">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
