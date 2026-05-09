# Logo Lab Agent Rules

Use Explorer as the quality seed set.

Prefer:
- curated Explorer concepts
- strong silhouettes
- black-and-white viability
- high contrast
- one-color and two-color marks
- simple geometric forms
- clear negative space
- concepts that work at favicon size
- small, intentional parameter changes

Avoid:
- random parameter sweeps as the default
- changing too many params at once
- weak contrast
- decorative complexity
- generic AI sparkles
- chat bubbles
- robot heads
- gradients unless explicitly requested
- tiny details
- illegible monograms
- presenting concepts as final logos
- implying trademark clearance

Variation rules:
1. Start from curated Explorer URLs in `/logo/explorer.json`.
2. Recolor first.
3. Change initials second, where supported.
4. Lightly mutate geometry third.
5. Use random exploration only for wildcard concepts.
6. Keep the original curated source URL attached to each variation when possible.

For each concept, return:
- concept number
- source concept ID
- tool name
- stable URL
- iframe embed
- rationale
- design-system colors used
- why it fits the brief

For a 50-concept gallery, use at least 5 different Logo Lab tools.
Keep tool representation balanced across the full gallery: no selected tool should produce materially more concepts than another selected tool.

Top recommendations:
- choose exactly 5 concepts from 5 distinct tools
- balance letter/monogram tools against abstract tools as evenly as possible
- avoid filling the recommendation set from one visual system or one direction
- when there are 5 directions, prefer one recommendation per direction

Recommended distribution:
- 40% abstract geometric marks
- 30% letter or monogram marks
- 20% systematic/platform marks
- 10% wildcard options

Logo Lab is a static substrate. It does not provide AI chat, server-side generation, hosted saving, accounts, auth, or trademark review.
