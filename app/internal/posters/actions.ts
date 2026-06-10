'use server';

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import Stripe from 'stripe';
import { revalidatePath } from 'next/cache';
import {
  ArtistProfile,
  DELIVERY_RETURN_TEMPLATES,
  PosterDraft,
  PRODUCT_DETAIL_TEMPLATES,
  posterAdminEnabled,
  readArtists,
  readPosterDrafts,
  writeArtists,
  writePosterDrafts,
} from '@/lib/poster-admin';
import { FORMAT_SIZES, PosterFormat, Size, SizePrices, buildVariants } from '@/data/products';

const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_PRINT_BYTES = 250 * 1024 * 1024;
const ALLOWED_PREVIEW_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_PRINT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']);

export interface PosterUploadState {
  ok: boolean;
  message: string;
  slug?: string;
}

export type PosterActionState = PosterUploadState;

export async function updateArtist(
  _prevState: PosterActionState,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  const slug = field(formData, 'artistSlug');
  const name = field(formData, 'artistName');
  const about = field(formData, 'artistAbout');

  if (!slug || !name || !about) {
    return { ok: false, message: 'Artist slug, name and about text are required.' };
  }

  const artists = await readArtists();
  const idx = artists.findIndex((a) => a.slug === slug);
  if (idx < 0) return { ok: false, message: 'Artist not found.' };

  const updated: ArtistProfile = {
    ...artists[idx],
    name,
    about,
    updatedAt: new Date().toISOString(),
  };

  artists[idx] = updated;
  await writeArtists(artists.sort((a, b) => a.name.localeCompare(b.name)));
  revalidatePath('/internal/posters');

  return { ok: true, message: `Updated ${name}.` };
}

export async function addArtist(
  _prevState: PosterActionState,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  const name = field(formData, 'artistName');
  const about = field(formData, 'artistAbout');

  if (!name || !about) {
    return { ok: false, message: 'Artist name and about text are required.' };
  }

  const artists = await readArtists();
  const slug = uniqueSlug(slugify(name), artists.map((artist) => artist.slug));
  const now = new Date().toISOString();
  const artist: ArtistProfile = {
    slug,
    name,
    about,
    createdAt: now,
    updatedAt: now,
  };

  await writeArtists([...artists, artist].sort((a, b) => a.name.localeCompare(b.name)));
  revalidatePath('/internal/posters');

  return { ok: true, message: `Added artist ${name}.`, slug };
}

