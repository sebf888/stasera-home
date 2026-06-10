import Image from 'next/image';
import { notFound } from 'next/navigation';
import PosterUploadForm, { ArtistEditForm, ArtistForm, PosterEditForm, PublishArchiveForm } from './PosterUploadForm';
import {
  DELIVERY_RETURN_TEMPLATES,
  PRODUCT_DETAIL_TEMPLATES,
  posterAdminEnabled,
  productSnippet,
  readArtists,
  readPosterDrafts,
} from '@/lib/poster-admin';
import { FORMAT_LABELS, FORMAT_SIZES, FRAMES, PosterFormat } from '@/data/products';
import { GELATO_UIDS } from '@/data/gelato-config';

export const dynamic = 'force-dynamic';

export default async function InternalPosterDashboard() {
  if (!posterAdminEnabled()) notFound();

  const drafts = await readPosterDrafts();
  const artists = await readArtists();

  return (
    <main className="bg-[#f6f3ee] px-4 py-8 text-[#292b28] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d1c4] pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#74756f]">Internal</p>
            <h1 className="mt-2 text-2xl font-medium tracking-normal sm:text-3xl">Poster upload dashboard</h1>
          </div>
          <div className="flex flex-wrap items-end gap-8">
            <div className="grid grid-cols-3 gap-6 text-right text-sm">
              <Metric label="Total" value={drafts.length} />
              <Metric label="Published" value={drafts.filter((draft) => draft.status === 'ready-to-publish').length} />
              <Metric label="Assets" value={drafts.reduce((sum, draft) => sum + 3 + draft.images.lifestyle.length, 0)} />
            </div>
            <div className="flex gap-2">
              <a
                href="/internal/posters/spreadsheet"
                className="h-10 border border-[#c9c1b3] bg-white px-5 text-sm text-[#55564f] flex items-center hover:bg-[#f6f3ee] whitespace-nowrap"
              >
                Spreadsheet
              </a>
              <a
                href="/internal/posters/batch"
                className="h-10 bg-[#334157] px-5 text-sm text-white flex items-center hover:opacity-90 whitespace-nowrap"
              >
                Batch upload
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-5 border border-[#d8d1c4] bg-[#fbfaf7] p-5 sm:p-6">
          <div className="grid gap-1">
            <h2 className="text-lg font-medium">New poster</h2>
            <p className="max-w-3xl text-sm leading-6 text-[#666861]">
              Upload the print master once, plus any lifestyle images. The dashboard keeps the master private, derives lightweight WebP site assets from it, and records the mapping work still needed for Stripe and Gelato.
            </p>
          </div>
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <PosterUploadForm
              artists={artists}
              productDetailTemplates={PRODUCT_DETAIL_TEMPLATES}
              deliveryReturnTemplates={DELIVERY_RETURN_TEMPLATES}
            />
            <div className="grid content-start gap-4">
              <ArtistForm />
              <div className="border border-[#d8d1c4] bg-white p-4">
                <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-[#74756f]">Saved artists</h3>
                <ul className="mt-3 grid gap-2">
                  {artists.length ? artists.map((artist) => (
                    <li key={artist.slug}>
                      <details className="border border-[#e4ded4]">
                        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-[#292b28]">
                          {artist.name}
                          <span className="ml-2 text-xs font-normal text-[#74756f]">{artist.slug}</span>
                        </summary>
                        <ArtistEditForm artist={artist} />
                      </details>
                    </li>
                  )) : (
                    <li className="text-sm leading-5 text-[#74756f]">Add an artist before creating a poster.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between border-b border-[#d8d1c4] pb-3">
            <h2 className="text-lg font-medium">Draft catalogue</h2>
            <p className="text-sm text-[#74756f]">{drafts.length ? 'Newest first' : 'No drafts yet'}</p>
          </div>

          <div className="grid gap-5">
            {drafts.map((draft) => (
              <article key={draft.slug} className="grid gap-5 border border-[#d8d1c4] bg-white p-4 lg:grid-cols-[220px_1fr]">
                <div className="grid gap-3">
                  <div className="relative aspect-[8/11] overflow-hidden bg-[#e8e2d7]">
                    <Image
                      src={draft.images.frame}
                      alt={`${draft.name} framed catalogue preview`}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <AssetLink href={draft.images.flat} label="Flat" />
                    <AssetLink href={draft.images.thumb} label="Thumb" />
                    <AssetLink href={draft.images.frame} label="Frame" />
                  </div>
                </div>

                <div className="grid content-start gap-4">
                  <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <h3 className="text-xl font-medium">{draft.name}</h3>
                      <p className="text-sm text-[#666861]">by {draft.artist || <span className="italic text-[#9d2f2f]">no artist set</span>}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {draft.status === 'ready-to-publish' ? (
                        <span className="w-fit border border-[#4a8c6c] bg-[#f0f7f3] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[#2f684e]">
                          Published
                        </span>
                      ) : (
                        <span className="w-fit border border-[#c9c1b3] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[#55564f]">
                          Draft
                        </span>
                      )}
                      <span className="w-fit border border-[#b8c9d8] bg-[#f0f4f8] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[#334157]">
                        {FORMAT_LABELS[draft.format ?? 'a-series'].split(' — ')[0]}
                      </span>
                    </div>
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-[#4d4f48]">{draft.description}</p>

                  <div className="grid gap-3 md:grid-cols-3">
                    <CopyBlock title="About Artist" body={draft.descriptions?.aboutArtist} />
                    <CopyBlock title="Product Details" body={draft.descriptions?.productDetails} />
                    <CopyBlock title="Delivery And Returns" body={draft.descriptions?.deliveryAndReturns} />
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <ChecklistBlock
                      title="Generated"
                      items={[
                        'Framed catalogue image',
                        'Flat product image',
                        'Grid thumbnail',
                        `${draft.images.lifestyle.length} lifestyle image${draft.images.lifestyle.length === 1 ? '' : 's'}`,
                      ]}
                    />
                    <ChecklistBlock
                      title="Before publishing"
                      items={[
                        draft.images.lifestyle.length ? 'Lifestyle images ✓' : 'Add lifestyle images',
                        draft.printFileUrl ? 'Print file URL ✓' : 'Add public print file URL',
                        gelatoConfigStatus(draft.format ?? 'a-series'),
                      ]}
                    />
                    <ChecklistBlock
                      title="Storage"
                      items={[
                        draft.printFilePath,
                        draft.printFileUrl || 'printFileUrl pending',
                        `/uploads/posters/${draft.slug}`,
                      ]}
                    />
                  </div>

                  <PublishArchiveForm
                    slug={draft.slug}
                    isPublished={draft.status === 'ready-to-publish'}
                  />

                  {draft.notes && (
                    <div className="border border-[#e4ded4] bg-[#fbfaf7] p-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-[#55564f]">{draft.notes}</p>
                    </div>
                  )}

                  <details className="border border-[#e4ded4] bg-[#fbfaf7]">
                    <summary className="cursor-pointer px-3 py-2 text-sm font-medium">Product snippet</summary>
                    <pre className="overflow-x-auto border-t border-[#e4ded4] p-3 text-xs leading-5 text-[#292b28]">
                      <code>{productSnippet(draft)}</code>
                    </pre>
                  </details>

                  <details className="border border-[#e4ded4] bg-[#fbfaf7]">
                    <summary className="cursor-pointer px-3 py-2 text-sm font-medium">Edit poster</summary>
                    <PosterEditForm
                      draft={normaliseDraft(draft)}
                      artists={artists}
                      productDetailTemplates={PRODUCT_DETAIL_TEMPLATES}
                      deliveryReturnTemplates={DELIVERY_RETURN_TEMPLATES}
                    />
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function CopyBlock({ title, body }: { title: string; body?: string }) {
  return (
    <div className="border border-[#e4ded4] p-3">
      <h4 className="text-xs uppercase tracking-[0.14em] text-[#74756f]">{title}</h4>
      <p className="mt-2 line-clamp-4 text-sm leading-5 text-[#4d4f48]">
        {body || 'Not set'}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-medium">{value}</p>
      <p className="text-xs uppercase tracking-[0.12em] text-[#74756f]">{label}</p>
    </div>
  );
}

function normaliseDraft(draft: Awaited<ReturnType<typeof readPosterDrafts>>[number]) {
  return {
    ...draft,
    format: (draft.format ?? 'a-series') as PosterFormat,
    basePrices: draft.basePrices ?? {},
    artistSlug: draft.artistSlug ?? '',
    descriptions: {
      aboutArtist: draft.descriptions?.aboutArtist ?? '',
      deliveryAndReturns: draft.descriptions?.deliveryAndReturns ?? DELIVERY_RETURN_TEMPLATES[0]?.body ?? '',
      productDetails: draft.descriptions?.productDetails ?? PRODUCT_DETAIL_TEMPLATES[0]?.body ?? '',
    },
    templateIds: {
      deliveryAndReturns: draft.templateIds?.deliveryAndReturns ?? DELIVERY_RETURN_TEMPLATES[0]?.id ?? '',
      productDetails: draft.templateIds?.productDetails ?? PRODUCT_DETAIL_TEMPLATES[0]?.id ?? '',
    },
  };
}

function gelatoConfigStatus(format: PosterFormat): string {
  const uids = GELATO_UIDS[format] ?? {};
  const sizes = FORMAT_SIZES[format];
  const total = sizes.length * FRAMES.length;
  const filled = sizes.flatMap((size) => FRAMES.map((frame) => uids[`${size}_${frame}`])).filter(Boolean).length;
  if (filled === total) return 'Gelato UIDs configured ✓';
  return `Paste Gelato UIDs in gelato-config.ts (${filled}/${total})`;
}

function AssetLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      className="border border-[#d8d1c4] px-2 py-2 text-center text-xs text-[#334157] hover:bg-[#f6f3ee]"
    >
      {label}
    </a>
  );
}

function ChecklistBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-[#e4ded4] p-3">
      <h4 className="text-xs uppercase tracking-[0.14em] text-[#74756f]">{title}</h4>
      <ul className="mt-2 grid gap-1">
        {items.map((item) => (
          <li key={item} className="break-words text-sm leading-5 text-[#4d4f48]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
