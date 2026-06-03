import Link from 'next/link';

export default function CollectionsPage() {
  return (
    <main className="px-5 sm:px-10 lg:px-[80px] py-12 lg:py-16 flex-1 flex flex-col">
      <h1 className="text-[26px] lg:text-[32px] font-medium tracking-[-0.03em] text-[#4B4C4A] mb-4">
        Collections
      </h1>
      <p className="text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 mb-6">
        Curated collections coming soon.
      </p>
      <Link
        href="/shop"
        className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] underline underline-offset-2 hover:opacity-60 transition-opacity"
      >
        Browse all prints
      </Link>
    </main>
  );
}
