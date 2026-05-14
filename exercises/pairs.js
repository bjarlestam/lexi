/**
 * Pairs exercise type: tap a word on the left, then its match on the right.
 *
 * Markdown shape:
 *
 *   - type: pairs
 *     direction: sv_es              # informational: left=svenska, right=spanska
 *     task: "Para ihop orden"       # optional, falls back to a default
 *     hint: "..."                   # optional
 *     left:
 *       - "Äpple"
 *       - "Bröd"
 *       - "Vatten"
 *       - "Mjölk"
 *     right:
 *       - "La manzana"
 *       - "El pan"
 *       - "El agua"
 *       - "La leche"
 *
 * `left[i]` and `right[i]` are the i:th pair. The lists are shuffled
 * independently at render time. Matching is direct: tap a left-word,
 * then a right-word. Correct pairs lock in green; incorrect pairs flash
 * red and count as a mistake. The Kontrollera button is enabled when
 * all pairs are matched.
 */
(function () {
  'use strict';

  var util = window.ExerciseTypes.util;
  var WRONG_FLASH_MS = 600;
  var MIN_PAIRS = 2;
  var MAX_PAIRS = 8;

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
      direction: 'sv_es',
      task: '',
      hint: '',
      left: readArrayField(f.left),
      right: readArrayField(f.right),
    };
    if (typeof f.chapter === 'string' && f.chapter) card.chapter = f.chapter;
    if (f.direction === 'sv_es' || f.direction === 'es_sv') card.direction = f.direction;
    if (typeof f.task === 'string') card.task = f.task;
    if (typeof f.hint === 'string') card.hint = f.hint;
    return { card: card, nextIdx: read.nextIdx };
  }

  function isValid(card) {
    return (
      card.left.length === card.right.length &&
      card.left.length >= MIN_PAIRS &&
      card.left.length <= MAX_PAIRS
    );
  }

  function getSignature(card) {
    return card.chapter + '\n' + card.left.join('|') + '\n' + card.right.join('|') + '\npairs';
  }

  function resolveTaskLabel(card) {
    if (card.task) return card.task;
    return 'Para ihop orden';
  }

  function buildFacit(card) {
    var lines = [];
    for (var i = 0; i < card.left.length; i++) {
      lines.push(card.left[i] + ' = ' + card.right[i]);
    }
    return lines.join(', ');
  }

  function render(zoneEl, card, hooks) {
    while (zoneEl.firstChild) zoneEl.removeChild(zoneEl.firstChild);

    var leftEntries = card.left.map(function (w, i) {
      return { side: 'left', pairIdx: i, word: w };
    });
    var rightEntries = card.right.map(function (w, i) {
      return { side: 'right', pairIdx: i, word: w };
    });
    util.shuffleInPlace(leftEntries);
    util.shuffleInPlace(rightEntries);

    var grid = document.createElement('div');
    grid.className = 'pairs-grid';

    var leftCol = document.createElement('div');
    leftCol.className = 'pairs-col pairs-col--left';
    var rightCol = document.createElement('div');
    rightCol.className = 'pairs-col pairs-col--right';
    grid.appendChild(leftCol);
    grid.appendChild(rightCol);

    var actionsEl = document.createElement('div');
    actionsEl.className = 'pairs-actions';
    var skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'btn btn--ghost pairs-action pairs-action--skip';
    skipBtn.textContent = 'Hoppa över';
    var checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'btn btn--primary pairs-action pairs-action--check';
    checkBtn.textContent = 'Kontrollera';
    checkBtn.disabled = true;
    actionsEl.appendChild(skipBtn);
    actionsEl.appendChild(checkBtn);

    zoneEl.appendChild(grid);
    zoneEl.appendChild(actionsEl);

    var leftBtns = [];
    var rightBtns = [];
    var selectedLeft = null;
    var selectedRight = null;
    var matched = {};
    var matchedCount = 0;
    var mistakes = 0;
    var locked = false;

    function makeBtn(entry) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pairs-token pairs-token--' + entry.side;
      b.textContent = entry.word;
      b.dataset.pairIdx = String(entry.pairIdx);
      b.dataset.side = entry.side;
      b.addEventListener('click', function () {
        onTokenClick(entry, b);
      });
      return b;
    }

    leftEntries.forEach(function (entry) {
      var b = makeBtn(entry);
      leftCol.appendChild(b);
      leftBtns.push({ entry: entry, btn: b });
    });
    rightEntries.forEach(function (entry) {
      var b = makeBtn(entry);
      rightCol.appendChild(b);
      rightBtns.push({ entry: entry, btn: b });
    });

    function clearSelectedClass() {
      if (selectedLeft) selectedLeft.btn.classList.remove('pairs-token--selected');
      if (selectedRight) selectedRight.btn.classList.remove('pairs-token--selected');
    }

    function setSelected(side, item) {
      if (side === 'left') {
        if (selectedLeft) selectedLeft.btn.classList.remove('pairs-token--selected');
        selectedLeft = item;
        if (item) item.btn.classList.add('pairs-token--selected');
      } else {
        if (selectedRight) selectedRight.btn.classList.remove('pairs-token--selected');
        selectedRight = item;
        if (item) item.btn.classList.add('pairs-token--selected');
      }
    }

    function findItem(side, btn) {
      var list = side === 'left' ? leftBtns : rightBtns;
      for (var i = 0; i < list.length; i++) {
        if (list[i].btn === btn) return list[i];
      }
      return null;
    }

    function onTokenClick(entry, btn) {
      if (locked) return;
      if (matched[entry.side + ':' + entry.pairIdx]) return;
      var item = findItem(entry.side, btn);
      if (!item) return;

      if (entry.side === 'left') {
        if (selectedLeft && selectedLeft.btn === btn) {
          setSelected('left', null);
          return;
        }
        setSelected('left', item);
      } else {
        if (selectedRight && selectedRight.btn === btn) {
          setSelected('right', null);
          return;
        }
        setSelected('right', item);
      }

      if (selectedLeft && selectedRight) {
        tryMatch(selectedLeft, selectedRight);
      }
    }

    function tryMatch(leftItem, rightItem) {
      var ok = leftItem.entry.pairIdx === rightItem.entry.pairIdx;
      if (ok) {
        matched['left:' + leftItem.entry.pairIdx] = true;
        matched['right:' + rightItem.entry.pairIdx] = true;
        matchedCount++;
        leftItem.btn.classList.remove('pairs-token--selected');
        rightItem.btn.classList.remove('pairs-token--selected');
        leftItem.btn.classList.add('pairs-token--matched');
        rightItem.btn.classList.add('pairs-token--matched');
        leftItem.btn.disabled = true;
        rightItem.btn.disabled = true;
        selectedLeft = null;
        selectedRight = null;
        if (matchedCount === card.left.length) {
          checkBtn.disabled = false;
        }
        return;
      }

      mistakes++;
      var lBtn = leftItem.btn;
      var rBtn = rightItem.btn;
      lBtn.classList.remove('pairs-token--selected');
      rBtn.classList.remove('pairs-token--selected');
      lBtn.classList.add('pairs-token--wrong');
      rBtn.classList.add('pairs-token--wrong');
      selectedLeft = null;
      selectedRight = null;
      window.setTimeout(function () {
        lBtn.classList.remove('pairs-token--wrong');
        rBtn.classList.remove('pairs-token--wrong');
      }, WRONG_FLASH_MS);
    }

    function finish() {
      if (locked) return;
      locked = true;
      skipBtn.disabled = true;
      checkBtn.disabled = true;
      leftBtns.forEach(function (x) {
        x.btn.disabled = true;
      });
      rightBtns.forEach(function (x) {
        x.btn.disabled = true;
      });
      if (mistakes === 0) {
        hooks.acceptCorrect();
      } else {
        hooks.acceptWrong({ correctText: buildFacit(card) });
      }
    }

    function skipNow() {
      if (locked) return;
      locked = true;
      hooks.skip();
    }

    checkBtn.addEventListener('click', finish);
    skipBtn.addEventListener('click', skipNow);
  }

  window.ExerciseTypes.register({
    type: 'pairs',
    parseBlock: parseBlock,
    isValid: isValid,
    getSignature: getSignature,
    resolveTaskLabel: resolveTaskLabel,
    render: render,
  });
})();
