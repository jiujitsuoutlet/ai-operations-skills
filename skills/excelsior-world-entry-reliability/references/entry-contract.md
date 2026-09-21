# Learning-world entry contract

## Product target

For an Outlet Academy world selected from the wheel, the member must reach a
recognizable, usable arrival scene in no more than three seconds on the
governed physical iPhone. "Usable" means the selected route remains active,
the return control works, and the first world controls respond. It does not
mean every high-fidelity asset has finished downloading.

If a slice needs a different budget, put the reason and new floor in the
slice contract before implementation. Never relabel a long wait as a
successful load because the final detailed asset eventually appears.

## Architecture rules

1. Keep transition motion independent from world asset completion. A portal
   must continue animating until the target scene is actually ready or a
   defined recovery takes over.
2. Stage delivery. Ship a compact arrival representation first. Defer the
   full-resolution GLB, large textures, dense foliage, and optional scenery
   until after the world is usable. Preserve the canonical source asset for
   fidelity and provenance, but do not require it for first arrival.
3. Keep the old surface visible until the arrival surface can paint. Never
   replace the screen with blank white or a static, fully opaque loader.
4. Route failure locally. A failed optional model retries in the target world
   or uses the arrival representation. It must not fall through to Home or
   erase the selected world state.
5. Handle context loss and asset rejection explicitly. Dispose partial work,
   keep the recovery UI responsive, and provide Retry and Back without a page
   reload.
6. Keep loading copy secondary. It may explain a transient state, but cannot
   become the dominant frozen frame or substitute for visible movement.

## Entry battery

Run the following on the exact candidate, sequentially:

1. Cold entry from each relevant wheel spoke, three times on a physical iPhone
   when available. Record tap-to-first-usable-scene for each run.
2. Confirm all runs meet the stated budget, preserve portal motion, and stay
   in the selected world after fifteen seconds.
3. Exercise delayed or rejected detail-asset delivery. The compact world must
   remain usable, retain its return route, and eventually upgrade or show its
   local recovery control.
4. Exercise a WebGL context loss or equivalent renderer recovery path when
   the platform exposes one. The app must offer recovery instead of redirecting
   to Home.
5. Confirm the whole entry path with real touch input, not synthetic events.
   Test the wheel tap, arrival control, world control, Retry when present, and
   Back.
6. Build the production bundle after the final code change. Inspect the exact
   Vite entry asset hash in a real browser context. A launch failure in the
   test browser blocks that proof and must be reported as such.

## Hosted release check

For Vercel, inspect the intended deployment until it is `Ready`, then check
the stable project alias returns the expected application HTML and entry asset
hash. Give the member the stable alias, not an ephemeral deployment URL. If a
protected preview is used for a founder walk, verify it in a real browser with
the approved access flow. Bare HTTP success can be a protection interstitial
and is not preview identity proof.
