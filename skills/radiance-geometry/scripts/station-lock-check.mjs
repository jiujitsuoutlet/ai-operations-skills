#!/usr/bin/env node

import fs from "node:fs";

const [beforePath, afterPath, toleranceText] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  throw new Error("usage: node station-lock-check.mjs <before.json> <after.json> [position-tolerance]");
}
const tolerance = Number(toleranceText || 1e-9);

function rows(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const value = Array.isArray(parsed) ? parsed : parsed.stations || parsed.station_state;
  if (!Array.isArray(value)) throw new Error(`${filePath} does not contain a station array`);
  return value;
}

const before = rows(beforePath);
const after = rows(afterPath);
const failures = [];
let maximumPositionDelta = 0;
if (before.length !== after.length) failures.push(`count ${before.length} -> ${after.length}`);

const count = Math.min(before.length, after.length);
for (let index = 0; index < count; index += 1) {
  const left = before[index];
  const right = after[index];
  for (const key of [
    "id",
    "moduleId",
    "i",
    "hitTarget",
    "progressionKey",
    "rollbackPos",
    "station",
  ]) {
    if (JSON.stringify(left[key] ?? null) !== JSON.stringify(right[key] ?? null)) {
      failures.push(`row ${index} ${key} changed`);
    }
  }
  const leftPosition = left.pos || left.position;
  const rightPosition = right.pos || right.position;
  if (!Array.isArray(leftPosition) || !Array.isArray(rightPosition) || leftPosition.length !== rightPosition.length) {
    failures.push(`row ${index} position shape changed`);
    continue;
  }
  const delta = Math.hypot(...leftPosition.map((value, axis) => value - rightPosition[axis]));
  maximumPositionDelta = Math.max(maximumPositionDelta, delta);
  if (delta > tolerance) failures.push(`row ${index} position delta ${delta} exceeds ${tolerance}`);
}

const result = {
  schema: "radiance-station-lock-v1",
  before_count: before.length,
  after_count: after.length,
  position_tolerance: tolerance,
  maximum_position_delta: maximumPositionDelta,
  failures,
  pass: failures.length === 0,
};
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
