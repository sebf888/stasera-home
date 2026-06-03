import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-4">
      <h1 className="text-[26px] font-medium tracking-[-0.03em] text-[#4B4C4A]">
        Checkout cancelled
      </h1>
      <p className="text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] opacity-60 max-w-[360px]">
        No payment was taken. Your cart items are still saved.
      </p>
      <div className="flex gap-8 mt-4">
        <Link
          href="/cart"
          className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] underline underline-offset-2"
        >
          Return to Cart
        </Link>
        <Link
          href="/"
          className="text-[12px] tracking-[-0.03em] text-[#4B4C4A] underline underline-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
