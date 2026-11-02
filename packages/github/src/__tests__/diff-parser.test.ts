import { describe, it, expect } from "vitest";
import { parseDiff, getChangedLineNumbers } from "../diff-parser.js";

const SIMPLE_PATCH = `@@ -1,3 +1,4 @@
 line1
+added line
 line2
-removed line`;

const ADDITION_ONLY = `@@ -0,0 +1,3 @@
+alpha
+beta
+gamma`;

describe("parseDiff", () => {
  it("returns [] for empty patch", () => {
    expect(parseDiff("")).toEqual([]);
  });

  it("parses a simple hunk with add/del/ctx", () => {
    const hunks = parseDiff(SIMPLE_PATCH);
    expect(hunks).toHaveLength(1);
    const lines = hunks[0]!.lines;
    expect(lines[0]).toMatchObject({ type: "ctx", oldLine: 1, newLine: 1 });
    expect(lines[1]).toMatchObject({ type: "add", oldLine: null, newLine: 2, content: "added line" });
    expect(lines[2]).toMatchObject({ type: "ctx", oldLine: 2, newLine: 3 });
    expect(lines[3]).toMatchObject({ type: "del", oldLine: 3, newLine: null, content: "removed line" });
  });

  it("parses addition-only hunk", () => {
    const hunks = parseDiff(ADDITION_ONLY);
    expect(hunks[0]!.lines).toHaveLength(3);
    expect(hunks[0]!.lines.every((l) => l.type === "add")).toBe(true);
    expect(hunks[0]!.lines.map((l) => l.newLine)).toEqual([1, 2, 3]);
  });

  it("handles multi-hunk patch", () => {
    const multiHunk = `@@ -1,2 +1,2 @@
 foo
-bar
+baz
@@ -10,2 +10,2 @@
 qux
-old
+new`;
    const hunks = parseDiff(multiHunk);
    expect(hunks).toHaveLength(2);
  });
});

describe("getChangedLineNumbers", () => {
  it("returns only added line numbers", () => {
    const changed = getChangedLineNumbers(SIMPLE_PATCH);
    expect(changed.has(2)).toBe(true);   // the added line
    expect(changed.has(1)).toBe(false);  // context
    expect(changed.has(3)).toBe(false);  // context
  });

  it("returns correct set for addition-only patch", () => {
    const changed = getChangedLineNumbers(ADDITION_ONLY);
    expect(changed).toEqual(new Set([1, 2, 3]));
  });

  it("returns empty set for empty patch", () => {
    expect(getChangedLineNumbers("").size).toBe(0);
  });
});
