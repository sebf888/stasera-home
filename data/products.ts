export type Size = 'A4' | 'A3' | '50x70' | '70x100';
export type Frame = 'none' | 'black' | 'white' | 'wood';

export const SIZES: Size[] = ['A4', 'A3', '50x70', '70x100'];
export const FRAMES: Frame[] = ['none', 'black', 'white', 'wood'];

export const SIZE_LABELS: Record<Size, string> = {
  A4: 'A4',
  A3: 'A3',
  '50x70': '50×70',
  '70x100': '70×100',
};

export const FRAME_LABELS: Record<Frame, string> = {
  none: 'No Frame',
  black: 'Black Frame',
  white: 'White Frame',
  wood: 'Wood Frame',
};

export interface Variant {
  size: Size;
  frame: Frame;
  priceGBP: number; // in pence, e.g. 2500 = £25.00
  stripePriceId: string; // fill in after Stripe setup
  gelatoProductUid: string; // fill in after Gelato mapping
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  artist: string;
  description: string;
  images: string[]; // 5 URLs — index 0 is the hero/grid image
  printFileUrl?: string; // publicly accessible URL of the print-ready file for Gelato
  variants: Variant[];
}

const FRAME_UPCHARGE: Record<Frame, number> = {
  none: 0,
  black: 2000, // +£20
  white: 2000, // +£20
  wood: 2500,  // +£25
};

function buildVariants(basePrices: Record<Size, number>): Variant[] {
  return SIZES.flatMap((size) =>
    FRAMES.map((frame) => ({
      size,
      frame,
      priceGBP: basePrices[size] + FRAME_UPCHARGE[frame],
      stripePriceId: `price_placeholder_${size}_${frame}`,
      gelatoProductUid: `gelato_placeholder_${size}_${frame}`,
    }))
  );
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'waiting-for',
    name: 'Waiting for',
    artist: 'Coco Hewitt',
    description: 'An exploration of stillness and anticipation rendered in quiet abstraction.',
    images: [
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
    ],
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '2',
    slug: 'desire',
    name: 'Desire',
    artist: 'Alexander Khebbad',
    description: 'A charged composition oscillating between tension and release.',
    images: [
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
    ],
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '3',
    slug: 'denim-440',
    name: 'Denim 440',
    artist: 'Bermuda Indigo',
    description: 'Deep indigo tones layered in a meditative textile-inspired study.',
    images: [
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
    ],
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '4',
    slug: 'soft-hands',
    name: 'Soft Hands',
    artist: 'Lottie Burns',
    description: 'Figurative warmth distilled into gesture and negative space.',
    images: [
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
      '/poster-placeholder.jpg',
    ],
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '5',
    slug: 'still-water',
    name: 'Still Water',
    artist: 'Elena Voss',
    description: 'Stillness rendered in layers of translucent blue.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '6',
    slug: 'mineral-light',
    name: 'Mineral Light',
    artist: 'Tobias Mehr',
    description: 'Geological abstraction in warm ochre and charcoal.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '7',
    slug: 'after-rain',
    name: 'After Rain',
    artist: 'Nadia Soleil',
    description: 'The quiet aftermath of a storm caught in ink and wash.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '8',
    slug: 'open-field',
    name: 'Open Field',
    artist: 'James Okafor',
    description: 'Expansive negative space and a single horizon line.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '9',
    slug: 'pale-ground',
    name: 'Pale Ground',
    artist: 'Cecile Arnaud',
    description: 'Bone and chalk tones layered into quiet density.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '10',
    slug: 'iron-bloom',
    name: 'Iron Bloom',
    artist: 'Riku Tanaka',
    description: 'Industrial textures softened by organic form.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '11',
    slug: 'low-tide',
    name: 'Low Tide',
    artist: 'Mara Lindqvist',
    description: 'Shore at receding water, spare and silver.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '12',
    slug: 'dust-hour',
    name: 'Dust Hour',
    artist: 'Felix Obando',
    description: 'Last light through a particulate atmosphere.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '13',
    slug: 'amber-veil',
    name: 'Amber Veil',
    artist: 'Iris Fontaine',
    description: 'Warm ochre suspended in translucent layers of amber and gold.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '14',
    slug: 'cold-shore',
    name: 'Cold Shore',
    artist: 'Petter Nygaard',
    description: 'A Nordic coastline rendered in grey wash and silence.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '15',
    slug: 'soft-carbon',
    name: 'Soft Carbon',
    artist: 'Yuki Mori',
    description: 'Charcoal gradients dissolving into a quiet, breathable void.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
  {
    id: '16',
    slug: 'rose-static',
    name: 'Rose Static',
    artist: 'Camille Drevet',
    description: 'Blush tones fractured by a fine electric tension.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    variants: buildVariants({ A4: 2500, A3: 3500, '50x70': 5500, '70x100': 7500 }),
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, size: Size, frame: Frame): Variant | undefined {
  return product.variants.find((v) => v.size === size && v.frame === frame);
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
