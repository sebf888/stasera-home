import { readPosterDrafts } from '@/lib/poster-admin';
import { buildVariants, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import FAQSection from '@/components/FAQSection';
import ReadyToHangSection from '@/components/ReadyToHangSection';
import MuseumQualitySection from '@/components/MuseumQualitySection';
import HeroSection from '@/components/HeroSection';

export const dynamic = 'force-dynamic';

// Each homepage section groups products differently per device so every grid
// fills cleanly: 3 per section on desktop (one row of 3) and 4 per section on
// mobile (a 2×2). The two groupings render independently and are toggled with
// Tailwind, so neither breakpoint ever shows an orphan card.
function ProductSection({
  mobile,
  desktop,
  className = '',
}: {
  mobile: Product[];
  desktop: Product[];
  className?: string;
}) {
  return (
    <div className={`px-5 sm:px-10 lg:px-[70px] ${className}`}>
      {/* Mobile — 2 columns, 4 per section */}
      <div className="grid grid-cols-2 items-start gap-x-[10px] gap-y-8 lg:hidden">
        {mobile.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Desktop — 3 columns, 3 per section */}
      <div className="hidden grid-cols-3 items-start gap-x-[10px] gap-y-8 lg:grid">
        {desktop.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

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

  // Independent groupings: mobile takes 4 per section, desktop 3 per section.
  const m = (a: number, b: number) => products.slice(a, b);

  return (
    <>
    <HeroSection />
    <main className="pb-10">
      <ProductSection mobile={m(0, 4)} desktop={m(0, 3)} className="pt-10" />

      <ReadyToHangSection />
      <MuseumQualitySection />

      <ProductSection mobile={m(4, 8)} desktop={m(3, 6)} />
      <ProductSection mobile={m(8, 12)} desktop={m(6, 9)} className="mt-8" />

      <FAQSection />

      <ProductSection mobile={m(12, 16)} desktop={m(9, 12)} />
    </main>
    </>
  );
}
