import { describe, it, expect } from "vitest";
import {
  parseDiff,
  getChangedLineNumbers,
  diffPositionToFileLine,
  fileLineToDiffPosition,
  getCommentableLines,
  getChangedLineRanges,
} from "../diff-parser.js";

const SIMPLE_PATCH = `@@ -1,3 +1,4 @@
 line1
+added line
 line2
-removed line`;

const ADDITION_ONLY = `@@ -0,0 +1,3 @@
+alpha
+beta
+gamma`;

const MULTI_HUNK_PATCH = `@@ -1,3 +1,3 @@
 foo
-bar
+baz
 qux
@@ -10,3 +10,4 @@
 itemA
+itemInserted
 itemB
 itemC`;

const CRLF_PATCH = "@@ -5,3 +5,4 @@\r\n lineA\r\n+lineCRLF\r\n lineB\r\n-lineDel\r\n";

const NO_NEWLINE_PATCH = `@@ -1,2 +1,2 @@
 hello
-world
+world!
\\ No newline at end of file`;

const UNICODE_PATCH = `@@ -1,2 +1,3 @@
 const greeting = "Hello";
+const emoji = "🚀 Antigravity 🌟";
+const kanji = "日本語テスト";`;

const DELETED_FILE_PATCH = `@@ -1,3 +0,0 @@
-line1
-line2
-line3`;

describe("parseDiff", () => {
  it("returns [] for empty patch", () => {
    expect(parseDiff("")).toEqual([]);
    expect(parseDiff("   ")).toEqual([]);
  });

  it("parses a simple hunk with add/del/ctx and sets diffPosition", () => {
    const hunks = parseDiff(SIMPLE_PATCH);
    expect(hunks).toHaveLength(1);
    const lines = hunks[0]!.lines;

    expect(lines[0]).toMatchObject({ type: "ctx", oldLine: 1, newLine: 1, diffPosition: 2 });
    expect(lines[1]).toMatchObject({ type: "add", oldLine: null, newLine: 2, content: "added line", diffPosition: 3 });
    expect(lines[2]).toMatchObject({ type: "ctx", oldLine: 2, newLine: 3, diffPosition: 4 });
    expect(lines[3]).toMatchObject({ type: "del", oldLine: 3, newLine: null, content: "removed line", diffPosition: 5 });
  });

  it("parses addition-only hunk", () => {
    const hunks = parseDiff(ADDITION_ONLY);
    expect(hunks[0]!.lines).toHaveLength(3);
    expect(hunks[0]!.lines.every((l) => l.type === "add")).toBe(true);
    expect(hunks[0]!.lines.map((l) => l.newLine)).toEqual([1, 2, 3]);
  });

  it("handles multi-hunk patch", () => {
    const hunks = parseDiff(MULTI_HUNK_PATCH);
    expect(hunks).toHaveLength(2);
    expect(hunks[0]!.newStart).toBe(1);
    expect(hunks[1]!.newStart).toBe(10);
  });

  it("handles CRLF line endings transparently", () => {
    const hunks = parseDiff(CRLF_PATCH);
    expect(hunks).toHaveLength(1);
    const added = hunks[0]!.lines.find((l) => l.type === "add");
    expect(added?.content).toBe("lineCRLF");
    expect(added?.newLine).toBe(6);
  });

  it("handles \\ No newline at end of file gracefully without shifting lines", () => {
    const hunks = parseDiff(NO_NEWLINE_PATCH);
    expect(hunks).toHaveLength(1);
    expect(hunks[0]!.lines).toHaveLength(3);
    const added = hunks[0]!.lines.find((l) => l.type === "add");
    expect(added?.content).toBe("world!");
    expect(added?.newLine).toBe(2);
  });

  it("handles unicode and multi-byte characters accurately", () => {
    const hunks = parseDiff(UNICODE_PATCH);
    expect(hunks).toHaveLength(1);
    const addedLines = hunks[0]!.lines.filter((l) => l.type === "add");
    expect(addedLines).toHaveLength(2);
    expect(addedLines[0]!.content).toContain("🚀 Antigravity 🌟");
    expect(addedLines[1]!.content).toContain("日本語テスト");
  });

  it("parses deletion-only diff for deleted file", () => {
    const hunks = parseDiff(DELETED_FILE_PATCH);
    expect(hunks).toHaveLength(1);
    expect(hunks[0]!.lines.every((l) => l.type === "del")).toBe(true);
    expect(hunks[0]!.lines.map((l) => l.oldLine)).toEqual([1, 2, 3]);
    expect(hunks[0]!.lines.every((l) => l.newLine === null)).toBe(true);
  });
});

describe("Line Mapping & Round-Trip", () => {
  it("correctly maps diff positions to file lines and vice-versa", () => {
    const posToFile = diffPositionToFileLine(MULTI_HUNK_PATCH);
    const fileToPos = fileLineToDiffPosition(MULTI_HUNK_PATCH);

    // Context line 1
    const posLine1 = fileToPos.get(1);
    expect(posLine1).toBeDefined();
    expect(posToFile.get(posLine1!)).toBe(1);

    // Added line 2 (baz)
    const posLine2 = fileToPos.get(2);
    expect(posLine2).toBeDefined();
    expect(posToFile.get(posLine2!)).toBe(2);

    // Hunk 2 added line 11 (itemInserted)
    const posLine11 = fileToPos.get(11);
    expect(posLine11).toBeDefined();
    expect(posToFile.get(posLine11!)).toBe(11);

    // Verify 100% roundtrip consistency for all commentable lines
    for (const [fileLine, diffPos] of fileToPos.entries()) {
      expect(posToFile.get(diffPos)).toBe(fileLine);
    }
  });

  it("returns commentable lines in head file (add + ctx)", () => {
    const commentable = getCommentableLines(SIMPLE_PATCH);
    expect(commentable.has(1)).toBe(true); // ctx
    expect(commentable.has(2)).toBe(true); // add
    expect(commentable.has(3)).toBe(true); // ctx
    expect(commentable.has(4)).toBe(false); // deleted line didn't produce new line 4
  });

  it("calculates contiguous changed line ranges", () => {
    const patch = `@@ -1,5 +1,7 @@
 line1
+line2
+line3
 line4
+line5
 line6`;

    const ranges = getChangedLineRanges(patch);
    expect(ranges).toEqual([
      { startLine: 2, endLine: 3, type: "added" },
      { startLine: 5, endLine: 5, type: "added" },
    ]);
  });
});

describe("getChangedLineNumbers", () => {
  it("returns only added line numbers", () => {
    const changed = getChangedLineNumbers(SIMPLE_PATCH);
    expect(changed.has(2)).toBe(true);
    expect(changed.has(1)).toBe(false);
    expect(changed.has(3)).toBe(false);
  });

  it("returns correct set for addition-only patch", () => {
    const changed = getChangedLineNumbers(ADDITION_ONLY);
    expect(changed).toEqual(new Set([1, 2, 3]));
  });

  it("returns empty set for empty patch", () => {
    expect(getChangedLineNumbers("").size).toBe(0);
  });
});
