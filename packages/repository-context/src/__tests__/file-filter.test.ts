import { describe, it, expect } from "vitest";
import { isIgnorableFile, filterReviewableFiles } from "../file-filter.js";

describe("isIgnorableFile", () => {
  it("ignores lockfiles across various ecosystems", () => {
    expect(isIgnorableFile("package-lock.json")).toBe(true);
    expect(isIgnorableFile("pnpm-lock.yaml")).toBe(true);
    expect(isIgnorableFile("yarn.lock")).toBe(true);
    expect(isIgnorableFile("Cargo.lock")).toBe(true);
    expect(isIgnorableFile("poetry.lock")).toBe(true);
    expect(isIgnorableFile("composer.lock")).toBe(true);
    expect(isIgnorableFile("sub/dir/go.sum")).toBe(true);
  });

  it("ignores binary and media assets", () => {
    expect(isIgnorableFile("assets/logo.png")).toBe(true);
    expect(isIgnorableFile("images/banner.jpg")).toBe(true);
    expect(isIgnorableFile("icons/favicon.ico")).toBe(true);
    expect(isIgnorableFile("fonts/inter.woff2")).toBe(true);
    expect(isIgnorableFile("docs/manual.pdf")).toBe(true);
    expect(isIgnorableFile("release/app.wasm")).toBe(true);
    expect(isIgnorableFile("bin/program.exe")).toBe(true);
  });

  it("ignores minified files, bundles, and source maps", () => {
    expect(isIgnorableFile("public/bundle.min.js")).toBe(true);
    expect(isIgnorableFile("styles/theme.min.css")).toBe(true);
    expect(isIgnorableFile("dist/index.js.map")).toBe(true);
    expect(isIgnorableFile("types/index.d.ts")).toBe(true);
  });

  it("ignores generated and vendored files", () => {
    expect(isIgnorableFile("node_modules/lodash/index.js")).toBe(true);
    expect(isIgnorableFile("vendor/bundle/ruby.rb")).toBe(true);
    expect(isIgnorableFile("dist/server.js")).toBe(true);
    expect(isIgnorableFile(".next/server/pages.js")).toBe(true);
    expect(isIgnorableFile("src/models.generated.ts")).toBe(true);
    expect(isIgnorableFile("proto/service.pb.go")).toBe(true);
  });

  it("permits regular source files", () => {
    expect(isIgnorableFile("src/server.ts")).toBe(false);
    expect(isIgnorableFile("lib/auth.py")).toBe(false);
    expect(isIgnorableFile("components/Button.tsx")).toBe(false);
    expect(isIgnorableFile("utils/helpers.js")).toBe(false);
    expect(isIgnorableFile("cmd/main.go")).toBe(false);
  });
});

describe("filterReviewableFiles", () => {
  it("separates files into reviewable and ignored sets", () => {
    const files = [
      { path: "src/auth.ts", content: "code" },
      { path: "package-lock.json", content: "{}" },
      { path: "public/avatar.png", content: "bytes" },
      { path: "lib/math.py", content: "code" },
    ];

    const { reviewable, ignored } = filterReviewableFiles(files);
    expect(reviewable.map((f) => f.path)).toEqual(["src/auth.ts", "lib/math.py"]);
    expect(ignored.map((f) => f.path)).toEqual(["package-lock.json", "public/avatar.png"]);
  });
});
