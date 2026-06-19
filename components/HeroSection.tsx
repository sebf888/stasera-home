import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-screen bg-[#1c1c1a] overflow-hidden">
      <Image
        src="/hero_comp.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      <div className="absolute bottom-0 left-0 px-5 pb-10 sm:px-10 sm:pb-12 lg:px-[70px] lg:pb-[70px] text-white">
        <p className="flex items-center gap-[10px] text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.12em] mb-3 sm:mb-4 font-medium">
          <span className="inline-block w-[7px] h-[7px] bg-white flex-shrink-0" />
          New Collection
        </p>
        <h1 className="text-[38px] sm:text-[58px] lg:text-[74px] font-bold tracking-[-0.025em] leading-none mb-3 sm:mb-4">
          Cinema on Your Wall
        </h1>
        <p className="text-[13px] sm:text-[15px] opacity-80">
          Now available
        </p>
      </div>
    </section>
  );
}
