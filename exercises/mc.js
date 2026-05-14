/**
 * Multiple choice exercise type.
 *
 * Markdown shape:
 *
 *   - type: mc
 *     direction: sv_es      # eller es_sv – informativt fält som ärvs av kortet
 *     task: "..."           # frivillig rubrik; en kort generisk fallback används annars
 *     front: "..."          # källord (används för stabil SRS-id)
 *     back: "..."           # målord
 *     prompt: "..."         # texten användaren ser
 *     hint: "..."           # frivilligt
 *     options:
 *       - "..."
 *       - "..."
 *       - "..."
 *       - "..."
 *     correct: 0            # index på rätt option (eller använd "answer:")
 */
(function () {
  'use strict';

  var util = window.ExerciseTypes.util;
  /** Generiska fallbacks om kortet inte anger `task:`. Avsiktligt
   *  ämnesneutrala — sätt en specifik task i Markdown om du vill ha det. */
  var DEFAULT_TASK_LABEL = 'Välj rätt svar';

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
      front: '',
      back: '',
      prompt: '',
      hint: '',
      direction: 'sv_es',
      task: '',
      options: readArrayField(f.options),
      correctIndex: -1,
      answerText: '',
    };
    if (typeof f.front === 'string') card.front = f.front;
    if (typeof f.back === 'string') card.back = f.back;
    if (typeof f.prompt === 'string') card.prompt = f.prompt;
    if (typeof f.hint === 'string') card.hint = f.hint;
    if (typeof f.chapter === 'string' && f.chapter) card.chapter = f.chapter;
    if (f.direction === 'sv_es' || f.direction === 'es_sv') card.direction = f.direction;
    if (typeof f.task === 'string') card.task = f.task;
    if (typeof f.answer === 'string') card.answerText = f.answer;
    if (typeof f.correct === 'string') {
      var ci = parseInt(f.correct, 10);
      if (!isNaN(ci)) card.correctIndex = ci;
    }

    if (!card.prompt && card.front && card.back) {
      card.prompt = card.direction === 'sv_es' ? card.front : card.back;
    }

    if (card.answerText && (card.correctIndex < 0 || card.correctIndex === undefined)) {
      for (var zi = 0; zi < card.options.length; zi++) {
        if (util.normKey(card.options[zi]) === util.normKey(card.answerText)) {
          card.correctIndex = zi;
          break;
        }
      }
    }

    if (card.correctIndex < 0 || card.correctIndex > 3) {
      var ansNorm =
        card.direction === 'sv_es' ? util.normKey(card.back) : util.normKey(card.front);
      for (var zj = 0; zj < card.options.length; zj++) {
        if (util.normKey(card.options[zj]) === ansNorm) {
          card.correctIndex = zj;
          break;
        }
      }
    }

    return { card: card, nextIdx: read.nextIdx };
  }

  function isValid(card) {
    return !!(
      card.front &&
      card.back &&
      card.prompt &&
      card.options.length === 4 &&
      card.correctIndex >= 0 &&
      card.correctIndex < 4
    );
  }

  function getSignature(card) {
    // Keep the legacy "flip" suffix so existing SRS ids stay stable.
    return card.chapter + '\n' + card.front + '\n' + card.back + '\nflip';
  }

  function resolveTaskLabel(card /*, idStr */) {
    if (card.task) return card.task;
    return DEFAULT_TASK_LABEL;
  }

  function render(zoneEl, card, hooks) {
    while (zoneEl.firstChild) zoneEl.removeChild(zoneEl.firstChild);

    var optsMc = card.options.slice();
    util.shuffleInPlace(optsMc);
    var ansText = card.options[card.correctIndex];
    var correctIdx = -1;
    for (var jj = 0; jj < optsMc.length; jj++) {
      if (util.normKey(optsMc[jj]) === util.normKey(ansText)) {
        correctIdx = jj;
        break;
      }
    }
    if (correctIdx < 0) correctIdx = 0;

    var wrap = document.createElement('div');
    wrap.className = 'mc-options';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Svarsalternativ');

    var locked = false;
    var btnNodes = [];

    function onClick(idx) {
      if (locked) return;
      locked = true;
      var correct = idx === correctIdx;
      for (var i = 0; i < btnNodes.length; i++) {
        btnNodes[i].disabled = true;
        if (i === correctIdx) {
          btnNodes[i].classList.add('mc-option--correct');
        } else if (i === idx && !correct) {
          btnNodes[i].classList.add('mc-option--picked', 'mc-option--wrong');
        } else {
          btnNodes[i].classList.add('mc-option--neutral-wrong');
        }
      }
      if (correct) {
        hooks.acceptCorrect();
      } else {
        var rightText = btnNodes[correctIdx] ? btnNodes[correctIdx].textContent : '';
        hooks.acceptWrong({ correctText: rightText });
      }
    }

    for (var o = 0; o < optsMc.length; o++) {
      (function (idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mc-option';
        b.textContent = optsMc[idx];
        b.addEventListener('click', function () {
          onClick(idx);
        });
        wrap.appendChild(b);
        btnNodes.push(b);
      })(o);
    }

    zoneEl.appendChild(wrap);
  }

  window.ExerciseTypes.register({
    type: 'mc',
    parseBlock: parseBlock,
    isValid: isValid,
    getSignature: getSignature,
    resolveTaskLabel: resolveTaskLabel,
    render: render,
  });
})();
