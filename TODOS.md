# Travel List Follow-Up TODOs

## 1. Full Keyboard Accessibility (ARIA Listbox Pattern)

**What:** Add arrow key navigation, `role="listbox"`/`role="option"`, and screen reader announcements to the place list.

**Why:** Currently places have `tabindex="0"` and Enter/Space support, which lets keyboard users activate individual places but requires tabbing through all 139 items sequentially. Arrow key navigation would let users move through the list efficiently, and ARIA roles would give screen reader users proper context ("item 3 of 40 in US & Canada").

**Context:** The place list is a `<ul>` with `<li class="travel-place" tabindex="0">` elements grouped by region. The current keyboard handler is in `TravelList.astro`'s `<script>` block — look for the `keydown` event listener. The ARIA pattern to implement is [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/). Key additions: `role="listbox"` on each `<ul>`, `role="option"` on each `<li>`, `aria-activedescendant` for focus management, and arrow key handling that wraps within each region group.

**Depends on:** Nothing — can be done independently.

## 2. Fill Missing Elevation Data (12 Places)

**What:** Find and add elevation data for the 12 places currently showing "—" for elevation.

**Why:** 12 of 139 places (9%) are missing elevation, which makes the stats panel look incomplete for those entries. The affected places are mostly in Japan (Kanazawa, Nozawa Onsen), New Zealand (Queenstown, Raglan), South Korea (Gyeongju), and a few others (Užupis, Fort Kochi, Ella, Jiufen, Pai, Colonia Suiza, Cochamó).

**Context:** The data lives in `src/data/travel-places.json`. Each entry has an `elevation` field (meters, integer). All 12 places have lat/lng coordinates, so you could query the [Open-Meteo Elevation API](https://open-meteo.com/en/docs/elevation-api) (`https://api.open-meteo.com/v1/elevation?latitude=X&longitude=Y`) to batch-fill them. Alternatively, add them to `scripts/fix-missing-data.mjs` as manual patches.

**Depends on:** Nothing — can be done independently.

## 3. Smooth SVG Map Zoom Animation

**What:** Animate the SVG map's viewBox transition when switching between places, instead of the current instant snap.

**Why:** When hovering between places on different continents, the map jumps instantly from one region to another. A smooth ~200ms animation interpolating the viewBox coordinates would make the transition feel polished and help the user maintain spatial orientation.

**Context:** CSS transitions don't work on SVG `viewBox` attributes. The animation needs to use `requestAnimationFrame` to interpolate between the old and new viewBox values over ~200ms. The relevant function is `animateMapTo()` in `TravelList.astro`'s `<script>` block. It currently sets `viewBox` directly via `setAttribute`. To animate: store the current viewBox values, compute the target values, and lerp between them over 10-12 frames. Consider easing (ease-out feels best for zoom). Cancel any in-progress animation when a new place is hovered.

**Depends on:** Nothing — can be done independently.

---

# Logo Lab Follow-Up TODOs

## 4. Per-Permalink OG Image via Edge Worker

**What:** Generate a unique Open Graph preview image for each shared Logo Lab permalink, so Twitter/Bluesky/Slack/Discord unfurls show the actual logo (not a generic site image).

**Why:** The initial shareable-URL rollout ships a single static OG image per tool (e.g., `/public/logo/<tool>/og-image.png`). When a designer shares `natemodi.com/logo/sliced-shapes/#v=1&c=5&bg=111...`, the unfurl still shows the generic tool OG — which kills the "forkable seed" share-conversion loop because the post doesn't show what was actually made. Per-permalink OG = the logo renders inline in every tweet/post. Massive lift in click-through and remix rate.

**Context:** Needs a server — this intentionally breaks the "zero infra" ethos that the initial rollout preserves. Two viable paths: (a) Cloudflare Worker that accepts `?tool=<name>&h=<hash>` and renders PNG via a headless canvas / WASM port of each tool's render code; caches result in R2 keyed by `{tool}:{hash}`. (b) Netlify Edge Function with the same shape. Either way, need to either: port each tool's `renderToCanvas()` to a Node-runnable form, or use Playwright-in-worker to load the tool page at the hash and screenshot. The plan's tool architecture (canonical `state` object + schema + seeded RNG) is designed to make approach (a) feasible. Update `<meta property="og:image">` per page to point to `https://og.natemodi.com/?tool=<x>&h=<hash>` dynamically via a small server-rendered wrapper, OR use a service worker to rewrite meta tags (but JS-disabled crawlers won't see it — so a real server is required).

