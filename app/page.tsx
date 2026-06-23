import { readPosterDrafts } from '@/lib/poster-admin';
import { buildVariants, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import MaterialsSection from '@/components/MaterialsSection';
import QuotesSection from '@/components/QuotesSection';
import FAQSection from '@/components/FAQSection';
import ReadyToHangSection from '@/components/ReadyToHangSection';
import MuseumQualitySection from '@/components/MuseumQualitySection';
import HeroSection from '@/components/HeroSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const drafts = await readPosterDrafts();
  const products: Product[] = drafts
    .filter((d) => d.status === 'ready-to-publish')
    .map((draft) => ({
      id: draft.id,
      slug: draft.slug,
      name: draft.name,
      artist: draft.artist,
      artistSlug: draft.artistSlug,
      description: draft.description,
      descriptions: draft.descriptions,
      images: [draft.images.flat, ...draft.images.lifestyle].filter(Boolean),
      printFileUrl: draft.printFileUrl ?? '',
      format: draft.format ?? 'a-series',
      variants: buildVariants(draft.format ?? 'a-series', draft.basePrices ?? {}, draft.stripePriceIds ?? {}),
    }));

  const firstRow  = products.slice(0, 3);
  const secondRow = products.slice(3, 6);
  const thirdRow  = products.slice(6, 9);
  const fourthRow = products.slice(9, 12);

  return (
    <>
    <HeroSection />
    <main className="pb-10">
      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-start gap-x-[10px] gap-y-8">
          {firstRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <ReadyToHangSection />
      <MuseumQualitySection />

      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-start gap-x-[10px] gap-y-8">
          {secondRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <QuotesSection />

      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-start gap-x-[10px] gap-y-8">
          {thirdRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <FAQSection />

      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-start gap-x-[10px] gap-y-8">
          {fourthRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
