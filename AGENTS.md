# Blog Writing Instructions

These instructions apply when creating or editing posts in `src/pages/blog/`.
Treat the latest approved versions of
`src/pages/blog/focus-shipping-long-game.mdx` and
`src/pages/blog/crypto-founder-advice.mdx` as the primary voice references.

## Voice

- Write like an intelligent founder talking to a thoughtful peer.
- Sound direct, conversational, and confident without sounding grandiose.
- Write a blog post, not a press release, academic paper, manifesto, or
  investor memo.
- Prefer plain language and concrete examples over ornate phrasing.
- Show competence through decisions, evidence, and specific work. Do not
  announce that the author or team is visionary, resilient, or exceptional.
- Admit mistakes, bad timing, and uncertainty plainly. Do not perform false
  humility or weaken claims that the evidence supports.
- Preserve a clear sense of ambition, ability, and long-term orientation.

## Find the Spine First

Before drafting, state the post's governing idea in one plain sentence. If the
piece has several competing theses, choose one and make the others support it
or remove them.

Use a coherent narrative progression. A reliable default is:

1. Give the reader a clear hook and enough framing to care.
2. Explain the problem or missing piece in language a general reader can
   understand.
3. Show the behavior, evidence, or experience that revealed what was real.
4. Explain the strategic interpretation.
5. Describe the decision, tradeoff, or change that followed.
6. End with the earned lesson or present conviction.

Advice posts may use numbered principles, but the sections must still build on
one another. Group observations into a small number of stages rather than
publishing a bag of unrelated tips.

## Paragraph Flow

- Give each paragraph one job.
- Make each paragraph create the reason for the next one.
- Use cause and effect, chronology, or a clear question to hand off between
  paragraphs.
- Put broad framing before company names, protocols, acronyms, and other
  insider details.
- Consolidate repeated statements of the thesis. Say it clearly once, develop
  it, and return to it only when the story has changed its meaning.
- Remove detours even when the sentences are individually good.
- Let the conclusion resolve the opening. Do not attach a generic moral or a
  summary of everything the reader just read.

## Evidence and Precision

- Separate observation, interpretation, and conviction.
- Verify precise statistics, quotations, dates, and named examples before
  publishing. Link to the strongest available source, preferably primary
  research or first-party analysis.
- Scope evidence honestly. A result from one project is not a universal fact.
- Preserve chronology. Do not add evidence published after the post's date
  unless the post is explicitly being updated and redated.
- Do not imply causation when the evidence only shows correlation.
- Metrics do not lie; people misread what the numbers mean. Put interpretive
  errors on the decision-maker, not the data.
- Address important counterexamples when they sharpen the thesis. Replace
  brittle absolutes with a more precise claim, not a cloud of qualifications.
- Prefer one useful number with context over several unsupported statistics.

## Natural Language

- Use concrete nouns and active verbs.
- Vary sentence length. Short sentences should land important points, not turn
  every paragraph into a sequence of slogans.
- Use contractions when they sound natural.
- Explain necessary jargon on first use. Remove jargon that adds no precision.
- Use commas and periods more often than dashes or parenthetical asides.
- Prefer the phrasing a smart person would use aloud over the phrasing that
  looks most polished on a quote card.

Avoid common AI-writing habits:

- generic openings such as "In today's rapidly evolving landscape"
- throat-clearing such as "At its core" or "It is important to note"
- words such as "delve," "navigate," "underscore," "testament," "multifaceted,"
  and "transformative" when a simpler word works
- repeated "not X, but Y" or "not only X, but also Y" constructions
- stacks of three abstract nouns
- overly symmetrical paragraphs and conclusions
- vague claims that something "changes everything"
- unnecessary superlatives and hero worship
- rhetorical questions used as decoration
- motivational slogans that have not been earned by the story
- metaphors that compete with one another

## Humor

- Use real humor as seasoning, not as a second narrator.
- Favor dry, specific observations about shared absurdity.
- Aim jokes at the situation or the author, not at users or an easy target.
- One strong joke in a section is usually enough.
- Do not stack metaphors, force meme language, or interrupt an important claim
  to show that the writing is clever.
- Cut any joke that weakens confidence, obscures causality, or sounds designed
  mainly to become a social post.

## The Cringe and Naivete Pass

Review every substantial draft like a skeptical, long-term operator:

- What is the actual claim?
- Does the evidence support the causal story?
- Would an expert find this naive, obvious, or incorrectly universal?
- Is the author showing competence or merely announcing it?
- Is a recommendation testing conviction, or accidentally testing wealth,
  visibility, status, or access?
- Is one anecdote being stretched into a law?
- Is a sentence trying harder to sound profound than to be true?
- Does the humor make the author sound sharp or smug?
- Does the title promise more certainty than the article can defend?
- Is "being early" an evidence-based conclusion or an excuse to avoid reality?

Make the claim sharper by making it more accurate. Do not hide weak reasoning
behind confidence or hide a strong conclusion behind excessive hedging.

## Collaboration and Publishing

- Treat rewrites as unpublished drafts until the user explicitly says to push
  them live.
- Preserve unrelated work and untracked drafts.
- Make structural changes before polishing individual sentences.
- When the user requests one micro-edit, change only that language unless a
  nearby factual or grammatical error makes a broader edit necessary.
- Incorporate durable feedback into this file so the writing process improves
  across sessions.
- Preserve frontmatter, publication dates, and existing links unless changing
  them is part of the editorial recommendation.
- Before publishing, run the production build and `git diff --check`.
- Commit only the approved post and any other explicitly approved files.
- Push the deployment branch, wait for the Pages workflow, and verify the
  revised language on the public URL.
