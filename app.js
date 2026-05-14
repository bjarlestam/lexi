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
  var MILESTONE_TARGET = 5;
  /** Poäng vid vilket flamma/siffra når full "mörkröd" intensitet (0–1 skalar däröver). */
  var POINTS_HEAT_MAX = 120;

  var util = window.ExerciseTypes.util;

  var cards = [];
  var stateById = {};
  var totalPoints = 0;
  /** Antal rätt svar (knew) sedan senaste bonus; vid 5 → +5 poäng och nollställs. */
  var towardBonus = 0;
  var currentCard = null;
  var currentRoundToken = 0;
  var correctTimer = null;
  var celebrationTimer = null;
  var pointsBadgePopTimer = null;
  var milestoneCountBumpTimer = null;
  /** Förra poängtal som visades i hörnet; null tills första uppdatering. */
  var lastBadgePoints = null;
  /** Synligt antal i milstolpe-räknaren; kan tillfälligt stanna på 5 under celebration. */
  var displayedMilestone = 0;

  var el = {
    statsTotal: document.getElementById('stat-total'),
    statsDue: document.getElementById('stat-due'),
    dashboardZone: document.getElementById('dashboard-zone'),
    headerPointsBadge: document.getElementById('header-points-badge'),
    headerPointsValue: document.getElementById('header-points-value'),
    celebrationLayer: document.getElementById('celebration-layer'),
    ctaDueNum: document.getElementById('cta-due-num'),
    milestoneTrack: document.getElementById('milestone-track'),
    milestoneProgress: document.getElementById('milestone-progress'),
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

  var milestoneSegEls = el.milestoneTrack
    ? Array.prototype.slice.call(el.milestoneTrack.querySelectorAll('.milestone__seg'))
    : [];

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
      if (!raw) return { v: 1, byId: {}, points: 0, towardBonus: 0 };
      var o = JSON.parse(raw);
      if (!o || typeof o !== 'object' || !o.byId) return { v: 1, byId: {}, points: 0, towardBonus: 0 };
      return o;
    } catch (e) {
      return { v: 1, byId: {}, points: 0, towardBonus: 0 };
    }
  }

  function saveStorage() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        byId: stateById,
        points: totalPoints,
        towardBonus: towardBonus,
      })
    );
  }

  function defaultState() {
    return { ease: 2.5, reps: 0, intervalDays: 0, due: Date.now() };
  }

  function mergeState(parsed) {
    var stored = loadStorage();
    stateById = stored.byId || {};
    totalPoints =
      typeof stored.points === 'number' && !isNaN(stored.points)
        ? Math.max(0, Math.floor(stored.points))
        : 0;
    towardBonus =
      typeof stored.towardBonus === 'number' && !isNaN(stored.towardBonus)
        ? Math.min(4, Math.max(0, Math.floor(stored.towardBonus)))
        : 0;
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
    updatePointsBadge();
  }

  function clamp01(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** Uppdaterar CSS-variabler för poängräknaren: orange → mörkröd med högre poäng. */
  function updatePointsBadgeHeatStyle(badge, points) {
    if (!badge) return;
    var heat = clamp01(points / POINTS_HEAT_MAX);
    badge.style.setProperty('--points-heat', heat.toFixed(4));
    var fh = lerp(32, 2, heat);
    var fs = lerp(100, 86, heat);
    var fl = lerp(50, 33, heat);
    var flame = 'hsl(' + fh + ',' + fs + '%,' + fl + '%)';
    var th = lerp(30, 0, heat);
    var ts = lerp(100, 72, heat);
    var tl = lerp(30, 22, heat);
    var textCol = 'hsl(' + th + ',' + ts + '%,' + tl + '%)';
    badge.style.setProperty('--score-flame', flame);
    badge.style.setProperty('--score-text', textCol);
  }

  function triggerPointsBadgePop() {
    var badge = el.headerPointsBadge;
    if (!badge) return;
    if (pointsBadgePopTimer !== null) {
      clearTimeout(pointsBadgePopTimer);
      pointsBadgePopTimer = null;
    }
    badge.classList.remove('top-bar__badge--pop');
    void badge.offsetWidth;
    badge.classList.add('top-bar__badge--pop');
    pointsBadgePopTimer = window.setTimeout(function () {
      pointsBadgePopTimer = null;
      badge.classList.remove('top-bar__badge--pop');
    }, 600);
  }

  function updatePointsBadge(opts) {
    if (!el.headerPointsBadge) return;
    var skipPop = opts && opts.skipPop;
    var gained = lastBadgePoints !== null && totalPoints > lastBadgePoints;
    var t = String(totalPoints);
    if (el.headerPointsValue) el.headerPointsValue.textContent = t;
    el.headerPointsBadge.setAttribute('aria-label', 'Poäng: ' + t);
    updatePointsBadgeHeatStyle(el.headerPointsBadge, totalPoints);
    lastBadgePoints = totalPoints;
    if (gained && !skipPop) triggerPointsBadgePop();
  }

  /** @param {function(): void} [onDone] körs när overlayn stängts (efter animationstiden) */
  function showCelebration(onDone) {
    var layer = el.celebrationLayer;
    if (!layer) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    if (celebrationTimer !== null) {
      clearTimeout(celebrationTimer);
      celebrationTimer = null;
    }
    layer.setAttribute('aria-hidden', 'false');
    layer.classList.remove('celebration-layer--active');
    void layer.offsetWidth;
    layer.classList.add('celebration-layer--active');
    celebrationTimer = window.setTimeout(function () {
      celebrationTimer = null;
      layer.classList.remove('celebration-layer--active');
      layer.setAttribute('aria-hidden', 'true');
      if (typeof onDone === 'function') onDone();
    }, 2600);
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
    if (el.ctaDueNum) el.ctaDueNum.textContent = String(dueNow);
  }

  /**
   * Renderar milstolpe-tracker (X / 5 segment).
   * @param {{ complete?: boolean, animateNew?: boolean }} [opts]
   *   complete: visa fullt (5/5) även om towardBonus är 0 (under celebration).
   *   animateNew: animera segmentet som just blev fyllt.
   */
  function updateMilestone(opts) {
    if (!el.milestoneTrack) return;
    var complete = !!(opts && opts.complete);
    var animateNew = !!(opts && opts.animateNew);
    var nextVisible = complete
      ? MILESTONE_TARGET
      : Math.min(Math.max(0, towardBonus), MILESTONE_TARGET);
    var prevVisible = displayedMilestone;

    if (el.milestoneProgress) {
      el.milestoneProgress.textContent = String(nextVisible);
    }
    el.milestoneTrack.setAttribute('aria-valuenow', String(nextVisible));
    el.milestoneTrack.classList.toggle('milestone__track--complete', complete);

    for (var i = 0; i < milestoneSegEls.length; i++) {
      var seg = milestoneSegEls[i];
      var shouldFill = i < nextVisible;
      seg.classList.toggle('milestone__seg--filled', shouldFill);
      seg.classList.remove('milestone__seg--just-filled');
    }

    if (animateNew && nextVisible > prevVisible) {
      var newestIdx = nextVisible - 1;
      if (milestoneSegEls[newestIdx]) {
        void milestoneSegEls[newestIdx].offsetWidth;
        milestoneSegEls[newestIdx].classList.add('milestone__seg--just-filled');
      }
      bumpMilestoneCount();
    }

    displayedMilestone = nextVisible;
  }

  function bumpMilestoneCount() {
    if (!el.milestoneProgress) return;
    if (milestoneCountBumpTimer !== null) {
      clearTimeout(milestoneCountBumpTimer);
      milestoneCountBumpTimer = null;
    }
    el.milestoneProgress.classList.remove('milestone__count-now--bumped');
    void el.milestoneProgress.offsetWidth;
    el.milestoneProgress.classList.add('milestone__count-now--bumped');
    milestoneCountBumpTimer = window.setTimeout(function () {
      milestoneCountBumpTimer = null;
      if (el.milestoneProgress) {
        el.milestoneProgress.classList.remove('milestone__count-now--bumped');
      }
    }, 460);
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

    var bonusPointsPendingBadgePop = false;
    var milestoneReached = false;
    if (gradeName === 'knew') {
      towardBonus++;
      if (towardBonus >= MILESTONE_TARGET) {
        milestoneReached = true;
        towardBonus = 0;
        totalPoints += 5;
        bonusPointsPendingBadgePop = true;
      }
    }

    saveStorage();
    updateStats();
    updatePointsBadge(bonusPointsPendingBadgePop ? { skipPop: true } : undefined);

    if (milestoneReached) {
      updateMilestone({ complete: true, animateNew: true });
      showCelebration(function () {
        triggerPointsBadgePop();
        updateMilestone({});
      });
    } else if (gradeName === 'knew') {
      updateMilestone({ animateNew: true });
    } else {
      updateMilestone({});
    }

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
    updateMilestone({});
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
