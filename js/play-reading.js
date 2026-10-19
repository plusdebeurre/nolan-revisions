/**
 * Varied reading games for Grade 2 / CE2.
 * PlayReading.mount({ subject, title, subtitle, mode, skin, bank, ui, backHref, homeHref })
 * mode: pick | order | word | multi
 */
(function (global) {
  var NO_SHUFFLE = { tf: 1, yn: 1 };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function shuffle(arr) {
    var x = arr.slice();
    for (var n = x.length - 1; n > 0; n--) {
      var j = Math.floor(Math.random() * (n + 1));
      var t = x[n];
      x[n] = x[j];
      x[j] = t;
    }
    return x;
  }

  function mount(config) {
    var subject = config.subject || 'english';
    var mode = config.mode || 'pick';
    var skin = config.skin || 'plain';
    var bank = config.bank || [];
    var ui = config.ui || {};
    var title = config.title || 'Reading';
    var subtitle = config.subtitle || '';

    document.body.className = 'game theme-' + subject;
    var app = document.getElementById('app') || document.body.appendChild(el('div'));
    app.id = 'app';
    app.className = 'w-full max-w-2xl mx-auto px-4 py-6';

    var gameId =
      (document.body && document.body.getAttribute('data-game-id')) ||
      (global.NolanProgress && global.NolanProgress.inferGameIdFromPath && global.NolanProgress.inferGameIdFromPath());

    var order = shuffle(bank.map(function (_, i) { return i; }));
    var index = 0;
    var score = 0;
    var streak = 0;
    var canAnswer = true;
    var picked = [];
    var multiOn = {};

    function fun() { return global.FunEffects || null; }

    function validOrder(list) {
      if (!Array.isArray(list) || list.length !== bank.length) return false;
      var seen = {};
      for (var i = 0; i < list.length; i++) {
        var n = list[i];
        if (!Number.isInteger(n) || n < 0 || n >= bank.length || seen[n]) return false;
        seen[n] = true;
      }
      return true;
    }

    if (gameId && global.NolanProgress && global.NolanProgress.loadCheckpoint) {
      var cp = global.NolanProgress.loadCheckpoint(gameId);
      if (cp && cp.extra && validOrder(cp.extra.order)) {
        order = cp.extra.order.slice();
        index = Math.max(0, cp.index | 0);
        score = Math.max(0, Number(cp.score) || 0);
        streak = typeof cp.extra.streak === 'number' ? cp.extra.streak : 0;
        if (index > 0 && index < bank.length && global.NolanProgress.showResumeToast) {
          global.NolanProgress.showResumeToast(ui.resume || 'Resuming…');
        }
      }
    }

    var total = bank.length;
    var hud = el('div', 'score-hud', 'Score: ' + score + ' / ' + total);
    hud.id = 'live-score-hud';
    app.appendChild(hud);

    var nav = el('div', 'nav-bar');
    var back = el('a', 'nav-link', ui.back || (subject === 'french' ? '← Français' : '← English'));
    back.href = config.backHref || '../index.html';
    var home = el('a', 'nav-link', ui.home || '🏠 Home');
    home.href = config.homeHref || '../../../index.html';
    nav.appendChild(back);
    nav.appendChild(home);
    app.appendChild(nav);

    var play = el('div');
    play.id = 'play-screen';
    var header = el('header', 'mb-5 text-center animate-pop');
    var h1 = el('h1', 'text-3xl md:text-4xl font-bold mb-2 drop-shadow-sm', title);
    h1.style.color = 'var(--accent-dark)';
    header.appendChild(h1);
    header.appendChild(el('p', 'text-lg text-slate-500 font-medium', subtitle));
    var track = el('div', 'progress-track');
    var bar = el('div', 'progress-bar-fill');
    track.appendChild(bar);
    header.appendChild(track);
    var roundLabel = el('p', 'mt-2 text-sm font-semibold', '');
    roundLabel.style.color = 'var(--accent)';
    header.appendChild(roundLabel);
    play.appendChild(header);

    var card = el('div', 'question-card p-6 md:p-8 animate-pop text-center skin-' + skin);
    var badge = el('p', 'rp-badge', '');
    var promptEl = el('h2', 'text-xl md:text-2xl font-semibold mb-4 text-slate-700 leading-snug', '');
    var passageEl = el('p', 'rp-passage hidden', '');
    var leadEl = el('p', 'rp-lead hidden', '');
    var slotsEl = el('div', 'rp-slots hidden');
    var optionsEl = el('div', 'rp-options');
    var listenBtn = el('button', 'btn-primary hidden mb-3', ui.listen || '🔊 Listen');
    listenBtn.type = 'button';
    var voiceNote = el('p', 'hidden text-sm text-slate-500 mb-3', '');
    var hintBtn = el('button', 'btn-hint mx-auto', ui.hint || '🦉 Hint');
    hintBtn.type = 'button';
    var hintBox = el('div', 'hidden mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 text-sm md:text-base font-medium text-left');
    var feedback = el('div', 'hidden text-center p-4 rounded-xl text-lg font-medium mb-4');
    var nextWrap = el('div', 'text-center mt-2');
    var undoBtn = el('button', 'nav-link hidden', ui.undo || 'Undo');
    undoBtn.type = 'button';
    var checkBtn = el('button', 'btn-primary hidden', ui.check || 'Check');
    checkBtn.type = 'button';
    var nextBtn = el('button', 'btn-primary hidden', ui.next || 'Next 🚀');
    nextBtn.type = 'button';
    nextWrap.appendChild(undoBtn);
    nextWrap.appendChild(checkBtn);
    nextWrap.appendChild(nextBtn);
    card.appendChild(badge);
    card.appendChild(promptEl);
    card.appendChild(leadEl);
    card.appendChild(passageEl);
    card.appendChild(slotsEl);
    card.appendChild(optionsEl);
    card.appendChild(listenBtn);
    card.appendChild(voiceNote);
    card.appendChild(hintBtn);
    if (subject === 'thai') card.classList.add('thai-script');
    card.appendChild(hintBox);
    card.appendChild(feedback);
    card.appendChild(nextWrap);
    play.appendChild(card);
    app.appendChild(play);

    var finish = el('div', 'hidden question-card p-8 text-center animate-pop');
    finish.id = 'finish-screen';
    finish.appendChild(el('div', 'text-6xl mb-4', config.emoji || '📖'));
    var doneTitle = el('h2', 'text-4xl font-bold mb-4', ui.done || 'Reading complete!');
    doneTitle.style.color = 'var(--accent-dark)';
    finish.appendChild(doneTitle);
    var scoreLine = el('p', 'text-2xl font-medium text-slate-600 mb-6');
    scoreLine.appendChild(document.createTextNode((ui.scored || 'You scored') + ' '));
    var scoreDisplay = el('span', 'font-bold text-3xl', '0');
    scoreDisplay.id = 'score-display';
    scoreDisplay.style.color = 'var(--accent)';
    scoreLine.appendChild(scoreDisplay);
    scoreLine.appendChild(document.createTextNode(' ' + (ui.outOf || 'out of') + ' ' + total + (ui.bang || '!')));
    finish.appendChild(scoreLine);
    var resultMessage = el('p', 'text-lg text-slate-500 mb-8 font-medium', '');
    finish.appendChild(resultMessage);
    var again = el('button', 'btn-primary', ui.again || 'Play Again 🔄');
    again.type = 'button';
    finish.appendChild(again);
    app.appendChild(finish);

    var style = document.createElement('style');
    style.textContent = [
      '.rp-badge{display:inline-block;background:#fff;border:2px solid var(--card-border);color:var(--accent-dark);font-weight:700;border-radius:999px;padding:0.15rem 0.8rem;margin-bottom:0.75rem}',
      '.rp-passage,.rp-lead{background:#f8fafc;border:2px solid #e2e8f0;border-radius:1rem;padding:0.85rem 1rem;text-align:left;font-size:1.08rem;line-height:1.5;margin:0 0 0.9rem;color:#334155;white-space:pre-line}',
      '.skin-note .rp-passage{background:#fffbeb;border-color:#fcd34d;box-shadow:4px 4px 0 #fde68a;font-size:1.12rem}',
      '.skin-bubbles .rp-lead{background:#fff;border-radius:1.25rem 1.25rem 1.25rem 0.3rem;font-size:1.25rem;font-weight:700;text-align:center}',
      '.skin-pair .rp-lead{background:#ecfdf5;border-color:#6ee7b7}',
      '.skin-pair .rp-passage{background:#eff6ff;border-color:#93c5fd}',
      '.rp-options{display:grid;gap:0.7rem;margin-bottom:0.75rem}',
      '.rp-options .option-btn{text-align:left}',
      '.skin-tf .rp-options,.skin-yn .rp-options,.skin-faces .rp-options,.skin-rooms .rp-options{grid-template-columns:1fr 1fr}',
      '.skin-tf .option-btn,.skin-yn .option-btn,.skin-faces .option-btn,.skin-rooms .option-btn{text-align:center;font-size:1.35rem;font-weight:800;min-height:4.2rem}',
      '.skin-faces .option-btn,.skin-rooms .option-btn{font-size:1.55rem}',
      '.tf-yes{background:#dcfce7;border-color:#22c55e}',
      '.tf-no{background:#fee2e2;border-color:#f87171}',
      '.rp-slots{display:grid;gap:0.45rem;margin-bottom:0.8rem}',
      '.rp-slot{min-height:2.8rem;border:2px dashed #cbd5e1;border-radius:0.9rem;padding:0.45rem 0.7rem;text-align:left;font-weight:700;background:#fff}',
      '.rp-slot.filled{border-style:solid;border-color:var(--accent)}',
      '.word-cloud{display:flex;flex-wrap:wrap;gap:0.45rem;justify-content:center}',
      '.word-cloud .option-btn{width:auto;font-size:1.2rem;font-weight:700}',
      '.skin-comic .option-btn{font-size:1.15rem;min-height:4rem}',
      '@media (max-width:700px){.rp-passage,.rp-lead{font-size:1rem}.skin-tf .rp-options,.skin-yn .rp-options{grid-template-columns:1fr}}'
    ].join('');
    document.head.appendChild(style);

    function item() { return bank[order[index]]; }

    function saveCp(nextIndex) {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.saveCheckpoint) return;
      global.NolanProgress.saveCheckpoint(gameId, {
        index: nextIndex,
        score: score,
        extra: { order: order, streak: streak }
      });
    }

    function clearCp() {
      if (gameId && global.NolanProgress && global.NolanProgress.clearCheckpoint) {
        global.NolanProgress.clearCheckpoint(gameId);
      }
    }

    function paintScore(pulse) {
      hud.textContent = 'Score: ' + score + ' / ' + total;
      if (index < total) {
        roundLabel.textContent = (ui.stop || 'Round') + ' ' + (index + 1) + ' ' + (ui.of || 'of') + ' ' + total + ' · ' + (ui.scoreWord || 'Score') + ' ' + score;
      }
      if (pulse && fun() && fun().pulseScore) fun().pulseScore(hud);
    }

    function showFeedback(ok, why) {
      feedback.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
      feedback.classList.add(ok ? 'bg-green-100' : 'bg-red-100', ok ? 'text-green-800' : 'text-red-800');
      feedback.replaceChildren();
      feedback.appendChild(el('strong', '', ok ? (ui.yes || 'Yes! 🎉') : (ui.nope || 'Not yet.')));
      feedback.appendChild(document.createElement('br'));
      feedback.appendChild(document.createTextNode(why));
    }

    function award(ok, key) {
      if (ok) {
        score++;
        streak++;
        paintScore(true);
        if (fun()) fun().showStreak(streak);
        if (gameId && global.NolanProgress && global.NolanProgress.awardAnswerXp && global.NolanProgress.questionKey) {
          var awarded = global.NolanProgress.awardAnswerXp(gameId, {
            key: global.NolanProgress.questionKey([key]),
            correct: true,
            streak: streak
          });
          if (fun() && fun().showXpGain) {
            fun().showXpGain(awarded.xpGained, {
              alreadyAwarded: !!awarded.alreadyAwarded,
              bonus: awarded.bonus,
              anchor: hud
            });
          }
        }
      } else {
        streak = 0;
        if (fun()) fun().shake(card);
      }
      showFeedback(ok, item().why);
      saveCp(index + 1);
      undoBtn.classList.add('hidden');
      checkBtn.classList.add('hidden');
      nextBtn.textContent = index + 1 >= total ? (ui.seeScore || 'See my score 🏆') : (ui.next || 'Next 🚀');
      nextBtn.classList.remove('hidden');
      hintBtn.classList.add('hidden');
    }

    function lockButtons() {
      optionsEl.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    }

    function showText(node, text) {
      if (text) {
        node.textContent = text;
        node.classList.remove('hidden');
      } else {
        node.textContent = '';
        node.classList.add('hidden');
      }
    }

    function paintSlots(steps, labels) {
      slotsEl.replaceChildren();
      for (var s = 0; s < steps.length; s++) {
        var slot = el('div', 'rp-slot' + (labels[s] ? ' filled' : ''), (s + 1) + '.  ' + (labels[s] || '…'));
        slotsEl.appendChild(slot);
      }
    }

    function loadRound() {
      canAnswer = true;
      picked = [];
      multiOn = {};
      var q = item();
      badge.textContent = q.skill || '';
      promptEl.textContent = q.prompt || '';
      showText(passageEl, q.passage || '');
      showText(leadEl, q.lead || '');
      hintBox.classList.add('hidden');
      hintBox.textContent = '';
      hintBtn.classList.remove('hidden');
      voiceNote.classList.add('hidden');
      if (q.say && global.NolanSpeak) {
        listenBtn.classList.remove('hidden');
        listenBtn.onclick = function () {
          var lang = q.lang || (subject === 'french' ? 'fr-FR' : subject === 'thai' ? 'th-TH' : 'en-US');
          var heard = global.NolanSpeak.speak(q.say, lang);
          if (!heard) {
            voiceNote.textContent = global.NolanSpeak.missingNote(lang);
            voiceNote.classList.remove('hidden');
          } else {
            voiceNote.classList.add('hidden');
          }
        };
      } else {
        listenBtn.classList.add('hidden');
        voiceNote.classList.add('hidden');
      }
      feedback.classList.add('hidden');
      feedback.replaceChildren();
      nextBtn.classList.add('hidden');
      undoBtn.classList.add('hidden');
      checkBtn.classList.add('hidden');
      optionsEl.replaceChildren();
      slotsEl.classList.add('hidden');
      bar.style.width = ((index / total) * 100) + '%';
      paintScore(false);

      if (mode === 'order') {
        slotsEl.classList.remove('hidden');
        var deck = shuffle(q.steps.map(function (text, idx) { return { text: text, idx: idx }; }));
        paintSlots(q.steps, []);
        undoBtn.classList.remove('hidden');
        deck.forEach(function (row) {
          var btn = el('button', 'option-btn', row.text);
          btn.type = 'button';
          btn.addEventListener('click', function () { tapOrder(row, btn, deck); });
          optionsEl.appendChild(btn);
        });
        card._deck = deck;
        return;
      }

      if (mode === 'word') {
        optionsEl.className = 'rp-options word-cloud';
        var bits = q.sentence.match(/[A-Za-zÀ-ÿ0-9''’]+|[^A-Za-zÀ-ÿ0-9''’]+/g) || [];
        bits.forEach(function (bit) {
          if (!/[A-Za-zÀ-ÿ0-9]/.test(bit)) {
            optionsEl.appendChild(document.createTextNode(bit));
            return;
          }
          var btn = el('button', 'option-btn', bit);
          btn.type = 'button';
          btn.addEventListener('click', function () { tapWord(bit, btn); });
          optionsEl.appendChild(btn);
        });
        return;
      }

      optionsEl.className = 'rp-options';

      if (mode === 'multi') {
        checkBtn.classList.remove('hidden');
        q.choices.forEach(function (choice, i) {
          var btn = el('button', 'option-btn', choice.text);
          btn.type = 'button';
          btn.addEventListener('click', function () {
            if (!canAnswer) return;
            multiOn[i] = !multiOn[i];
            btn.classList.toggle('correct', !!multiOn[i]);
          });
          optionsEl.appendChild(btn);
        });
        return;
      }

      var rows = q.options.map(function (text, idx) { return { text: text, idx: idx }; });
      if (!NO_SHUFFLE[skin]) rows = shuffle(rows);
      rows.forEach(function (row) {
        var btn = el('button', 'option-btn', row.text);
        btn.type = 'button';
        if (skin === 'tf' || skin === 'yn') btn.classList.add(row.idx === 0 ? 'tf-yes' : 'tf-no');
        btn.addEventListener('click', function () { tapPick(row.idx, btn, rows); });
        optionsEl.appendChild(btn);
      });
    }

    function tapPick(idx, btn, rows) {
      if (!canAnswer) return;
      canAnswer = false;
      lockButtons();
      var q = item();
      var ok = idx === q.answer;
      rows.forEach(function (row) {
        var b = [].find.call(optionsEl.querySelectorAll('button'), function (node) { return node.textContent === row.text; });
        if (!b) return;
        if (row.idx === q.answer) b.classList.add('correct');
        else if (b === btn && !ok) b.classList.add('wrong');
      });
      award(ok, q.id);
    }

    function tapWord(bit, btn) {
      if (!canAnswer) return;
      canAnswer = false;
      lockButtons();
      var q = item();
      var ok = bit.toLowerCase() === String(q.answer).toLowerCase();
      optionsEl.querySelectorAll('button').forEach(function (b) {
        if (b.textContent.toLowerCase() === String(q.answer).toLowerCase()) b.classList.add('correct');
        else if (b === btn && !ok) b.classList.add('wrong');
      });
      award(ok, q.id);
    }

    function tapOrder(row, btn, deck) {
      if (!canAnswer || btn.disabled) return;
      var q = item();
      if (picked.length >= q.steps.length) return;
      picked.push(row);
      btn.disabled = true;
      btn.classList.add('correct');
      paintSlots(q.steps, picked.map(function (p) { return p.text; }));
      if (picked.length < q.steps.length) return;
      canAnswer = false;
      lockButtons();
      var ok = picked.every(function (p, i) { return p.idx === i; });
      if (!ok) {
        picked.forEach(function (p, i) {
          if (p.idx !== i) {
            var b = [].find.call(optionsEl.querySelectorAll('button'), function (node) { return node.textContent === p.text; });
            if (b) {
              b.classList.remove('correct');
              b.classList.add('wrong');
            }
          }
        });
      }
      award(ok, q.id);
    }

    function gradeMulti() {
      if (!canAnswer) return;
      var q = item();
      var any = false;
      q.choices.forEach(function (_, i) { if (multiOn[i]) any = true; });
      if (!any) {
        if (fun()) fun().shake(card);
        return;
      }
      canAnswer = false;
      lockButtons();
      var ok = q.choices.every(function (choice, i) { return !!multiOn[i] === !!choice.in; });
      optionsEl.querySelectorAll('button').forEach(function (b, i) {
        if (q.choices[i].in) b.classList.add('correct');
        else b.classList.remove('correct');
        if (!q.choices[i].in && multiOn[i]) b.classList.add('wrong');
      });
      award(ok, q.id);
    }

    function undo() {
      if (!canAnswer || mode !== 'order' || !picked.length) return;
      var last = picked.pop();
      var btn = [].find.call(optionsEl.querySelectorAll('button'), function (node) { return node.textContent === last.text; });
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('correct');
      }
      paintSlots(item().steps, picked.map(function (p) { return p.text; }));
    }

    function showResults() {
      clearCp();
      play.classList.add('hidden');
      scoreDisplay.textContent = String(score);
      bar.style.width = '100%';
      hud.textContent = 'Score: ' + score + ' / ' + total;
      var ratio = total ? score / total : 0;
      if (score === total) {
        resultMessage.textContent = ui.perfect || 'Perfect! You read like a star! 🌟';
        if (fun() && fun().celebratePerfect) fun().celebratePerfect();
      } else if (ratio >= 0.75) {
        resultMessage.textContent = ui.good || 'Great reading! 👍';
      } else {
        resultMessage.textContent = ui.retry || 'Good try! Read it once more. 💪';
      }
      finish.classList.remove('hidden');
      if (gameId && global.NolanProgress && global.NolanProgress.recordResult) {
        var recorded = global.NolanProgress.recordResult(gameId, { score: score, total: total, skipXp: true });
        if (recorded) {
          document.dispatchEvent(new CustomEvent('nolan:progress', { detail: recorded }));
          if (recorded.medal === 'gold' && fun()) fun().confetti({ count: 16 });
        }
      }
    }

    hintBtn.addEventListener('click', function () {
      if (!canAnswer) return;
      hintBox.textContent = (ui.owl || 'Mr. Owl says:') + ' ' + item().hint;
      hintBox.classList.remove('hidden');
    });
    nextBtn.addEventListener('click', function () {
      if (canAnswer) return;
      index++;
      if (index >= total) showResults();
      else loadRound();
    });
    undoBtn.addEventListener('click', undo);
    checkBtn.addEventListener('click', gradeMulti);
    again.addEventListener('click', function () {
      clearCp();
      order = shuffle(bank.map(function (_, i) { return i; }));
      index = 0;
      score = 0;
      streak = 0;
      finish.classList.add('hidden');
      play.classList.remove('hidden');
      loadRound();
    });

    document.addEventListener('keydown', function (e) {
      if (!finish.classList.contains('hidden')) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (mode === 'pick' && canAnswer && e.key >= '1' && e.key <= '9') {
        var buttons = optionsEl.querySelectorAll('button');
        var n = Number(e.key) - 1;
        if (buttons[n]) buttons[n].click();
      } else if (e.key === 'Enter' && !canAnswer) {
        nextBtn.click();
      }
    });

    if (!bank.length) return;
    if (index >= total) showResults();
    else loadRound();
  }

  global.PlayReading = { mount: mount };
})(window);
