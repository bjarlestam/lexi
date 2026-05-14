/**
 * App host. Owns:
 *   - loading the markdown file and turning it into card objects via ExerciseTypes
 *   - SRS state (per-card schedule) and localStorage persistence
 *   - the shared card frame (chapter / task / prompt / hint + "wrong answer" feedback)
 *   - delegating the interactive zone to the registered handler for each card's type
 *
 * The interactive part of every exercise type lives in exercises/<type>.js;
 * see exercises/registry.js for the handler contract.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'spanish-srs:v1';
  var DEFAULT_MD = 'exercises-spanish.md';
  var AGAIN_MS = 15 * 60 * 1000;
  var MS_PER_DAY = 86400000;
  var KNEW_LONG_DAYS = 90;
  var CORRECT_DELAY_MS = 650;

  var util = window.ExerciseTypes.util;

  var cards = [];
  var stateById = {};
  var currentCard = null;
  var currentRoundToken = 0;
  var correctTimer = null;

  var el = {
    statsTotal: document.getElementById('stat-total'),
    statsDue: document.getElementById('stat-due'),
    dashboardZone: document.getElementById('dashboard-zone'),
    headerDueBadge: document.getElementById('header-due-badge'),
    ctaDueNum: document.getElementById('cta-due-num'),
    studyProgressBar: document.getElementById('study-progress-bar'),
    study: document.getElementById('study'),
    empty: document.getElementById('empty-state'),
    emptyMsg: document.getElementById('empty-message'),
    cardChapter: document.getElementById('card-chapter'),
    cardTask: document.getElementById('card-task'),
    cardPrompt: document.getElementById('card-prompt'),
    cardHint: document.getElementById('card-hint'),
    exerciseZone: document.getElementById('exercise-zone'),
    cardFeedback: document.getElementById('card-feedback'),
    cardFeedbackText: document.getElementById('card-feedback-text'),
    btnContinue: document.getElementById('btn-continue'),
  };

  function parseMarkdown(text) {
    var lines = text.split(/\r?\n/);
    var chapter = 'Övrigt';
    var out = [];
    var i = 0;
    var inHtmlComment = false;

    while (i < lines.length) {
      var line = lines[i];
      if (inHtmlComment) {
        if (line.indexOf('-->') !== -1) inHtmlComment = false;
        i++;
        continue;
      }
      var trimmedStart = line.trim();
      if (trimmedStart.indexOf('<!--') === 0) {
        if (trimmedStart.indexOf('-->') === -1) inHtmlComment = true;
        i++;
        continue;
      }
      var chapterMatch = line.match(/^# ([^#].*)$/);
      if (chapterMatch) {
        chapter = chapterMatch[1].trim();
        i++;
        continue;
      }
      var typeMatch = line.match(/^\s*-\s*type:\s*(\w+)\b/);
      if (typeMatch) {
        var typeName = typeMatch[1];
        var handler = window.ExerciseTypes.get(typeName);
        if (handler && typeof handler.parseBlock === 'function') {
          var res = handler.parseBlock(lines, i + 1, { chapter: chapter });
          if (res && res.card && handler.isValid(res.card)) {
            var card = res.card;
            card.type = typeName;
            if (!card.chapter) card.chapter = chapter;
            card.id = util.hashId(handler.getSignature(card));
            out.push(card);
          }
          i = res && typeof res.nextIdx === 'number' ? res.nextIdx : i + 1;
          continue;
        }
        i = util.skipUnknownBlock(lines, i + 1);
        continue;
      }
      i++;
    }
    return { cards: out };
  }

  function loadStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { v: 1, byId: {} };
      var o = JSON.parse(raw);
      if (!o || typeof o !== 'object' || !o.byId) return { v: 1, byId: {} };
      return o;
    } catch (e) {
      return { v: 1, byId: {} };
    }
  }

  function saveStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, byId: stateById }));
  }

  function defaultState() {
    return { ease: 2.5, reps: 0, intervalDays: 0, due: Date.now() };
  }

  function mergeState(parsed) {
    var stored = loadStorage();
    stateById = stored.byId || {};
    var seen = {};
    for (var i = 0; i < parsed.length; i++) {
      seen[parsed[i].id] = true;
      if (!stateById[parsed[i].id]) {
        stateById[parsed[i].id] = defaultState();
      } else {
        var s = stateById[parsed[i].id];
        if (typeof s.ease !== 'number') s.ease = 2.5;
        if (typeof s.reps !== 'number') s.reps = 0;
        if (typeof s.intervalDays !== 'number') s.intervalDays = 0;
        if (typeof s.due !== 'number') s.due = Date.now();
      }
    }
    var keys = Object.keys(stateById);
    for (var k = 0; k < keys.length; k++) {
      if (!seen[keys[k]]) delete stateById[keys[k]];
    }
    saveStorage();
  }

  function applyGrade(state, gradeName) {
    var ease = state.ease;
    var reps = state.reps;

    if (gradeName === 'miss') {
      return {
        ease: Math.max(1.3, ease - 0.15),
        reps: 0,
        intervalDays: 0,
        due: Date.now() + AGAIN_MS,
      };
    }

    if (gradeName === 'knew') {
      var newInterval;
      var newReps;
      if (reps === 0) {
        newInterval = 1;
        newReps = 1;
      } else if (reps === 1) {
        newInterval = 3;
        newReps = 2;
      } else if (reps === 2) {
        newInterval = 6;
        newReps = 3;
      } else {
        newInterval = KNEW_LONG_DAYS;
        newReps = reps + 1;
      }
      return {
        ease: ease,
        reps: newReps,
        intervalDays: newInterval,
        due: Date.now() + newInterval * MS_PER_DAY,
      };
    }

    return state;
  }

  function countDueNow(list, now) {
    var n = 0;
    for (var i = 0; i < list.length; i++) {
      if ((stateById[list[i].id] || defaultState()).due <= now) n++;
    }
    return n;
  }

  function updateStats() {
    var total = cards.length;
    var dueNow = countDueNow(cards, Date.now());
    el.statsTotal.textContent = total ? String(total) : '0';
    el.statsDue.textContent = String(dueNow);
    if (el.headerDueBadge) el.headerDueBadge.textContent = String(dueNow);
    if (el.ctaDueNum) el.ctaDueNum.textContent = String(dueNow);
    if (el.studyProgressBar) {
      if (total) {
        var pct = Math.round(((total - dueNow) / total) * 100);
        el.studyProgressBar.style.width = Math.max(8, pct) + '%';
      } else {
        el.studyProgressBar.style.width = '0%';
      }
    }
  }

  function pickNextCard() {
    if (!cards.length) return null;
    var now = Date.now();
    var dueList = [];
    for (var i = 0; i < cards.length; i++) {
      var st = stateById[cards[i].id] || defaultState();
      if (st.due <= now) dueList.push(cards[i]);
    }
    var pool = dueList.length ? dueList : cards.slice();
    pool.sort(function (a, b) {
      return (stateById[a.id] || defaultState()).due - (stateById[b.id] || defaultState()).due;
    });
    return pool[0];
  }

  function showStudy(show) {
    el.study.hidden = !show;
    el.empty.hidden = show;
  }

  function setEmptyMessage(msg) {
    el.emptyMsg.textContent = msg;
    showStudy(false);
    if (el.dashboardZone) el.dashboardZone.hidden = true;
  }

  function setFeedback(show, text) {
    el.cardFeedback.hidden = !show;
    el.cardFeedbackText.textContent = text || '';
  }

  function finishRound(gradeName) {
    if (correctTimer !== null) {
      clearTimeout(correctTimer);
      correctTimer = null;
    }
    if (!currentCard) return;
    var st = stateById[currentCard.id] || defaultState();
    stateById[currentCard.id] = applyGrade(st, gradeName);
    saveStorage();
    updateStats();
    setFeedback(false, '');
    renderCard(pickNextCard());
  }

  function renderCard(card) {
    currentRoundToken++;
    var roundToken = currentRoundToken;
    currentCard = card;
    if (!card) return;

    var handler = window.ExerciseTypes.get(card.type);
    if (!handler) {
      setEmptyMessage('Okänd uppgiftstyp: ' + card.type);
      return;
    }

    el.cardChapter.textContent = card.chapter || '';
    el.cardTask.textContent = handler.resolveTaskLabel
      ? handler.resolveTaskLabel(card, card.id)
      : card.task || '';
    el.cardPrompt.textContent = card.prompt || '';
    if (card.hint) {
      el.cardHint.textContent = 'Tips: ' + card.hint;
      el.cardHint.hidden = false;
    } else {
      el.cardHint.textContent = '';
      el.cardHint.hidden = true;
    }
    setFeedback(false, '');

    var hooks = {
      acceptCorrect: function () {
        if (roundToken !== currentRoundToken) return;
        if (correctTimer !== null) clearTimeout(correctTimer);
        correctTimer = window.setTimeout(function () {
          correctTimer = null;
          finishRound('knew');
        }, CORRECT_DELAY_MS);
      },
      acceptWrong: function (info) {
        if (roundToken !== currentRoundToken) return;
        var ct = (info && info.correctText) || '';
        setFeedback(true, 'Rätt svar: ' + ct);
      },
      skip: function () {
        if (roundToken !== currentRoundToken) return;
        finishRound('miss');
      },
    };

    while (el.exerciseZone.firstChild) el.exerciseZone.removeChild(el.exerciseZone.firstChild);
    handler.render(el.exerciseZone, card, hooks);

    showStudy(true);
  }

  el.btnContinue.addEventListener('click', function () {
    finishRound('miss');
  });

  function applyParsed(doc) {
    cards = doc.cards;
    mergeState(doc.cards);
    updateStats();
    if (!cards.length) {
      if (el.dashboardZone) el.dashboardZone.hidden = true;
      setEmptyMessage('Inga kort hittades i filen. Kontrollera formatet i ' + DEFAULT_MD + '.');
      return;
    }
    if (el.dashboardZone) el.dashboardZone.hidden = false;
    renderCard(pickNextCard());
  }

  function loadText(text) {
    applyParsed(parseMarkdown(text));
  }

  function tryFetchDefault() {
    return fetch(DEFAULT_MD, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('fetch ' + r.status);
        return r.text();
      })
      .then(loadText)
      .catch(function () {
        setEmptyMessage(
          'Kunde inte ladda ' +
            DEFAULT_MD +
            '. Starta en lokal webbserver i projektmappen (t.ex. python3 -m http.server) och öppna sidan därifrån.'
        );
      });
  }

  tryFetchDefault();
})();
