/**
 * Parsed diff hunk line info.
 */
export interface DiffLine {
  type: "add" | "del" | "ctx";
  oldLine: number | null;
  newLine: number | null;
  content: string;
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

/**
 * Parses a unified diff patch string into structured hunks.
 * Returns [] for binary or empty patches.
 */
export function parseDiff(patch: string): DiffHunk[] {
  if (!patch || patch.trim() === "") return [];

  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;

  for (const raw of patch.split("\n")) {
    // Hunk header: @@ -a,b +c,d @@
    const hunkMatch = raw.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      oldLine = parseInt(hunkMatch[1]!, 10);
      newLine = parseInt(hunkMatch[2]!, 10);
      currentHunk = { header: raw, lines: [] };
      hunks.push(currentHunk);
      continue;
    }

    if (!currentHunk) continue;

    if (raw.startsWith("+")) {
      currentHunk.lines.push({ type: "add", oldLine: null, newLine: newLine++, content: raw.slice(1) });
    } else if (raw.startsWith("-")) {
      currentHunk.lines.push({ type: "del", oldLine: oldLine++, newLine: null, content: raw.slice(1) });
    } else if (raw.startsWith(" ") || raw === "") {
      currentHunk.lines.push({ type: "ctx", oldLine: oldLine++, newLine: newLine++, content: raw.slice(1) });
    }
    // Skip "\ No newline at end of file"
  }

  return hunks;
}

/**
 * Returns the set of new-file line numbers that were added or modified in the patch.
 */
export function getChangedLineNumbers(patch: string): Set<number> {
  const result = new Set<number>();
  for (const hunk of parseDiff(patch)) {
    for (const line of hunk.lines) {
      if (line.type === "add" && line.newLine !== null) {
        result.add(line.newLine);
      }
    }
  }
  return result;
}
