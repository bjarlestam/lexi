# Lexi

Liten klient-bara webbapp för spaced repetition av valfritt ämne (glosor, fakta,
o.s.v.). Övningar definieras i en Markdown-fil (default `lessons.md`, kan bytas
via `?lessons=…` i URL:en) och serveras kort för kort. Inget ämne är hårdkodat
i appen – titel, hälsning, tagline och deckId styrs av filens frontmatter.

Inga build-steg. Öppna via `python3 -m http.server` och peka webbläsaren på `index.html`.

## Arkitektur

`app.js` är *värden* och äger bara det som är gemensamt mellan alla uppgiftstyper:

- Hämtar och tolkar Markdown-filen (inkl. frontmatter med deck-metadata)
- SRS-schemaläggning och persistens i `localStorage`, en nyckel per deck
- Den gemensamma kortramen: kapitel, uppgiftsetikett, prompt, tips
- Den generiska "Rätt svar: … / Fortsätt"-panelen vid felsvar

Allt som är specifikt för en viss uppgiftstyp ligger i `exercises/<typ>.js`.

### Lessons-filens frontmatter

Toppen på filen kan innehålla en YAML-ish frontmatter som styr presentation
och SRS-id:

```
---
title: Spanska – repetition
greeting: ¡Hola!
tagline: Spansk repetition
deckId: spanish-v1
---
```

`deckId` används som localStorage-suffix (`lexi-srs:<deckId>`) så olika
lessons-filer får separata SRS-tillstånd. Saknas blocket används filnamnet
som id.

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

## Design
Appen ska vara mobilanpassad, färger m.m. finns specade i DESIGN.md

## PWA / installerbar

Appen är installerbar som PWA på mobil och desktop:

- `manifest.webmanifest` definierar namn, färger, start-URL och ikoner.
- `sw.js` är en network-first service worker som cachar app-skalet (HTML, CSS,
  JS, ikoner, manifest, `lessons.md`) så appen kan startas offline från
  hemskärmen inklusive övningar.
- `icons/` innehåller PNG-ikoner (192/512 för Android, 180 för iOS apple-touch,
  16/32 för favicon). De är genererade från `lexi.png` med `sips`. Om logon
  byts: regenerera ikonerna och bumpa `VERSION`-konstanten i `sw.js` så att
  klienter hämtar den nya app-skals-cachen.
- Servera över HTTPS (eller `localhost`) — service worker registreras inte
  annars. På iOS installeras appen via Safari → Dela → "Lägg till på
  hemskärmen".