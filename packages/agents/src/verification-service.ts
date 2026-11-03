import { createHash } from "node:crypto";
import type { Finding } from "@acr/review-contracts";
import { logger } from "@acr/observability";

export interface VerificationOptions {
  minConfidence?: number;
  requireChangedLine?: boolean;
}

export interface VerificationRejection {
  finding: Finding;
  reason:
    | "file_not_found"
    | "line_out_of_bounds"
    | "evidence_mismatch"
    | "low_confidence"
    | "duplicate"
    | "not_changed_line";
}

export interface VerificationResult {
  verified: Finding[];
  rejected: VerificationRejection[];
  stats: {
    total: number;
    verifiedCount: number;
    rejectedCount: number;
    duplicatesCount: number;
  };
}

export function computeFindingFingerprint(finding: Finding): string {
  const normTitle = finding.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const ruleOrTitle = finding.ruleId || normTitle;
  return createHash("sha256")
    .update(`${finding.file}:${finding.line}:${finding.category}:${ruleOrTitle}`)
    .digest("hex");
}

/**
 * Normalizes text for lenient evidence comparison (collapses multiple whitespaces).
 */
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Checks if evidence snippet appears near the target line in file content.
 */
function verifyEvidenceAtLocation(
  fileContent: string,
  targetLine: number,
  evidence: string
): boolean {
  if (!evidence || evidence.trim() === "") return true;

  const lines = fileContent.split("\n");
  const normalizedEvidence = normalizeText(evidence);

  // Check lines within a window of +/- 3 lines around target line
  const startIdx = Math.max(0, targetLine - 4);
  const endIdx = Math.min(lines.length, targetLine + 3);
  const windowContent = lines.slice(startIdx, endIdx).join(" ");

  if (normalizeText(windowContent).includes(normalizedEvidence)) {
    return true;
  }

  // Fallback: Check if evidence is anywhere in the file
  return normalizeText(fileContent).includes(normalizedEvidence);
}

/**
 * Verifies and deduplicates findings against actual file content and diff boundaries.
 */
export function verifyAndDeduplicateFindings(
  findings: Finding[],
  fileContents: Map<string, string>,
  changedLinesByFile?: Map<string, Set<number>>,
  options: VerificationOptions = {}
): VerificationResult {
  const { minConfidence = 0.75, requireChangedLine = true } = options;

  const verified: Finding[] = [];
  const rejected: VerificationRejection[] = [];
  const seenFingerprints = new Map<string, Finding>();
  let duplicatesCount = 0;

  for (const finding of findings) {
    // 1. Confidence threshold check
    if (finding.confidence < minConfidence) {
      rejected.push({ finding, reason: "low_confidence" });
      continue;
    }

    // 2. File existence check
    const content = fileContents.get(finding.file);
    if (!content && fileContents.size > 0) {
      rejected.push({ finding, reason: "file_not_found" });
      continue;
    }

    // 3. Line bounds check
    if (content) {
      const lineCount = content.split("\n").length;
      if (finding.line < 1 || finding.line > lineCount) {
        rejected.push({ finding, reason: "line_out_of_bounds" });
        continue;
      }

      // 4. Evidence match check
      const evidenceOk = verifyEvidenceAtLocation(content, finding.line, finding.evidence);
      if (!evidenceOk) {
        rejected.push({ finding, reason: "evidence_mismatch" });
        continue;
      }
    }

    // 5. Changed lines check
    if (requireChangedLine && changedLinesByFile && changedLinesByFile.has(finding.file)) {
      const changed = changedLinesByFile.get(finding.file)!;
      if (!changed.has(finding.line)) {
        rejected.push({ finding, reason: "not_changed_line" });
        continue;
      }
    }

    // 6. Deduplication check
    const fp = computeFindingFingerprint(finding);

    // Also check for proximate duplicate (same file, same category, line within +/- 1)
    let isProximateDuplicate = false;
    for (const [existingFp, existingFinding] of seenFingerprints.entries()) {
      if (
        existingFinding.file === finding.file &&
        existingFinding.category === finding.category &&
        Math.abs(existingFinding.line - finding.line) <= 1
      ) {
        isProximateDuplicate = true;
        // Keep the finding with higher confidence
        if (finding.confidence > existingFinding.confidence) {
          seenFingerprints.delete(existingFp);
          const idx = verified.findIndex(
            (v) =>
              v.file === existingFinding.file &&
              v.line === existingFinding.line &&
              v.category === existingFinding.category
          );
          if (idx !== -1) verified.splice(idx, 1);
          seenFingerprints.set(fp, finding);
          verified.push({ ...finding, verificationStatus: "verified" });
        }
        break;
      }
    }

    if (isProximateDuplicate) {
      duplicatesCount++;
      rejected.push({ finding, reason: "duplicate" });
      continue;
    }

    if (seenFingerprints.has(fp)) {
      duplicatesCount++;
      rejected.push({ finding, reason: "duplicate" });
      continue;
    }

    seenFingerprints.set(fp, finding);
    verified.push({
      ...finding,
      verificationStatus: "verified",
    });
  }

  logger.info(
    {
      total: findings.length,
      verified: verified.length,
      rejected: rejected.length,
      duplicates: duplicatesCount,
    },
    "Findings verification and deduplication complete"
  );

  return {
    verified,
    rejected,
    stats: {
      total: findings.length,
      verifiedCount: verified.length,
      rejectedCount: rejected.length,
      duplicatesCount,
    },
  };
}