**Depends on:** Initial shareable-URL PR must ship first (schema + seeded RNG are prerequisites for reproducible server-side render).

## 5. localStorage "My Saved Presets" Library

**What:** Let users bookmark favorite logo configurations inside the tool itself (keyed by tool + label), without needing to copy URLs into notes.

**Why:** Shared permalinks solve cross-user sharing. But a designer iterating on their own work wants a "save this one" button — Randomize → tweak → like it → save → keep exploring → come back. Currently the only save mechanism is "copy URL to clipboard and paste into a doc." localStorage gives a frictionless personal gallery per tool.

**Context:** Store as `localStorage['logo-lab:saved:<toolName>']` = JSON array of `{label, hash, createdAt}`. Add a small "Saved" drawer/menu in each tool (could live inside the existing Export modal as a new tab, or in the pill nav). UI: list of thumbnails (re-render client-side on demand via the hash) + label + delete. "Save current" button stores the canonical permalink. Export: let user dump their saved presets as JSON for backup / migration. No server, no account, no sync — purely local. Works cleanly because the permalink system already provides canonical serialization.

**Depends on:** Initial shareable-URL PR (uses the same schema / encode / decode).

## 6. Consolidate Legacy `/public/letter-maker/` Path

**What:** Consolidate the legacy top-level `/public/letter-maker/` route (which appears to duplicate `/public/logo/parallel-letters/`) without breaking any in-the-wild URLs or the currently-live `/logo/parallel-letters/` tool.

**Why:** Spotted during the shareable-URLs system audit: `/public/letter-maker/index.html` sits outside the `/logo/` namespace reorganization done in PR #7. It predates that reorg. Leaving it behind means: two sources of truth to update when the tool changes, confusion for new contributors, dead code risk. Cleanup is hygiene, not urgent.

**Context:** Do NOT delete `/public/logo/parallel-letters/` — that's the canonical path the pill nav, design-system rollout, and future shareable-URL wiring all point to. Safe moves: (a) verify `/letter-maker/` is in fact a duplicate / superseded by `/logo/parallel-letters/` (diff the two index.html files; the legacy one may lack the shared design system and export engine). (b) Replace `/public/letter-maker/index.html` with a minimal HTML file that `<meta http-equiv="refresh">` or JS-redirects to `/logo/parallel-letters/` (preserves any bookmarks / inbound links from old posts). (c) Alternatively, for true cleanup once you're confident nothing links to it, delete outright and rely on the 404 page.

**Depends on:** Nothing — independent of shareable-URLs work.

## 7. Visual Snapshot Baseline Maintenance

**What:** Keep Playwright visual-regression snapshots up to date as logo tools evolve, via a documented `npm run test:visual:update` flow.

**Why:** The shareable-URLs PR ships visual-regression tests that render each tool at a set of "golden" permalinks and diff against baseline PNGs. Those baselines go stale any time you intentionally change a tool's render (new slider, bug fix that shifts pixels, font swap). Without a clear update flow, future-you hits red CI on a legit change and has no idea whether the diff is a regression or an expected update.

**Context:** Add a `test:visual:update` script in `package.json` that runs Playwright with `--update-snapshots`. Document in `README.md` or a new `TESTING.md`: when to run it (only for intentional render changes), how to review the diff (git diff of PNGs in a baseline dir), where baselines live (`tests/__snapshots__/` or similar). Recommend a per-browser subdir (Chromium + WebKit baselines differ for canvas anti-aliasing). Pair with a PR-template checkbox: "If visual baselines changed, I confirm the new rendering is intentional."

**Depends on:** Initial shareable-URLs PR (this tooling is established there).
