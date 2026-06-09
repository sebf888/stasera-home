import { GELATO_UIDS } from './gelato-config';

export type PosterFormat = 'a-series' | 'ratio-4x3';
export type Size = 'A4' | 'A3' | 'A2' | 'A1' | '6x8' | '12x16' | '18x24' | '24x32';
export type Frame = 'none' | 'black' | 'white' | 'wood';

export const FORMAT_SIZES: Record<PosterFormat, Size[]> = {
  'a-series':  ['A4', 'A3', 'A2', 'A1'],
  'ratio-4x3': ['6x8', '12x16', '18x24', '24x32'],
};

export const FORMAT_LABELS: Record<PosterFormat, string> = {
  'a-series':  'A-series — A4, A3, A2, A1',
  'ratio-4x3': '4:3 ratio — 6×8", 12×16", 18×24", 24×32"',
};

export const SIZES: Size[] = ['A4', 'A3', 'A2', 'A1', '6x8', '12x16', '18x24', '24x32'];
export const FRAMES: Frame[] = ['none', 'black', 'white', 'wood'];

export const SIZE_LABELS: Record<Size, string> = {
  A4:     'A4',
  A3:     'A3',
  A2:     'A2',
  A1:     'A1',
  '6x8':   '6×8"',
  '12x16': '12×16"',
  '18x24': '18×24"',
  '24x32': '24×32"',
};

export const FRAME_LABELS: Record<Frame, string> = {
  none:  'No Frame',
  black: 'Black Frame',
  white: 'White Frame',
  wood:  'Wood Frame',
};

export interface SizePrices {
  unframed: number;
  framed: number;
}

export const DEFAULT_PRICES: Record<PosterFormat, Partial<Record<Size, SizePrices>>> = {
  'a-series': {
    A4: { unframed: 2500, framed: 4500 },
    A3: { unframed: 3500, framed: 5500 },
    A2: { unframed: 5500, framed: 7500 },
    A1: { unframed: 7500, framed: 9500 },
  },
  'ratio-4x3': {
    '6x8':   { unframed: 2500, framed: 4500 },
    '12x16': { unframed: 3500, framed: 5500 },
    '18x24': { unframed: 5500, framed: 7500 },
    '24x32': { unframed: 7500, framed: 9500 },
  },
};

export interface Variant {
  size: Size;
  frame: Frame;
  priceGBP: number; // in pence, e.g. 2500 = £25.00
  stripePriceId: string;
  gelatoProductUid: string;
}

export interface ProductDescriptions {
  aboutArtist?: string;
  deliveryAndReturns?: string;
  productDetails?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  artist: string;
  artistSlug?: string;
  description: string;
  descriptions?: ProductDescriptions;
  images: string[]; // index 0 is the hero/grid image
  printFileUrl?: string;
  format: PosterFormat;
  variants: Variant[];
}

export function buildVariants(
  format: PosterFormat,
  customPrices: Partial<Record<Size, SizePrices>> = {},
): Variant[] {
  const defaults = DEFAULT_PRICES[format];
  return FORMAT_SIZES[format].flatMap((size) =>
    FRAMES.map((frame) => {
      const prices = customPrices[size] ?? defaults[size] ?? { unframed: 0, framed: 0 };
      const uid = GELATO_UIDS[format]?.[`${size}_${frame}`];
      return {
        size,
        frame,
        priceGBP: frame === 'none' ? prices.unframed : prices.framed,
        stripePriceId: `price_placeholder_${size}_${frame}`,
        gelatoProductUid: uid || `gelato_pending_${size}_${frame}`,
      };
    })
  );
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'waiting-for',
    name: 'Waiting for',
    artist: 'Coco Hewitt',
    description: 'An exploration of stillness and anticipation rendered in quiet abstraction.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '2',
    slug: 'desire',
    name: 'Desire',
    artist: 'Alexander Khebbad',
    description: 'A charged composition oscillating between tension and release.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '3',
    slug: 'denim-440',
    name: 'Denim 440',
    artist: 'Bermuda Indigo',
    description: 'Deep indigo tones layered in a meditative textile-inspired study.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '4',
    slug: 'soft-hands',
    name: 'Soft Hands',
    artist: 'Lottie Burns',
    description: 'Figurative warmth distilled into gesture and negative space.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '5',
    slug: 'still-water',
    name: 'Still Water',
    artist: 'Elena Voss',
    description: 'Stillness rendered in layers of translucent blue.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '6',
    slug: 'mineral-light',
    name: 'Mineral Light',
    artist: 'Tobias Mehr',
    description: 'Geological abstraction in warm ochre and charcoal.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '7',
    slug: 'after-rain',
    name: 'After Rain',
    artist: 'Nadia Soleil',
    description: 'The quiet aftermath of a storm caught in ink and wash.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '8',
    slug: 'open-field',
    name: 'Open Field',
    artist: 'James Okafor',
    description: 'Expansive negative space and a single horizon line.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '9',
    slug: 'pale-ground',
    name: 'Pale Ground',
    artist: 'Cecile Arnaud',
    description: 'Bone and chalk tones layered into quiet density.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '10',
    slug: 'iron-bloom',
    name: 'Iron Bloom',
    artist: 'Riku Tanaka',
    description: 'Industrial textures softened by organic form.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '11',
    slug: 'low-tide',
    name: 'Low Tide',
    artist: 'Mara Lindqvist',
    description: 'Shore at receding water, spare and silver.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '12',
    slug: 'dust-hour',
    name: 'Dust Hour',
    artist: 'Felix Obando',
    description: 'Last light through a particulate atmosphere.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '13',
    slug: 'amber-veil',
    name: 'Amber Veil',
    artist: 'Iris Fontaine',
    description: 'Warm ochre suspended in translucent layers of amber and gold.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '14',
    slug: 'cold-shore',
    name: 'Cold Shore',
    artist: 'Petter Nygaard',
    description: 'A Nordic coastline rendered in grey wash and silence.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '15',
    slug: 'soft-carbon',
    name: 'Soft Carbon',
    artist: 'Yuki Mori',
    description: 'Charcoal gradients dissolving into a quiet, breathable void.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
  },
  {
    id: '16',
    slug: 'rose-static',
    name: 'Rose Static',
    artist: 'Camille Drevet',
    description: 'Blush tones fractured by a fine electric tension.',
    images: Array(5).fill('/poster-placeholder.jpg'),
    format: 'a-series',
    variants: buildVariants('a-series'),
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
