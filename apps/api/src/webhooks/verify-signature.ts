import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies GitHub webhook HMAC-SHA256 signature.
 * @param rawBody - The raw request buffer (captured before JSON parsing)
 * @param signature - Value of X-Hub-Signature-256 header (format: "sha256=<hex>")
 * @param secret - GitHub App webhook secret
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string,
  secret: string
): boolean {
  if (!signature.startsWith("sha256=")) return false;

  const expected = Buffer.from(
    createHmac("sha256", secret).update(rawBody).digest("hex"),
    "utf8"
  );
  const received = Buffer.from(signature.slice(7), "utf8");

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
