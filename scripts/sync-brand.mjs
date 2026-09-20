#!/usr/bin/env node
/**
 * Copy canonical brand files into a meatsack product repo.
 *
 * Reads brand.config.json from the consumer root (cwd, or --root).
 * --check fails if committed outputs differ from this brand revision.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BRAND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_BANNER = "Generated from meatsack-brand. Do not edit.";
const PRODUCTS = ["show", "ask", "share"];
const DARK_MODES = ["media", "class"];
const DEFAULT_PATHS = {
  css: "src/app/brand.generated.css",
  components: "src/components",
  logo: "public/logo.svg",
  hero: "public/brand/hero.jpg",
};

function parseArgs(argv) {
  const args = { check: false, root: process.cwd() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--check") args.check = true;
    else if (arg === "--root") {
      const value = argv[i + 1];
      if (!value) throw new Error("--root needs a path");
      args.root = resolve(value);
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadConfig(root) {
  const path = join(root, "brand.config.json");
  let raw;
  try {
    raw = loadJson(path);
  } catch {
    throw new Error(`Missing or invalid brand.config.json in ${root}`);
  }
  if (!PRODUCTS.includes(raw.product)) {
    throw new Error(`brand.config.json product must be ${PRODUCTS.join(" or ")}`);
  }
  if (!DARK_MODES.includes(raw.darkMode)) {
    throw new Error(`brand.config.json darkMode must be ${DARK_MODES.join(" or ")}`);
  }
  return {
    product: raw.product,
    darkMode: raw.darkMode,
    paths: { ...DEFAULT_PATHS, ...(raw.paths ?? {}) },
  };
}

function cssVars(record, indent) {
  return Object.entries(record)
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join("\n");
}

function seamCss() {
  return `.meatsack-pulse {
  left: 50%;
  top: 0;
  margin-left: -4.5px;
  animation: meatsack-travel-y 4.2s cubic-bezier(0.6, 0, 0.4, 1) infinite;
}

@media (min-width: 1024px) {
  .meatsack-pulse {
    left: 0;
    top: 50%;
    margin-left: 0;
    margin-top: -4.5px;
    animation-name: meatsack-travel-x;
  }
}

@keyframes meatsack-travel-x {
  0% {
    left: -4px;
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  42% {
    left: calc(100% - 5px);
    opacity: 1;
  }
  50% {
    left: calc(100% - 5px);
    opacity: 0;
  }
  58% {
    left: calc(100% - 5px);
    opacity: 1;
  }
  92% {
    left: -4px;
    opacity: 1;
  }
  100% {
    left: -4px;
    opacity: 0;
  }
}

@keyframes meatsack-travel-y {
  0% {
    top: -4px;
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  42% {
    top: calc(100% - 5px);
    opacity: 1;
  }
  50% {
    top: calc(100% - 5px);
    opacity: 0;
  }
  58% {
    top: calc(100% - 5px);
    opacity: 1;
  }
  92% {
    top: -4px;
    opacity: 1;
  }
  100% {
    top: -4px;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .meatsack-pulse {
    animation: none;
    left: 50%;
    top: 50%;
    margin-left: -4.5px;
    margin-top: -4.5px;
    opacity: 1;
  }
}
`;
}

export function generateCss(tokens, { product, darkMode }) {
  const productMeta = tokens.products[product];
  const accent = tokens.accents[productMeta.accent];
  const light = { ...tokens.shared.light, ...accent.light, radius: tokens.radius };
  const dark = { ...tokens.shared.dark, ...accent.dark };
  const darkBlock =
    darkMode === "media"
      ? `@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
${cssVars(dark, "    ")}
  }
}`
      : `html.dark,
.dark {
  color-scheme: dark;
${cssVars(dark, "  ")}
}`;

  return `/* ${GENERATED_BANNER} */
/* product: ${product}; accent: ${productMeta.accent}; darkMode: ${darkMode} */

:root {
  color-scheme: light;
${cssVars(light, "  ")}
}

${darkBlock}

${seamCss()}`;
}

function generatedTsx(sourcePath, contents) {
  return `/**
 * ${GENERATED_BANNER}
 * Canonical source: ${sourcePath}
 */

${contents}`;
}

function asBuffer(contents) {
  return Buffer.isBuffer(contents) ? contents : Buffer.from(contents, "utf8");
}

function digest(contents) {
  return createHash("sha256").update(asBuffer(contents)).digest("hex");
}

function currentFile(path) {
  try {
    return readFileSync(path);
  } catch {
    return null;
  }
}

function filesFor(config, tokens) {
  const product = tokens.products[config.product];
  const files = [
    {
      dest: join(config.paths.components, "site-chrome.tsx"),
      contents: generatedTsx(
        "components/site-chrome.tsx",
        readFileSync(join(BRAND_ROOT, "components/site-chrome.tsx"), "utf8"),
      ),
    },
    {
      dest: join(config.paths.components, "home-sections.tsx"),
      contents: generatedTsx(
        "components/home-sections.tsx",
        readFileSync(join(BRAND_ROOT, "components/home-sections.tsx"), "utf8"),
      ),
    },
    {
      dest: config.paths.css,
      contents: generateCss(tokens, config),
    },
    {
      dest: config.paths.logo,
      contents: readFileSync(join(BRAND_ROOT, product.logo)),
    },
    {
      dest: config.paths.hero,
      contents: readFileSync(join(BRAND_ROOT, product.hero)),
    },
  ];
  if (product.failure && config.paths.failure) {
    files.push({
      dest: config.paths.failure,
      contents: readFileSync(join(BRAND_ROOT, product.failure)),
    });
  }
  return files;
}

export function planSync({ root }) {
  const config = loadConfig(root);
  const tokens = loadJson(join(BRAND_ROOT, "tokens/tokens.json"));
  const files = filesFor(config, tokens);
  const stale = [];
  for (const file of files) {
    const dest = join(root, file.dest);
    const current = currentFile(dest);
    const next = asBuffer(file.contents);
    if (current && digest(current) === digest(next)) continue;
    stale.push({ dest: file.dest, next });
  }
  return { stale };
}

export function applySync({ root, check }) {
  const { stale } = planSync({ root });
  if (check) {
    if (stale.length === 0) return { wrote: [] };
    const names = stale.map((file) => file.dest).join("\n");
    throw new Error(
      `Brand outputs are stale:\n${names}\n\nRun \`pnpm sync:brand\` after updating the brand submodule.`,
    );
  }
  for (const file of stale) {
    const dest = join(root, file.dest);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, file.next);
  }
  return { wrote: stale.map((file) => file.dest) };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = applySync(args);
  if (!args.check) {
    for (const dest of result.wrote) console.log(`wrote ${dest}`);
    if (result.wrote.length === 0) console.log("brand outputs already match");
  }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
