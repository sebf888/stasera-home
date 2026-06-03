export default function ContactPage() {
  return (
    <main className="px-5 sm:px-10 lg:px-[80px] py-12 lg:py-16 flex-1">
      <div className="max-w-[500px]">
        <h1 className="text-[26px] lg:text-[32px] font-medium tracking-[-0.03em] text-[#4B4C4A] mb-8">
          Contact
        </h1>

        <div className="flex flex-col gap-6 text-[13px] font-normal tracking-[-0.03em] text-[#4B4C4A] leading-[1.7]">
          <p>
            For order enquiries, returns, or anything else — get in touch and we&apos;ll
            get back to you within one business day.
          </p>

          <p>
            <a
              href="mailto:hello@yourdomain.com"
              className="underline underline-offset-2 hover:opacity-60 transition-opacity"
            >
              hello@yourdomain.com
            </a>
          </p>

          <p className="opacity-50 text-[12px]">
            [Replace the email address above with your actual contact email.]
          </p>
        </div>
      </div>
    </main>
  );
}
