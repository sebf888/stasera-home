import LegalPage, { LegalSection } from '@/components/LegalPage';

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns & Refunds" lastUpdated="25 June 2026">

      <LegalSection heading="Returns Policy">
        <p>
          Every Stasera print is produced individually for your order. Because of this, we
          are unable to accept returns or exchanges for reasons of personal preference or
          change of mind.
        </p>
      </LegalSection>

      <LegalSection heading="Damaged or Defective Items">
        <p>
          If your order arrives damaged, defective, or incorrect, we will replace it or
          issue a full refund at no cost to you. Please contact us within{' '}
          <strong>14 days of delivery</strong> at{' '}
          <a
            href="mailto:info@stasera.digital"
            className="underline underline-offset-2"
          >
            info@stasera.digital
          </a>{' '}
          with:
        </p>
        <ul className="mt-2 flex flex-col gap-1 pl-4">
          <li>– Your order number</li>
          <li>– A clear photo of the damage or defect</li>
          <li>– A brief description of the issue</li>
        </ul>
        <p className="mt-3">
          We will respond within 2 business days with next steps. You do not need to
          return the damaged item.
        </p>
      </LegalSection>

      <LegalSection heading="Refunds">
        <p>
          Approved refunds are processed to your original payment method via Stripe
          within 5 to 10 business days. Stripe may take additional time to post the
          credit depending on your bank.
        </p>
      </LegalSection>

      <LegalSection heading="Lost in Transit">
        <p>
          If your order has not arrived within 30 days of the estimated delivery date,
          please contact us and we will investigate with our fulfilment partner.
          If confirmed lost, we will reprint and reship at no charge.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          For all returns or refund enquiries:{' '}
          <a
            href="mailto:info@stasera.digital"
            className="underline underline-offset-2"
          >
            info@stasera.digital
          </a>
        </p>
      </LegalSection>

    </LegalPage>
  );
}
