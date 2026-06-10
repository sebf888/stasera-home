'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import {
  addArtist,
  archivePoster,
  createPosterDraft,
  publishPoster,
  PosterUploadState,
  updateArtist,
  updatePosterDraft,
} from './actions';
import {
  ArtistProfile,
  CopyTemplate,
  PosterDraft,
} from '@/lib/poster-admin';
import {
  DEFAULT_PRICES,
  FORMAT_LABELS,
  FORMAT_SIZES,
  PosterFormat,
  SIZE_LABELS,
  SizePrices,
} from '@/data/products';

const FORMATS: PosterFormat[] = ['a-series', 'ratio-4x3'];

const initialState: PosterUploadState = {
  ok: false,
  message: '',
};

interface UploadProps {
  artists: ArtistProfile[];
  productDetailTemplates: CopyTemplate[];
  deliveryReturnTemplates: CopyTemplate[];
}

interface EditProps extends UploadProps {
  draft: PosterDraft;
}

export function ArtistEditForm({ artist }: { artist: ArtistProfile }) {
  const [state, formAction, isPending] = useActionState(updateArtist, initialState);

  return (
    <form action={formAction} className="grid gap-3 border-t border-[#e4ded4] p-3">
      <input type="hidden" name="artistSlug" value={artist.slug} />
      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Name
        <input
          name="artistName"
          required
          defaultValue={artist.name}
          className="h-10 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        About
        <textarea
          name="artistAbout"
          required
          rows={4}
          defaultValue={artist.about}
          className="resize-none border border-[#d7d2c8] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#334157]"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#334157] px-4 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? 'text-[#2f684e]' : 'text-[#9d2f2f]'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function ArtistForm() {
  const [state, formAction, isPending] = useActionState(addArtist, initialState);

  return (
    <form action={formAction} className="grid gap-4 border border-[#d8d1c4] bg-white p-4">
      <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-[#74756f]">Add artist</h3>
      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Artist name
        <input
          name="artistName"
          required
          className="h-11 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
          placeholder="Coco Hewitt"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        About artist
        <textarea
          name="artistAbout"
          required
          rows={4}
          className="resize-none border border-[#d7d2c8] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#334157]"
          placeholder="Standardised artist bio used across product pages and future artist pages."
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#334157] px-4 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Adding...' : 'Add artist'}
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? 'text-[#2f684e]' : 'text-[#9d2f2f]'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export default function PosterUploadForm({
  artists,
  productDetailTemplates,
  deliveryReturnTemplates,
}: UploadProps) {
  const [state, formAction, isPending] = useActionState(createPosterDraft, initialState);
  const [format, setFormat] = useState<PosterFormat>('a-series');

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Poster name
          <input
            name="name"
            required
            className="h-11 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
            placeholder="Waiting for"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Artist
          <select
            name="artistSlug"
            required
            className="h-11 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
            defaultValue=""
          >
            <option value="" disabled>Select artist</option>
            {artists.map((artist) => (
              <option key={artist.slug} value={artist.slug}>
                {artist.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FormatSelector format={format} onChange={setFormat} />

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Catalogue summary
        <textarea
          name="summary"
          required
          rows={3}
          className="resize-none border border-[#d7d2c8] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#334157]"
          placeholder="Short poster-specific summary. The longer sections below are standardised."
        />
      </label>

      <StandardDescriptionSelects
        productDetailTemplates={productDetailTemplates}
        deliveryReturnTemplates={deliveryReturnTemplates}
      />

      <PriceFields format={format} />

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Site preview fallback
          <input
            name="posterImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="border border-[#d7d2c8] bg-white p-3 text-sm font-normal file:mr-4 file:border-0 file:bg-[#334157] file:px-3 file:py-2 file:text-white"
          />
          <span className="text-xs font-normal text-[#74756f]">Optional. Use this only if the master PDF cannot be rendered, or if you want a different cropped preview.</span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Print master
          <input
            name="printFile"
            type="file"
            required
            accept="application/pdf,image/jpeg,image/png,image/tiff"
            className="border border-[#d7d2c8] bg-white p-3 text-sm font-normal file:mr-4 file:border-0 file:bg-[#334157] file:px-3 file:py-2 file:text-white"
          />
          <span className="text-xs font-normal text-[#74756f]">The full quality file Gelato receives. PDF preferred.</span>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Lifestyle images
        <input
          name="lifestyleImages"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="border border-[#d7d2c8] bg-white p-3 text-sm font-normal file:mr-4 file:border-0 file:bg-[#334157] file:px-3 file:py-2 file:text-white"
        />
        <span className="text-xs font-normal text-[#74756f]">Optional. Upload as many AI room/vibe images as you want; each will be converted to lightweight WebP.</span>
      </label>

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Internal notes
        <textarea
          name="notes"
          rows={3}
          className="resize-none border border-[#d7d2c8] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#334157]"
          placeholder="AI lifestyle direction, vibe pairing, source file notes."
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="h-11 bg-[#334157] px-5 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Creating draft...' : 'Create poster draft'}
        </button>

        {state.message && (
          <p className={`text-sm ${state.ok ? 'text-[#2f684e]' : 'text-[#9d2f2f]'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function PosterEditForm({
  draft,
  artists,
  productDetailTemplates,
  deliveryReturnTemplates,
}: EditProps) {
  const [state, formAction, isPending] = useActionState(updatePosterDraft, initialState);
  const [format, setFormat] = useState<PosterFormat>(draft.format ?? 'a-series');

  return (
    <form action={formAction} className="grid gap-4 border-t border-[#e4ded4] p-3">
      <input type="hidden" name="slug" value={draft.slug} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Poster name
          <input
            name="name"
            required
            defaultValue={draft.name}
            className="h-10 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Artist
        <select
          name="artistSlug"
          required
          defaultValue={draft.artistSlug}
          className="h-10 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
        >
          {artists.map((artist) => (
            <option key={artist.slug} value={artist.slug}>
              {artist.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Catalogue summary
        <textarea
          name="summary"
          required
          rows={3}
          defaultValue={draft.description}
          className="resize-none border border-[#d7d2c8] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#334157]"
        />
      </label>

      <StandardDescriptionSelects
        productDetailTemplates={productDetailTemplates}
        deliveryReturnTemplates={deliveryReturnTemplates}
        defaultProductDetailsId={draft.templateIds?.productDetails}
        defaultDeliveryAndReturnsId={draft.templateIds?.deliveryAndReturns}
      />

      <FormatSelector format={format} onChange={setFormat} />

      <PriceFields format={format} existingPrices={draft.basePrices} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Public print file URL
          <input
            name="printFileUrl"
            defaultValue={draft.printFileUrl}
            className="h-10 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
            placeholder="Signed/cloud URL used by Gelato"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Replace preview only
          <input
            name="posterImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="border border-[#d7d2c8] bg-white p-2 text-sm font-normal file:mr-4 file:border-0 file:bg-[#334157] file:px-3 file:py-2 file:text-white"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Replace print master
          <input
            name="printFile"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/tiff"
            className="border border-[#d7d2c8] bg-white p-2 text-sm font-normal file:mr-4 file:border-0 file:bg-[#334157] file:px-3 file:py-2 file:text-white"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#292b28]">
          Add lifestyle images
          <input
            name="lifestyleImages"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="border border-[#d7d2c8] bg-white p-2 text-sm font-normal file:mr-4 file:border-0 file:bg-[#334157] file:px-3 file:py-2 file:text-white"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Internal notes
        <textarea
          name="notes"
          rows={3}
          defaultValue={draft.notes}
          className="resize-none border border-[#d7d2c8] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#334157]"
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#334157] px-4 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? 'text-[#2f684e]' : 'text-[#9d2f2f]'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function PublishArchiveForm({
  slug,
  isPublished,
}: {
  slug: string;
  isPublished: boolean;
}) {
  const action = isPublished ? archivePoster : publishPoster;
  const [state, formAction, isPending] = useActionState(action, { ok: false, message: '' });

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={isPending}
        className={`h-9 px-4 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${
          isPublished
            ? 'border border-[#c9c1b3] bg-white text-[#55564f] hover:bg-[#f6f3ee]'
            : 'bg-[#334157] text-white hover:opacity-90'
        }`}
      >
        {isPending
          ? isPublished ? 'Archiving...' : 'Publishing...'
          : isPublished ? 'Archive' : 'Publish'}
      </button>
      {state.message && (
        <p className={`text-sm ${state.ok ? 'text-[#2f684e]' : 'text-[#9d2f2f]'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

function FormatSelector({
  format,
  onChange,
}: {
  format: PosterFormat;
  onChange: (f: PosterFormat) => void;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium text-[#292b28]">Poster format</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {FORMATS.map((f) => (
          <label
            key={f}
            className={`flex cursor-pointer items-start gap-3 border p-3 text-sm ${
              format === f
                ? 'border-[#334157] bg-[#f0f3f6]'
                : 'border-[#d7d2c8] bg-white hover:border-[#a8b0bc]'
            }`}
          >
            <input
              type="radio"
              name="format"
              value={f}
              checked={format === f}
              onChange={() => onChange(f)}
              className="mt-0.5 accent-[#334157]"
            />
            <span className="leading-5 text-[#292b28]">{FORMAT_LABELS[f]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PriceFields({
  format,
  existingPrices,
}: {
  format: PosterFormat;
  existingPrices?: Partial<Record<string, SizePrices>>;
}) {
  const sizes = FORMAT_SIZES[format];
  const defaults = DEFAULT_PRICES[format];

  return (
    <details key={format} className="border border-[#d7d2c8] bg-white">
      <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-[#292b28]">
        Base prices <span className="ml-1 font-normal text-[#74756f]">(pence — optional, defaults shown)</span>
      </summary>
      <div className="border-t border-[#e4ded4] p-3">
        <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] pb-2">
          <span>Size</span>
          <span>Unframed</span>
          <span>Framed (all colours)</span>
        </div>
        <div className="grid gap-2">
          {sizes.map((size) => {
            const d = existingPrices?.[size] ?? defaults[size];
            return (
              <div key={size} className="grid grid-cols-3 items-center gap-x-3">
                <span className="text-sm font-medium text-[#292b28]">{SIZE_LABELS[size]}</span>
                <input
                  name={`price_${size}_unframed`}
                  type="number"
                  min="100"
                  step="100"
                  defaultValue={d?.unframed}
                  className="h-9 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
                />
                <input
                  name={`price_${size}_framed`}
                  type="number"
                  min="100"
                  step="100"
                  defaultValue={d?.framed}
                  className="h-9 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}

function StandardDescriptionSelects({
  productDetailTemplates,
  deliveryReturnTemplates,
  defaultProductDetailsId,
  defaultDeliveryAndReturnsId,
}: {
  productDetailTemplates: CopyTemplate[];
  deliveryReturnTemplates: CopyTemplate[];
  defaultProductDetailsId?: string;
  defaultDeliveryAndReturnsId?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Product details
        <select
          name="productDetailsId"
          required
          defaultValue={defaultProductDetailsId ?? productDetailTemplates[0]?.id ?? ''}
          className="h-11 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
        >
          {productDetailTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-[#292b28]">
        Delivery and returns
        <select
          name="deliveryAndReturnsId"
          required
          defaultValue={defaultDeliveryAndReturnsId ?? deliveryReturnTemplates[0]?.id ?? ''}
          className="h-11 border border-[#d7d2c8] bg-white px-3 text-sm font-normal outline-none focus:border-[#334157]"
        >
          {deliveryReturnTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
