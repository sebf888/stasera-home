import LegalPage, { LegalSection } from '@/components/LegalPage';

// CONTENT GUIDANCE:
// Generate compliant UK Terms & Conditions at https://termly.io or https://www.rocketlawyer.com/gb/en
// Key requirements under UK Consumer Rights Act 2015 and Consumer Contracts Regulations 2013:
// - 14-day right to cancel (distance selling)
// - Clear description of goods
// - Delivery timeframes
// - Your liability limitations
// Replace the placeholder sections below before going live.

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="[Date]">

      <LegalSection heading="1. About Us">
        <p>
          These terms govern your use of stasera.co.uk (the &quot;Site&quot;) and any purchase
          made through it. The Site is operated by [Your Full Legal Name / Company Name],
          [Address]. By placing an order you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Products">
        <p>
          All prints are made to order by our fulfilment partner, Gelato, and printed on
          the materials described at the time of purchase. Colours may vary slightly from
          screen representations due to monitor calibration and print process differences.
          We reserve the right to change product specifications or discontinue products
          without notice.
        </p>
      </LegalSection>

      <LegalSection heading="3. Ordering & Payment">
        <p>
          Orders are subject to acceptance and availability. We reserve the right to
          refuse or cancel any order. Payment is taken in full at the time of order via
          Stripe. All prices are in GBP and include VAT where applicable.
          [Confirm your VAT status with an accountant before going live.]
        </p>
      </LegalSection>

      <LegalSection heading="4. Delivery">
        <p>
          Estimated delivery times are [X–X business days] for UK orders and
          [X–X business days] internationally. Times are estimates only and we cannot
          guarantee delivery by a specific date. Risk passes to you on delivery.
          [Fill in actual Gelato delivery estimates for your regions.]
        </p>
      </LegalSection>

      <LegalSection heading="5. Right to Cancel (Distance Selling)">
        <p>
          Under the Consumer Contracts Regulations 2013, you have 14 days from receipt
          of your order to cancel without giving a reason. Because our prints are made
          to order (personalised goods), this right does not apply unless the item
          arrives damaged or faulty. Please see our Returns policy for details.
        </p>
      </LegalSection>

      <LegalSection heading="6. Intellectual Property">
        <p>
          All artwork sold on the Site is licensed for personal, non-commercial display
          only. You may not reproduce, resell, or distribute any artwork purchased.
          All rights remain with the respective artists.
          [Confirm your licensing agreements with contributing artists.]
        </p>
      </LegalSection>

      <LegalSection heading="7. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, our liability for any claim arising
          from a purchase is limited to the price paid for the relevant item.
          Nothing in these terms excludes liability for death or personal injury caused
          by our negligence, or for fraud or fraudulent misrepresentation.
        </p>
      </LegalSection>

      <LegalSection heading="8. Governing Law">
        <p>
          These terms are governed by the laws of England and Wales. Any disputes shall
          be subject to the exclusive jurisdiction of the courts of England and Wales.
        </p>
      </LegalSection>

    </LegalPage>
  );
}
