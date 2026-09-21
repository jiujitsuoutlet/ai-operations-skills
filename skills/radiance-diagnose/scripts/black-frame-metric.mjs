#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

let PNG;
for (const packagePath of [
  path.join(process.cwd(), "package.json"),
  path.join(process.cwd(), "app/package.json"),
]) {
  try {
    ({ PNG } = createRequire(packagePath)("pngjs"));
    break;
  } catch {}
}
if (!PNG) throw new Error("pngjs is required in the current project or its app/ package");
const imagePaths = process.argv.slice(2);
if (!imagePaths.length) {
  throw new Error("usage: node black-frame-metric.mjs <png> [png ...]");
}

function analyze(imagePath) {
  const png = PNG.sync.read(fs.readFileSync(imagePath));
  let nearBlack = 0;
  let maximumRun = 0;
  let maximumRunRow = -1;
  for (let y = 0; y < png.height; y += 1) {
    let run = 0;
    let rowMaximum = 0;
    for (let x = 0; x < png.width; x += 1) {
      const offset = (y * png.width + x) * 4;
      const black =
        png.data[offset] <= 2 &&
        png.data[offset + 1] <= 2 &&
        png.data[offset + 2] <= 2 &&
        png.data[offset + 3] >= 250;
      if (black) {
        nearBlack += 1;
        run += 1;
        rowMaximum = Math.max(rowMaximum, run);
      } else {
        run = 0;
      }
    }
    if (rowMaximum > maximumRun) {
      maximumRun = rowMaximum;
      maximumRunRow = y;
    }
  }
  const pixelCount = png.width * png.height;
  return {
    path: imagePath,
    width: png.width,
    height: png.height,
    near_black_share: nearBlack / pixelCount,
    longest_near_black_row_run_fraction: maximumRun / png.width,
    longest_near_black_row: maximumRunRow,
    hard_quad_candidate: nearBlack / pixelCount > 0.2 && maximumRun / png.width > 0.85,
  };
}

console.log(JSON.stringify(imagePaths.map(analyze), null, 2));
