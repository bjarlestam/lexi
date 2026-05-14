/**
 * Reads a markdown file with `- type: mc` cards and rewrites it as a mix of
 * `mc`, `assemble` and `pairs` so the user sees variation while studying.
 *
 *   * Cards with a single-word answer can become mc OR be combined into a
 *     pairs exercise (4 short cards -> 1 pairs).
 *   * Cards with a multi-word answer become assemble exercises (you build
 *     the sentence from a word bank).
 *   * No more than three consecutive exercises of the same type.
 *
 * Run with:
 *   node scripts/diversify-exercises.mjs [path-to-md]
 *
 * Defaults to exercises-spanish.md. Writes back to the same file.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const inputArg = process.argv[2];
const mdPath = path.resolve(root, inputArg || 'exercises-spanish.md');

const MAX_STREAK = 3;
const MIN_PAIRS_GROUP = 4;
const PAIRS_PER_X_SHORT = 5; // one pairs per ~5 short-answer cards
const MAX_PAIRS_PER_CHAPTER = 4;
const ASSEMBLE_DISTRACTORS = 3;
const ASSEMBLE_MIN_TOKENS = 3; // shorter answers stay as mc (la chica, Buenos días)

// ---------- parsing ----------

function stripQuotes(raw) {
  const t = raw.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return t;
}

function normKey(s) {
  return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
}

function parseMcCards(text) {
  const lines = text.split(/\r?\n/);
  let chapter = 'Övrigt';
  const out = [];
  let i = 0;
  let inHtmlComment = false;

  while (i < lines.length) {
    const line = lines[i];
    if (inHtmlComment) {
      if (line.includes('-->')) inHtmlComment = false;
      i++;
      continue;
    }
    const ts = line.trim();
    if (ts.startsWith('<!--')) {
      if (!ts.includes('-->')) inHtmlComment = true;
      i++;
      continue;
    }
    const ch = line.match(/^# ([^#].*)$/);
    if (ch) {
      chapter = ch[1].trim();
      i++;
      continue;
    }
    if (/^\s*-\s*type:\s*mc\b/.test(line)) {
      const card = {
        chapter,
        direction: 'sv_es',
        task: '',
        front: '',
        back: '',
        prompt: '',
        hint: '',
        options: [],
        correctIndex: -1,
      };
      i++;
      while (i < lines.length) {
        const L = lines[i];
        if (/^\s*-\s*type:\s*\w+/.test(L)) break;
        if (/^# /.test(L)) break;
        const kv = L.match(/^\s{2,}(\w+):\s*(.*)$/);
        if (kv) {
          const key = kv[1].toLowerCase();
          const val = kv[2];
          if (key === 'options' && val === '') {
            i++;
            while (i < lines.length) {
              const Lo = lines[i];
              if (!Lo.trim()) {
                i++;
                continue;
              }
              const opt = Lo.match(/^\s{4,}-\s+(.+)$/);
              if (opt) {
                card.options.push(stripQuotes(opt[1].trim()));
                i++;
                continue;
              }
              if (/^\s{2,}\w/.test(Lo)) break;
              if (/^\s*-\s*type:/.test(Lo)) break;
              if (/^# /.test(Lo)) break;
              i++;
            }
            continue;
          }
          const v = stripQuotes(val);
          if (key === 'front') card.front = v;
          else if (key === 'back') card.back = v;
          else if (key === 'prompt') card.prompt = v;
          else if (key === 'hint') card.hint = v;
          else if (key === 'task') card.task = v;
          else if (key === 'direction' && (v === 'sv_es' || v === 'es_sv')) card.direction = v;
          else if (key === 'correct') {
            const ci = parseInt(v, 10);
            if (!isNaN(ci)) card.correctIndex = ci;
          }
        }
        i++;
      }
      if (!card.prompt && card.front && card.back) {
        card.prompt = card.direction === 'sv_es' ? card.front : card.back;
      }
      if (card.front && card.back) out.push(card);
      continue;
    }
    i++;
  }
  return out;
}

// ---------- classification ----------

function answerSide(card) {
  return card.direction === 'sv_es' ? card.back : card.front;
}

function promptSide(card) {
  return card.direction === 'sv_es' ? card.front : card.back;
}

function tokenize(s) {
  return String(s).trim().split(/\s+/).filter(Boolean);
}

function isShortAnswer(card) {
  // For pairs we want a single concept: 1 or 2 tokens.
  return tokenize(answerSide(card)).length <= 2;
}

function hasMessyChars(s) {
  // Parens, slashes and ellipses signal clarifiers ("hej (informellt)",
  // "god kväll / god natt", "Me llamo …") that don't reassemble into a clean
  // sentence from a word bank.
  return /[()…\/]/.test(s) || s.includes('...');
}

function isAssembleCandidate(card) {
  const ans = answerSide(card);
  const tokens = tokenize(ans);
  if (tokens.length < ASSEMBLE_MIN_TOKENS) return false;
  if (hasMessyChars(ans)) return false;
  return true;
}

// ---------- pairs grouping ----------

/** Pick groups of 4 short-answer cards from this chapter to become pairs. */
function pickPairsGroups(chapterCards) {
  const shorts = chapterCards.filter(isShortAnswer);
  if (shorts.length < MIN_PAIRS_GROUP) return [];
  let n = Math.floor(shorts.length / PAIRS_PER_X_SHORT);
  if (n === 0 && shorts.length >= MIN_PAIRS_GROUP) n = 1;
  n = Math.min(n, MAX_PAIRS_PER_CHAPTER);

  // Spread the groups evenly across the chapter's short list.
  const groups = [];
  const stride = Math.max(MIN_PAIRS_GROUP, Math.floor(shorts.length / n));
  for (let g = 0; g < n; g++) {
    const start = g * stride;
    const group = shorts.slice(start, start + MIN_PAIRS_GROUP);
    if (group.length === MIN_PAIRS_GROUP && hasUniqueSides(group)) {
      groups.push(group);
    }
  }
  return groups;
}

