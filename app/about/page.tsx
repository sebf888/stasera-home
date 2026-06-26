import LegalPage, { LegalSection } from '@/components/LegalPage';

export default function AboutPage() {
  return (
    <LegalPage title="About Us" lastUpdated="">
      <LegalSection heading="Who We Are">
        <p>
          Stasera is an independent print studio based in the United Kingdom. We curate
          distinctive artwork and turn it into museum-quality prints — made to order,
          one piece at a time, and shipped worldwide.
        </p>
      </LegalSection>

      <LegalSection heading="Our Prints">
        <p>
          Every Stasera print is produced on premium archival materials using pigment
          inks rated to last well over 100 years. Choose from a range of fine-art papers
          and framing options, each made to order — so nothing sits in a warehouse, and
          every piece is produced specifically for you.
        </p>
      </LegalSection>

      <LegalSection heading="How It Works">
        <p>
          Orders are produced and shipped by our fulfilment partner, Gelato — a global
          network of certified print partners — and sent directly to you. As a general
          guide, UK orders arrive within 3–6 business days and international orders within
          7–14 business days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
