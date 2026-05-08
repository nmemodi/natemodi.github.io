# Logo Lab Deferred Work

## Completed

### Agent prompt fixture and evaluation suite

- Completed: 2026-05-07.
- Result: Added the VectorKit brand brief and prompt fixtures, an expected summary snapshot, a reusable gallery evaluator, and tests/CLI coverage through `npm run eval:logo-agent-gallery`.

## Agent Gallery Platform Follow-Ups

### Shared gallery validator extraction

- What: Extract the gallery manifest validation rules shared by `public/logo/gallery/index.html`, `public/logo/gallery-template.html`, and tests into a generated or reusable module.
- Why: The route and template intentionally duplicate some validation today to keep the static artifact portable, but duplication will become risky if the manifest schema evolves.
- Context: Keep the current static route isolated until at least one real agent-generated gallery has shipped.
- Effort estimate: Medium.
- Priority: P2.
- Depends on / blocked by: Wait until validation changes at least once or template drift becomes visible.

### Richer concept metadata

- What: Extend generated concepts with richer style labels, semantic motif tags, and source-preset provenance that agents can use for sharper filtering and recommendations.
- Why: The gallery currently derives filter membership from validated concepts and concise tool metadata; richer tags would make agent-authored galleries feel more curatorial.
- Context: Should come from the existing preset registry rather than handwritten per-gallery metadata.
- Effort estimate: Medium.
- Priority: P2.
- Depends on / blocked by: Requires a compact tag taxonomy that does not turn `explorer.json` into a bloated API.

### Gallery visual exports

- What: Add optional screenshot/export generation for gallery concepts and curated recommendation sets.
- Why: Static iframes are enough for the first release, but share cards, previews, and review workflows would benefit from durable raster snapshots.
- Context: Reuse the existing Logo Lab browser capture scripts if this becomes necessary.
- Effort estimate: Large.
- Priority: P2.
- Depends on / blocked by: Needs a decision on where generated images live and how much binary artifact churn is acceptable.

### Compressed hash payloads

- What: Add optional compressed `#data=` support for small manifests so users can share tiny one-file galleries without hosting JSON.
- Why: It would make lightweight sharing delightful, but it increases URL-length edge cases and validation surface.
- Context: The current implementation supports paste and `?src=` to keep the first release debuggable.
- Effort estimate: Medium.
- Priority: P3.
- Depends on / blocked by: Needs explicit URL size limits, browser compatibility checks, and a graceful fallback for oversized payloads.