function hasUniqueSides(group) {
  const lefts = new Set();
  const rights = new Set();
  for (const c of group) {
    const l = normKey(c.front);
    const r = normKey(c.back);
    if (lefts.has(l) || rights.has(r)) return false;
    lefts.add(l);
    rights.add(r);
  }
  return true;
}

// ---------- assemble pool building ----------

function buildAssemblePool(card, chapterCards) {
  const direction = card.direction;
  const answerTokens = tokenize(answerSide(card));
  const answerNormSet = new Set(answerTokens.map(normKey));
  const distractors = new Set();
  for (const other of chapterCards) {
    if (other === card) continue;
    const otherAns = direction === 'sv_es' ? other.back : other.front;
    for (const t of tokenize(otherAns)) {
      if (hasMessyChars(t)) continue;
      const nk = normKey(t);
      if (!nk || answerNormSet.has(nk)) continue;
      distractors.add(t);
    }
  }
  // Stable deterministic pick: sort, then take the first N by simple hash of (card.front + token).
  const distractorList = Array.from(distractors);
  distractorList.sort((a, b) => seedHash(card.front + '|' + a) - seedHash(card.front + '|' + b));
  const picked = distractorList.slice(0, ASSEMBLE_DISTRACTORS);
  return [...answerTokens, ...picked];
}

