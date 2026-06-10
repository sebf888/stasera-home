import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  DELIVERY_RETURN_TEMPLATES,
  PRODUCT_DETAIL_TEMPLATES,
  posterAdminEnabled,
  readArtists,
} from '@/lib/poster-admin';
import BatchUploader from './BatchUploader';

export const dynamic = 'force-dynamic';

export default async function BatchUploadPage() {
  if (!posterAdminEnabled()) notFound();

  const artists = await readArtists();

  return (
    <main className="bg-[#f6f3ee] px-4 py-8 text-[#292b28] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d1c4] pb-5">
          <div>
            <Link
              href="/internal/posters"
              className="text-xs uppercase tracking-[0.16em] text-[#74756f] hover:text-[#292b28]"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-medium tracking-normal sm:text-3xl">Batch upload</h1>
            <p className="mt-1 text-sm text-[#74756f]">
              Drop all your master files at once, fill in metadata, then create drafts in one go.
            </p>
          </div>
        </header>

        <BatchUploader
          artists={artists}
          productDetailTemplates={PRODUCT_DETAIL_TEMPLATES}
          deliveryReturnTemplates={DELIVERY_RETURN_TEMPLATES}
        />
      </div>
    </main>
  );
}