export async function createPosterDraft(
  _prevState: PosterUploadState,
  formData: FormData
): Promise<PosterUploadState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  try {
    const name = field(formData, 'name');
    const artistSlug = field(formData, 'artistSlug');
    const summary = field(formData, 'summary');
    const productDetailsId = field(formData, 'productDetailsId');
    const deliveryAndReturnsId = field(formData, 'deliveryAndReturnsId');
    const notes = field(formData, 'notes', false);
    const format = (field(formData, 'format', false) || 'a-series') as PosterFormat;
    const basePrices = parsePriceFields(formData, format);
    const posterImage = fileField(formData, 'posterImage');
    const printFile = fileField(formData, 'printFile');
    const lifestyleFiles = formData
      .getAll('lifestyleImages')
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!name || !artistSlug || !summary || !productDetailsId || !deliveryAndReturnsId) {
      return { ok: false, message: 'Poster name, artist, summary, product details, and delivery/returns are required.' };
    }

    const artists = await readArtists();
    const artist = artists.find((candidate) => candidate.slug === artistSlug);
    const productDetails = PRODUCT_DETAIL_TEMPLATES.find((template) => template.id === productDetailsId);
    const deliveryAndReturns = DELIVERY_RETURN_TEMPLATES.find((template) => template.id === deliveryAndReturnsId);

    if (!artist) return { ok: false, message: 'Select a saved artist before creating the poster.' };
    if (!productDetails) return { ok: false, message: 'Select a product details template.' };
    if (!deliveryAndReturns) return { ok: false, message: 'Select a delivery and returns template.' };

    if (!printFile || printFile.size === 0) {
      return { ok: false, message: 'Upload the print-ready master file that Gelato will use.' };
    }

    if (posterImage && posterImage.size > 0 && !ALLOWED_PREVIEW_TYPES.has(posterImage.type)) {
      return { ok: false, message: 'The preview image must be JPEG, PNG, or WebP.' };
    }

    if (!ALLOWED_PRINT_TYPES.has(printFile.type)) {
      return { ok: false, message: 'The print master must be PDF, JPEG, PNG, or TIFF.' };
    }

    if (posterImage && posterImage.size > MAX_IMAGE_BYTES) {
      return { ok: false, message: 'The preview image is over 30MB. Export a smaller RGB preview.' };
    }

    if (printFile.size > MAX_PRINT_BYTES) {
      return { ok: false, message: 'The print master is over 250MB.' };
    }

    for (const lifestyleFile of lifestyleFiles) {
      if (!ALLOWED_PREVIEW_TYPES.has(lifestyleFile.type)) {
        return { ok: false, message: 'Lifestyle images must be JPEG, PNG, or WebP.' };
      }
      if (lifestyleFile.size > MAX_IMAGE_BYTES) {
        return { ok: false, message: 'One of the lifestyle images is over 30MB.' };
      }
    }

    const drafts = await readPosterDrafts();
    const slug = uniqueSlug(slugify(name), drafts.map((draft) => draft.slug));
    const id = `poster_${slug.replace(/-/g, '_')}`;
    const createdAt = new Date().toISOString();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posters', slug);
    const privateDir = path.join(process.cwd(), 'data', 'poster-masters', slug);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(privateDir, { recursive: true });

    const printBuffer = Buffer.from(await printFile.arrayBuffer());
    const previewBuffer = await previewBufferFor(printFile, printBuffer, posterImage);
    const printExtension = extensionFor(printFile);
    const printFileName = `print-master${printExtension}`;
    const privatePrintPath = path.join(privateDir, printFileName);

    await fs.writeFile(privatePrintPath, printBuffer);
    await writeDerivatives(previewBuffer, uploadDir);
    const lifestyleImages = await writeLifestyleImages(lifestyleFiles, uploadDir, slug);

    const publicBase = `/uploads/posters/${slug}`;
    const draft: PosterDraft = {
      id,
      slug,
      name,
      artist: artist.name,
      artistSlug: artist.slug,
      description: summary,
      descriptions: {
        aboutArtist: artist.about,
        deliveryAndReturns: deliveryAndReturns.body,
        productDetails: productDetails.body,
      },
      templateIds: {
        deliveryAndReturns: deliveryAndReturns.id,
        productDetails: productDetails.id,
      },
      status: 'draft',
      createdAt,
      updatedAt: createdAt,
      printFilePath: `data/poster-masters/${slug}/${printFileName}`,
      printFileUrl: '',
      images: {
        flat: `${publicBase}/poster-flat.webp`,
        frame: `${publicBase}/poster-flat.webp`,
        thumb: `${publicBase}/poster-thumb.webp`,
        lifestyle: lifestyleImages,
      },
      format,
      basePrices,
      stripePriceIds: {},
      gelatoProductUids: {},
      notes: notes || '',
    };

    await writePosterDrafts([draft, ...drafts]);
    revalidatePath('/internal/posters');

    return { ok: true, message: `Created draft for ${name}.`, slug };
  } catch (error) {
    if (error instanceof Error && error.message === 'PDF_PREVIEW_UNAVAILABLE') {
      return {
        ok: false,
        message: 'This server could not render the PDF preview. Upload a JPEG, PNG, or WebP site preview as a fallback.',
      };
    }

    console.error('[Poster Admin] Upload failed:', error);
    return { ok: false, message: 'Upload failed. Check the terminal for details.' };
  }
}

