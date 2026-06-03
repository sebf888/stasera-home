import Link from 'next/link';
import ClearCart from '@/components/ClearCart';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-4">
      <ClearCart />
      <h1 className="text-[26px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
        Thank you for your order
      </h1>
      <p className="text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 max-w-[380px]">
        Your payment was successful and your print is on its way to production.
        A confirmation email will be with you shortly.
      </p>
      {session_id && (
        <p className="text-[11px] text-[#4B4C4A] opacity-35 font-mono mt-2">
          Ref: {session_id}
        </p>
      )}
      <Link
        href="/"
        className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] underline underline-offset-2 mt-4"
      >
        Continue shopping
      </Link>
    </main>
  );
}
