import { FindingSchema, type Finding } from "@acr/review-contracts";

export interface SemgrepResult {
  check_id: string;
  path: string;
  start: { line: number; col?: number };
  end: { line: number; col?: number };
  extra: {
    message: string;
    severity?: "ERROR" | "WARNING" | "INFO" | string;
    metadata?: {
      cwe?: string[] | string;
      category?: string;
      confidence?: string;
    };
    lines?: string;
  };
}

export interface SemgrepJsonOutput {
  results: SemgrepResult[];
  errors?: unknown[];
}

function mapSemgrepSeverity(
  sev?: string
): "critical" | "high" | "medium" | "low" | "informational" {
  switch (sev?.toUpperCase()) {
    case "ERROR":
      return "critical";
    case "WARNING":
      return "high";
    case "INFO":
      return "low";
    default:
      return "medium";
  }
}

function mapCategory(
  ruleId: string,
  metaCategory?: string
): "correctness" | "security" | "performance" | "maintainability" | "testing" | "dependency" {
  const normalized = (metaCategory || ruleId).toLowerCase();
  if (normalized.includes("security") || normalized.includes("injection") || normalized.includes("cwe")) {
    return "security";
  }
  if (normalized.includes("performance") || normalized.includes("leak")) {
    return "performance";
  }
  if (normalized.includes("test")) {
    return "testing";
  }
  return "security";
}

/**
 * Normalizes Semgrep JSON output into Zod-validated Review Findings.
 */
export function normalizeSemgrepOutput(
  rawJson: string | SemgrepJsonOutput,
  changedLinesByFile?: Map<string, Set<number>>
): Finding[] {
  let parsed: SemgrepJsonOutput;
  try {
    parsed = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;
  } catch {
    return [];
  }

  if (!parsed?.results || !Array.isArray(parsed.results)) {
    return [];
  }

  const findings: Finding[] = [];

  for (const item of parsed.results) {
    const file = item.path.replace(/^[./\\]+/, "");
    const line = item.start.line;
    const endLine = item.end.line;

    // If changed line bounds are provided, filter findings to only changed lines
    if (changedLinesByFile && changedLinesByFile.has(file)) {
      const changedLines = changedLinesByFile.get(file)!;
      let intersects = false;
      for (let l = line; l <= endLine; l++) {
        if (changedLines.has(l)) {
          intersects = true;
          break;
        }
      }
      if (!intersects) continue;
    }

    const cwe = Array.isArray(item.extra.metadata?.cwe)
      ? item.extra.metadata.cwe.join(", ")
      : item.extra.metadata?.cwe;

    const finding: Finding = {
      title: item.extra.message.split("\n")[0]?.slice(0, 180) || item.check_id,
      category: mapCategory(item.check_id, item.extra.metadata?.category),
      severity: mapSemgrepSeverity(item.extra.severity),
      confidence: 1.0, // Deterministic static analysis has max confidence
      file,
      line,
      endLine: endLine > line ? endLine : undefined,
      description: item.extra.message + (cwe ? ` (CWE: ${cwe})` : ""),
      evidence: item.extra.lines?.trim() || `Line ${line}`,
      recommendation: "Review code against security policies and parameterize inputs.",
      ruleId: item.check_id,
      verificationStatus: "verified", // Deterministic AST rule match is pre-verified
    };

    // Strict validation against schema
    const validated = FindingSchema.safeParse(finding);
    if (validated.success) {
      findings.push(validated.data);
    }
  }

  return findings;
}