export async function updatePosterDraft(
  _prevState: PosterActionState,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  try {
    const slug = field(formData, 'slug');
    const name = field(formData, 'name');
    const artistSlug = field(formData, 'artistSlug');
    const summary = field(formData, 'summary');
    const productDetailsId = field(formData, 'productDetailsId');
    const deliveryAndReturnsId = field(formData, 'deliveryAndReturnsId');
    const printFileUrl = field(formData, 'printFileUrl', false);
    const notes = field(formData, 'notes', false);
    const format = (field(formData, 'format', false) || 'a-series') as PosterFormat;
    const basePrices = parsePriceFields(formData, format);
    const posterImage = fileField(formData, 'posterImage');
    const printFile = fileField(formData, 'printFile');
    const lifestyleFiles = formData
      .getAll('lifestyleImages')
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!slug || !name || !artistSlug || !summary || !productDetailsId || !deliveryAndReturnsId) {
      return { ok: false, message: 'Missing required poster fields.' };
    }

    if (posterImage && posterImage.size > 0 && !ALLOWED_PREVIEW_TYPES.has(posterImage.type)) {
      return { ok: false, message: 'The preview image must be JPEG, PNG, or WebP.' };
    }

    if (printFile && printFile.size > 0 && !ALLOWED_PRINT_TYPES.has(printFile.type)) {
      return { ok: false, message: 'The print master must be PDF, JPEG, PNG, or TIFF.' };
    }

    for (const lifestyleFile of lifestyleFiles) {
      if (!ALLOWED_PREVIEW_TYPES.has(lifestyleFile.type)) {
        return { ok: false, message: 'Lifestyle images must be JPEG, PNG, or WebP.' };
      }
      if (lifestyleFile.size > MAX_IMAGE_BYTES) {
        return { ok: false, message: 'One of the lifestyle images is over 30MB.' };
      }
    }

    const drafts = await readPosterDrafts();
    const draftIndex = drafts.findIndex((draft) => draft.slug === slug);
    if (draftIndex < 0) return { ok: false, message: 'Poster draft not found.' };

    const artists = await readArtists();
    const artist = artists.find((candidate) => candidate.slug === artistSlug);
    const productDetails = PRODUCT_DETAIL_TEMPLATES.find((template) => template.id === productDetailsId);
    const deliveryAndReturns = DELIVERY_RETURN_TEMPLATES.find((template) => template.id === deliveryAndReturnsId);

    if (!artist) return { ok: false, message: 'Select a saved artist.' };
    if (!productDetails) return { ok: false, message: 'Select a product details template.' };
    if (!deliveryAndReturns) return { ok: false, message: 'Select a delivery and returns template.' };

    const existing = drafts[draftIndex];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posters', existing.slug);
    const privateDir = path.join(process.cwd(), 'data', 'poster-masters', existing.slug);
    let printFilePath = existing.printFilePath;

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(privateDir, { recursive: true });

    if (printFile && printFile.size > 0) {
      const printBuffer = Buffer.from(await printFile.arrayBuffer());
      const previewBuffer = await previewBufferFor(printFile, printBuffer, posterImage);
      const printExtension = extensionFor(printFile);
      const printFileName = `print-master${printExtension}`;
      await fs.writeFile(path.join(privateDir, printFileName), printBuffer);
      await writeDerivatives(previewBuffer, uploadDir);
      printFilePath = `data/poster-masters/${existing.slug}/${printFileName}`;
    } else if (posterImage && posterImage.size > 0) {
      await writeDerivatives(Buffer.from(await posterImage.arrayBuffer()), uploadDir);
    }

    const lifestyleImages = lifestyleFiles.length
      ? await writeLifestyleImages(lifestyleFiles, uploadDir, existing.slug, existing.images.lifestyle.length)
      : [];

    const updated: PosterDraft = {
      ...existing,
      name,
      artist: artist.name,
      artistSlug: artist.slug,
      description: summary,
      descriptions: {
        aboutArtist: artist.about,
        deliveryAndReturns: deliveryAndReturns.body,
        productDetails: productDetails.body,
      },
      templateIds: {
        deliveryAndReturns: deliveryAndReturns.id,
        productDetails: productDetails.id,
      },
      status: existing.status,
      format,
      basePrices,
      updatedAt: new Date().toISOString(),
      printFilePath,
      printFileUrl,
      images: {
        ...existing.images,
        lifestyle: [...existing.images.lifestyle, ...lifestyleImages],
      },
      notes: notes || '',
    };

    drafts[draftIndex] = updated;
    await writePosterDrafts(drafts);
    revalidatePath('/internal/posters');

    return { ok: true, message: `Updated ${name}.`, slug: existing.slug };
  } catch (error) {
    if (error instanceof Error && error.message === 'PDF_PREVIEW_UNAVAILABLE') {
      return {
        ok: false,
        message: 'This server could not render the PDF preview. Upload a JPEG, PNG, or WebP site preview as a fallback.',
      };
    }

    console.error('[Poster Admin] Update failed:', error);
    return { ok: false, message: 'Update failed. Check the terminal for details.' };
  }
}

