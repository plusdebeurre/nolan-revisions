/**
 * Short-passage reading rounds for Grade 2 / CE2.
 * ReadEngine.mount({ subject, mode: 'choices'|'sentences', title, bank, ui, ... })
 * Choice order is shuffled. Sentence order stays so the story still reads.
 */
(function (global) {
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
    var mode = config.mode === 'sentences' ? 'sentences' : 'choices';
    var bank = config.bank || [];
    var ui = config.ui || {};
    var backHref = config.backHref || '../index.html';
    var homeHref = config.homeHref || '../../../index.html';
    var backLabel = ui.back || (subject === 'french' ? '← Français' : '← English');
    var homeLabel = ui.home || '🏠 Home';
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

    function fun() {
      return global.FunEffects || null;
    }

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
    app.appendChild(el('div', 'score-hud', 'Score: ' + score + ' / ' + total));
    var hud = app.querySelector('.score-hud');
    hud.id = 'live-score-hud';

    var nav = el('div', 'nav-bar');
    var back = el('a', 'nav-link', backLabel);
    back.href = backHref;
    var home = el('a', 'nav-link', homeLabel);
    home.href = homeHref;
    nav.appendChild(back);
    nav.appendChild(home);
    app.appendChild(nav);

    var play = el('div');
    play.id = 'play-screen';
    var header = el('header', 'mb-6 text-center animate-pop');
    header.appendChild(el('h1', 'text-3xl md:text-4xl font-bold mb-2 drop-shadow-sm', title));
    header.querySelector('h1').style.color = 'var(--accent-dark)';
    header.appendChild(el('p', 'text-lg text-slate-500 font-medium', subtitle));
    var track = el('div', 'progress-track');
    var bar = el('div', 'progress-bar-fill');
    bar.id = 'progress-bar';
    track.appendChild(bar);
    header.appendChild(track);
    var roundLabel = el('p', 'mt-2 text-sm font-semibold', '');
    roundLabel.id = 'round-label';
    roundLabel.style.color = 'var(--accent)';
    header.appendChild(roundLabel);
    play.appendChild(header);

    var card = el('div', 'question-card p-6 md:p-8 animate-pop');
    card.id = 'game-card';
    var badge = el('p', 'skill-badge', '');
    var passage = el('p', 'passage', '');
    passage.id = 'passage';
    var ask = el('h2', 'text-xl md:text-2xl font-semibold text-center mb-4 text-slate-700 leading-snug', '');
    ask.id = 'ask';
    var options = el('div', 'grid gap-3 mb-4');
    options.id = 'options';
    var hintBtn = el('button', 'btn-hint mx-auto', ui.hint || '🦉 Get a hint from Mr. Owl');
    hintBtn.type = 'button';
    hintBtn.id = 'hint-btn';
    var hintBox = el('div', 'hidden mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 text-sm md:text-base font-medium text-left');
    hintBox.id = 'hint-display';
    var feedback = el('div', 'hidden text-center p-4 rounded-xl text-lg font-medium mb-4');
    feedback.id = 'feedback';
    var nextWrap = el('div', 'text-center');
    var nextBtn = el('button', 'hidden btn-primary', ui.next || 'Next 🚀');
    nextBtn.type = 'button';
    nextBtn.id = 'next-btn';
    nextWrap.appendChild(nextBtn);
    card.appendChild(badge);
    card.appendChild(passage);
    card.appendChild(ask);
    card.appendChild(options);
    card.appendChild(hintBtn);
    card.appendChild(hintBox);
    card.appendChild(feedback);
    card.appendChild(nextWrap);
    play.appendChild(card);
    app.appendChild(play);

    var finish = el('div', 'hidden question-card p-8 text-center animate-pop');
    finish.id = 'finish-screen';
    finish.appendChild(el('div', 'text-6xl mb-4', mode === 'sentences' ? '🔎' : '📖'));
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
    resultMessage.id = 'result-message';
    finish.appendChild(resultMessage);
    var again = el('button', 'btn-primary', ui.again || 'Play Again 🔄');
    again.type = 'button';
    finish.appendChild(again);
    app.appendChild(finish);

    var style = document.createElement('style');
    style.textContent = [
      '.skill-badge{display:inline-block;background:#fff;border:2px solid var(--card-border);color:var(--accent-dark);font-weight:700;border-radius:999px;padding:0.2rem 0.85rem;margin:0 auto 0.85rem;font-size:0.95rem}',
      '#game-card{text-align:center}',
      '.passage{background:#f8fafc;border:2px solid #e2e8f0;border-radius:1rem;padding:0.9rem 1rem;text-align:left;font-size:1.12rem;line-height:1.55;margin:0 0 1rem;color:#334155}',
      '.sentence-btn{text-align:left;font-size:1.05rem;line-height:1.4}',
      '@media (max-width:700px){#app{padding-top:0.4rem;padding-bottom:0.75rem}#app header{margin-bottom:0.6rem}#app h1{font-size:1.55rem;margin-bottom:0.1rem}#app header .text-lg{font-size:0.95rem;line-height:1.3}#game-card{padding:0.8rem 0.75rem 0.85rem}.passage{font-size:1.02rem;line-height:1.45;margin-bottom:0.55rem;padding:0.7rem 0.75rem}#ask{font-size:1.12rem;margin-bottom:0.55rem}#options{gap:0.45rem;margin-bottom:0.55rem}.option-btn{padding:0.65rem 0.75rem}.sentence-btn{font-size:1rem}}'
    ].join('');
    document.head.appendChild(style);

    function saveCp(nextIndex) {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.saveCheckpoint) return;
      global.NolanProgress.saveCheckpoint(gameId, {
        index: nextIndex,
        score: score,
        extra: { order: order, streak: streak }
      });
    }

    function clearCp() {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.clearCheckpoint) return;
      global.NolanProgress.clearCheckpoint(gameId);
    }

    function paintScore(pulse) {
      hud.textContent = 'Score: ' + score + ' / ' + total;
      if (index < total) {
        roundLabel.textContent = (ui.stop || 'Stop') + ' ' + (index + 1) + ' ' + (ui.of || 'of') + ' ' + total + ' · ' + (ui.scoreWord || 'Score') + ' ' + score;
      }
      if (pulse && fun() && fun().pulseScore) fun().pulseScore(hud);
    }

    function showFeedback(ok, why) {
      feedback.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
      feedback.classList.add(ok ? 'bg-green-100' : 'bg-red-100', ok ? 'text-green-800' : 'text-red-800');
      feedback.replaceChildren();
      var strong = el('strong', '', ok ? (ui.yes || 'Yes! 🎉') : (ui.nope || 'Not yet.'));
      feedback.appendChild(strong);
      feedback.appendChild(document.createElement('br'));
      feedback.appendChild(document.createTextNode(why));
    }

    function loadRound() {
      canAnswer = true;
      var item = bank[order[index]];
      badge.textContent = item.skill || '';
      hintBox.classList.add('hidden');
      hintBox.textContent = '';
      hintBtn.classList.remove('hidden');
      feedback.classList.add('hidden');
      feedback.replaceChildren();
      nextBtn.classList.add('hidden');
      options.replaceChildren();
      bar.style.width = ((index / total) * 100) + '%';
      paintScore(false);

      if (mode === 'sentences') {
        passage.classList.add('hidden');
        passage.textContent = '';
      } else {
        passage.classList.remove('hidden');
        passage.textContent = item.passage;
      }
      ask.textContent = item.ask;

      var rows;
      if (mode === 'sentences') {
        rows = item.sentences.map(function (text, idx) {
          return { text: text, idx: idx };
        });
      } else {
        rows = shuffle(item.options.map(function (text, idx) {
          return { text: text, idx: idx };
        }));
      }

      rows.forEach(function (row, pos) {
        var btn = el('button', 'option-btn' + (mode === 'sentences' ? ' sentence-btn' : ''), (mode === 'sentences' ? (pos + 1) + '. ' : '') + row.text);
        btn.type = 'button';
        btn.addEventListener('click', function () { pick(pos, rows, item); });
        options.appendChild(btn);
      });
      card._rows = rows;
      card._item = item;
    }

    function pick(pos, rows, item) {
      if (!canAnswer) return;
      canAnswer = false;
      hintBtn.classList.add('hidden');
      var correct = pos === rows.findIndex(function (row) { return row.idx === item.answer; });
      var buttons = options.querySelectorAll('button');
      buttons.forEach(function (btn, i) {
        btn.disabled = true;
        if (rows[i].idx === item.answer) btn.classList.add('correct');
        else if (i === pos && !correct) btn.classList.add('wrong');
      });
      if (correct) {
        score++;
        streak++;
        paintScore(true);
        if (fun()) fun().showStreak(streak);
        if (gameId && global.NolanProgress && global.NolanProgress.awardAnswerXp && global.NolanProgress.questionKey) {
          var awarded = global.NolanProgress.awardAnswerXp(gameId, {
            key: global.NolanProgress.questionKey([item.id, item.ask]),
            correct: true,
            streak: streak
          });
          if (fun() && fun().showXpGain) {
            fun().showXpGain(awarded.xpGained, {
              alreadyAwarded: !!awarded.alreadyAwarded,
              bonus: awarded.bonus,
              anchor: window.matchMedia('(max-width: 700px)').matches ? roundLabel : hud
            });
          }
        }
      } else {
        streak = 0;
        if (fun()) fun().shake(card);
      }
      showFeedback(correct, item.why);
      saveCp(index + 1);
      nextBtn.textContent = index + 1 >= total ? (ui.seeScore || 'See my score 🏆') : (ui.next || 'Next 🚀');
      nextBtn.classList.remove('hidden');
    }

    function showResults() {
      clearCp();
      play.classList.add('hidden');
      scoreDisplay.textContent = String(score);
      bar.style.width = '100%';
      hud.textContent = 'Score: ' + score + ' / ' + total;
      var ratio = total ? score / total : 0;
      if (score === total) {
        resultMessage.textContent = ui.perfect || 'Perfect reading! You found the clues in every story! 🌟';
        if (fun() && fun().celebratePerfect) fun().celebratePerfect();
      } else if (ratio >= 0.75) {
        resultMessage.textContent = ui.good || 'Great reading! You can find who, where, and what. 👍';
      } else {
        resultMessage.textContent = ui.retry || 'Good try! Read it once more, then look for who, where, and what. 💪';
      }
      finish.classList.remove('hidden');
      if (gameId && global.NolanProgress && global.NolanProgress.recordResult) {
        var recorded = global.NolanProgress.recordResult(gameId, { score: score, total: total, skipXp: true });
        if (recorded) {
          document.dispatchEvent(new CustomEvent('nolan:progress', { detail: recorded }));
          if (recorded.medal === 'gold' && fun()) fun().confetti({ count: 20 });
        }
      }
    }

    hintBtn.addEventListener('click', function () {
      if (!canAnswer) return;
      var item = bank[order[index]];
      hintBox.textContent = (ui.owl || 'Mr. Owl says:') + ' ' + item.hint;
      hintBox.classList.remove('hidden');
    });

    nextBtn.addEventListener('click', function () {
      if (canAnswer) return;
      index++;
      if (index >= total) showResults();
      else loadRound();
    });

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
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key >= '1' && e.key <= '9') {
        var n = Number(e.key) - 1;
        var buttons = options.querySelectorAll('button');
        if (canAnswer && buttons[n]) {
          buttons[n].click();
          e.preventDefault();
        }
      } else if (e.key === 'Enter' && !canAnswer) {
        nextBtn.click();
        e.preventDefault();
      }
    });

    if (!bank.length) return;
    if (index >= total) showResults();
    else loadRound();
  }

  global.ReadEngine = { mount: mount };
})(window);
