/**
 * One-off migration: regenerate Stripe products + prices in LIVE mode.
 *
 * Why this exists: the catalog's stripePriceIds were created in Stripe TEST
 * mode. Test and live are separate ledgers — those IDs are invalid against the
 * live key, so every product is checkout-broken until prices are recreated.
 * The dashboard "copy to live" does NOT help: it mints new IDs we don't track
 * and doesn't set the Gelato metadata our webhook reads.
 *
 * What it does: for every `ready-to-publish` draft, create a fresh live Stripe
 * product + one price per variant (mirroring publishPoster in
 * app/internal/posters/actions.ts), writing gelatoProductUid + printFileUrl
 * into each price's metadata, then rewrite data/poster-drafts.json with the new
 * live price IDs.
 *
 * Run:
 *   1. Put the LIVE secret key in .env.local  (STRIPE_SECRET_KEY=sk_live_...)
 *   2. Dry run (no writes, no Stripe calls):  npx tsx scripts/regen-live-prices.ts
 *   3. Apply:                                  npx tsx scripts/regen-live-prices.ts --apply
 *
 * Resumable & crash-safe: saves data/poster-drafts.json after EACH product and
 * records completed slugs in scripts/.regen-state.json (gitignored). If it dies
 * mid-run (e.g. network drop), just re-run with --apply — it skips products
 * already done and continues. Products created before a crash but not recorded
 * become harmless orphans in the live catalog (archive later if you care).
 */
import { promises as fs } from 'fs';
import path from 'path';
import Stripe from 'stripe';
import { loadEnvConfig } from '@next/env';
import { buildVariants, PosterFormat } from '../data/products';
import type { PosterDraft } from '../lib/poster-admin';

loadEnvConfig(process.cwd());

const APPLY = process.argv.includes('--apply');
const DATA_FILE = path.join(process.cwd(), 'data', 'poster-drafts.json');
const STATE_FILE = path.join(process.cwd(), 'scripts', '.regen-state.json');

async function readState(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await fs.readFile(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set (check .env.local).');
  }
  if (!key.startsWith('sk_live_')) {
    throw new Error(
      `Refusing to run: STRIPE_SECRET_KEY is "${key.slice(0, 8)}…", not a live key. ` +
        'Put the sk_live_ key in .env.local before regenerating live prices.'
    );
  }

  // maxNetworkRetries rides over brief DNS/connection drops with backoff.
  const stripe = new Stripe(key, { maxNetworkRetries: 5 });
  const drafts: PosterDraft[] = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  const done = await readState();

  const targets = drafts.filter((d) => d.status === 'ready-to-publish');
  const remaining = targets.filter((d) => !done[d.slug]);
  console.log(`${targets.length} ready-to-publish; ${Object.keys(done).length} already done, ${remaining.length} remaining.`);
  console.log(APPLY ? '*** APPLY MODE — creating live Stripe objects ***\n' : '--- DRY RUN (no writes) ---\n');

  let regenerated = 0;
  const skipped: string[] = [];

  for (const draft of drafts) {
    if (draft.status !== 'ready-to-publish') continue;
    if (done[draft.slug]) continue; // already migrated in a prior run

    const format = (draft.format ?? 'a-series') as PosterFormat;
    const variants = buildVariants(format, draft.basePrices ?? {});

    // Refuse to write broken metadata into live prices.
    const pending = variants.filter((v) => v.gelatoProductUid.startsWith('gelato_pending_'));
    if (!draft.printFileUrl) {
      skipped.push(`${draft.slug} (missing printFileUrl)`);
      continue;
    }
    if (pending.length > 0) {
      skipped.push(`${draft.slug} (${pending.length} variants have no Gelato UID)`);
      continue;
    }

    console.log(`${draft.slug}: ${variants.length} variants @ ${format}`);
    if (!APPLY) {
      regenerated++;
      continue;
    }

    const product = await stripe.products.create({
      name: draft.name,
      description: draft.description,
      metadata: { productId: draft.id, slug: draft.slug },
    });

    const stripePriceIds: Record<string, string> = {};
    for (const variant of variants) {
      const price = await stripe.prices.create({
        product: product.id,
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
      stripePriceIds[`${variant.size}_${variant.frame}`] = price.id;
    }

    draft.stripePriceIds = stripePriceIds;
    draft.updatedAt = new Date().toISOString();

    // Persist progress after EACH product so a crash never loses work.
    done[draft.slug] = product.id;
    await fs.writeFile(DATA_FILE, `${JSON.stringify(drafts, null, 2)}\n`);
    await fs.writeFile(STATE_FILE, `${JSON.stringify(done, null, 2)}\n`);

    regenerated++;
    console.log(`  ✓ ${product.id} (${Object.keys(stripePriceIds).length} prices) — saved`);
  }

  if (skipped.length) {
    console.log(`\nSKIPPED ${skipped.length}:`);
    skipped.forEach((s) => console.log(`  - ${s}`));
  }

  if (APPLY) {
    const total = Object.keys(done).length;
    console.log(`\n${regenerated} regenerated this run; ${total}/${targets.length} done total.`);
    if (total === targets.length && skipped.length === 0) {
      console.log('All done. Review the diff, commit, push, redeploy. Then delete scripts/.regen-state.json.');
    } else {
      console.log('Re-run with --apply to continue any remaining/skipped products.');
    }
  } else {
    console.log(`\nWould regenerate ${regenerated} products. Re-run with --apply to execute.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
