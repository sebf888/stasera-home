import LegalPage, { LegalSection } from '@/components/LegalPage';

export default function AboutPage() {
  return (
    <LegalPage title="About Us" lastUpdated="">
      <LegalSection heading="Who We Are">
        <p>
          Stasera is a small print studio in the UK. We find artwork we like, from film
          and music to vintage pieces, and turn it into prints worth putting on your wall.
        </p>
      </LegalSection>

      <LegalSection heading="Our Prints">
        <p>
          Every print is made on archival paper with pigment inks that hold their colour
          for years. Choose paper or framed, in a handful of sizes, and pick the look that
          suits your space.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping">
        <p>
          Wherever you are, we can get a print to you. We work with production partners
          around the world who print close to your address, so your order arrives quickly:
          usually 3 to 6 business days in the UK and 7 to 14 internationally.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
