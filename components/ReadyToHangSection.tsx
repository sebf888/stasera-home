import Image from 'next/image';

export default function ReadyToHangSection() {
  return (
    <section className="pt-16 pb-6 lg:pt-24 lg:pb-1 px-5 sm:px-10 lg:px-[70px]">
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

        <div className="relative w-full lg:w-[48%] aspect-[16/9] flex-shrink-0 bg-[#D4D4D2]">
          <Image
            src="/ready-to-hang.jpg"
            alt="Ready to hang poster in a frame"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
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
