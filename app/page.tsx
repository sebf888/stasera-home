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

  const firstRow  = products.slice(0, 4);
  const secondRow = products.slice(4, 8);
  const thirdRow  = products.slice(8, 12);
  const fourthRow = products.slice(12);

  return (
    <>
    <HeroSection />
    <main className="pb-10">
      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-4 lg:gap-x-[5vw] gap-y-24">
          {firstRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <MaterialsSection />

      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-4 lg:gap-x-[5vw] gap-y-24">
          {secondRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <QuotesSection />

      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-4 lg:gap-x-[5vw] gap-y-24">
          {thirdRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <FAQSection />

      <div className="px-5 sm:px-10 lg:px-[70px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-x-4 lg:gap-x-[5vw] gap-y-24">
          {fourthRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <ReadyToHangSection />
      <MuseumQualitySection />
    </main>
    </>
  );
}
