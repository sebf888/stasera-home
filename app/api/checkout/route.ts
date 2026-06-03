import Stripe from 'stripe';
import { CartItem } from '@/lib/cart-context';
import { SIZE_LABELS, FRAME_LABELS } from '@/data/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'gbp',
          unit_amount: item.priceGBP,
          product_data: {
            name: `${item.name} — ${SIZE_LABELS[item.size]}${
              item.frame !== 'none' ? ` + ${FRAME_LABELS[item.frame]}` : ''
            }`,
            description: `by ${item.artist}`,
            metadata: {
              gelatoProductUid: item.gelatoProductUid,
              size: item.size,
              frame: item.frame,
              printFileUrl: item.printFileUrl,
              productId: item.productId,
            },
          },
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: [
          'GB', 'US', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH',
          'SE', 'NO', 'DK', 'FI', 'AU', 'CA', 'JP', 'IE', 'PT',
        ],
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe] Checkout session error:', err);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