export async function publishPoster(
  _prevState: PosterActionState,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  const slug = field(formData, 'slug');
  if (!slug) return { ok: false, message: 'Missing poster slug.' };

  const drafts = await readPosterDrafts();
  const idx = drafts.findIndex((d) => d.slug === slug);
  if (idx < 0) return { ok: false, message: 'Poster not found.' };

  const draft = drafts[idx];

  if (!draft.printFileUrl) {
    return { ok: false, message: 'Add a public print file URL before publishing — Gelato needs it to fulfil orders.' };
  }

  const now = new Date().toISOString();

  const hasRealPriceIds = Object.values(draft.stripePriceIds ?? {}).some(
    (id) => id && !id.startsWith('price_placeholder')
  );

  if (hasRealPriceIds) {
    drafts[idx] = { ...draft, status: 'ready-to-publish', updatedAt: now };
    await writePosterDrafts(drafts);
    revalidatePath('/internal/posters');
    revalidatePath('/shop');
    revalidatePath(`/shop/${slug}`);
    return { ok: true, message: `${draft.name} is now live on the shop.` };
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not set');

    const stripe = new Stripe(stripeKey);
    const format = draft.format ?? 'a-series';
    const variants = buildVariants(format, draft.basePrices ?? {});

    const stripeProduct = await stripe.products.create({
      name: draft.name,
      description: draft.description,
      metadata: { productId: draft.id, slug: draft.slug },
    });

    const stripePriceIds: Record<string, string> = {};

    for (const variant of variants) {
      const key = `${variant.size}_${variant.frame}`;
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        currency: 'gbp',
        unit_amount: variant.priceGBP,
        metadata: {
          gelatoProductUid: variant.gelatoProductUid,
          printFileUrl: draft.printFileUrl,
          size: variant.size,
          frame: variant.frame,
          productId: draft.id,
        },
      });
      stripePriceIds[key] = price.id;
    }

    drafts[idx] = { ...draft, status: 'ready-to-publish', stripePriceIds, updatedAt: now };
    await writePosterDrafts(drafts);
    revalidatePath('/internal/posters');
    revalidatePath('/shop');
    revalidatePath(`/shop/${slug}`);

    return { ok: true, message: `${draft.name} is now live on the shop.` };
  } catch (error) {
    console.error('[Poster Admin] Publish failed:', error);
    return { ok: false, message: 'Failed to create Stripe products. Check the terminal for details.' };
  }
}

export async function archivePoster(
  _prevState: PosterActionState,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  const slug = field(formData, 'slug');
  if (!slug) return { ok: false, message: 'Missing poster slug.' };

  const drafts = await readPosterDrafts();
  const idx = drafts.findIndex((d) => d.slug === slug);
  if (idx < 0) return { ok: false, message: 'Poster not found.' };

  drafts[idx] = { ...drafts[idx], status: 'draft', updatedAt: new Date().toISOString() };
  await writePosterDrafts(drafts);
  revalidatePath('/internal/posters');
  revalidatePath('/shop');
  revalidatePath(`/shop/${slug}`);

  return { ok: true, message: `${drafts[idx].name} has been archived.` };
}

export async function updatePosterFields(
  _prevState: PosterActionState | null,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  const slug = field(formData, 'slug');
  if (!slug) return { ok: false, message: 'Missing poster slug.' };

  const drafts = await readPosterDrafts();
  const idx = drafts.findIndex((d) => d.slug === slug);
  if (idx < 0) return { ok: false, message: 'Poster not found.' };

  const existing = drafts[idx];
  const name = field(formData, 'name', false) || existing.name;
  const artistSlug = field(formData, 'artistSlug', false);
  const format = (field(formData, 'format', false) || existing.format || 'a-series') as PosterFormat;
  const description = field(formData, 'description', false) ?? existing.description;
  const printFileUrl = field(formData, 'printFileUrl', false) ?? existing.printFileUrl;

  const artists = await readArtists();
  const artist = artists.find((a) => a.slug === artistSlug);

  drafts[idx] = {
    ...existing,
    name,
    artist: artist?.name ?? existing.artist,
    artistSlug: artist?.slug ?? existing.artistSlug,
    description,
    printFileUrl,
    format,
    descriptions: {
      ...existing.descriptions,
      aboutArtist: artist?.about ?? existing.descriptions?.aboutArtist ?? '',
    },
    updatedAt: new Date().toISOString(),
  };

  await writePosterDrafts(drafts);
  revalidatePath('/internal/posters');
  revalidatePath('/internal/posters/spreadsheet');
  revalidatePath('/shop');
  revalidatePath(`/shop/${slug}`);

  return { ok: true, message: 'Saved.' };
}

