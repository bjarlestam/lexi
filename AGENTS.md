# Spanish homework

Liten klient-bara webbapp för spaced repetition av spanska glosor. Övningar definieras
i en Markdown-fil (`exercises-small.md` eller `exercises.md`) och serveras kort för kort.

Inga build-steg. Öppna via `python3 -m http.server` och peka webbläsaren på `index.html`.

## Arkitektur

`app.js` är *värden* och äger bara det som är gemensamt mellan alla uppgiftstyper:

- Hämtar och tolkar Markdown-filen
- SRS-schemaläggning och persistens i `localStorage`
- Den gemensamma kortramen: kapitel, uppgiftsetikett, prompt, tips
- Den generiska "Rätt svar: … / Fortsätt"-panelen vid felsvar

Allt som är specifikt för en viss uppgiftstyp ligger i `exercises/<typ>.js`.

### Registret

`exercises/registry.js` exponerar `window.ExerciseTypes` med:

- `register(handler)` – varje typ-fil anropar denna vid load
- `get(type)` – slår upp en handler
- `util` – delade parsing-/hashning-/shuffle-hjälpare, bl.a. `readBlock` som
  läser en YAML-ish lista av `key: value`-rader (med stöd för indenterade `- item`-listor)

### Handler-kontraktet

En handler är ett vanligt objekt:

```js
ExerciseTypes.register({
  type: 'mc',
  parseBlock(lines, startIdx, ctx),    // -> { card, nextIdx }
  isValid(card),                       // -> boolean
  getSignature(card),                  // -> string (matas in i hashId för att ge stabil SRS-id)
  resolveTaskLabel(card, idStr),       // -> string visad ovanför prompten
  render(zoneEl, card, hooks),         // ritar interaktiv UI i zoneEl
});
```

`render` får tre hooks för att rapportera utfall till värden:

- `hooks.acceptCorrect()` – rätt svar (värden schemalägger "knew" efter en kort delay)
- `hooks.acceptWrong({ correctText })` – fel svar (värden visar facit + Fortsätt)
- `hooks.skip()` – användaren hoppade över (värden räknar som "miss")

### Lägga till en ny uppgiftstyp

1. Skapa `exercises/<typ>.js` och registrera en handler enligt kontraktet ovan.
2. Lägg till `<script src="exercises/<typ>.js"></script>` i `index.html` **före** `app.js`.
3. Lägg till eventuella CSS-klasser i `styles.css` (prefixa gärna med typens namn).
4. Skriv exempel-uppgifter i Markdown-filen med `- type: <typ>`.

Befintliga typer:

- `mc` – fyrval (multiple choice). Källkort `front`/`back`, fyra `options`, ett `correct`-index.
- `assemble` – bygg meningen från en ordbank. `prompt`, `answer` (och valfri `pool`).

## SRS-id:n

Varje korts id härleds genom `util.hashId(handler.getSignature(card))`. För att
behålla SRS-historik vid omskrivningar måste `getSignature` returnera samma sträng
för "samma" kort. MC använder bakåtkompatibel `chapter + front + back + 'flip'`.
