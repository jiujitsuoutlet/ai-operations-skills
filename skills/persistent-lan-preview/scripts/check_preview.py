#!/usr/bin/env python3
"""Check LAN preview HTTP reachability and optional commit-bearing health data."""

import argparse
import json
import urllib.error
import urllib.request


def fetch(url, timeout):
    request = urllib.request.Request(url, headers={"User-Agent": "excelsior-preview-check/1"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        body = response.read()
        return {
            "url": url,
            "status": response.status,
            "content_type": response.headers.get("content-type"),
            "bytes": len(body),
            "text": body.decode("utf-8", errors="replace"),
        }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--health-url")
    parser.add_argument("--expected-commit")
    parser.add_argument("--timeout", type=float, default=10)
    args = parser.parse_args()
    results = []
    errors = []
    for url in [args.url, args.health_url]:
        if not url:
            continue
        try:
            results.append(fetch(url, args.timeout))
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            errors.append({"url": url, "error": str(exc)})
    commit_found = None
    if args.expected_commit:
        commit_found = any(args.expected_commit in item["text"] for item in results)
        if not commit_found:
            errors.append({"error": "expected commit not present in fetched responses"})
    report = {
        "status": "PASS" if not errors and all(r["status"] == 200 for r in results) else "FAIL",
        "expected_commit": args.expected_commit,
        "commit_found": commit_found,
        "responses": [{k: v for k, v in r.items() if k != "text"} for r in results],
        "errors": errors,
        "warning": "HTTP proof does not replace a fresh-browser app boot check.",
    }
    print(json.dumps(report, indent=2))
    raise SystemExit(0 if report["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
