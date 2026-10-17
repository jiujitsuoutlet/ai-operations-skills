#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Validate an Excelsior physical-device frame report")
    parser.add_argument("report", type=Path)
    parser.add_argument("--max-median-ms", type=float, default=33.33)
    parser.add_argument("--max-drop-pct", type=float, default=1.0)
    parser.add_argument("--expected-commit")
    args = parser.parse_args()
    data = json.loads(args.report.read_text())
    errors = []
    if data.get("schema") != "excelsior.device-frame-report.v1":
        errors.append("unexpected schema")
    commit = data.get("app_commit")
    if not commit or commit in {"not supplied", "unknown"}:
        errors.append("app_commit missing")
    if args.expected_commit and commit != args.expected_commit:
        errors.append(f"commit mismatch: {commit}")
    device = data.get("device", {})
    viewport = device.get("viewport_css_px", {})
    for key in ("width", "height"):
        if not viewport.get(key):
            errors.append(f"viewport {key} missing")
    legs = ["map_orbit", "focus_flight", "finger_drag"]
    verdicts = {}
    for leg in legs:
        row = data.get(leg, {})
        median = row.get("median_frame_ms")
        drops = row.get("dropped_frame_pct")
        if median is None or drops is None:
            errors.append(f"{leg} metrics missing")
            continue
        verdicts[leg] = {
            "median_frame_ms": median,
            "p95_frame_ms": row.get("p95_frame_ms"),
            "dropped_frame_pct": drops,
            "long_frame_pct": row.get("long_frame_pct"),
            "worst_frame_ms": row.get("worst_frame_ms"),
            "pass": median <= args.max_median_ms and drops <= args.max_drop_pct,
        }
    output = {
        "valid": not errors,
        "errors": errors,
        "commit": commit,
        "viewport": viewport,
        "cadence": data.get("cadence"),
        "legs": verdicts,
        "overall_pass": not errors and all(row["pass"] for row in verdicts.values()),
    }
    print(json.dumps(output, indent=2))
    raise SystemExit(0 if output["valid"] else 2)


if __name__ == "__main__":
    main()
