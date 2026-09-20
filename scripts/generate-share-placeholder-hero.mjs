#!/usr/bin/env node
/**
 * Writes the labelled share hero placeholder. Not production art.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const rowSize = width * 3;
const padding = (4 - (rowSize % 4)) % 4;
const pixelSize = (rowSize + padding) * height;
const headerSize = 54;
const data = Buffer.alloc(headerSize + pixelSize);

data.write("BM", 0);
data.writeUInt32LE(headerSize + pixelSize, 2);
data.writeUInt32LE(headerSize, 10);
data.writeUInt32LE(40, 14);
data.writeInt32LE(width, 18);
data.writeInt32LE(height, 22);
data.writeUInt16LE(1, 26);
data.writeUInt16LE(24, 28);
data.writeUInt32LE(pixelSize, 34);

for (let y = 0; y < height; y += 1) {
  const yy = y / (height - 1);
  const offset = headerSize + y * (rowSize + padding);
  for (let x = 0; x < width; x += 1) {
    const xx = x / (width - 1);
    const plate = xx > 0.18 && xx < 0.82 && yy > 0.28 && yy < 0.72;
    let r = Math.round(198 + 18 * xx - 12 * yy);
    let g = Math.round(204 + 10 * xx - 8 * yy);
    let b = Math.round(212 + 6 * xx - 4 * yy);
    if (plate) {
      r = 92;
      g = 106;
      b = 122;
      if (xx > 0.22 && xx < 0.78 && yy > 0.34 && yy < 0.66) {
        r = 122;
        g = 136;
        b = 150;
      }
    }
    const i = offset + x * 3;
    data[i] = b;
    data[i + 1] = g;
    data[i + 2] = r;
  }
}

const root = dirname(fileURLToPath(import.meta.url));
const bmp = join(root, "../assets/share/hero.bmp");
const jpg = join(root, "../assets/share/hero.jpg");
writeFileSync(bmp, data);
const converted = spawnSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "70", bmp, "--out", jpg], {
  encoding: "utf8",
});
if (converted.status !== 0) {
  throw new Error(converted.stderr || converted.stdout || "sips failed");
}
console.log(`wrote ${jpg}`);
