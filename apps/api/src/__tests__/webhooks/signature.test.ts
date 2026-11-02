import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "../../webhooks/verify-signature.js";

const SECRET = "test-webhook-secret";

function makeSignature(body: Buffer, secret = SECRET): string {
  return "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyWebhookSignature", () => {
  const body = Buffer.from(JSON.stringify({ action: "opened" }));

  it("accepts valid signature", () => {
    expect(verifyWebhookSignature(body, makeSignature(body), SECRET)).toBe(true);
  });

  it("rejects tampered body", () => {
    const tampered = Buffer.from(JSON.stringify({ action: "closed" }));
    expect(verifyWebhookSignature(tampered, makeSignature(body), SECRET)).toBe(false);
  });

  it("rejects wrong secret", () => {
    expect(verifyWebhookSignature(body, makeSignature(body, "wrong-secret"), SECRET)).toBe(false);
  });

  it("rejects missing sha256= prefix", () => {
    const bare = createHmac("sha256", SECRET).update(body).digest("hex");
    expect(verifyWebhookSignature(body, bare, SECRET)).toBe(false);
  });

  it("rejects empty signature", () => {
    expect(verifyWebhookSignature(body, "", SECRET)).toBe(false);
  });
});
