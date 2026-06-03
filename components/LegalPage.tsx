interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <main className="px-5 sm:px-10 lg:px-[80px] py-12 lg:py-16 flex-1">
      <div className="max-w-[700px]">
        <h1 className="text-[26px] lg:text-[32px] font-medium tracking-[-0.03em] text-[#4B4C4A] mb-2">
          {title}
        </h1>
        <p className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] opacity-50 mb-10">
          Last updated: {lastUpdated}
        </p>
        <div className="flex flex-col gap-8 text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] leading-[1.7]">
          {children}
        </div>
      </div>
    </main>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[14px] font-medium tracking-[-0.03em] text-[#4B4C4A] mb-2">
        {heading}
      </h2>
      {children}
    </section>
  );
}
