# Design system — *Vibrant Castillian*

Designspecifikation för Spanska-repetitionsappen. Dokumentet är *källan*: när
designen och `styles.css` skiljer sig åt så är detta dokument det som
gäller och koden ska följa efter.

## 1. Färgpalett

Fyra grundfärger med var sin 10-stegs ramp (50 → 900). Bas-stegget i fet stil
är det som används som default och som i koden mappas till
`--primary` / `--secondary` / `--tertiary` / neutrala variabler.

### Primary — frisk grön (action / framgång)

| Steg | Hex       | Användning                                    |
| ---- | --------- | --------------------------------------------- |
| 50   | `#EBF7EE` | Mycket ljus bakgrund, hover/soft fills        |
| 100  | `#D3EFDB` | Tags, lugna bakgrunder                        |
| 200  | `#A9DEB7` |                                               |
| 300  | `#7FCD93` |                                               |
| 400  | `#55BC6F` |                                               |
| **500** | **`#2D963F`** | **Bas — primärknapp, accent, progressfyllning** |
| 600  | `#267E36` | Hover / pressed                               |
| 700  | `#1F662C` | Mörkare text på ljus yta                      |
| 800  | `#184E23` |                                               |
| 900  | `#113619` |                                               |

### Secondary — varm orange (highlight / "nu")

| Steg | Hex       | Användning                                  |
| ---- | --------- | ------------------------------------------- |
| 50   | `#FFF3E6` | Soft fill, t.ex. `Nu`-pillen                |
| 100  | `#FFE2BF` |                                             |
| 200  | `#FFC580` |                                             |
| 300  | `#FFA840` |                                             |
| 400  | `#FF9520` |                                             |
| **500** | **`#FF8A00`** | **Bas — accent, "nu att repetera"-badge**  |
| 600  | `#D67400` |                                             |
| 700  | `#AD5D00` |                                             |
| 800  | `#854700` |                                             |
| 900  | `#5C3100` |                                             |

### Tertiary — cyan (info / poäng / bonus)

| Steg | Hex       | Användning                                  |
| ---- | --------- | ------------------------------------------- |
| 50   | `#E3F8FC` |                                             |
| 100  | `#BFF0F8` |                                             |
| 200  | `#8AE3F1` |                                             |
| 300  | `#55D6EA` |                                             |
| 400  | `#34CDE6` |                                             |
| **500** | **`#1CC2E3`** | **Bas — poängbadge, milstolpe-progress**   |
| 600  | `#12A0C4` | Hover på poängbadge                         |
| 700  | `#0E81A0` |                                             |
| 800  | `#0A627B` |                                             |
| 900  | `#064456` |                                             |

### Neutral — grå (text / ytor / kanter)

| Steg | Hex       | Användning                                  |
| ---- | --------- | ------------------------------------------- |
| 50   | `#FAFAFB` | Subtil bakgrund                             |
| 100  | `#F5F5F7` | App-bakgrund (`body`)                       |
| 200  | `#E8E8EA` | Kanter, dividers, tomma progress-segment    |
| 300  | `#D0D0D3` |                                             |
| 400  | `#9C9CA0` |                                             |
| **500** | **`#6B6B6B`** | **Sekundär text**                          |
| 600  | `#585858` |                                             |
| 700  | `#4A4A4A` | Primär text på ljusa ytor (utöver `900`)    |
| 800  | `#2D2D2E` |                                             |
| 900  | `#1A1A1A` | Brödtext, rubriker                          |

### Semantiska tokens

| Token              | Värde                       | Notering                                      |
| ------------------ | --------------------------- | --------------------------------------------- |
| `surface`          | `#FFFFFF`                   | Kort, paneler                                 |
| `surface-soft`     | `neutral-50`                | Hover-/dragna ytor                            |
| `text`             | `neutral-900`               | Brödtext, rubriker                            |
| `text-muted`       | `neutral-500`               | Hjälptext, labels                             |
| `border`           | `neutral-200`               | Kanter, dividers                              |
| `again` / fel      | `#E53935` (hover `#C62828`) | Fel svar, varning                             |
| `good` / rätt      | `primary-500`               | Rätt svar, bekräftelse                        |
| `focus-ring`       | `tertiary-500` 55 % opacitet, 3 px outline, 2 px offset | Tangentbordsfokus (`:focus-visible`) |

