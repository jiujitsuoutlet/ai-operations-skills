#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const [mode, configPath, snapshotPath, ...flags] = process.argv.slice(2);
if (!mode || !configPath || !snapshotPath || !["snapshot", "check"].includes(mode)) {
  throw new Error("usage: node frozen-pipeline-guard.mjs <snapshot|check> <targets.json> <snapshot.json> [--replace]");
}
const root = process.cwd();
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
if (!Array.isArray(config.targets) || !config.targets.length) throw new Error("targets.json must contain targets[]");

function select(target) {
  const filePath = path.resolve(root, target.path);
  const content = fs.readFileSync(filePath, "utf8");
  let selected = content;
  let startOffset = 0;
  let endOffset = content.length;
  if (target.start != null) {
    startOffset = content.indexOf(target.start);
    if (startOffset < 0) throw new Error(`${target.name}: start marker not found in ${target.path}`);
  }
  if (target.end != null) {
    const markerOffset = content.indexOf(target.end, startOffset);
    if (markerOffset < 0) throw new Error(`${target.name}: end marker not found in ${target.path}`);
    endOffset = markerOffset + target.end.length;
  }
  if (endOffset <= startOffset) throw new Error(`${target.name}: invalid marker order`);
  selected = content.slice(startOffset, endOffset);
  return {
    name: target.name,
    path: target.path,
    start: target.start ?? null,
    end: target.end ?? null,
    bytes: Buffer.byteLength(selected),
    sha256: crypto.createHash("sha256").update(selected).digest("hex"),
  };
}

const current = config.targets.map(select);
if (mode === "snapshot") {
  if (fs.existsSync(snapshotPath) && !flags.includes("--replace")) {
    throw new Error(`${snapshotPath} exists; pass --replace only after an authorized baseline change`);
  }
  const snapshot = {
    schema: "frozen-pipeline-snapshot-v1",
    created_at: new Date().toISOString(),
    root,
    targets: current,
  };
  fs.writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(JSON.stringify({ pass: true, mode, snapshot: snapshotPath, targets: current.length }, null, 2));
} else {
  const expected = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
  const expectedByName = new Map(expected.targets.map((target) => [target.name, target]));
  const results = current.map((target) => {
    const baseline = expectedByName.get(target.name);
    return {
      name: target.name,
      path: target.path,
      expected_sha256: baseline?.sha256 || null,
      actual_sha256: target.sha256,
      pass: Boolean(baseline) && baseline.sha256 === target.sha256,
    };
  });
  for (const baseline of expected.targets) {
    if (!current.some((target) => target.name === baseline.name)) {
      results.push({ name: baseline.name, path: baseline.path, expected_sha256: baseline.sha256, actual_sha256: null, pass: false });
    }
  }
  const output = { schema: "frozen-pipeline-check-v1", pass: results.every((result) => result.pass), results };
  console.log(JSON.stringify(output, null, 2));
  if (!output.pass) process.exitCode = 1;
}
