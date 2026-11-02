import { extname } from "node:path";

export type SupportedLanguage = "typescript" | "tsx" | "javascript" | "python" | "unknown";

export function detectLanguage(filePath: string): SupportedLanguage {
  const ext = extname(filePath).toLowerCase();

  switch (ext) {
    case ".ts":
    case ".mts":
    case ".cts":
      return "typescript";
    case ".tsx":
      return "tsx";
    case ".js":
    case ".jsx":
    case ".mjs":
    case ".cjs":
      return "javascript";
    case ".py":
      return "python";
    default:
      return "unknown";
  }
}