export async function createDraftFromMaster(
  _prevState: PosterActionState | null,
  formData: FormData
): Promise<PosterActionState> {
  if (!posterAdminEnabled()) {
    return { ok: false, message: 'Poster admin is disabled in this environment.' };
  }

  try {
    const printFile = fileField(formData, 'printFile');
    if (!printFile || printFile.size === 0) {
      return { ok: false, message: 'No print file provided.' };
    }
    if (!ALLOWED_PRINT_TYPES.has(printFile.type)) {
      return { ok: false, message: 'Print master must be PDF, JPEG, PNG, or TIFF.' };
    }
    if (printFile.size > MAX_PRINT_BYTES) {
      return { ok: false, message: 'Print master is over 250 MB.' };
    }

    const rawName = field(formData, 'name', false) || printFile.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
    const name = rawName || 'Untitled';
    const artistSlug = field(formData, 'artistSlug', false);
    const summary = field(formData, 'summary', false) || '';
    const printFileUrl = field(formData, 'printFileUrl', false) || '';
    const notes = field(formData, 'notes', false) || '';
    const format = (field(formData, 'format', false) || 'a-series') as PosterFormat;

    const productDetailsId = field(formData, 'productDetailsId', false) || PRODUCT_DETAIL_TEMPLATES[0]?.id || '';
    const deliveryAndReturnsId = field(formData, 'deliveryAndReturnsId', false) || DELIVERY_RETURN_TEMPLATES[0]?.id || '';
    const productDetails = PRODUCT_DETAIL_TEMPLATES.find((t) => t.id === productDetailsId) ?? PRODUCT_DETAIL_TEMPLATES[0];
    const deliveryAndReturns = DELIVERY_RETURN_TEMPLATES.find((t) => t.id === deliveryAndReturnsId) ?? DELIVERY_RETURN_TEMPLATES[0];

    const artists = await readArtists();
    const artist = artists.find((a) => a.slug === artistSlug);

    const posterImage = fileField(formData, 'posterImage');
    const lifestyleFiles = formData
      .getAll('lifestyleImages')
      .filter((v): v is File => v instanceof File && v.size > 0);

    for (const lf of lifestyleFiles) {
      if (!ALLOWED_PREVIEW_TYPES.has(lf.type)) {
        return { ok: false, message: 'Lifestyle images must be JPEG, PNG, or WebP.' };
      }
      if (lf.size > MAX_IMAGE_BYTES) {
        return { ok: false, message: 'One lifestyle image is over 30 MB.' };
      }
    }

    const drafts = await readPosterDrafts();
    const slug = uniqueSlug(slugify(name), drafts.map((d) => d.slug));
    const id = `poster_${slug.replace(/-/g, '_')}`;
    const createdAt = new Date().toISOString();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posters', slug);
    const privateDir = path.join(process.cwd(), 'data', 'poster-masters', slug);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(privateDir, { recursive: true });

    const printBuffer = Buffer.from(await printFile.arrayBuffer());
    const previewBuffer = await previewBufferFor(printFile, printBuffer, posterImage);
    const printExtension = extensionFor(printFile);
    const printFileName = `print-master${printExtension}`;

    await fs.writeFile(path.join(privateDir, printFileName), printBuffer);
    await writeDerivatives(previewBuffer, uploadDir);
    const lifestyleImages = await writeLifestyleImages(lifestyleFiles, uploadDir, slug);

    const publicBase = `/uploads/posters/${slug}`;
    const basePrices = parsePriceFields(formData, format);

    const draft: PosterDraft = {
      id,
      slug,
      name,
      artist: artist?.name ?? '',
      artistSlug: artist?.slug ?? '',
      description: summary,
      descriptions: {
        aboutArtist: artist?.about ?? '',
        deliveryAndReturns: deliveryAndReturns?.body ?? '',
        productDetails: productDetails?.body ?? '',
      },
      templateIds: {
        deliveryAndReturns: deliveryAndReturns?.id ?? '',
        productDetails: productDetails?.id ?? '',
      },
      status: 'draft',
      createdAt,
      updatedAt: createdAt,
      printFilePath: `data/poster-masters/${slug}/${printFileName}`,
      printFileUrl,
      images: {
        flat: `${publicBase}/poster-flat.webp`,
        frame: `${publicBase}/poster-flat.webp`,
        thumb: `${publicBase}/poster-thumb.webp`,
        lifestyle: lifestyleImages,
      },
      format,
      basePrices,
      stripePriceIds: {},
      gelatoProductUids: {},
      notes,
    };

    await writePosterDrafts([draft, ...drafts]);
    revalidatePath('/internal/posters');

    return { ok: true, message: `Created draft for ${name}.`, slug };
  } catch (error) {
    if (error instanceof Error && error.message === 'PDF_PREVIEW_UNAVAILABLE') {
      return {
        ok: false,
        message: 'PDF preview failed — upload a JPEG or PNG alongside this file as a fallback.',
      };
    }
    console.error('[Poster Admin] Batch draft creation failed:', error);
    return { ok: false, message: 'Failed to create draft. Check the terminal for details.' };
  }
}

