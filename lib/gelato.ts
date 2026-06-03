import Stripe from 'stripe';

interface GelatoOrderItem {
  itemReferenceId: string;
  productUid: string;
  quantity: number;
  files: Array<{ type: string; url: string }>;
}

interface GelatoShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  country: string;
  state?: string;
  email: string;
  phone?: string;
}

interface GelatoOrderPayload {
  orderType: 'order' | 'draft';
  orderReferenceId: string;
  customerReferenceId: string;
  currency: string;
  items: GelatoOrderItem[];
  shippingAddress: GelatoShippingAddress;
}

export async function createGelatoOrder(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
): Promise<unknown> {
  const apiKey = process.env.GELATO_API_KEY;
  if (!apiKey) throw new Error('GELATO_API_KEY is not set');

  const shipping = session.collected_information?.shipping_details;
  const customerEmail = session.customer_details?.email ?? '';

  if (!shipping?.address) throw new Error('No shipping address found in session');

  const nameParts = (shipping.name ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  const items: GelatoOrderItem[] = lineItems.map((lineItem, idx) => {
    const product = lineItem.price?.product as Stripe.Product | null;
    const meta = product?.metadata ?? {};
    return {
      itemReferenceId: `item-${idx + 1}`,
      productUid: meta.gelatoProductUid ?? '',
      quantity: lineItem.quantity ?? 1,
      files: meta.printFileUrl ? [{ type: 'default', url: meta.printFileUrl }] : [],
    };
  });

  const payload: GelatoOrderPayload = {
    orderType: 'order',
    orderReferenceId: session.id,
    customerReferenceId: customerEmail,
    currency: 'GBP',
    items,
    shippingAddress: {
      firstName,
      lastName,
      addressLine1: shipping.address.line1 ?? '',
      ...(shipping.address.line2 ? { addressLine2: shipping.address.line2 } : {}),
      city: shipping.address.city ?? '',
      postCode: shipping.address.postal_code ?? '',
      country: shipping.address.country ?? 'GB',
      ...(shipping.address.state ? { state: shipping.address.state } : {}),
      email: customerEmail,
    },
  };

  const response = await fetch('https://order.gelatoapis.com/v4/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gelato API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log(`[Gelato] Order created: ${JSON.stringify(result?.id)} for session ${session.id}`);
  return result;
}
