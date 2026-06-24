import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Backblaze B2 upload helper (S3-compatible API).
 *
 * Required env (in .env.local):
 *   B2_ENDPOINT          e.g. https://s3.us-west-004.backblazeb2.com
 *   B2_REGION            e.g. us-west-004
 *   B2_KEY_ID            B2 application keyID
 *   B2_APP_KEY           B2 application key
 *   B2_BUCKET            bucket name (must be public so Gelato can fetch)
 *   B2_PUBLIC_BASE_URL   public file base, e.g.
 *                        https://f004.backblazeb2.com/file/<bucket>  (or a CDN domain)
 */

let cachedClient: S3Client | null = null;

function getClient(): S3Client | null {
  const endpoint = process.env.B2_ENDPOINT;
  const region = process.env.B2_REGION;
  const accessKeyId = process.env.B2_KEY_ID;
  const secretAccessKey = process.env.B2_APP_KEY;

  if (!endpoint || !region || !accessKeyId || !secretAccessKey) return null;

  // Backblaze shows the endpoint without a scheme (e.g. s3.us-east-005.backblazeb2.com);
  // the S3 client requires a full URL, so prepend https:// if it's missing.
  const normalizedEndpoint = /^https?:\/\//.test(endpoint) ? endpoint : `https://${endpoint}`;

  if (!cachedClient) {
    cachedClient = new S3Client({
      endpoint: normalizedEndpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return cachedClient;
}

/** True when all the env needed to upload + build a public URL is present. */
export function backblazeConfigured(): boolean {
  return (
    getClient() !== null &&
    !!process.env.B2_BUCKET &&
    !!process.env.B2_PUBLIC_BASE_URL
  );
}

/**
 * Uploads a buffer to B2 and returns its public URL.
 * Throws if Backblaze is not configured or the upload fails.
 */
export async function uploadToBackblaze(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  const client = getClient();
  const bucket = process.env.B2_BUCKET;
  const base = process.env.B2_PUBLIC_BASE_URL;

  if (!client || !bucket || !base) {
    throw new Error('Backblaze is not configured (missing B2_* env vars).');
  }

  const normalizedKey = key.replace(/^\/+/, '');

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: normalizedKey,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    }),
  );

  return `${base.replace(/\/+$/, '')}/${normalizedKey}`;
}