## 2. Typografi

Två familjer. Lexend är den distinkta display-fonten, Plus Jakarta Sans används
för allt brödtext, labels och knappar.

| Roll        | Familj                                | Vikt        | Spårning      | Exempel                        |
| ----------- | ------------------------------------- | ----------- | ------------- | ------------------------------ |
| Headline    | `Lexend`                              | 700         | -0.02em       | Sektionsrubriker, hero         |
| Body        | `Plus Jakarta Sans`                   | 400 / 500   | 0             | Brödtext                       |
| Label       | `Plus Jakarta Sans`                   | 600 / 700   | 0.05–0.07em uc | Knappar, små etiketter        |
| Numeric     | `Plus Jakarta Sans` + `tabular-nums`  | 700         | -0.02em       | Räknare, poäng                 |

Båda familjerna laddas via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
```

Skala (mobil):

| Token       | Storlek    | Radhöjd | Användning                  |
| ----------- | ---------- | ------- | --------------------------- |
| `display`   | 2.25rem    | 1.1     | Stora siffror, hero         |
| `h1`        | 1.5rem     | 1.2     | Sidrubrik                   |
| `h2`        | 1.2rem     | 1.25    | Kortrubrik (`Redo att öva?`)|
| `body-lg`   | 1rem       | 1.5     | Brödtext                    |
| `body`      | 0.9375rem  | 1.5     |                             |
| `label`     | 0.75rem    | 1.35    | Pillar, taggar (uppercase)  |
| `caption`   | 0.7rem     | 1.3     | Mikrotext                   |

## 3. Komponenter

### Knappar

Fyra varianter, alla med pillerform och min-höjd 48 px (`--tap-min`).

| Variant      | Bakgrund               | Text             | Kant / övrigt                |
| ------------ | ---------------------- | ---------------- | ---------------------------- |
| **Primary**  | `primary-500`          | `#FFFFFF`        | Skugga `shadow-cta`          |
| **Secondary**| `primary-100`          | `primary-700`    | Ingen kant                   |
| **Inverted** | `neutral-900`          | `#FFFFFF`        |                              |
| **Outlined** | `transparent`          | `neutral-700`    | `1.5px` kant `neutral-200`   |

States:

- **Hover** mörkare av samma färg (primary-600, neutral-50 på outlined).
- **Pressed** sänkt skugga + 96 % skala.
- **Disabled** 45 % opacitet, ingen cursor.

### Ikonknappar

- Cirkelform, diameter 44 px (kompakta 36 px finns för kontextmenyer).
- Bakgrundsvarianter: Primary, Secondary, Tertiary, Neutral, Destruktiv (`#E53935`).
- Ikonen är alltid vit, 20 px.

### Input — sökfält

- Bakgrund `neutral-100`, kantradie 999 px.
- Ikon vänster (`neutral-500`), placeholder `neutral-500`.
- Höjd 44 px, padding `0 16px`.
- Fokus: kant 1.5 px `tertiary-500` + 4 px ring (35 % opacitet).

### Progress / framsteg

Tre stilar visas i designen:

1. **Bar (tunn)** — höjd 6 px, kantradie pill, fyllning gradient `primary → tertiary`.
2. **Bar (medel)** — höjd 8 px för dashboard-paneler.
3. **Segmenterad** — 5 segment, 6 px höga, gap 4 px. Använd för diskreta delmål
   (t.ex. "Nästa bonus 3/5").

Färger på fyllning:

- Standard progress: `primary-500` solid eller gradient `primary → tertiary`.
- Sekundär progress: `secondary-500` solid.
- Info / bonus: `tertiary-500` solid.

### Bottom-nav (om/när vi inför den)

- 64 px hög rad, vit yta, top-skugga `0 -4px 16px rgba(0,0,0,0.05)`.
- Aktiv flik: cirkulär `primary-500` bakgrund runt ikonen, vit ikon, etikett under.
- Inaktiv flik: ikon `neutral-500`, etikett `neutral-500`.

### Kort & paneler

| Token              | Värde                                   |
| ------------------ | --------------------------------------- |
| `radius-panel`     | 16 px                                   |
| `radius-btn`       | 14 px                                   |
| `radius-pill`      | 999 px                                  |
| `shadow-sm`        | `0 2px 8px rgba(26, 26, 26, 0.06)`      |
| `shadow-card`      | `0 8px 28px rgba(26, 26, 26, 0.1)`      |
| `shadow-cta`       | `0 12px 32px rgba(45, 150, 63, 0.28)`   |

