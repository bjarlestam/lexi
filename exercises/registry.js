/**
 * ExerciseTypes – registry for exercise type handlers.
 *
 * Each handler is a plain object with the following shape:
 *
 *   {
 *     type: 'mc',                                 // string used after "- type:" in markdown
 *     parseBlock(lines, startIdx, ctx),           // returns { card, nextIdx }
 *     isValid(card),                              // returns boolean
 *     getSignature(card),                         // string used to derive a stable SRS id
 *     resolveTaskLabel(card, idStr),              // returns the small label above the prompt
 *     render(zoneEl, card, hooks),                // draws the interactive UI into zoneEl
 *   }
 *
 * Handlers register themselves at load time by calling ExerciseTypes.register(handler).
 * The host (app.js) is responsible for everything that is shared between types:
 * chapter / task / prompt / hint header, the generic "wrong answer + Fortsätt" panel,
 * SRS scheduling and persistence.
 *
 * To add a new type:
 *   1. Create exercises/<type>.js and register a handler.
 *   2. Add a <script src="exercises/<type>.js"> tag in index.html before app.js.
 *   3. Add a CSS section in styles.css if the type needs new visuals.
 *
 * The render() function is given hooks for talking back to the host:
 *   hooks.acceptCorrect()             – the user answered correctly
 *   hooks.acceptWrong({ correctText }) – the user answered incorrectly
 *   hooks.skip()                       – the user chose to skip
 */
(function () {
  'use strict';

  var registry = {};

  function stripQuotes(raw) {
    var t = String(raw).trim();
    if (
      (t.charAt(0) === '"' && t.charAt(t.length - 1) === '"') ||
      (t.charAt(0) === "'" && t.charAt(t.length - 1) === "'")
    ) {
      return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
    }
    return t;
  }

  function splitInlineList(val) {
    if (!val) return [];
    return val
      .split(/[,;|]/)
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
  }

  function normKey(s) {
    return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function hashId(signature) {
    var s = String(signature);
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return 'c' + (h >>> 0).toString(36);
  }

  function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  /**
   * Read a YAML-ish block of "key: value" pairs starting at startIdx.
   * Recognises empty-valued keys followed by indented "- item" lines as lists.
   * Stops at the next "- type: ..." line, the next "# chapter" header, or EOF.
   * Returns { fields, nextIdx } where fields[key] is either a string or string[].
   */
  function readBlock(lines, startIdx) {
    var i = startIdx;
    var fields = {};
    while (i < lines.length) {
      var L = lines[i];
      if (/^\s*-\s*type:\s*\w+/.test(L)) break;
      if (/^# /.test(L)) break;
      var kv = L.match(/^\s{2,}(\w+):\s*(.*)$/);
      if (!kv) {
        i++;
        continue;
      }
      var key = kv[1].toLowerCase();
      var rawVal = kv[2];
      if (rawVal === '' && nextLineLooksListy(lines, i + 1)) {
        var listRes = readListItems(lines, i + 1);
        fields[key] = listRes.items;
        i = listRes.nextIdx;
        continue;
      }
      fields[key] = stripQuotes(rawVal);
      i++;
    }
    return { fields: fields, nextIdx: i };
  }

  function nextLineLooksListy(lines, startIdx) {
    var j = startIdx;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j >= lines.length) return false;
    return /^\s{4,}-\s+/.test(lines[j]);
  }

  function readListItems(lines, startIdx) {
    var i = startIdx;
    var items = [];
    while (i < lines.length) {
      var Lo = lines[i];
      if (!Lo.trim()) {
        i++;
        continue;
      }
      var m = Lo.match(/^\s{4,}-\s+(.+)$/);
      if (m) {
        items.push(stripQuotes(m[1].trim()));
        i++;
        continue;
      }
      if (/^\s{2,}\w/.test(Lo)) break;
      if (/^\s*-\s*type:/.test(Lo)) break;
      if (/^# /.test(Lo)) break;
      i++;
    }
    return { items: items, nextIdx: i };
  }

  /**
   * Skip a block whose type has no registered handler. Stops just before
   * the next "- type: ..." or chapter header so the outer parser can resume.
   */
  function skipUnknownBlock(lines, startIdx) {
    var i = startIdx;
    while (i < lines.length) {
      var L = lines[i];
      if (/^\s*-\s*type:\s*\w+/.test(L)) break;
      if (/^# /.test(L)) break;
      i++;
    }
    return i;
  }

  var ParseUtil = {
    stripQuotes: stripQuotes,
    splitInlineList: splitInlineList,
    normKey: normKey,
    hashId: hashId,
    shuffleInPlace: shuffleInPlace,
    readBlock: readBlock,
    skipUnknownBlock: skipUnknownBlock,
  };

  window.ExerciseTypes = {
    register: function (handler) {
      if (!handler || !handler.type) {
        throw new Error('ExerciseTypes.register: handler.type is required');
      }
      registry[handler.type] = handler;
    },
    get: function (type) {
      return registry[type] || null;
    },
    list: function () {
      return Object.keys(registry).map(function (k) {
        return registry[k];
      });
    },
    util: ParseUtil,
  };
})();
