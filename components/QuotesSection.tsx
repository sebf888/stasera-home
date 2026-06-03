import Link from 'next/link';

export default function QuotesSection() {
  return (
    <section className="py-16 lg:py-20 px-5 sm:px-10 lg:px-[70px]">

      {/* Two quote panels */}
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">

        {/* Left panel — larger */}
        <div className="flex-[3] bg-[#334157] flex items-center justify-center px-10 lg:px-16 min-h-[420px] lg:min-h-[500px]">
          <div className="max-w-[220px] lg:max-w-[260px] text-center">
            <p className="text-[22px] lg:text-[28px] font-normal tracking-[-0.03em] text-white leading-[1.2]">
              &ldquo;Get your hands on this{' '}
              <span className="font-medium">AD-favourite</span>{' '}
              brand.&rdquo;
            </p>
            <p className="mt-5 text-[10px] tracking-[0.12em] uppercase text-white">
              Architectural Digest
            </p>
          </div>
        </div>

        {/* Right panel — smaller */}
        <div className="flex-[2] bg-[#334157] flex items-center justify-center px-8 lg:px-12 min-h-[420px] lg:min-h-[500px]">
          <div className="max-w-[200px] lg:max-w-[240px] text-center">
            <p className="text-[22px] lg:text-[28px] font-normal tracking-[-0.03em] text-white leading-[1.2]">
              &ldquo;I&rsquo;ve been using them for{' '}
              <span className="font-medium">nearly a decade</span>, and I&rsquo;m{' '}
              <span className="font-medium">never looking back</span>.&rdquo;
            </p>
            <p className="mt-5 text-[10px] tracking-[0.12em] uppercase text-white">
              Harper&rsquo;s Bazaar
            </p>
          </div>
        </div>

      </div>

      {/* Explore Reviews */}
      <div className="flex justify-end mt-5">
        <Link
          href="/reviews"
          className="text-[11px] font-medium tracking-[-0.03em] text-[#4B4C4A] uppercase underline underline-offset-2"
        >
          Explore Reviews
        </Link>
      </div>

    </section>
  );
}
