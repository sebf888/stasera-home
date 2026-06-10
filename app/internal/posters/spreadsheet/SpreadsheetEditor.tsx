'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updatePosterFields, publishPoster, archivePoster } from '../actions';
import { ArtistProfile, PosterDraft } from '@/lib/poster-admin';
import { FORMAT_LABELS, PosterFormat } from '@/data/products';

interface RowState {
  slug: string;
  name: string;
  artistSlug: string;
  format: PosterFormat;
  description: string;
  printFileUrl: string;
  isPublished: boolean;
  thumb: string;
  dirty: boolean;
  saving: 'idle' | 'saving' | 'saved' | 'error';
  saveMessage: string;
  publishing: boolean;
}

function draftToRow(draft: PosterDraft): RowState {
  return {
    slug: draft.slug,
    name: draft.name,
    artistSlug: draft.artistSlug ?? '',
    format: (draft.format ?? 'a-series') as PosterFormat,
    description: draft.description ?? '',
    printFileUrl: draft.printFileUrl ?? '',
    isPublished: draft.status === 'ready-to-publish',
    thumb: draft.images.thumb,
    dirty: false,
    saving: 'idle',
    saveMessage: '',
    publishing: false,
  };
}

export default function SpreadsheetEditor({
  drafts,
  artists,
}: {
  drafts: PosterDraft[];
  artists: ArtistProfile[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<RowState[]>(() => drafts.map(draftToRow));

  function patch(slug: string, update: Partial<RowState>) {
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, ...update } : r))
    );
  }

  function markDirty(slug: string, update: Partial<RowState>) {
    patch(slug, { ...update, dirty: true, saving: 'idle', saveMessage: '' });
  }

  const saveRow = useCallback(
    async (slug: string) => {
      const row = rows.find((r) => r.slug === slug);
      if (!row) return;

      patch(slug, { saving: 'saving' });

      const fd = new FormData();
      fd.append('slug', slug);
      fd.append('name', row.name);
      fd.append('artistSlug', row.artistSlug);
      fd.append('format', row.format);
      fd.append('description', row.description);
      fd.append('printFileUrl', row.printFileUrl);

      const result = await updatePosterFields(null, fd);

      patch(slug, {
        saving: result.ok ? 'saved' : 'error',
        saveMessage: result.message,
        dirty: result.ok ? false : true,
      });

      if (result.ok) router.refresh();
    },
    [rows, router]
  );

  const togglePublish = useCallback(
    async (slug: string, isPublished: boolean) => {
      patch(slug, { publishing: true });

      const fd = new FormData();
      fd.append('slug', slug);

      const result = await (isPublished ? archivePoster(null as never, fd) : publishPoster(null as never, fd));

      if (result.ok) {
        patch(slug, { isPublished: !isPublished, publishing: false, saveMessage: result.message, saving: 'saved' });
        router.refresh();
      } else {
        patch(slug, { publishing: false, saving: 'error', saveMessage: result.message });
      }
    },
    [router]
  );

  const cell = 'w-full border border-[#d7d2c8] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#334157] leading-snug';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-[#d8d1c4] text-left">
            {['', 'Name', 'Artist', 'Format', 'Description', 'Print file URL', 'Status', ''].map((h, i) => (
              <th
                key={i}
                className="pb-2.5 pr-3 last:pr-0 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e4ded4]">
          {rows.map((row) => (
            <tr
              key={row.slug}
              className={row.dirty ? 'bg-[#fdfcf8]' : ''}
            >
              {/* Thumb */}
              <td className="py-2 pr-3 w-10">
                <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden bg-[#e8e2d7]">
                  <Image
                    src={row.thumb}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                    unoptimized
                  />
                </div>
              </td>

              {/* Name */}
              <td className="py-2 pr-3 min-w-[180px]">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => markDirty(row.slug, { name: e.target.value })}
                  className={cell}
                />
              </td>

              {/* Artist */}
              <td className="py-2 pr-3 min-w-[150px]">
                <select
                  value={row.artistSlug}
                  onChange={(e) => markDirty(row.slug, { artistSlug: e.target.value })}
                  className={cell}
                >
                  <option value="">— blank —</option>
                  {artists.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Format */}
              <td className="py-2 pr-3 min-w-[110px]">
                <select
                  value={row.format}
                  onChange={(e) => markDirty(row.slug, { format: e.target.value as PosterFormat })}
                  className={cell}
                >
                  <option value="a-series">{FORMAT_LABELS['a-series'].split(' — ')[0]}</option>
                  <option value="ratio-4x3">{FORMAT_LABELS['ratio-4x3'].split(' — ')[0]}</option>
                </select>
              </td>

              {/* Description */}
              <td className="py-2 pr-3 min-w-[240px]">
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => markDirty(row.slug, { description: e.target.value })}
                  className={cell}
                  placeholder="Short description"
                />
              </td>

              {/* Print URL */}
              <td className="py-2 pr-3 min-w-[200px]">
                <input
                  type="text"
                  value={row.printFileUrl}
                  onChange={(e) => markDirty(row.slug, { printFileUrl: e.target.value })}
                  className={cell}
                  placeholder="https://…"
                />
              </td>

              {/* Status */}
              <td className="py-2 pr-3 w-28">
                <span
                  className={`inline-block px-2 py-1 text-xs uppercase tracking-[0.1em] border ${
                    row.isPublished
                      ? 'border-[#4a8c6c] bg-[#f0f7f3] text-[#2f684e]'
                      : 'border-[#c9c1b3] text-[#55564f]'
                  }`}
                >
                  {row.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>

              {/* Actions */}
              <td className="py-2 w-auto">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {row.dirty && (
                    <button
                      onClick={() => saveRow(row.slug)}
                      disabled={row.saving === 'saving'}
                      className="h-8 bg-[#334157] px-3 text-xs text-white disabled:opacity-60"
                    >
                      {row.saving === 'saving' ? 'Saving…' : 'Save'}
                    </button>
                  )}

                  <button
                    onClick={() => togglePublish(row.slug, row.isPublished)}
                    disabled={row.publishing || row.saving === 'saving'}
                    className={`h-8 px-3 text-xs transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${
                      row.isPublished
                        ? 'border border-[#c9c1b3] bg-white text-[#55564f] hover:bg-[#f6f3ee]'
                        : 'bg-[#334157] text-white hover:opacity-90'
                    }`}
                  >
                    {row.publishing
                      ? row.isPublished ? 'Archiving…' : 'Publishing…'
                      : row.isPublished ? 'Archive' : 'Publish'}
                  </button>

                  {row.saveMessage && (
                    <span
                      className={`text-xs ${row.saving === 'error' ? 'text-[#9d2f2f]' : 'text-[#2f684e]'}`}
                    >
                      {row.saveMessage}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
