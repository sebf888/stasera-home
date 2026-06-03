import LegalPage, { LegalSection } from '@/components/LegalPage';

export default function AboutPage() {
  return (
    <LegalPage title="About Us" lastUpdated="">
      <LegalSection heading="Who We Are">
        <p>
          [Tell your story here — who you are, why you started Stasera, and what drives
          your curation. Keep it personal and concise.]
        </p>
      </LegalSection>

      <LegalSection heading="Our Prints">
        <p>
          [Describe your print offering — the artists, the aesthetic, the quality
          standards you hold yourself to.]
        </p>
      </LegalSection>

      <LegalSection heading="How It Works">
        <p>
          Every print is made to order and fulfilled by Gelato — a global network of
          certified print partners. Orders are produced and shipped directly to you,
          typically within [X–X] business days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
