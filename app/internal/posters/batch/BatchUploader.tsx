'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createDraftFromMaster } from '../actions';
import { ArtistProfile, CopyTemplate } from '@/lib/poster-admin';
import { FORMAT_LABELS, PosterFormat } from '@/data/products';

const ALLOWED_PRINT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']);
const PREVIEWABLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

interface BatchRow {
  id: string;
  file: File;
  previewUrl: string | null;
  name: string;
  artistSlug: string;
  format: PosterFormat;
  summary: string;
  printFileUrl: string;
  lifestyleFiles: File[];
}

interface RowResult {
  name: string;
  ok: boolean;
  message: string;
  slug?: string;
}

interface Props {
  artists: ArtistProfile[];
  productDetailTemplates: CopyTemplate[];
  deliveryReturnTemplates: CopyTemplate[];
}

export default function BatchUploader({ artists, productDetailTemplates, deliveryReturnTemplates }: Props) {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [results, setResults] = useState<RowResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultProductDetailsId = productDetailTemplates[0]?.id ?? '';
  const defaultDeliveryAndReturnsId = deliveryReturnTemplates[0]?.id ?? '';

  function addFiles(files: FileList | File[]) {
    const valid = Array.from(files).filter((f) => ALLOWED_PRINT_TYPES.has(f.type));
    if (!valid.length) return;

    setRows((prev) => [
      ...prev,
      ...valid.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl: PREVIEWABLE_TYPES.has(file.type) ? URL.createObjectURL(file) : null,
        name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim(),
        artistSlug: '',
        format: 'a-series' as PosterFormat,
        summary: '',
        printFileUrl: '',
        lifestyleFiles: [],
      })),
    ]);
    setResults(null);
  }

  function updateRow(id: string, patch: Partial<BatchRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => {
      const row = prev.find((r) => r.id === id);
      if (row?.previewUrl) URL.revokeObjectURL(row.previewUrl);
      return prev.filter((r) => r.id !== id);
    });
  }

  function clearAll() {
    rows.forEach((r) => r.previewUrl && URL.revokeObjectURL(r.previewUrl));
    setRows([]);
    setResults(null);
  }

  async function handleSubmit() {
    if (!rows.length || submitting) return;
    setSubmitting(true);
    setProgress({ current: 0, total: rows.length });

    const statuses: RowResult[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setProgress({ current: i + 1, total: rows.length });

      const formData = new FormData();
      formData.append('printFile', row.file);
      formData.append('name', row.name || row.file.name);
      formData.append('artistSlug', row.artistSlug);
      formData.append('format', row.format);
      formData.append('summary', row.summary);
      formData.append('printFileUrl', row.printFileUrl);
      formData.append('productDetailsId', defaultProductDetailsId);
      formData.append('deliveryAndReturnsId', defaultDeliveryAndReturnsId);
      for (const lf of row.lifestyleFiles) {
        formData.append('lifestyleImages', lf);
      }

      try {
        const result = await createDraftFromMaster(null, formData);
        statuses.push({ name: row.name, ok: result.ok, message: result.message, slug: result.slug });
      } catch {
        statuses.push({ name: row.name, ok: false, message: 'Unexpected error — check the terminal.' });
      }
    }

    setResults(statuses);
    setSubmitting(false);
    setProgress(null);

    const failedNames = new Set(statuses.filter((s) => !s.ok).map((s) => s.name));
    setRows((prev) => prev.filter((r) => failedNames.has(r.name)));
  }

  const allSucceeded = results?.length && results.every((r) => r.ok);

  return (
    <div className="grid gap-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-12 text-center transition-colors ${
          isDragging
            ? 'border-[#334157] bg-[#f0f3f6]'
            : 'border-[#c9c1b3] bg-[#fbfaf7] hover:border-[#a8a19a] hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <p className="text-sm font-medium text-[#292b28]">
          {rows.length
            ? `${rows.length} file${rows.length === 1 ? '' : 's'} staged — drop more or click to add`
            : 'Drop print master files here, or click to browse'}
        </p>
        <p className="text-xs text-[#74756f]">PDF, JPEG, PNG, TIFF · up to 250 MB each</p>
      </div>

      {/* Progress bar */}
      {progress && (
        <div className="grid gap-2">
          <div className="h-1 w-full overflow-hidden bg-[#e4ded4]">
            <div
              className="h-full bg-[#334157] transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-[#74756f]">
            Creating draft {progress.current} of {progress.total}…
          </p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="border border-[#d8d1c4] bg-white p-4 grid gap-2">
          {results.map((r, i) => (
            <p key={i} className={`text-sm ${r.ok ? 'text-[#2f684e]' : 'text-[#9d2f2f]'}`}>
              {r.ok ? `✓ ${r.name}` : `✗ ${r.name} — ${r.message}`}
            </p>
          ))}
          {allSucceeded && (
            <Link
              href="/internal/posters"
              className="mt-1 text-sm font-medium text-[#334157] underline"
            >
              View all drafts →
            </Link>
          )}
        </div>
      )}

      {/* Spreadsheet */}
      {rows.length > 0 && (
        <div className="grid gap-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#d8d1c4] text-left">
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] w-12">
                    Preview
                  </th>
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] min-w-[180px]">
                    Name
                  </th>
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] min-w-[150px]">
                    Artist
                  </th>
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] min-w-[120px]">
                    Format
                  </th>
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] min-w-[220px]">
                    Description
                  </th>
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] min-w-[200px]">
                    Print file URL <span className="normal-case tracking-normal text-[#a8a19a]">(auto)</span>
                  </th>
                  <th className="pb-2 pr-3 text-xs font-medium uppercase tracking-[0.1em] text-[#74756f] w-28">
                    Lifestyle
                  </th>
                  <th className="pb-2 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4ded4]">
                {rows.map((row) => (
                  <BatchRowEditor
                    key={row.id}
                    row={row}
                    artists={artists}
                    onChange={(patch) => updateRow(row.id, patch)}
                    onRemove={() => removeRow(row.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="h-10 bg-[#334157] px-5 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Creating drafts…'
                : `Create ${rows.length} draft${rows.length === 1 ? '' : 's'}`}
            </button>
            {!submitting && (
              <button
                onClick={clearAll}
                className="h-10 border border-[#c9c1b3] bg-white px-4 text-sm text-[#55564f] hover:bg-[#f6f3ee]"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BatchRowEditor({
  row,
  artists,
  onChange,
  onRemove,
}: {
  row: BatchRow;
  artists: ArtistProfile[];
  onChange: (patch: Partial<BatchRow>) => void;
  onRemove: () => void;
}) {
  const lifestyleRef = useRef<HTMLInputElement>(null);
  const cell = 'border border-[#d7d2c8] bg-white px-2 py-1.5 text-sm w-full outline-none focus:border-[#334157]';

  return (
    <tr className="align-top">
      {/* Preview */}
      <td className="py-2 pr-3">
        <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden bg-[#e8e2d7]">
          {row.previewUrl ? (
            <Image src={row.previewUrl} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-[8px] font-medium uppercase tracking-widest text-[#74756f]">
                PDF
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="py-2 pr-3">
        <input
          type="text"
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={cell}
          placeholder="Poster name"
        />
      </td>

      {/* Artist */}
      <td className="py-2 pr-3">
        <select
          value={row.artistSlug}
          onChange={(e) => onChange({ artistSlug: e.target.value })}
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
      <td className="py-2 pr-3">
        <select
          value={row.format}
          onChange={(e) => onChange({ format: e.target.value as PosterFormat })}
          className={cell}
        >
          <option value="a-series">{FORMAT_LABELS['a-series'].split(' — ')[0]}</option>
          <option value="ratio-4x3">{FORMAT_LABELS['ratio-4x3'].split(' — ')[0]}</option>
        </select>
      </td>

      {/* Description */}
      <td className="py-2 pr-3">
        <input
          type="text"
          value={row.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          className={cell}
          placeholder="Short description"
        />
      </td>

      {/* Print URL */}
      <td className="py-2 pr-3">
        <input
          type="text"
          value={row.printFileUrl}
          onChange={(e) => onChange({ printFileUrl: e.target.value })}
          className={cell}
          placeholder="Auto-uploaded to Backblaze — or paste to override"
        />
      </td>

      {/* Lifestyle images */}
      <td className="py-2 pr-3">
        <input
          ref={lifestyleRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            if (!e.target.files) return;
            onChange({ lifestyleFiles: [...row.lifestyleFiles, ...Array.from(e.target.files)] });
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => lifestyleRef.current?.click()}
          className="h-8 border border-[#d7d2c8] bg-white px-2 text-xs text-[#334157] hover:bg-[#f6f3ee] whitespace-nowrap"
        >
          {row.lifestyleFiles.length > 0
            ? `${row.lifestyleFiles.length} image${row.lifestyleFiles.length === 1 ? '' : 's'}`
            : 'Add'}
        </button>
      </td>

      {/* Remove */}
      <td className="py-2">
        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center border border-[#e4ded4] text-[#9d2f2f] hover:bg-[#fdf0f0]"
          aria-label="Remove row"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
