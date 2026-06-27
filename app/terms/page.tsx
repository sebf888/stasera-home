import LegalPage, { LegalSection } from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="25 June 2026">

      <LegalSection heading="1. About Us">
        <p>
          These terms govern your use of stasera.digital (the &quot;Site&quot;) and any purchase
          made through it. The Site is operated by Stasera Home (a trading name of
          Stanley Phillips), 40 Cecil Road, Hertford, Hertfordshire, SG13 8HR,
          United Kingdom. By placing an order you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Products">
        <p>
          All prints are produced individually for your order and printed on the materials
          described at the time of purchase. Colours may vary slightly from screen
          representations due to monitor calibration and print process differences. We
          reserve the right to change product specifications or discontinue products
          without notice.
        </p>
      </LegalSection>

      <LegalSection heading="3. Ordering & Payment">
        <p>
          Orders are subject to acceptance and availability. We reserve the right to
          refuse or cancel any order. Payment is taken in full at the time of order via
          Stripe. All prices are in GBP. Stasera Home is not currently VAT-registered,
          so no VAT is charged on your order.
        </p>
      </LegalSection>

      <LegalSection heading="4. Delivery">
        <p>
          Orders are produced and shipped through our production partners, who print close
          to your delivery address wherever possible. As a general guide, UK orders
          typically arrive within 3 to 6 business days and international orders within 7 to
          14 business days. Larger and framed pieces may take a little longer. These times
          are estimates only and are not guaranteed. Risk passes to you on delivery.
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
