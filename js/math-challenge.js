/**
 * Generated math challenges, one step above end-of-semester-1.
 * Numbers to 999, ×3 ×4, exact ÷2 ÷5 ÷10, halves and quarters.
 * MathChallenge.mount({ kind, title, subtitle, emoji })
 */
(function (global) {
  /* gen-start */
  var MINUS = '−';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function rand(rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pack(round) {
    if (!Number.isInteger(round.answer) || round.answer < 0 || round.answer > 999) {
      throw new Error('bad answer ' + round.kind + ' ' + round.answer);
    }
    round.key = round.kind + '|' + (round.line || '') + '|' + round.before + '|' + round.after + '|' + round.answer;
    return round;
  }

  function add3(rng) {
    var ones = rng() < 0.5;
    var aH = rand(rng, 1, 4);
    var bH = rand(rng, 1, 4);
    var aT;
    var bT;
    var aO;
    var bO;
    if (ones) {
      aO = rand(rng, 4, 9);
      bO = rand(rng, 10 - aO, 9);
      aT = rand(rng, 0, 3);
      bT = rand(rng, 0, 8 - aT);
    } else {
      aO = rand(rng, 0, 4);
      bO = rand(rng, 0, 4 - aO);
      aT = rand(rng, 5, 9);
      bT = rand(rng, 10 - aT, 9);
    }
    var a = aH * 100 + aT * 10 + aO;
    var b = bH * 100 + bT * 10 + bO;
    var sum = a + b;
    var why = ones
      ? 'Ones: ' + aO + ' + ' + bO + ' makes a ten, so carry 1. The answer is ' + sum + '.'
      : 'Tens: ' + aT + ' + ' + bT + ' makes a hundred, so carry 1. The answer is ' + sum + '.';
    return pack({
      kind: 'hundreds',
      badge: '3-digit add',
      before: a + ' + ' + b + ' = ',
      after: '',
      line: '',
      answer: sum,
      hint: ones ? 'Add the ones first. They make 10 or more, so carry.' : 'The ones do not carry. The tens do.',
      why: why
    });
  }

  function sub3(rng) {
    var ones = rng() < 0.5;
    var aH = rand(rng, 3, 8);
    var aT;
    var aO;
    var bH;
    var bT;
    var bO;
    if (ones) {
      aO = rand(rng, 0, 4);
      bO = rand(rng, aO + 1, 9);
      aT = rand(rng, 3, 8);
      bT = rand(rng, 0, aT - 2);
      bH = rand(rng, 1, aH - 1);
    } else {
      aO = rand(rng, 3, 9);
      bO = rand(rng, 0, aO);
      aT = rand(rng, 1, 4);
      bT = rand(rng, aT + 1, 9);
      bH = rand(rng, 1, aH - 1);
    }
    var a = aH * 100 + aT * 10 + aO;
    var b = bH * 100 + bT * 10 + bO;
    return pack({
      kind: 'hundreds',
      badge: '3-digit subtract',
      before: a + ' ' + MINUS + ' ' + b + ' = ',
      after: '',
      line: '',
      answer: a - b,
      hint: ones ? 'The ones are too small. Borrow from the tens.' : 'The tens are too small. Borrow from the hundreds.',
      why: a + ' ' + MINUS + ' ' + b + ' = ' + (a - b) + '.'
    });
  }

  function hundreds(rng) {
    return rng() < 0.5 ? add3(rng) : sub3(rng);
  }

  function times34(rng) {
    var table = rng() < 0.5 ? 3 : 4;
    var n = rand(rng, 2, 10);
    var bits = [];
    var i;
    for (i = 1; i <= n; i++) bits.push(String(table * i));
    return pack({
      kind: 'times34',
      badge: 'Times ×' + table,
      before: n + ' × ' + table + ' = ',
      after: '',
      line: n + ' groups of ' + table,
      answer: n * table,
      hint: 'Count by ' + table + 's, ' + n + ' times.',
      why: bits.join(', ') + '. The answer is ' + (n * table) + '.'
    });
  }

  function fairshares(rng) {
    var div = [2, 5, 10][rand(rng, 0, 2)];
    var each = rand(rng, 2, 9);
    var total = div * each;
    return pack({
      kind: 'fairshares',
      badge: 'Share ÷' + div,
      before: '',
      after: '',
      line: 'Share ' + total + ' into ' + div + ' equal groups. How many in each group?',
      answer: each,
      hint: 'Count by ' + div + 's until you reach ' + total + '.',
      why: div + ' groups of ' + each + ' make ' + total + '.'
    });
  }

  function halfquarter(rng) {
    if (rng() < 0.5) {
      var n = rand(rng, 6, 24) * 2;
      return pack({
        kind: 'halfquarter',
        badge: 'Half',
        before: 'Half of ' + n + ' = ',
        after: '',
        line: 'Split ' + n + ' into 2 equal groups.',
        answer: n / 2,
        hint: 'Half means divide by 2.',
        why: n + ' ÷ 2 = ' + (n / 2) + '.'
      });
    }
    var q = rand(rng, 2, 10) * 4;
    return pack({
      kind: 'halfquarter',
      badge: 'Quarter',
      before: 'A quarter of ' + q + ' = ',
      after: '',
      line: 'Split ' + q + ' into 4 equal groups.',
      answer: q / 4,
      hint: 'A quarter means divide by 4.',
      why: q + ' ÷ 4 = ' + (q / 4) + '.'
    });
  }

  function twostep(rng) {
    var a = rand(rng, 12, 40);
    var b = rand(rng, 5, 20);
    var c = rand(rng, 3, Math.min(15, a + b - 5));
    var things = ['stickers', 'marbles', 'cards', 'shells'][rand(rng, 0, 3)];
    var answer = a + b - c;
    return pack({
      kind: 'twostep',
      badge: 'Two steps',
      before: '',
      after: '',
      line: 'There are ' + a + ' ' + things + '. ' + b + ' more are added. Then ' + c + ' are given away. How many are left?',
      answer: answer,
      hint: 'Add first. Then subtract.',
      why: a + ' + ' + b + ' = ' + (a + b) + '. Then ' + (a + b) + ' ' + MINUS + ' ' + c + ' = ' + answer + '.'
    });
  }

  function quarterclock(rng) {
    var hour = rand(rng, 1, 12);
    var mins = [0, 15, 30, 45][rand(rng, 0, 3)];
    var next = hour === 12 ? 1 : hour + 1;
    var phrase = mins === 0
      ? hour + ' o’clock. How many minutes past the hour is that?'
      : mins === 15
        ? 'Quarter past ' + hour + '. How many minutes past the hour is that?'
        : mins === 30
          ? 'Half past ' + hour + '. How many minutes past the hour is that?'
          : 'Quarter to ' + next + '. How many minutes past ' + hour + ' is that?';
    var hint = mins === 0
      ? 'Nothing has gone past the hour yet.'
      : mins === 15
        ? 'A quarter of 60 minutes.'
        : mins === 30
          ? 'Half of 60 minutes.'
          : 'Three quarters of the way through the hour.';
    return pack({
      kind: 'quarterclock',
      badge: 'Quarter hours',
      before: '',
      after: '',
      line: phrase,
      answer: mins,
      hint: hint,
      why: 'That is ' + mins + ' minutes past ' + hour + '.'
    });
  }

  function changemaker(rng) {
    var pay = rng() < 0.5 ? 50 : 100;
    var cost = rand(rng, pay === 50 ? 15 : 40, pay - 5);
    return pack({
      kind: 'changemaker',
      badge: 'Change',
      before: '',
      after: '',
      line: 'The toy costs ' + cost + '. You pay ' + pay + '. How much change do you get?',
      answer: pay - cost,
      hint: 'Change is what you paid minus the cost.',
      why: pay + ' ' + MINUS + ' ' + cost + ' = ' + (pay - cost) + '.'
    });
  }

  function hundredshouse(rng) {
    var n = rand(rng, 1, 9) * 100 + rand(rng, 0, 9) * 10 + rand(rng, 0, 9);
    var place = ['ones', 'tens', 'hundreds'][rand(rng, 0, 2)];
    var digit = place === 'ones' ? n % 10 : place === 'tens' ? Math.floor(n / 10) % 10 : Math.floor(n / 100);
    var value = place === 'ones' ? digit : place === 'tens' ? digit * 10 : digit * 100;
    return pack({
      kind: 'hundredshouse',
      badge: 'Place value',
      before: '',
      after: '',
      line: 'In ' + n + ', what is the ' + place + ' digit worth?',
      answer: value,
      hint: 'A hundreds digit is worth hundreds, not just the digit itself.',
      why: 'The ' + place + ' digit is ' + digit + ', so it is worth ' + value + '.'
    });
  }

  function numberduel(rng) {
    var a = rand(rng, 100, 899);
    var b = rand(rng, 100, 999);
    if (a === b) b = Math.min(999, a + rand(rng, 1, 20));
    var bigger = Math.max(a, b);
    return pack({
      kind: 'numberduel',
      badge: 'Compare',
      before: '',
      after: '',
      line: 'Which number is bigger, ' + a + ' or ' + b + '? Type the bigger one.',
      answer: bigger,
      hint: 'Look at the hundreds digit first.',
      why: bigger + ' is bigger.'
    });
  }

  function missingfactor(rng) {
    var table = [2, 3, 4, 5, 10][rand(rng, 0, 4)];
    var n = rand(rng, 2, 9);
    if (rng() < 0.5) {
      return pack({
        kind: 'missingfactor',
        badge: 'Missing factor',
        before: table + ' × ',
        after: ' = ' + (table * n),
        line: 'What number goes in the box?',
        answer: n,
        hint: 'How many times does ' + table + ' fit into ' + (table * n) + '?',
        why: table + ' × ' + n + ' = ' + (table * n) + '.'
      });
    }
    return pack({
      kind: 'missingfactor',
      badge: 'Missing divisor',
      before: (table * n) + ' ÷ ',
      after: ' = ' + n,
      line: 'What number goes in the box?',
      answer: table,
      hint: 'What do you divide by to get ' + n + '?',
      why: (table * n) + ' ÷ ' + table + ' = ' + n + '.'
    });
  }

  function fence(rng) {
    var length = rand(rng, 4, 12);
    var width = rand(rng, 2, 9);
    if (width === length) width = Math.max(2, length - 2);
    var answer = 2 * (length + width);
    return pack({
      kind: 'fence',
      badge: 'Perimeter',
      before: '',
      after: '',
      line: 'A garden is ' + length + ' steps long and ' + width + ' steps wide. How long is the fence all the way around?',
      answer: answer,
      hint: 'Add the length and the width, then double it.',
      why: length + ' + ' + width + ' = ' + (length + width) + '. Double that is ' + answer + '.'
    });
  }

  function jumpline(rng) {
    var op = ['+10', '-10', '+100', '-100'][rand(rng, 0, 3)];
    var n;
    if (op === '+10') n = rand(rng, 140, 880);
    else if (op === '-10') n = rand(rng, 30, 890);
    else if (op === '+100') n = rand(rng, 100, 800);
    else n = rand(rng, 200, 900);
    var answer = op === '+10' ? n + 10 : op === '-10' ? n - 10 : op === '+100' ? n + 100 : n - 100;
    var sign = op[0];
    var step = Number(op.slice(1));
    return pack({
      kind: 'jumpline',
      badge: 'Number line',
      before: n + ' ' + (sign === '+' ? '+' : MINUS) + ' ' + step + ' = ',
      after: '',
      line: 'Jump ' + (sign === '+' ? 'forward' : 'back') + ' ' + step + ' from ' + n + '.',
      answer: answer,
      hint: step === 10 ? 'A jump of 10 changes the tens digit.' : 'A jump of 100 changes the hundreds digit.',
      why: n + ' ' + (sign === '+' ? '+' : MINUS) + ' ' + step + ' = ' + answer + '.'
    });
  }

  function balance(rng) {
    var left = rand(rng, 20, 90);
    var part = rand(rng, 5, left - 5);
    return pack({
      kind: 'balance',
      badge: 'Balance',
      before: left + ' = ' + part + ' + ',
      after: '',
      line: 'Both sides must be equal. What is the missing number?',
      answer: left - part,
      hint: 'Subtract the part you can see from the total.',
      why: part + ' + ' + (left - part) + ' = ' + left + '.'
    });
  }

  function arraygarden(rng) {
    var cols = rng() < 0.5 ? 3 : 4;
    var rows = rand(rng, 2, 6);
    var dots = [];
    var r;
    for (r = 0; r < rows; r++) dots.push(new Array(cols + 1).join('● '));
    return pack({
      kind: 'arraygarden',
      badge: rows + ' rows of ' + cols,
      before: rows + ' × ' + cols + ' = ',
      after: '',
      line: dots.join('\n'),
      answer: rows * cols,
      hint: 'Count by ' + cols + 's, once for each row.',
      why: rows + ' rows of ' + cols + ' is ' + (rows * cols) + '.'
    });
  }

  function pizza(rng) {
    if (rng() < 0.5) {
      var slices = 4;
      var eaten = rand(rng, 1, 3);
      return pack({
        kind: 'pizza',
        badge: 'Quarters',
        before: '',
        after: '',
        line: 'A pizza is cut into 4 equal slices. You eat ' + eaten + '. How many slices are left?',
        answer: slices - eaten,
        hint: 'Start with 4 quarters and take away the ones that were eaten.',
        why: '4 ' + MINUS + ' ' + eaten + ' = ' + (slices - eaten) + '.'
      });
    }
    var whole = rand(rng, 2, 8) * 2;
    return pack({
      kind: 'pizza',
      badge: 'Half a set',
      before: '',
      after: '',
      line: 'There are ' + whole + ' slices. Half of them are eaten. How many are eaten?',
      answer: whole / 2,
      hint: 'Half of the slices means divide by 2.',
      why: 'Half of ' + whole + ' is ' + (whole / 2) + '.'
    });
  }

  function nearestten(rng) {
    var n = rand(rng, 21, 98);
    if (n % 10 === 0) n += 3;
    var answer = Math.round(n / 10) * 10;
    if (n % 10 === 0) answer = n;
    return pack({
      kind: 'nearestten',
      badge: 'Nearest 10',
      before: '',
      after: '',
      line: 'Round ' + n + ' to the nearest ten.',
      answer: answer,
      hint: 'If the ones digit is 5 or more, round up. If it is 4 or less, round down.',
      why: n + ' rounds to ' + answer + '.'
    });
  }

  function doubledash(rng) {
    if (rng() < 0.5) {
      var n = rand(rng, 6, 25);
      return pack({
        kind: 'doubledash',
        badge: 'Double',
        before: 'Double ' + n + ' = ',
        after: '',
        line: n + ' + ' + n,
        answer: n * 2,
        hint: 'Double means add the number to itself.',
        why: n + ' + ' + n + ' = ' + (n * 2) + '.'
      });
    }
    var even = rand(rng, 6, 25) * 2;
    return pack({
      kind: 'doubledash',
      badge: 'Half',
      before: 'Half of ' + even + ' = ',
      after: '',
      line: 'What number doubled makes ' + even + '?',
      answer: even / 2,
      hint: 'Find the number that adds to itself to make ' + even + '.',
      why: (even / 2) + ' + ' + (even / 2) + ' = ' + even + '.'
    });
  }

  function graphreader(rng) {
    var names = ['Cats', 'Dogs', 'Birds'];
    var values = [rand(rng, 2, 8), rand(rng, 2, 8), rand(rng, 2, 8)];
    var which = rand(rng, 0, 2);
    var bars = names.map(function (name, i) {
      return name + '  ' + new Array(values[i] + 1).join('█');
    }).join('\n');
    return pack({
      kind: 'graphreader',
      badge: 'Graph',
      before: '',
      after: '',
      line: bars + '\nHow many ' + names[which].toLowerCase() + '?',
      answer: values[which],
      hint: 'Count the blocks in the ' + names[which] + ' row.',
      why: names[which] + ' has ' + values[which] + ' blocks.'
    });
  }

  function daycounter(rng) {
    var start = rand(rng, 0, 3);
    var gap = rand(rng, 1, 4);
    var end = start + gap;
    return pack({
      kind: 'daycounter',
      badge: 'Days',
      before: '',
      after: '',
      line: 'How many days after ' + DAYS[start] + ' is ' + DAYS[end] + '?',
      answer: gap,
      hint: 'Count the jumps, not the starting day.',
      why: DAYS[start] + ' to ' + DAYS[end] + ' is ' + gap + ' day' + (gap === 1 ? '' : 's') + ' later.'
    });
  }

  var MAKERS = {
    hundreds: hundreds,
    times34: times34,
    fairshares: fairshares,
    halfquarter: halfquarter,
    twostep: twostep,
    quarterclock: quarterclock,
    changemaker: changemaker,
    hundredshouse: hundredshouse,
    numberduel: numberduel,
    missingfactor: missingfactor,
    fence: fence,
    jumpline: jumpline,
    balance: balance,
    arraygarden: arraygarden,
    pizza: pizza,
    nearestten: nearestten,
    doubledash: doubledash,
    graphreader: graphreader,
    daycounter: daycounter
  };

  var MIX = Object.keys(MAKERS);

  function makeOne(kind, rng) {
    if (kind === 'mix') return MAKERS[MIX[rand(rng, 0, MIX.length - 1)]](rng);
    return MAKERS[kind](rng);
  }

  function buildSet(kind, seed, count) {
    var rng = mulberry32(seed >>> 0);
    var seen = {};
    var rounds = [];
    var guard = 0;
    while (rounds.length < count && guard < 400) {
      guard++;
      var round = makeOne(kind, rng);
      if (seen[round.key]) continue;
      seen[round.key] = true;
      rounds.push(round);
    }
    if (rounds.length < count) throw new Error('short set ' + kind + ' ' + rounds.length);
    return rounds;
  }
  /* gen-end */

  function mount(config) {
    var kind = config.kind;
    var title = config.title || 'Math Challenge';
    var subtitle = config.subtitle || '';
    var total = config.rounds || 10;
    var ui = config.ui || {};

    document.body.className = 'game theme-math';
    var app = document.getElementById('app') || document.body.appendChild(document.createElement('div'));
    app.id = 'app';
    app.className = 'w-full max-w-2xl mx-auto px-4 py-6';

    var gameId = document.body.getAttribute('data-game-id') || '';
    var rounds = [];
    var index = 0;
    var score = 0;
    var streak = 0;
    var typed = '';
    var canAnswer = true;

    function fun() { return global.FunEffects || null; }
    function gid() { return gameId; }

    function fresh() {
      var seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
      return buildSet(kind, seed, total);
    }

    function roundOk(r) {
      return r && Number.isInteger(r.answer) && r.why && r.hint && r.key;
    }

    if (global.NolanProgress && global.NolanProgress.loadCheckpoint) {
      var cp = global.NolanProgress.loadCheckpoint(gameId);
      if (cp && cp.extra && Array.isArray(cp.extra.rounds) && cp.extra.rounds.length === total && cp.extra.rounds.every(roundOk)) {
        rounds = cp.extra.rounds;
        index = Math.max(0, cp.index | 0);
        score = Math.max(0, Number(cp.score) || 0);
        streak = typeof cp.extra.streak === 'number' ? cp.extra.streak : 0;
        if (index > 0 && index < total && global.NolanProgress.showResumeToast) {
          global.NolanProgress.showResumeToast('Resuming…');
        }
      }
    }
    if (!rounds.length) rounds = fresh();

    app.innerHTML = '';
    var hud = document.createElement('div');
    hud.className = 'score-hud';
    hud.id = 'live-score-hud';
    app.appendChild(hud);

    var nav = document.createElement('div');
    nav.className = 'nav-bar';
    nav.innerHTML = '<a class="nav-link" href="../index.html">← Math</a><a class="nav-link" href="../../../index.html">🏠 Home</a>';
    app.appendChild(nav);

    var play = document.createElement('div');
    play.id = 'play-screen';
    play.innerHTML = ''
      + '<header class="mb-5 text-center"><h1 class="text-3xl font-bold mb-1" style="color:var(--accent-dark)"></h1>'
      + '<p class="text-lg text-slate-500"></p><div class="progress-track"><div class="progress-bar-fill" id="mc-bar"></div></div>'
      + '<p id="mc-round" class="mt-2 text-sm font-semibold" style="color:var(--accent)"></p></header>'
      + '<div id="mc-card" class="question-card p-6 text-center">'
      + '<p id="mc-badge" class="rp-inline-badge"></p>'
      + '<pre id="mc-line" class="mc-line"></pre>'
      + '<p id="mc-eq" class="mc-eq"></p>'
      + '<div id="mc-pad" class="mc-pad"></div>'
      + '<button type="button" id="mc-check" class="btn-primary">Check</button>'
      + '<button type="button" id="mc-hint" class="btn-hint mx-auto">🦉 Get a hint</button>'
      + '<div id="mc-hintbox" class="hidden mt-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 text-left"></div>'
      + '<div id="mc-fb" class="hidden text-center p-4 rounded-xl text-lg font-medium mt-3"></div>'
      + '<button type="button" id="mc-next" class="hidden btn-primary mt-3">Next 🚀</button>'
      + '</div>';
    app.appendChild(play);
    play.querySelector('h1').textContent = title;
    play.querySelector('header p').textContent = subtitle;

    var finish = document.createElement('div');
    finish.id = 'finish-screen';
    finish.className = 'hidden question-card p-8 text-center';
    finish.innerHTML = '<div class="text-6xl mb-3">' + (config.emoji || '🔢') + '</div>'
      + '<h2 class="text-3xl font-bold mb-3" style="color:var(--accent-dark)">Challenge complete!</h2>'
      + '<p class="text-2xl mb-4">You scored <span id="score-display" class="font-bold text-3xl" style="color:var(--accent)">0</span> out of ' + total + '!</p>'
      + '<p id="mc-msg" class="text-lg text-slate-500 mb-6"></p>'
      + '<button type="button" id="mc-again" class="btn-primary">Play Again 🔄</button>';
    app.appendChild(finish);

    var css = document.createElement('style');
    css.textContent = '.rp-inline-badge{display:inline-block;border:2px solid var(--card-border);border-radius:999px;padding:0.15rem 0.75rem;font-weight:700;color:var(--accent-dark);margin-bottom:0.6rem}'
      + '.mc-line{white-space:pre-wrap;text-align:left;font-family:Fredoka,sans-serif;font-size:1.15rem;line-height:1.45;background:#fffbeb;border-radius:1rem;padding:0.8rem 1rem;margin:0 0 0.8rem}'
      + '.mc-eq{font-size:clamp(1.6rem,6vw,2.6rem);font-weight:800;color:var(--accent-dark);margin-bottom:0.8rem}'
      + '.mc-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:0.45rem;max-width:18rem;margin:0 auto 0.8rem}'
      + '.mc-pad .option-btn{text-align:center;font-size:1.45rem;font-weight:700;min-height:2.8rem;padding:0.4rem}';
    document.head.appendChild(css);

    var badge = document.getElementById('mc-badge');
    var line = document.getElementById('mc-line');
    var eq = document.getElementById('mc-eq');
    var pad = document.getElementById('mc-pad');
    var check = document.getElementById('mc-check');
    var hintBtn = document.getElementById('mc-hint');
    var hintBox = document.getElementById('mc-hintbox');
    var fb = document.getElementById('mc-fb');
    var next = document.getElementById('mc-next');
    var bar = document.getElementById('mc-bar');
    var roundLabel = document.getElementById('mc-round');
    var card = document.getElementById('mc-card');

    function saveCp(nextIndex) {
      if (!global.NolanProgress || !global.NolanProgress.saveCheckpoint || !gid()) return;
      global.NolanProgress.saveCheckpoint(gid(), { index: nextIndex, score: score, extra: { rounds: rounds, streak: streak } });
    }
    function clearCp() {
      if (global.NolanProgress && global.NolanProgress.clearCheckpoint && gid()) global.NolanProgress.clearCheckpoint(gid());
    }
    function paint(pulse) {
      hud.textContent = 'Score: ' + score + ' / ' + total;
      if (index < total) roundLabel.textContent = 'Round ' + (index + 1) + ' of ' + total + ' · Score ' + score;
      if (pulse && fun() && fun().pulseScore) fun().pulseScore(hud);
    }
    function paintAnswer(state) {
      var shown = typed === '' ? '?' : typed;
      var box = '<span class="answer-box' + (typed === '' ? ' empty' : '') + (state ? ' ' + state : '') + '">' + shown + '</span>';
      var r = rounds[index];
      eq.innerHTML = (r.before || '') + box + (r.after || '');
    }

    ['1','2','3','4','5','6','7','8','9','←','0','Clear'].forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'option-btn';
      b.textContent = label;
      b.addEventListener('click', function () {
        if (!canAnswer) return;
        if (label === '←') typed = typed.slice(0, -1);
        else if (label === 'Clear') typed = '';
        else if (typed.length < 3) typed += label;
        paintAnswer('');
      });
      pad.appendChild(b);
    });

    function load() {
      canAnswer = true;
      typed = '';
      var r = rounds[index];
      badge.textContent = r.badge;
      if (r.line) {
        line.textContent = r.line;
        line.classList.remove('hidden');
      } else {
        line.textContent = '';
        line.classList.add('hidden');
      }
      paintAnswer('');
      hintBox.classList.add('hidden');
      hintBtn.classList.remove('hidden');
      fb.classList.add('hidden');
      next.classList.add('hidden');
      check.classList.remove('hidden');
      pad.classList.remove('is-locked');
      pad.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
      bar.style.width = ((index / total) * 100) + '%';
      paint(false);
    }

    function submit() {
      if (!canAnswer) return;
      if (typed === '') {
        if (fun()) fun().shake(eq);
        return;
      }
      canAnswer = false;
      pad.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
      check.classList.add('hidden');
      hintBtn.classList.add('hidden');
      var r = rounds[index];
      var ok = Number(typed) === r.answer;
      paintAnswer(ok ? 'ok' : 'bad');
      fb.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
      fb.classList.add(ok ? 'bg-green-100' : 'bg-red-100', ok ? 'text-green-800' : 'text-red-800');
      fb.textContent = (ok ? 'Yes! ' : 'Not yet. The answer is ' + r.answer + '. ') + r.why;
      if (ok) {
        score++;
        streak++;
        paint(true);
        if (fun()) fun().showStreak(streak);
        if (global.NolanProgress && global.NolanProgress.awardAnswerXp && global.NolanProgress.questionKey) {
          var awarded = global.NolanProgress.awardAnswerXp(gid(), {
            key: global.NolanProgress.questionKey([r.key]),
            correct: true,
            streak: streak
          });
          if (fun() && fun().showXpGain) {
            fun().showXpGain(awarded.xpGained, { alreadyAwarded: !!awarded.alreadyAwarded, bonus: awarded.bonus, anchor: hud });
          }
        }
      } else {
        streak = 0;
        if (fun()) fun().shake(card);
      }
      saveCp(index + 1);
      next.textContent = index + 1 >= total ? 'See my score' : 'Next';
      next.classList.remove('hidden');
    }

    function showResults() {
      clearCp();
      play.classList.add('hidden');
      document.getElementById('score-display').textContent = String(score);
      hud.textContent = 'Score: ' + score + ' / ' + total;
      var msg = document.getElementById('mc-msg');
      if (score === total) {
        msg.textContent = 'Perfect challenge! These harder numbers are yours. 🌟';
        if (fun() && fun().celebratePerfect) fun().celebratePerfect();
      } else if (score >= Math.ceil(total * 0.75)) msg.textContent = 'Great work on the harder math. 👍';
      else msg.textContent = 'Good try! Look at hundreds, groups, and halves again. 💪';
      finish.classList.remove('hidden');
      if (global.NolanProgress && global.NolanProgress.recordResult && gid()) {
        var recorded = global.NolanProgress.recordResult(gid(), { score: score, total: total, skipXp: true });
        if (recorded) {
          document.dispatchEvent(new CustomEvent('nolan:progress', { detail: recorded }));
          if (recorded.medal === 'gold' && fun()) fun().confetti({ count: 16 });
        }
      }
    }

    check.addEventListener('click', submit);
    hintBtn.addEventListener('click', function () {
      if (!canAnswer) return;
      hintBox.textContent = 'Mr. Owl says: ' + rounds[index].hint;
      hintBox.classList.remove('hidden');
    });
    next.addEventListener('click', function () {
      if (canAnswer) return;
      index++;
      if (index >= total) showResults();
      else load();
    });
    document.getElementById('mc-again').addEventListener('click', function () {
      clearCp();
      rounds = fresh();
      index = 0;
      score = 0;
      streak = 0;
      finish.classList.add('hidden');
      play.classList.remove('hidden');
      load();
    });
    document.addEventListener('keydown', function (e) {
      if (!finish.classList.contains('hidden')) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key >= '0' && e.key <= '9') {
        if (canAnswer && typed.length < 3) typed += e.key;
        paintAnswer('');
      } else if (e.key === 'Backspace' && canAnswer) {
        typed = typed.slice(0, -1);
        paintAnswer('');
      } else if (e.key === 'Enter') {
        if (canAnswer) submit();
        else next.click();
      }
    });

    if (index >= total) showResults();
    else load();
  }

  global.MathChallenge = { mount: mount, buildSet: buildSet, makers: Object.keys(MAKERS).concat(['mix']) };
})(typeof window !== 'undefined' ? window : globalThis);
