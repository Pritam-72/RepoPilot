/**
 * Parsed diff hunk line info.
 */
export interface DiffLine {
  type: "add" | "del" | "ctx";
  oldLine: number | null;
  newLine: number | null;
  content: string;
  diffPosition: number; // 1-based index in the patch representation
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface ParsedDiffFile {
  oldPath?: string | undefined;
  newPath?: string | undefined;
  isNew: boolean;
  isDeleted: boolean;
  isRenamed: boolean;
  hunks: DiffHunk[];
}

export interface ChangedLineRange {
  startLine: number;
  endLine: number;
  type: "added" | "modified" | "deleted";
}

/**
 * Normalizes patch text by standardizing line endings to \n.
 */
function normalizePatchText(patch: string): string[] {
  return patch.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

/**
 * Parses a unified diff patch string into structured hunks.
 * Supports CRLF, multi-hunk, unicode, and '\ No newline at end of file'.
 */
export function parseDiff(patch: string): DiffHunk[] {
  if (!patch || patch.trim() === "") return [];

  const lines = normalizePatchText(patch);
  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;
  let diffPosition = 0;

  for (const raw of lines) {
    // Hunk header: @@ -a,b +c,d @@ or @@ -a +c @@
    const hunkMatch = raw.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (hunkMatch) {
      diffPosition++;
      oldLine = parseInt(hunkMatch[1]!, 10);
      const oldLines = hunkMatch[2] ? parseInt(hunkMatch[2], 10) : 1;
      newLine = parseInt(hunkMatch[3]!, 10);
      const newLines = hunkMatch[4] ? parseInt(hunkMatch[4], 10) : 1;

      currentHunk = {
        header: raw,
        oldStart: oldLine,
        oldLines,
        newStart: newLine,
        newLines,
        lines: [],
      };
      hunks.push(currentHunk);
      continue;
    }

    if (!currentHunk) {
      // Prior to first hunk (e.g. diff header lines like --- a/file +++ b/file)
      continue;
    }

    // Skip "\ No newline at end of file"
    if (raw.startsWith("\\ No newline at end of file") || raw.startsWith("\\")) {
      continue;
    }

    diffPosition++;

    if (raw.startsWith("+")) {
      currentHunk.lines.push({
        type: "add",
        oldLine: null,
        newLine: newLine++,
        content: raw.slice(1),
        diffPosition,
      });
    } else if (raw.startsWith("-")) {
      currentHunk.lines.push({
        type: "del",
        oldLine: oldLine++,
        newLine: null,
        content: raw.slice(1),
        diffPosition,
      });
    } else if (raw.startsWith(" ") || raw === "") {
      currentHunk.lines.push({
        type: "ctx",
        oldLine: oldLine++,
        newLine: newLine++,
        content: raw.startsWith(" ") ? raw.slice(1) : raw,
        diffPosition,
      });
    }
  }

  return hunks;
}

/**
 * Returns a map of diffPosition (1-based index in diff) -> new file line number.
 */
export function diffPositionToFileLine(patch: string): Map<number, number> {
  const map = new Map<number, number>();
  for (const hunk of parseDiff(patch)) {
    for (const line of hunk.lines) {
      if (line.newLine !== null) {
        map.set(line.diffPosition, line.newLine);
      }
    }
  }
  return map;
}

/**
 * Returns a map of new file line number -> diffPosition (1-based index in diff).
 */
export function fileLineToDiffPosition(patch: string): Map<number, number> {
  const map = new Map<number, number>();
  for (const hunk of parseDiff(patch)) {
    for (const line of hunk.lines) {
      if (line.newLine !== null) {
        map.set(line.newLine, line.diffPosition);
      }
    }
  }
  return map;
}

/**
 * Returns the set of all line numbers in the new file that are commentable
 * in a pull request review (lines that appear in the diff as add or ctx).
 */
export function getCommentableLines(patch: string): Set<number> {
  const commentable = new Set<number>();
  for (const hunk of parseDiff(patch)) {
    for (const line of hunk.lines) {
      if (line.newLine !== null) {
        commentable.add(line.newLine);
      }
    }
  }
  return commentable;
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

/**
 * Groups consecutive changed lines into contiguous ranges.
 */
export function getChangedLineRanges(patch: string): ChangedLineRange[] {
  const ranges: ChangedLineRange[] = [];
  const hunks = parseDiff(patch);

  for (const hunk of hunks) {
    let currentRange: { start: number; end: number; type: "added" | "modified" | "deleted" } | null = null;

    for (const line of hunk.lines) {
      if (line.type === "add") {
        const lineNum = line.newLine!;
        if (!currentRange) {
          currentRange = { start: lineNum, end: lineNum, type: "added" };
        } else if (lineNum === currentRange.end + 1) {
          currentRange.end = lineNum;
        } else {
          ranges.push({ startLine: currentRange.start, endLine: currentRange.end, type: currentRange.type });
          currentRange = { start: lineNum, end: lineNum, type: "added" };
        }
      } else {
        if (currentRange) {
          ranges.push({ startLine: currentRange.start, endLine: currentRange.end, type: currentRange.type });
          currentRange = null;
        }
      }
    }

    if (currentRange) {
      ranges.push({ startLine: currentRange.start, endLine: currentRange.end, type: currentRange.type });
    }
  }

  return ranges;
}
