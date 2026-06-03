import Stripe from 'stripe';
import { createGelatoOrder } from '@/lib/gelato';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === 'paid') {
      try {
        await fulfillOrder(session);
      } catch (err) {
        console.error('[Stripe] Order fulfillment error — investigate manually:', err);
      }
    }
  }

  return Response.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const { data: lineItems } = await stripe.checkout.sessions.listLineItems(
    session.id,
    { expand: ['data.price.product'], limit: 100 }
  );
  await createGelatoOrder(session, lineItems);
}