function seedHash(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// ---------- per-chapter planning ----------

function planChapter(chapterCards, streakState) {
  const pairsGroups = pickPairsGroups(chapterCards);
  const inPairs = new Set();
  for (const g of pairsGroups) for (const c of g) inPairs.add(c);

  // Bucket atoms by type, preserving original order within each bucket.
  const mcQ = [];
  const assembleQ = [];
  const pairsQ = [];
  const seenGroup = new Set();
  for (const card of chapterCards) {
    if (inPairs.has(card)) {
      const g = pairsGroups.find((gr) => gr.includes(card));
      if (g[0] === card && !seenGroup.has(g)) {
        pairsQ.push({ type: 'pairs', group: g, chapter: card.chapter });
        seenGroup.add(g);
      }
      continue;
    }
    if (isAssembleCandidate(card)) {
      assembleQ.push({ type: 'assemble', card, chapter: card.chapter });
    } else {
      mcQ.push({ type: 'mc', card, chapter: card.chapter });
    }
  }
  return weaveAtoms({ mc: mcQ, assemble: assembleQ, pairs: pairsQ }, streakState);
}

/**
 * Greedy weave: emit one atom at a time, always picking the queue with the
 * most remaining items but never repeating the same type more than MAX_STREAK
 * times in a row if any other queue still has items.
 *
 * The streakState parameter is mutated so callers can carry the running
 * streak across boundaries (e.g. chapter to chapter).
 */
function weaveAtoms(queues, streakState) {
  const state = streakState || { lastType: null, streak: 0 };
  const out = [];
  while (queues.mc.length || queues.assemble.length || queues.pairs.length) {
    const available = ['mc', 'assemble', 'pairs'].filter((t) => queues[t].length > 0);
    const eligible = available.filter(
      (t) => !(t === state.lastType && state.streak >= MAX_STREAK)
    );
    const pool = eligible.length ? eligible : available;
    pool.sort((a, b) => queues[b].length - queues[a].length);
    const chosen = pool[0];
    out.push(queues[chosen].shift());
    if (chosen === state.lastType) state.streak++;
    else {
      state.lastType = chosen;
      state.streak = 1;
    }
  }
  return out;
}

// ---------- emit ----------

function yamlScalar(s) {
  if (s === '') return '""';
  return JSON.stringify(s);
}

function emitMc(card) {
  const lines = ['- type: mc', `  direction: ${card.direction}`];
  if (card.task) lines.push(`  task: ${yamlScalar(card.task)}`);
  lines.push(`  front: ${yamlScalar(card.front)}`);
  lines.push(`  back: ${yamlScalar(card.back)}`);
  lines.push(`  prompt: ${yamlScalar(card.prompt)}`);
  if (card.hint) lines.push(`  hint: ${yamlScalar(card.hint)}`);
  lines.push('  options:');
  for (const o of card.options) lines.push(`    - ${yamlScalar(o)}`);
  lines.push(`  correct: ${card.correctIndex}`);
  return lines.join('\n');
}

function emitAssemble(card, chapterCards) {
  const direction = card.direction;
  const prompt = promptSide(card);
  const answer = answerSide(card);
  const pool = buildAssemblePool(card, chapterCards);
  const defaultTask = direction === 'sv_es' ? 'Bygg meningen på spanska' : 'Bygg meningen på svenska';
  const task = card.task && tokenize(card.task).length > 0 ? card.task : defaultTask;
  const lines = [
    '- type: assemble',
    `  direction: ${direction}`,
    `  task: ${yamlScalar(task)}`,
    `  prompt: ${yamlScalar(prompt)}`,
    `  answer: ${yamlScalar(answer)}`,
  ];
  if (card.hint) lines.push(`  hint: ${yamlScalar(card.hint)}`);
  lines.push('  pool:');
  for (const w of pool) lines.push(`    - ${yamlScalar(w)}`);
  return lines.join('\n');
}

function emitPairs(group) {
  const lines = [
    '- type: pairs',
    '  direction: sv_es',
    '  task: "Para ihop orden"',
    '  left:',
  ];
  for (const c of group) lines.push(`    - ${yamlScalar(c.front)}`);
  lines.push('  right:');
  for (const c of group) lines.push(`    - ${yamlScalar(c.back)}`);
  return lines.join('\n');
}

// ---------- main ----------

function main() {
  const text = fs.readFileSync(mdPath, 'utf8');
  const allCards = parseMcCards(text);
  if (!allCards.length) {
    console.error('No mc cards found in', mdPath);
    process.exit(1);
  }

  // Preserve top-of-file comments.
  const headLines = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*#/.test(line)) break;
    if (/^\s*-\s*type:/.test(line)) break;
    headLines.push(line);
  }
  while (headLines.length && !headLines[headLines.length - 1].trim()) headLines.pop();

  // Group cards by chapter, preserving order.
  const byChapter = new Map();
  const chapterOrder = [];
  for (const c of allCards) {
    if (!byChapter.has(c.chapter)) {
      byChapter.set(c.chapter, []);
      chapterOrder.push(c.chapter);
    }
    byChapter.get(c.chapter).push(c);
  }

  const out = [];
  if (headLines.length) {
    out.push(headLines.join('\n'));
    out.push('');
  }

  const typeCounts = { mc: 0, assemble: 0, pairs: 0 };
  const streakState = { lastType: null, streak: 0 };
  const flat = [];
  for (const chapter of chapterOrder) {
    const chCards = byChapter.get(chapter);
    const atoms = planChapter(chCards, streakState);

    out.push(`# ${chapter}`);
    out.push('');
    for (const a of atoms) {
      typeCounts[a.type]++;
      flat.push(a.type);
      if (a.type === 'mc') out.push(emitMc(a.card));
      else if (a.type === 'assemble') out.push(emitAssemble(a.card, chCards));
      else if (a.type === 'pairs') out.push(emitPairs(a.group));
      out.push('');
    }
  }

  fs.writeFileSync(mdPath, out.join('\n').replace(/\n\n\n+/g, '\n\n'), 'utf8');
  console.log(
    `Wrote ${typeCounts.mc} mc, ${typeCounts.assemble} assemble, ${typeCounts.pairs} pairs to ${path.relative(root, mdPath)}`
  );

  let worst = 1;
  let cur = 1;
  for (let i = 1; i < flat.length; i++) {
    if (flat[i] === flat[i - 1]) {
      cur++;
      if (cur > worst) worst = cur;
    } else {
      cur = 1;
    }
  }
  console.log('Longest same-type streak in output:', worst);
}

main();
