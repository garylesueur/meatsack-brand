import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { applySync, generateCss } from "../scripts/sync-brand.mjs";

const tokens = JSON.parse(
  readFileSync(new URL("../tokens/tokens.json", import.meta.url), "utf8"),
);

function consumer(config) {
  const root = mkdtempSync(join(tmpdir(), "meatsack-brand-"));
  writeFileSync(join(root, "brand.config.json"), `${JSON.stringify(config, null, 2)}\n`);
  mkdirSync(join(root, "src/components"), { recursive: true });
  mkdirSync(join(root, "src/app"), { recursive: true });
  mkdirSync(join(root, "public"), { recursive: true });
  return root;
}

test("writes components, css, logo and hero for show", () => {
  const root = consumer({
    product: "show",
    darkMode: "media",
    paths: { failure: "public/silicon-failure.png" },
  });
  const result = applySync({ root, check: false });
  assert.ok(result.wrote.includes("src/components/site-chrome.tsx"));
  assert.ok(result.wrote.includes("src/components/home-sections.tsx"));
  assert.ok(result.wrote.includes("src/app/brand.generated.css"));
  assert.ok(result.wrote.includes("public/logo.svg"));
  assert.ok(result.wrote.includes("public/brand/hero.jpg"));
  assert.ok(result.wrote.includes("public/silicon-failure.png"));
  const css = readFileSync(join(root, "src/app/brand.generated.css"), "utf8");
  assert.match(css, /product: show/);
  assert.match(css, /--primary: oklch\(0\.44 0\.09 175\)/);
  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /\.meatsack-pulse/);
  const chrome = readFileSync(join(root, "src/components/site-chrome.tsx"), "utf8");
  assert.match(chrome, /Generated from meatsack-brand/);
  assert.match(chrome, /export function SiteShell/);
});

test("check passes after a write and fails if a generated file is edited", () => {
  const root = consumer({ product: "ask", darkMode: "class" });
  applySync({ root, check: false });
  applySync({ root, check: true });
  writeFileSync(join(root, "src/app/brand.generated.css"), "/* tampered */\n");
  assert.throws(() => applySync({ root, check: true }), /Brand outputs are stale/);
});

test("rejects an unknown product", () => {
  const root = consumer({ product: "lanyard", darkMode: "media" });
  assert.throws(() => applySync({ root, check: false }), /product must be/);
});

test("class dark mode uses html.dark and ember accent", () => {
  const css = generateCss(tokens, { product: "ask", darkMode: "class" });
  assert.match(css, /product: ask/);
  assert.match(css, /html\.dark/);
  assert.match(css, /--primary: oklch\(0\.32 0\.04 55\)/);
  assert.doesNotMatch(css, /prefers-color-scheme/);
});

test("writes components, css, logo and hero for share", () => {
  const root = consumer({ product: "share", darkMode: "class" });
  const result = applySync({ root, check: false });
  assert.ok(result.wrote.includes("src/components/site-chrome.tsx"));
  assert.ok(result.wrote.includes("src/components/home-sections.tsx"));
  assert.ok(result.wrote.includes("src/app/brand.generated.css"));
  assert.ok(result.wrote.includes("public/logo.svg"));
  assert.ok(result.wrote.includes("public/brand/hero.jpg"));
  const css = readFileSync(join(root, "src/app/brand.generated.css"), "utf8");
  assert.match(css, /product: share/);
  assert.match(css, /accent: iron/);
  assert.match(css, /--primary: oklch\(0\.38 0\.035 255\)/);
  assert.match(css, /html\.dark/);
});

test("class dark mode uses html.dark and iron accent for share", () => {
  const css = generateCss(tokens, { product: "share", darkMode: "class" });
  assert.match(css, /product: share/);
  assert.match(css, /html\.dark/);
  assert.match(css, /--primary: oklch\(0\.38 0\.035 255\)/);
  assert.doesNotMatch(css, /prefers-color-scheme/);
});
