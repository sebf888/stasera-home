import { promises as fs } from 'fs';
import path from 'path';
import {
  buildVariants,
  DEFAULT_PRICES,
  FORMAT_SIZES,
  PosterFormat,
  Size,
  SizePrices,
} from '@/data/products';

export type DraftStatus = 'draft' | 'ready-for-stripe' | 'ready-for-gelato' | 'ready-to-publish';

export interface ArtistProfile {
  slug: string;
  name: string;
  about: string;
  createdAt: string;
  updatedAt: string;
}

export interface CopyTemplate {
  id: string;
  label: string;
  body: string;
}

export interface PosterDescriptionSections {
  aboutArtist: string;
  deliveryAndReturns: string;
  productDetails: string;
}

export interface PosterDraft {
  id: string;
  slug: string;
  name: string;
  artist: string;
  artistSlug: string;
  description: string;
  descriptions: PosterDescriptionSections;
  templateIds: {
    deliveryAndReturns: string;
    productDetails: string;
  };
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
  printFilePath: string;
  printFileUrl: string;
  images: {
    flat: string;
    frame: string;
    thumb: string;
    lifestyle: string[];
  };
  format?: PosterFormat;
  basePrices?: Partial<Record<Size, SizePrices>>;
  stripePriceIds: Record<string, string>;
  gelatoProductUids: Record<string, string>;
  notes: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'poster-drafts.json');
const ARTISTS_FILE = path.join(process.cwd(), 'data', 'artists.json');

export const PRODUCT_DETAIL_TEMPLATES: CopyTemplate[] = [
  {
    id: 'museum-print',
    label: 'Museum-quality print',
    body: 'Printed on premium archival paper with rich colour reproduction, a refined matte finish, and careful handling from production to dispatch.',
  },
  {
    id: 'framed-ready-to-hang',
    label: 'Framed and ready to hang',
    body: 'Available unframed or in a ready-to-hang frame, with sizes mapped to our Gelato fulfilment catalogue for consistent production quality.',
  },
];

export const DELIVERY_RETURN_TEMPLATES: CopyTemplate[] = [
  {
    id: 'standard-global',
    label: 'Standard global fulfilment',
    body: 'Produced to order and shipped from the closest available fulfilment partner where possible. Returns are accepted for damaged, faulty, or incorrect items in line with our returns policy.',
  },
  {
    id: 'uk-eu-us-priority',
    label: 'UK, EU and US priority',
    body: 'Produced to order with priority routing for the UK, EU, and US where available. If an item arrives damaged or incorrect, contact us promptly so we can arrange a replacement or refund.',
  },
];

export async function readPosterDrafts(): Promise<PosterDraft[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw) as PosterDraft[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function writePosterDrafts(drafts: PosterDraft[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(drafts, null, 2)}\n`);
}

export async function readArtists(): Promise<ArtistProfile[]> {
  try {
    const raw = await fs.readFile(ARTISTS_FILE, 'utf8');
    return JSON.parse(raw) as ArtistProfile[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function writeArtists(artists: ArtistProfile[]) {
  await fs.mkdir(path.dirname(ARTISTS_FILE), { recursive: true });
  await fs.writeFile(ARTISTS_FILE, `${JSON.stringify(artists, null, 2)}\n`);
}

export function posterAdminEnabled() {
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_POSTER_ADMIN === 'true';
}

export function productSnippet(draft: PosterDraft) {
  const format: PosterFormat = draft.format ?? 'a-series';
  const defaults = DEFAULT_PRICES[format];
  const custom = draft.basePrices ?? {};

  const priceLines = FORMAT_SIZES[format].map((size) => {
    const p = custom[size] ?? defaults[size] ?? { unframed: 0, framed: 0 };
    return `    '${size}': { unframed: ${p.unframed}, framed: ${p.framed} }`;
  });
  const variantsCall = `buildVariants('${format}', {\n${priceLines.join(',\n')},\n  })`;

  const lifestyleLines = draft.images.lifestyle.map((image) => `    '${image}',`);

  return `{
  id: '${draft.id}',
  slug: '${draft.slug}',
  name: '${escapeSnippet(draft.name)}',
  artist: '${escapeSnippet(draft.artist)}',
  artistSlug: '${draft.artistSlug || 'TODO_ARTIST_SLUG'}',
  description: '${escapeSnippet(draft.description)}',
  descriptions: {
    aboutArtist: '${escapeSnippet(draft.descriptions?.aboutArtist ?? '')}',
    deliveryAndReturns: '${escapeSnippet(draft.descriptions?.deliveryAndReturns ?? '')}',
    productDetails: '${escapeSnippet(draft.descriptions?.productDetails ?? '')}',
  },
  images: [
    '${draft.images.flat}',
${lifestyleLines.join('\n')}
  ].filter(Boolean),
  printFileUrl: '${draft.printFileUrl || 'TODO_UPLOAD_PRINT_MASTER_TO_SIGNED_URL'}',
  format: '${format}',
  variants: ${variantsCall},
}`;
}

function escapeSnippet(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
