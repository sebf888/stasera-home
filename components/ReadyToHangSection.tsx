export default function ReadyToHangSection() {
  return (
    <section className="pt-16 pb-6 lg:pt-24 lg:pb-8 px-5 sm:px-10 lg:px-[70px]">
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

        {/* Placeholder image */}
        <div className="w-full lg:w-[48%] aspect-[16/9] bg-[#D4D4D2] flex-shrink-0 flex items-center justify-center">
          <span className="text-[13px] tracking-[-0.03em] text-[#4B4C4A] opacity-50">
            Image placeholder
          </span>
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center text-center w-full">
          <h2 className="text-[28px] lg:text-[36px] font-normal tracking-[-0.01em] text-[#4B4C4A] leading-[1.1] uppercase">
            Ready to <span className="font-medium underline decoration-[2px] underline-offset-[4px]">Hang.</span>
          </h2>

          <p className="mt-1 text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A]">
            No hassle. Straight on the wall.
          </p>

          <ul className="mt-5 flex flex-col gap-[6px]">
            {[
              'Installed hanging hardware',
              'Lightweight & easy to mount',
              'Ships in protective packaging',
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

      </div>
    </section>
  );
}
