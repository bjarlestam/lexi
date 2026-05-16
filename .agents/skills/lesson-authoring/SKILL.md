# Lesson Authoring

Use this guide when creating or editing exercise Markdown for this project. Follow the existing `lessons.md` style: frontmatter, chapter headings, then a YAML-ish list of exercise blocks.

## File Shape

Start with frontmatter unless editing an existing file:

```markdown
---
title: Spanska
greeting: ¡Hola!
tagline: Spanska
deckId: spanish-v1
---

# Kapitel 1 - Tema
```

Keep `deckId` stable for an existing deck so saved SRS progress stays separate and predictable. Use `#` headings for chapters; the current chapter becomes part of each card's stable id.

## Exercise Types

### `mc` - Multiple Choice

Use for quick recognition or translation checks. It must have exactly 4 options. `correct` is a zero-based index, or use `answer` if it exactly matches one option.

```markdown
- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "god morgon"
  back: "Buenos días"
  prompt: "god morgon"
  options:
    - "Buenas noches"
    - "Buenos días"
    - "gracias"
    - "hasta luego"
  correct: 1
```

### `assemble` - Build the Sentence

Use for production practice: the learner builds the answer from word tokens. Always include `pool` explicitly; it should contain all answer tokens plus 2-4 plausible distractors.

```markdown
- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "¿Qué tal?"
  answer: "Hur är det?"
  pool:
    - "Hur"
    - "är"
    - "det?"
    - "tack"
    - "du"
```

### `pairs` - Matching Pairs

Use for grouped vocabulary practice. `left[i]` matches `right[i]`. Use 2-8 pairs; 4 is usually comfortable on mobile.

```markdown
- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "hej"
    - "tack"
    - "god kväll"
    - "hej då"
  right:
    - "hola"
    - "gracias"
    - "buenas noches"
    - "adiós"
```

## Variation Rules

- Do not place more than 3 exercises of the same `type` in a row.
- Mix directions (`sv_es` and `es_sv`) when the subject allows it.
- Alternate easy recognition (`mc`) with more active recall (`assemble`) and grouped review (`pairs`).
- Put related items near each other, but avoid testing the exact same phrase in the exact same way twice.
- For `mc`, make distractors plausible but clearly wrong: same topic, similar length, not trick answers.
- For `assemble`, keep answers short enough to tap comfortably on mobile unless the goal is sentence practice.
- For `pairs`, group words by theme and avoid pairs where two right-side answers could reasonably fit the same left-side prompt.

## Authoring Checklist

- Preserve existing frontmatter unless intentionally creating a new deck.
- Quote strings that include punctuation, inverted Spanish marks, colons, or leading/trailing spaces.
- Keep task labels short and action-oriented, for example `"Vad betyder det här?"`, `"Översätt till spanska"`, `"Bygg meningen"`.
- Prefer small batches per chapter: introduce, recognize, produce, then review with pairs.
- After editing, scan for invalid blocks: `mc` needs 4 options, `pairs` lists need equal length, and `assemble` should include `prompt`, `answer`, and an explicit `pool`.
