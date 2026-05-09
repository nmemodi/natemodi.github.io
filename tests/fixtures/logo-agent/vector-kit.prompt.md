Read these Logo Lab files:

https://natemodi.com/logo/llms.txt
https://natemodi.com/logo/tools.json
https://natemodi.com/logo/explorer.json
https://natemodi.com/logo/agent-rules.md
https://natemodi.com/logo/gallery.schema.json
https://natemodi.com/logo/gallery-template.html

Using `tests/fixtures/logo-agent/vector-kit-brief.json`, generate a custom Explorer-style gallery manifest and page for VectorKit.

Requirements:
- Generate exactly 50 concepts.
- Use at least 5 different Logo Lab tools.
- Seed at least 30 concepts from curated Explorer outputs.
- Every letter-capable concept should use `V`, the leading letter in VectorKit.
- Include at least 10 initial-customized concepts using that leading `V`.
- Include no more than 5 wildcard concepts.
- Group concepts into 3 to 6 named directions.
- Highlight exactly 5 recommended concepts with reasons.
- Use 5 distinct tools in the recommendation set.
- Balance letter/monogram tools and abstract tools across the recommendation set.
- Use canonical `https://natemodi.com/logo/{tool-slug}/#v=1...` URLs only.
- Include the trademark and starting-point disclaimer.
- Do not present concepts as final identity work.

Evaluate the manifest with:

```sh
npm run eval:logo-agent-gallery
```
