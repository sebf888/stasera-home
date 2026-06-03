export default function MuseumQualitySection() {
  return (
    <section className="pt-6 pb-16 lg:pt-8 lg:pb-24 px-5 sm:px-10 lg:px-[70px]">
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

        {/* Text content */}
        <div className="flex flex-col items-center text-center w-full order-2 lg:order-1">
          <h2 className="text-[28px] lg:text-[36px] font-normal tracking-[-0.01em] text-[#4B4C4A] leading-[1.1] uppercase">
            <span className="font-medium underline decoration-[2px] underline-offset-[4px]">Museum</span> Quality.
          </h2>

          <p className="mt-1 text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A]">
            Premium materials. Gallery level execution.
          </p>

          <ul className="mt-5 flex flex-col gap-[6px]">
            {[
              '100+ year archival canvas',
              'Hand-stretched in Norway',
              'Vibrant, fade-resistant inks',
            ].map((item) => (
              <li
                key={item}
                className="text-[22px] lg:text-[24px] font-normal tracking-[-0.03em] text-[#4B4C4A] leading-[1.0]"
              >
                – {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Placeholder image */}
        <div className="w-full lg:w-[48%] aspect-[16/9] bg-[#D4D4D2] flex-shrink-0 flex items-center justify-center order-1 lg:order-2">
          <span className="text-[13px] tracking-[-0.03em] text-[#4B4C4A] opacity-50">
            Image placeholder
          </span>
        </div>

      </div>
    </section>
  );
}