### Spacing-skala

Bas 4 px. Vanliga steg:

| Token  | Värde   |
| ------ | ------- |
| `xs`   | 4 px    |
| `sm`   | 8 px    |
| `md`   | 12 px   |
| `lg`   | 16 px   |
| `xl`   | 24 px   |
| `2xl`  | 32 px   |
| `3xl`  | 48 px   |

## 4. Motion

Generella tider:

- **Mikro** 120–180 ms (hover, fokus).
- **Standard** 250–350 ms (paneler, övergångar).
- **Pop / belöning** 450–600 ms cubic-bezier `(0.34, 1.5, 0.5, 1)`.
- **Celebration overlay** 2,6 s totalt (in 0,4 s → håll → ut 0,35 s).

Vid `prefers-reduced-motion: reduce`: stäng av rotationer/skala-pop, ersätt med
diskret opacitetsförändring.

## 5. Mappning till CSS-variabler

Befintliga variabler i `styles.css` med rekommenderade justeringar för att matcha designen.

| CSS-variabel      | Idag (kod) | Spec (denna fil) | Status                            |
| ----------------- | ---------- | ---------------- | --------------------------------- |
| `--primary`       | `#2d963f`  | `#2D963F`        | OK                                |
| `--primary-dark`  | `#267e36`  | `#267E36`        | OK                                |
| `--primary-soft`  | `#ebf7ee`  | `#EBF7EE`        | OK                                |
| `--secondary`     | `#ff8a00`  | `#FF8A00`        | OK                                |
| `--secondary-soft`| `#fff3e6`  | `#FFF3E6`        | OK                                |
| `--tertiary`      | `#1cc2e3`  | `#1CC2E3`        | OK                                |
| `--neutral-900`   | `#1a1a1a`  | `#1A1A1A`        | OK                                |
| `--neutral-700`   | `#4a4a4a`  | `#4A4A4A`        | OK                                |
| `--neutral-500`   | `#6b6b6b`  | `#6B6B6B`        | OK                                |
| `--neutral-200`   | `#e8e8ea`  | `#E8E8EA`        | OK                                |
| `--neutral-100`   | `#f5f5f7`  | `#F5F5F7`        | OK                                |
| `--font`          | Plus Jakarta Sans | Plus Jakarta Sans | OK                          |
| `--font-display`  | Lexend     | Lexend           | OK                                |
| `--focus-ring-*`  | tertiary 55 %, 3 px outline, 2 px offset | tertiary 55 %, 3 px, 2 px | OK |
| `--primary-{50..900}`  | finns      | finns            | OK (full ramp)               |
| `--secondary-{50..900}`| finns      | finns            | OK                           |
| `--tertiary-{50..900}` | finns      | finns            | OK                           |
| `--neutral-{50..900}`  | finns      | finns            | OK                           |

Existerande aliasen (`--primary`, `--primary-dark`, `--primary-soft`, `--secondary`,
`--secondary-soft`, `--tertiary`, `--good`, `--good-hover`) pekar nu på respektive
rampsteg och kan användas som genvägar.

## 6. Tillgänglighet

- **Kontrast:** all text uppfyller WCAG AA (4.5:1) mot sin bakgrund. Primary-500 på vitt = 4.6:1 ✓.
- **Tap targets:** alla interaktiva element ≥ 44 × 44 px (helst 48).
- **Fokus:** synlig ring (tertiary 35 %) på alla fokuserbara element, även vid mus-fokus om användaren tabbar.
- **Reduced motion:** följ `prefers-reduced-motion`.

## 7. Att göra (sync mellan kod och spec)

- [x] Uppdatera `--primary` och `--primary-dark` till spec-värdena.
- [x] Lägg in Lexend i `<head>` och introducera `--font-display`.
- [x] Använd `--font-display` på `.top-bar__hello`, `.cta-card__title`, `.flashcard__prompt`.
- [x] Definiera fullständig 50–900 ramp som CSS-variabler i `:root`.
- [x] Explicit `:focus-visible`-stil på `.btn`, `.mc-option`, `.pairs-token`, `.asm-token`.
