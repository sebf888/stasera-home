import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import MaterialsSection from '@/components/MaterialsSection';
import QuotesSection from '@/components/QuotesSection';
import FAQSection from '@/components/FAQSection';
import ReadyToHangSection from '@/components/ReadyToHangSection';
import MuseumQualitySection from '@/components/MuseumQualitySection';

export default function Home() {
  const firstRow  = products.slice(0, 4);
  const secondRow = products.slice(4, 8);
  const thirdRow  = products.slice(8, 12);
  const fourthRow = products.slice(12);

  return (
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
  );
}