async function writeLifestyleImages(files: File[], uploadDir: string, slug: string, startIndex = 0) {
  const images: string[] = [];

  for (const [index, file] of files.entries()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `poster-lifestyle-${startIndex + index + 1}.webp`;

    await sharp(buffer, { limitInputPixels: false })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(uploadDir, filename));

    images.push(`/uploads/posters/${slug}/${filename}`);
  }

  return images;
}

async function previewBufferFor(printFile: File, printBuffer: Buffer, posterImage: File | null) {
  if (posterImage && posterImage.size > 0) {
    return Buffer.from(await posterImage.arrayBuffer());
  }

  if (ALLOWED_PREVIEW_TYPES.has(printFile.type)) {
    return printBuffer;
  }

  if (printFile.type === 'application/pdf') {
    try {
      return await sharp(printBuffer, {
        density: 220,
        limitInputPixels: false,
        pages: 1,
      })
        .rotate()
        .flatten({ background: '#ffffff' })
        .png()
        .toBuffer();
    } catch (error) {
      console.error('[Poster Admin] PDF preview generation failed:', error);
      throw new Error('PDF_PREVIEW_UNAVAILABLE');
    }
  }

  throw new Error('PREVIEW_SOURCE_UNAVAILABLE');
}

async function writeDerivatives(previewBuffer: Buffer, uploadDir: string) {
  const normalized = sharp(previewBuffer, { limitInputPixels: false }).rotate();

  await normalized
    .clone()
    .resize({ width: 1600, height: 2240, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(path.join(uploadDir, 'poster-flat.webp'));

  await normalized
    .clone()
    .resize({ width: 520, height: 728, fit: 'cover' })
    .webp({ quality: 84 })
    .toFile(path.join(uploadDir, 'poster-thumb.webp'));

}

function field(formData: FormData, key: string, required = true) {
  const value = formData.get(key);
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (required && !trimmed) return '';
  return trimmed;
}

function fileField(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'poster';
}

function uniqueSlug(base: string, existing: string[]) {
  let candidate = base;
  let count = 2;
  while (existing.includes(candidate)) {
    candidate = `${base}-${count}`;
    count += 1;
  }
  return candidate;
}

function extensionFor(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  if (extension) return extension;
  if (file.type === 'application/pdf') return '.pdf';
  if (file.type === 'image/png') return '.png';
  if (file.type === 'image/tiff') return '.tif';
  return '.jpg';
}

function parsePriceFields(formData: FormData, format: PosterFormat): Partial<Record<Size, SizePrices>> {
  const prices: Partial<Record<Size, SizePrices>> = {};
  for (const size of FORMAT_SIZES[format]) {
    const u = parseInt(field(formData, `price_${size}_unframed`, false) || '', 10);
    const f = parseInt(field(formData, `price_${size}_framed`, false) || '', 10);
    if (!isNaN(u) && u > 0 && !isNaN(f) && f > 0) {
      prices[size] = { unframed: u, framed: f };
    }
  }
  return prices;
}
