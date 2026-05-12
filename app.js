(function () {
  'use strict';

  var STORAGE_KEY = 'spanish-srs:v1';
  var DEFAULT_MD = 'exercises.md';
  var AGAIN_MS = 15 * 60 * 1000;
  var MS_PER_DAY = 86400000;
  var KNEW_LONG_DAYS = 90;

  var cards = [];
  var stateById = {};
  var currentCardId = null;

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
    cardFront: document.getElementById('card-front'),
    cardHint: document.getElementById('card-hint'),
    btnReveal: document.getElementById('btn-reveal'),
    cardBackWrap: document.getElementById('card-back-wrap'),
    cardBack: document.getElementById('card-back'),
  };

  function hashId(chapter, front, back) {
    var s = chapter + '\n' + front + '\n' + back + '\nflip';
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return 'c' + (h >>> 0).toString(36);
  }

  function stripQuotes(raw) {
    var t = raw.trim();
    if ((t.charAt(0) === '"' && t.charAt(t.length - 1) === '"') ||
        (t.charAt(0) === "'" && t.charAt(t.length - 1) === "'")) {
      return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
    }
    return t;
  }

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
      if (/^\s*-\s*type:\s*flip\b/.test(line)) {
        var card = { type: 'flip', chapter: chapter, front: '', back: '', hint: '' };
        i++;
        while (i < lines.length) {
          var L = lines[i];
          if (/^\s*-\s*type:\s*\w+/.test(L)) break;
          if (/^# /.test(L)) break;
          var kv = L.match(/^\s{2,}(\w+):\s*(.*)$/);
          if (kv) {
            var key = kv[1].toLowerCase();
            var val = stripQuotes(kv[2]);
            if (key === 'front') card.front = val;
            else if (key === 'back') card.back = val;
            else if (key === 'hint') card.hint = val;
            else if (key === 'chapter') card.chapter = val;
          }
          i++;
        }
        if (card.front && card.back) {
          card.id = hashId(card.chapter, card.front, card.back);
          out.push(card);
        }
        continue;
      }
      i++;
    }
    return out;
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
    return {
      ease: 2.5,
      reps: 0,
      intervalDays: 0,
      due: Date.now(),
    };
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
    var list = cards;
    var total = list.length;
    var dueNow = countDueNow(list, Date.now());
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
    var list = cards;
    if (!list.length) return null;
    var now = Date.now();
    var dueList = [];
    for (var i = 0; i < list.length; i++) {
      var st = stateById[list[i].id] || defaultState();
      if (st.due <= now) dueList.push(list[i]);
    }
    var pool = dueList.length ? dueList : list.slice();
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

  function renderCard(card) {
    if (!card) {
      return;
    }
    currentCardId = card.id;
    el.cardChapter.textContent = card.chapter;
    el.cardFront.textContent = card.front;
    el.cardBack.textContent = card.back;
    if (card.hint) {
      el.cardHint.textContent = 'Tips: ' + card.hint;
      el.cardHint.hidden = false;
    } else {
      el.cardHint.textContent = '';
      el.cardHint.hidden = true;
    }
    el.btnReveal.hidden = false;
    el.cardBackWrap.hidden = true;
    showStudy(true);
  }

  function reveal() {
    el.btnReveal.hidden = true;
    el.cardBackWrap.hidden = false;
  }

  function grade(gradeName) {
    if (!currentCardId) return;
    var st = stateById[currentCardId] || defaultState();
    var next = applyGrade(st, gradeName);
    stateById[currentCardId] = next;
    saveStorage();
    updateStats();
    renderCard(pickNextCard());
  }

  function applyParsed(parsed) {
    cards = parsed;
    mergeState(parsed);
    updateStats();
    if (!cards.length) {
      if (el.dashboardZone) el.dashboardZone.hidden = true;
      setEmptyMessage('Inga kort hittades i filen. Kontrollera formatet i exercises.md.');
      return;
    }
    if (el.dashboardZone) el.dashboardZone.hidden = false;
    renderCard(pickNextCard());
  }

  function loadText(text) {
    var parsed = parseMarkdown(text);
    applyParsed(parsed);
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
          'Kunde inte ladda exercises.md. Starta en lokal webbserver i projektmappen (t.ex. python3 -m http.server) och öppna sidan därifrån.'
        );
      });
  }

  el.btnReveal.addEventListener('click', reveal);

  var gradeButtons = document.querySelectorAll('[data-grade]');
  for (var g = 0; g < gradeButtons.length; g++) {
    gradeButtons[g].addEventListener('click', function (ev) {
      var btn = ev.currentTarget;
      var gname = btn.getAttribute('data-grade');
      grade(gname);
    });
  }

  tryFetchDefault();
})();
