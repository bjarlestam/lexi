/**
 * Assemble-a-sentence exercise type.
 *
 * Markdown shape:
 *
 *   - type: assemble
 *     direction: es_sv               # or sv_es; controls the default task label
 *     task: "Traduce esta frase"     # optional, falls back to a default
 *     prompt: "Yo como una manzana"  # sentence the user reads
 *     answer: "Jag äter ett äpple"   # expected built sentence
 *     hint: "..."                    # optional
 *     tokens:                        # optional explicit answer tokens (defaults to answer split on whitespace)
 *       - "Jag"
 *       - "äter"
 *     pool:                          # optional word bank (distractors); answer tokens are auto-added
 *       - "Jag"
 *       - "äter"
 *       - "ett"
 *       - "äpple"
 *       - "apelsin"
 *       - "röd"
 *       - "springer"
 *
 * The user taps words in the bank to fill the answer area in order. Tapping a
 * placed word returns it to the bank. The Kontrollera button compares the
 * built sentence against the expected tokens (whitespace-normalised, case-insensitive).
 */
(function () {
  'use strict';

  var util = window.ExerciseTypes.util;

  function tokenize(s) {
    return String(s).trim().split(/\s+/).filter(Boolean);
  }

  function readArrayField(value) {
    if (Array.isArray(value)) return value.slice();
    if (typeof value === 'string' && value) return util.splitInlineList(value);
    return [];
  }

  function parseBlock(lines, startIdx, ctx) {
    var read = util.readBlock(lines, startIdx);
    var f = read.fields;
    var card = {
      chapter: ctx.chapter,
      direction: 'es_sv',
      task: '',
      prompt: '',
      answer: '',
      hint: '',
      tokens: readArrayField(f.tokens),
      pool: readArrayField(f.pool),
    };
    if (typeof f.chapter === 'string' && f.chapter) card.chapter = f.chapter;
    if (f.direction === 'sv_es' || f.direction === 'es_sv') card.direction = f.direction;
    if (typeof f.task === 'string') card.task = f.task;
    if (typeof f.prompt === 'string') card.prompt = f.prompt;
    if (typeof f.answer === 'string') card.answer = f.answer;
    if (typeof f.hint === 'string') card.hint = f.hint;

    if (!card.tokens.length && card.answer) {
      card.tokens = tokenize(card.answer);
    }

    if (!card.pool.length) {
      card.pool = card.tokens.slice();
    } else {
      // Make sure every answer token is present in the pool at least once.
      var remaining = card.pool.map(util.normKey);
      for (var ti = 0; ti < card.tokens.length; ti++) {
        var nk = util.normKey(card.tokens[ti]);
        var idx = remaining.indexOf(nk);
        if (idx === -1) {
          card.pool.push(card.tokens[ti]);
          remaining.push(nk);
        }
        var consumeAt = remaining.indexOf(nk);
        if (consumeAt !== -1) remaining[consumeAt] = '__used__';
      }
    }

    return { card: card, nextIdx: read.nextIdx };
  }

  function isValid(card) {
    return !!(card.prompt && card.answer && card.tokens.length && card.pool.length);
  }

  function getSignature(card) {
    return card.chapter + '\n' + card.prompt + '\n' + card.answer + '\nassemble';
  }

  function resolveTaskLabel(card) {
    if (card.task) return card.task;
    return card.direction === 'sv_es' ? 'Bygg meningen på spanska' : 'Bygg meningen på svenska';
  }

  function render(zoneEl, card, hooks) {
    while (zoneEl.firstChild) zoneEl.removeChild(zoneEl.firstChild);

    var bankEntries = card.pool.map(function (w, i) {
      return { word: w, origIdx: i };
    });
    util.shuffleInPlace(bankEntries);

    var slotsEl = document.createElement('div');
    slotsEl.className = 'asm-slots';

    var bankEl = document.createElement('div');
    bankEl.className = 'asm-bank';

    var actionsEl = document.createElement('div');
    actionsEl.className = 'asm-actions';

    var skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'btn btn--ghost asm-action asm-action--skip';
    skipBtn.textContent = 'Hoppa över';

    var checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'btn btn--primary asm-action asm-action--check';
    checkBtn.textContent = 'Kontrollera';

    actionsEl.appendChild(skipBtn);
    actionsEl.appendChild(checkBtn);

    zoneEl.appendChild(slotsEl);
    zoneEl.appendChild(bankEl);
    zoneEl.appendChild(actionsEl);

    var placed = []; // entries from bankEntries the user has placed, in order
    var locked = false;

    function isPlaced(entry) {
      for (var i = 0; i < placed.length; i++) {
        if (placed[i].origIdx === entry.origIdx) return true;
      }
      return false;
    }

    function updateCheckEnabled() {
      checkBtn.disabled = locked || placed.length === 0;
    }

    function renderBank() {
      while (bankEl.firstChild) bankEl.removeChild(bankEl.firstChild);
      bankEntries.forEach(function (entry) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'asm-token asm-token--bank';
        b.textContent = entry.word;
        var used = isPlaced(entry);
        if (used) b.classList.add('asm-token--used');
        b.disabled = used || locked;
        b.setAttribute('aria-label', entry.word);
        b.addEventListener('click', function () {
          onBankClick(entry);
        });
        bankEl.appendChild(b);
      });
    }

    function renderSlots() {
      while (slotsEl.firstChild) slotsEl.removeChild(slotsEl.firstChild);
      if (placed.length === 0) {
        var ph = document.createElement('span');
        ph.className = 'asm-slots__placeholder';
        ph.textContent = '\u00A0';
        slotsEl.appendChild(ph);
        return;
      }
      placed.forEach(function (entry, idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'asm-token asm-token--slot';
        b.textContent = entry.word;
        b.disabled = locked;
        b.setAttribute('aria-label', 'Ta bort ' + entry.word);
        b.addEventListener('click', function () {
          onSlotClick(idx);
        });
        slotsEl.appendChild(b);
      });
    }

    function onBankClick(entry) {
      if (locked) return;
      if (isPlaced(entry)) return;
      placed.push(entry);
      renderBank();
      renderSlots();
      updateCheckEnabled();
    }

    function onSlotClick(slotIdx) {
      if (locked) return;
      placed.splice(slotIdx, 1);
      renderBank();
      renderSlots();
      updateCheckEnabled();
    }

    function checkAnswer() {
      if (locked) return;
      locked = true;
      var built = placed
        .map(function (s) {
          return s.word;
        })
        .join(' ');
      var expected = card.tokens.join(' ');
      var correct = util.normKey(built) === util.normKey(expected);

      Array.prototype.slice.call(bankEl.querySelectorAll('button')).forEach(function (b) {
        b.disabled = true;
      });
      Array.prototype.slice.call(slotsEl.querySelectorAll('button')).forEach(function (b) {
        b.disabled = true;
      });
      skipBtn.disabled = true;
      checkBtn.disabled = true;
      slotsEl.classList.add(correct ? 'asm-slots--correct' : 'asm-slots--wrong');

      if (correct) {
        hooks.acceptCorrect();
      } else {
        hooks.acceptWrong({ correctText: card.answer });
      }
    }

    function skipNow() {
      if (locked) return;
      locked = true;
      hooks.skip();
    }

    checkBtn.addEventListener('click', checkAnswer);
    skipBtn.addEventListener('click', skipNow);

    renderBank();
    renderSlots();
    updateCheckEnabled();
  }

  window.ExerciseTypes.register({
    type: 'assemble',
    parseBlock: parseBlock,
    isValid: isValid,
    getSignature: getSignature,
    resolveTaskLabel: resolveTaskLabel,
    render: render,
  });
})();
