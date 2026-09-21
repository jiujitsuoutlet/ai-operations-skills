---
name: persistent-lan-preview
description: Build and serve an exact Excelsior production commit over the local network in a persistent, device-walkable way. Use when a founder needs LAN walk URLs, device-recorder URLs, stable service survival between sessions, current IP or Bonjour hostname, health verification, fresh-WebKit boot proof, server-crash diagnosis, or confirmation that the served dist is not stale.
---

# Persistent LAN Preview

An HTTP 200 is necessary but never sufficient. Prove the intended app boots from the intended build.

## Build and identify

1. Build production from the exact branch and commit. Embed the full commit in the app/recorder artifact.
2. Record build timestamp, dist hash, feature flags, query contract, and expected runtime assets.
3. Inspect the built bundle for the governed feature or probe code before serving it.

## Serve persistently

1. Bind to `0.0.0.0` on the ruled port.
2. Run independently of the interactive shell using the platform's persistent service manager, preferably a user LaunchAgent on macOS. Capture stdout/stderr to stable log files.
3. Serve a health endpoint that returns commit, build timestamp, service start time, and dist path.
4. Serve the recorder receiver persistently when device artifacts must post back.

## Verify before handoff

1. Run `scripts/check_preview.py` against the walk URL and health endpoint.
2. Load the exact URL in a fresh WebKit context. Confirm console health, world-ready state, GLB/assets fetched, correct query parameters, and expected visual feature state.
3. Verify reachability from another LAN device when possible. Loopback alone does not prove device reachability.
4. Report current LAN IP and a Bonjour `.local` hostname. A hostname reduces link churn but is not a substitute for confirming resolution.

## Diagnose failures

Check the process state and logs before restarting. Distinguish process exit, session cleanup, stale dist, OOM, port conflict, routing failure, and app boot failure. Repoint or rebuild stale services and re-run fresh-WebKit verification.

Follow [references/service-law.md](references/service-law.md). Give plain-text, copy-paste-ready URLs and name the served branch and commit.
