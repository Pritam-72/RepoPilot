import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Mock the 'ai' package before importing our module
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: vi.fn(() => () => "mock-model"),
}));

// Import after mocks are set up
const { generateObject } = await import("ai");
const { generateStructuredOutput } = await import("../llm-provider.js");

const TestSchema = z.object({ answer: z.string() });

describe("generateStructuredOutput", () => {
  beforeEach(() => {
    vi.mocked(generateObject).mockClear();
    vi.mocked(generateObject).mockResolvedValue({ object: { answer: "42" } } as never);
  });

  it("returns structured object matching schema", async () => {
    const result = await generateStructuredOutput("What is the answer?", TestSchema, {
      apiKey: "test-key",
    });
    expect(result).toEqual({ answer: "42" });
    expect(generateObject).toHaveBeenCalledOnce();
  });

  it("passes prompt and schema to generateObject", async () => {
    await generateStructuredOutput("Hello", TestSchema, { apiKey: "x" });
    const call = vi.mocked(generateObject).mock.calls[0]![0] as Record<string, unknown>;
    expect(call.prompt).toBe("Hello");
    expect(call.schema).toBe(TestSchema);
  });

  it("aborts on timeout (AbortSignal.timeout) and throws if all models fail", async () => {
    vi.mocked(generateObject).mockRejectedValue(
      Object.assign(new Error("aborted"), { name: "AbortError" })
    );
    await expect(
      generateStructuredOutput("test", TestSchema, { apiKey: "x", timeoutMs: 1, fallbackModels: [] })
    ).rejects.toThrow();
  });

  it("gracefully falls back to secondary model when primary model fails", async () => {
    vi.mocked(generateObject)
      .mockRejectedValueOnce(new Error("ResourceExhausted: 429 quota exceeded"))
      .mockResolvedValueOnce({ object: { answer: "fallback response" } } as never);

    const result = await generateStructuredOutput("Explain quantum computing", TestSchema, {
      apiKey: "test-key",
      model: "gemini-2.0-flash-exp",
      fallbackModels: ["gemini-1.5-flash"],
    });

    expect(result).toEqual({ answer: "fallback response" });
    expect(generateObject).toHaveBeenCalledTimes(2);
  });
});

