import LegalPage, { LegalSection } from '@/components/LegalPage';

// CONTENT GUIDANCE:
// Generate a compliant UK/EU privacy policy at https://termly.io or https://www.iubenda.com
// It must cover: data controller identity, what data you collect, lawful basis (GDPR Art.6),
// how it is used, third parties (Stripe, Gelato), retention periods, and user rights.
// Replace the placeholder sections below with the generated text before going live.

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="25 June 2026">

      <LegalSection heading="1. Who We Are">
        <p>
          Stasera (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an online fine art print retailer
          operated by Stasera Home, based at [BUSINESS ADDRESS], United Kingdom.
          You can reach us at info@stasera.digital.
        </p>
      </LegalSection>

      <LegalSection heading="2. Data We Collect">
        <p>
          When you place an order we collect: your name, email address, postal address,
          and payment details (processed directly by Stripe — we never see or store full
          card numbers). We also collect standard server logs (IP address, browser type,
          pages visited) for security and analytics purposes.
        </p>
      </LegalSection>

      <LegalSection heading="3. How We Use Your Data">
        <p>
          Your data is used solely to fulfil your order (including passing your shipping
          address to our print fulfilment partner, Gelato), to communicate order updates,
          and to comply with legal obligations. We do not sell your data to third parties
          or use it for unsolicited marketing without your consent.
        </p>
      </LegalSection>

      <LegalSection heading="4. Third-Party Processors">
        <p>
          <strong>Stripe</strong> processes payments. Their privacy policy is at stripe.com/privacy.{' '}
          <strong>Gelato</strong> fulfils and ships your order. Their privacy policy is at gelato.com/privacy.
          Both are GDPR-compliant processors under data processing agreements.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data Retention">
        <p>
          Order data is retained for 6 years in line with UK tax and accounting requirements.
          You may request deletion of personal data not required for legal compliance at any time.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your Rights">
        <p>
          Under UK GDPR you have the right to access, rectify, erase, restrict, or port
          your personal data, and to object to processing. To exercise any of these rights
          email us at info@stasera.digital. You also have the right to lodge a complaint
          with the Information Commissioner&apos;s Office (ico.org.uk).
        </p>
      </LegalSection>

      <LegalSection heading="7. Cookies">
        <p>
          This site uses essential cookies only (cart persistence via localStorage).
          No third-party tracking or advertising cookies are set without your consent.
        </p>
      </LegalSection>

    </LegalPage>
  );
}
