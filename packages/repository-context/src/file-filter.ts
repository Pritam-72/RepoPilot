import path from "node:path";

// Exact filename matches for package manager lockfiles
const LOCKFILES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "cargo.lock",
  "poetry.lock",
  "gemfile.lock",
  "composer.lock",
  "go.sum",
  "mix.lock",
  "flake.lock",
]);

// Binary, media, font, archive, and executable extensions
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".svg",
  ".mp4", ".mov", ".avi", ".mp3", ".wav",
  ".pdf", ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".wasm", ".exe", ".dll", ".so", ".dylib", ".bin", ".iso",
  ".pyc", ".class",
]);

// Path segments that indicate generated, vendored, or build artifacts
const IGNORED_PATH_SEGMENTS = new Set([
  "node_modules",
  "vendor",
  "third_party",
  "dist",
  "build",
  "out",
  ".next",
  "coverage",
  "target",
  ".turbo",
  ".git",
]);

/**
 * Normalizes file path to forward slashes and extracts lowercase basename.
 */
function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/").toLowerCase();
}

/**
 * Determines whether a file should be ignored from code review analysis.
 * Ignored files include lockfiles, binaries, vendored libraries, minified code,
 * sourcemaps, and build outputs.
 */
export function isIgnorableFile(filePath: string): boolean {
  if (!filePath || filePath.trim() === "") return true;

  const normalized = normalizePath(filePath);
  const basename = path.basename(normalized);
  const ext = path.extname(normalized);

  // 1. Check exact lockfile names
  if (LOCKFILES.has(basename)) {
    return true;
  }

  // 2. Check binary and media extensions
  if (BINARY_EXTENSIONS.has(ext)) {
    return true;
  }

  // 3. Check minified and source map files
  if (
    normalized.endsWith(".min.js") ||
    normalized.endsWith(".min.css") ||
    normalized.endsWith(".bundle.js") ||
    normalized.endsWith(".map") ||
    normalized.endsWith(".d.ts")
  ) {
    return true;
  }

  // 4. Check generated file naming patterns
  if (
    basename.includes(".generated.") ||
    basename.includes(".gen.") ||
    basename.endsWith(".g.dart") ||
    basename.endsWith(".pb.go")
  ) {
    return true;
  }

  // 5. Check ignored directory path segments
  const segments = normalized.split("/");
  for (const segment of segments) {
    if (IGNORED_PATH_SEGMENTS.has(segment)) {
      return true;
    }
  }

  // 6. OS metadata
  if (basename === ".ds_store" || basename === "thumbs.db") {
    return true;
  }

  return false;
}

/**
 * Filters a list of files into reviewable and ignored groups.
 */
export function filterReviewableFiles<T extends { path: string }>(
  files: T[]
): { reviewable: T[]; ignored: T[] } {
  const reviewable: T[] = [];
  const ignored: T[] = [];

  for (const file of files) {
    if (isIgnorableFile(file.path)) {
      ignored.push(file);
    } else {
      reviewable.push(file);
    }
  }

  return { reviewable, ignored };
}

