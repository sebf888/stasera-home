// Single source of truth for the shipping rule, shared by the announcement bar,
// the cart summary, and the Stripe checkout session so they can never drift.
// Threshold/fee are GBP pence; the fee is a psychological "token", not a real
// shipping cost (Gelato bills us separately).
export const FREE_SHIPPING_THRESHOLD_PENCE = 5000; // £50
export const SHIPPING_FEE_PENCE = 365; // £3.65
