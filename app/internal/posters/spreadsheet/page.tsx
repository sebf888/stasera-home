import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posterAdminEnabled, readArtists, readPosterDrafts } from '@/lib/poster-admin';
import SpreadsheetEditor from './SpreadsheetEditor';

export const dynamic = 'force-dynamic';

export default async function SpreadsheetPage() {
  if (!posterAdminEnabled()) notFound();

  const [drafts, artists] = await Promise.all([readPosterDrafts(), readArtists()]);

  return (
    <main className="bg-[#f6f3ee] px-4 py-8 text-[#292b28] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d1c4] pb-5">
          <div>
            <Link
              href="/internal/posters"
              className="text-xs uppercase tracking-[0.16em] text-[#74756f] hover:text-[#292b28]"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-medium tracking-normal sm:text-3xl">Poster spreadsheet</h1>
            <p className="mt-1 text-sm text-[#74756f]">
              {drafts.length} poster{drafts.length === 1 ? '' : 's'} ·{' '}
              {drafts.filter((d) => d.status === 'ready-to-publish').length} published
            </p>
          </div>
        </header>

        {drafts.length === 0 ? (
          <p className="text-sm text-[#74756f]">
            No posters yet.{' '}
            <Link href="/internal/posters/batch" className="text-[#334157] underline">
              Batch upload
            </Link>{' '}
            or{' '}
            <Link href="/internal/posters" className="text-[#334157] underline">
              add one individually
            </Link>
            .
          </p>
        ) : (
          <SpreadsheetEditor drafts={drafts} artists={artists} />
        )}
      </div>
    </main>
  );
}
