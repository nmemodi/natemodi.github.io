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
