/**
 * Focus games: inhibition, working memory, reverse order,
 * rule switching, and left-to-right tracking.
 * FocusEngine.mount({ subject, title, subtitle, backHref, homeHref, lang, buildRounds })
 */
(function (global) {
  const SUBJECT = {
    math: 'Math',
    science: 'Science',
    english: 'English',
    hpe: 'HPE',
    french: 'Français',
    thai: 'Thai'
  };

  const COPY = {
    en: {
      home: '🏠 Home',
      round: 'Round',
      of: 'of',
      score: 'Score',
      hint: '🦉 Get a hint',
      owl: 'Mr. Owl says:',
      next: 'Next 🚀',
      seeScore: 'See my score 🏆',
      again: 'Play Again 🔄',
      doneTitle: 'You did it!',
      scored: 'You scored',
      outOf: 'out of',
      perfect: 'Perfect score! You are a champion! 🌟',
      good: 'Great job! Keep it up! 👍',
      retry: 'Good try! Practice again and you will get there! 💪',
      yes: 'Yes! 🎉',
      nope: 'Not yet.',
      catch: 'Catch it!',
      letGo: 'Let it go',
      remember: 'Remember',
      watch: 'Watch…',
      yourTurn: 'Your turn. Same order.',
      yourTurnBack: 'Your turn. Backwards.',
      undo: 'Undo',
      newRule: 'New rule!',
      breakTitle: 'Stand up',
      breakBody: 'Touch your left knee with your right hand. Then your right knee with your left hand. Do it 10 times, slowly.',
      breakBtn: 'I did it',
      resume: 'Resuming…',
      pause: 'Pause'
    },
    fr: {
      home: '🏠 Accueil',
      round: 'Manche',
      of: 'sur',
      score: 'Score',
      hint: '🦉 Un indice',
      owl: 'M. Hibou dit :',
      next: 'Suite 🚀',
      seeScore: 'Voir mon score 🏆',
      again: 'Rejouer 🔄',
      doneTitle: 'Bravo !',
      scored: 'Tu as marqué',
      outOf: 'sur',
      perfect: 'Tout juste ! Tu es un champion ! 🌟',
      good: 'Bravo ! Continue comme ça ! 👍',
      retry: 'Bel essai ! On recommence et tu vas y arriver ! 💪',
      yes: 'Oui ! 🎉',
      nope: 'Pas encore.',
      catch: 'Je l’attrape !',
      letGo: 'Je le laisse',
      remember: 'Retiens',
      watch: 'Regarde…',
      yourTurn: 'À toi, dans le même ordre.',
      yourTurnBack: 'À toi, à l’envers.',
      undo: 'Annuler',
      newRule: 'Nouvelle règle !',
      breakTitle: 'Debout',
      breakBody: 'Touche ton genou gauche avec ta main droite. Puis ton genou droit avec ta main gauche. Fais-le 10 fois, doucement.',
      breakBtn: 'C’est fait',
      resume: 'On reprend…',
      pause: 'Pause'
    }
  };

  function fun() {
    return global.FunEffects || null;
  }

  function mount(config) {
    const lang = config.lang === 'fr' ? 'fr' : 'en';
    const ui = Object.assign({}, COPY[lang], config.ui || {});
    const subject = config.subject || 'math';
    const subjectLabel = SUBJECT[subject] || 'Subject';
    const title = config.title || 'Focus';
    const subtitle = config.subtitle || '';
    const backHref = config.backHref || '../index.html';
    const homeHref = config.homeHref || '../../../index.html';
    const breakAfter = typeof config.breakAfter === 'number' ? config.breakAfter : 3;

    const kept = [];
    if (document.body.classList.contains('nolan-embedded')) kept.push('nolan-embedded');
    if (document.body.classList.contains('hub-locked')) kept.push('hub-locked');
    document.body.className = 'game theme-' + subject + (kept.length ? ' ' + kept.join(' ') : '');
    const app = document.getElementById('app') || document.body.appendChild(document.createElement('div'));
    app.id = 'app';
    app.className = 'w-full max-w-2xl mx-auto px-4 py-6';

    const gameId =
      config.gameId ||
      (document.body && document.body.getAttribute('data-game-id')) ||
      (global.NolanProgress && global.NolanProgress.inferGameIdFromPath && global.NolanProgress.inferGameIdFromPath());

    let rounds = [];
    let index = 0;
    let score = 0;
    let streak = 0;
    let breakDone = false;
    let phase = 'play';
    let lastOk = null;
    let finished = false;
    let timers = [];
    let resumed = false;

    app.innerHTML =
      '<div class="score-hud" id="live-score"></div>' +
      '<div class="nav-bar">' +
      '<a class="nav-link" id="focus-back" href="' + backHref + '"></a>' +
      '<a class="nav-link" id="focus-home" href="' + homeHref + '"></a>' +
      '</div>' +
      '<div class="mb-6 text-center animate-pop" id="focus-header">' +
      '<h1 class="text-3xl md:text-4xl font-bold mb-2 drop-shadow-sm" id="focus-title" style="color: var(--accent-dark)"></h1>' +
      '<p class="text-lg text-slate-500 font-medium" id="focus-sub"></p>' +
      '<div class="progress-track"><div id="focus-bar" class="progress-bar-fill"></div></div>' +
      '<p id="focus-tracker" class="mt-2 text-sm font-semibold" style="color: var(--accent)"></p>' +
      '<p id="focus-line" class="live-score-line"></p>' +
      '</div>' +
      '<div id="focus-card" class="question-card p-6 md:p-8 animate-pop">' +
      '<div id="focus-stage"></div>' +
      '<div id="focus-hint-area" class="mb-4 hidden">' +
      '<button type="button" id="focus-hint" class="btn-hint"></button>' +
      '<div id="focus-hint-text" class="hidden mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 text-sm md:text-base font-medium"></div>' +
      '</div>' +
      '<div id="focus-feedback" class="hidden text-center p-4 rounded-xl mb-6 text-lg font-medium"></div>' +
      '<div class="text-center"><button type="button" id="focus-next" class="hidden btn-primary"></button></div>' +
      '</div>' +
      '<div id="focus-result" class="hidden question-card p-8 text-center animate-pop">' +
      '<div class="text-6xl mb-4">🏆</div>' +
      '<h2 class="text-4xl font-bold mb-4" id="focus-done-title" style="color: var(--accent-dark)"></h2>' +
      '<p class="text-2xl font-medium text-slate-600 mb-6"><span id="focus-scored-label"></span> <span id="focus-score" class="font-bold text-3xl" style="color: var(--accent)"></span> <span id="focus-outof"></span> <span id="focus-total"></span></p>' +
      '<p id="focus-message" class="text-lg text-slate-500 mb-8 font-medium"></p>' +
      '<button type="button" id="focus-again" class="btn-primary"></button>' +
      '</div>';

    const backLink = document.getElementById('focus-back');
    const homeLink = document.getElementById('focus-home');
    const titleEl = document.getElementById('focus-title');
    const subEl = document.getElementById('focus-sub');
    const bar = document.getElementById('focus-bar');
    const tracker = document.getElementById('focus-tracker');
    const line = document.getElementById('focus-line');
    const hud = document.getElementById('live-score');
    const header = document.getElementById('focus-header');
    const card = document.getElementById('focus-card');
    const stage = document.getElementById('focus-stage');
    const hintArea = document.getElementById('focus-hint-area');
    const hintBtn = document.getElementById('focus-hint');
    const hintText = document.getElementById('focus-hint-text');
    const feedback = document.getElementById('focus-feedback');
    const nextBtn = document.getElementById('focus-next');
    const result = document.getElementById('focus-result');
    const doneTitle = document.getElementById('focus-done-title');
    const scoredLabel = document.getElementById('focus-scored-label');
    const scoreEl = document.getElementById('focus-score');
    const outOf = document.getElementById('focus-outof');
    const totalEl = document.getElementById('focus-total');
    const message = document.getElementById('focus-message');
    const againBtn = document.getElementById('focus-again');

    backLink.textContent = '← ' + subjectLabel;
    homeLink.textContent = ui.home;
    titleEl.textContent = title;
    subEl.textContent = subtitle;
    hintBtn.textContent = ui.hint;
    doneTitle.textContent = ui.doneTitle;
    scoredLabel.textContent = ui.scored;
    outOf.textContent = ui.outOf;
    againBtn.textContent = ui.again;

    function later(fn, ms) {
      const id = setTimeout(() => {
        timers = timers.filter((t) => t !== id);
        fn();
      }, ms);
      timers.push(id);
    }

    function stopTimers() {
      timers.forEach((id) => clearTimeout(id));
      timers = [];
    }

    function persist() {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.saveCheckpoint || finished) return;
      global.NolanProgress.saveCheckpoint(gameId, {
        index: index,
        score: score,
        extra: {
          rounds: rounds,
          streak: streak,
          breakDone: breakDone,
          phase: phase,
          lastOk: lastOk
        }
      });
    }

    function clearPersisted() {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.clearCheckpoint) return;
      global.NolanProgress.clearCheckpoint(gameId);
    }

    function updateChrome() {
      const total = rounds.length || 1;
      if (phase === 'break') tracker.textContent = ui.pause;
      else tracker.textContent = ui.round + ' ' + Math.min(index + 1, rounds.length) + ' ' + ui.of + ' ' + rounds.length;
      bar.style.width = Math.min(100, (index / total) * 100) + '%';
      const text = ui.score + ': ' + score + ' / ' + rounds.length;
      hud.textContent = text;
      line.textContent = ui.score + ': ' + score;
      totalEl.textContent = String(rounds.length);
    }

    function showHintFor(round) {
      if (round && round.hint && phase === 'play') {
        hintArea.classList.remove('hidden');
        hintBtn.classList.remove('hidden');
        hintText.classList.add('hidden');
        hintText.textContent = '';
      } else {
        hintArea.classList.add('hidden');
      }
    }

    function award(round) {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.awardAnswerXp) return;
      const key = global.NolanProgress.questionKey
        ? global.NolanProgress.questionKey([gameId, round.key || round.prompt || index])
        : String(round.key || index);
      const awarded = global.NolanProgress.awardAnswerXp(gameId, {
        key: key,
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

    function paintFeedback(ok, explain) {
      feedback.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
      feedback.textContent = '';
      if (ok) feedback.classList.add('bg-green-100', 'text-green-800');
      else feedback.classList.add('bg-red-100', 'text-red-800');
      const strong = document.createElement('strong');
      strong.textContent = ok ? ui.yes : ui.nope;
      feedback.appendChild(strong);
      if (explain) {
        feedback.appendChild(document.createElement('br'));
        feedback.appendChild(document.createTextNode(explain));
      }
      nextBtn.textContent = index >= rounds.length - 1 ? ui.seeScore : ui.next;
      nextBtn.classList.remove('hidden');
      hintBtn.classList.add('hidden');
    }

    function settle(ok, explain, round) {
      if (phase !== 'play' || finished) return;
      phase = 'feedback';
      lastOk = !!ok;
      if (ok) {
        score += 1;
        streak += 1;
        if (fun()) fun().showStreak(streak);
        award(round);
        if (fun()) fun().pulseScore(hud);
      } else {
        streak = 0;
        if (fun()) fun().shake(card);
      }
      paintFeedback(!!ok, explain || (round && round.explain) || '');
      stage.querySelectorAll('button').forEach((node) => {
        node.disabled = true;
        if (node.classList.contains('focus-sweep')) node.style.animationPlayState = 'paused';
      });
      updateChrome();
      persist();
    }

    function choiceGrid(labels, className, onPick) {
      const grid = document.createElement('div');
      grid.className = labels.length === 2 ? 'focus-actions two' : 'grid grid-cols-1 sm:grid-cols-2 gap-4';
      labels.forEach((label, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn ' + (className || 'focus-choice');
        button.textContent = label;
        button.addEventListener('click', () => onPick(i, button, grid));
        grid.appendChild(button);
      });
      return grid;
    }

    function lockButtons(grid, correctIndex, pickedIndex) {
      Array.prototype.forEach.call(grid.children, (btn, i) => {
        btn.disabled = true;
        if (i === correctIndex) btn.classList.add('correct');
        else if (i === pickedIndex) btn.classList.add('wrong');
      });
    }

    function renderInhibit(round) {
      const rule = document.createElement('h2');
      rule.className = 'focus-rule';
      rule.textContent = round.prompt || '';
      const cardText = document.createElement('div');
      cardText.className = 'focus-flash';
      cardText.textContent = round.card || '';
      stage.appendChild(rule);
      stage.appendChild(cardText);
      stage.appendChild(choiceGrid([ui.catch, ui.letGo], 'focus-choice', (i, button, grid) => {
        const caught = i === 0;
        const ok = caught === !!round.shouldCatch;
        lockButtons(grid, round.shouldCatch ? 0 : 1, i);
        settle(ok, round.explain, round);
      }));
    }

    function renderQuestion(prompt, options, answer, className, onDone) {
      stage.textContent = '';
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = prompt;
      stage.appendChild(heading);
      const grid = choiceGrid(options, className, (i, button, box) => {
        lockButtons(box, answer, i);
        onDone(i === answer);
      });
      stage.appendChild(grid);
      return grid;
    }

    function renderHold(round) {
      const cap = document.createElement('p');
      cap.className = 'focus-status';
      cap.textContent = ui.remember;
      const num = document.createElement('div');
      num.className = 'focus-hold';
      num.textContent = String(round.hold);
      stage.appendChild(cap);
      stage.appendChild(num);
      later(() => {
        if (phase !== 'play') return;
        const q = round.distractor;
        renderQuestion(q.prompt, q.options, q.answer, 'focus-choice', (ok) => {
          const note = document.createElement('p');
          note.className = 'focus-note';
          note.textContent = q.explain || '';
          stage.appendChild(note);
          later(() => {
            if (phase !== 'play') return;
            const recall = round.recall;
            renderQuestion(recall.prompt, recall.options, recall.answer, 'focus-choice', (good) => {
              settle(good, recall.explain || round.explain, round);
            });
          }, ok ? 700 : 1100);
        });
      }, 2800);
    }

    function renderMirror(round) {
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = round.prompt || '';
      const word = document.createElement('div');
      word.className = 'focus-word';
      const text = String(round.word || '');
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text.charAt(i);
        if (i === round.index) span.className = 'is-target';
        word.appendChild(span);
      }
      stage.appendChild(heading);
      stage.appendChild(word);
      stage.appendChild(choiceGrid(round.options, 'focus-letter', (i, button, grid) => {
        lockButtons(grid, round.answer, i);
        settle(i === round.answer, round.explain, round);
      }));
    }

    function renderSwitch(round) {
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = round.prompt || '';
      const emoji = document.createElement('div');
      emoji.className = 'focus-hold';
      emoji.textContent = (round.item && round.item.emoji) || '';
      const name = document.createElement('p');
      name.className = 'focus-rule';
      name.textContent = (round.item && round.item.name) || '';
      stage.appendChild(heading);
      stage.appendChild(emoji);
      stage.appendChild(name);
      const labels = (round.choices || []).map((choice) => choice.label);
      stage.appendChild(choiceGrid(labels, 'focus-choice', (i, button, grid) => {
        const choice = round.choices[i];
        const correctIndex = round.choices.findIndex((row) => row.id === round.answer);
        lockButtons(grid, correctIndex, i);
        settle(!!choice && choice.id === round.answer, round.explain, round);
      }));
    }

    function renderTrack(round) {
      const words = round.words || [];
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = round.prompt || '';
      const tray = document.createElement('div');
      tray.className = 'focus-tray';
      const lane = document.createElement('div');
      lane.className = 'focus-lane';
      stage.appendChild(heading);
      stage.appendChild(tray);
      stage.appendChild(lane);
      let cursor = 0;
      let failed = false;
      const slots = words.map((_, i) => i);
      for (let n = slots.length - 1; n > 0; n--) {
        const j = Math.floor(Math.random() * (n + 1));
        const t = slots[n];
        slots[n] = slots[j];
        slots[j] = t;
      }
      slots.forEach((wordIndex, slot) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn focus-sweep';
        button.textContent = words[wordIndex];
        button.style.top = (0.35 + (slot % 3) * 3.15) + 'rem';
        button.style.animationDelay = (-(slot * (18 / Math.max(words.length, 1)))) + 's';
        button.addEventListener('click', () => {
          if (failed || phase !== 'play') return;
          if (wordIndex === cursor) {
            cursor += 1;
            button.disabled = true;
            button.classList.add('correct');
            button.classList.remove('focus-sweep');
            button.style.animation = 'none';
            button.style.position = 'static';
            button.style.top = '';
            tray.appendChild(button);
            if (cursor === words.length) settle(true, round.explain, round);
          } else {
            failed = true;
            button.classList.add('wrong');
            Array.prototype.forEach.call(lane.children, (node) => {
              node.disabled = true;
            });
            settle(false, round.explain, round);
          }
        });
        lane.appendChild(button);
      });
    }

    function renderReverse(round) {
      const steps = round.steps || [];
      const pool = round.pool && round.pool.length ? round.pool : steps;
      const expected = (round.reverse ? steps.slice().reverse() : steps.slice()).map((step) => step.id);
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = round.prompt || '';
      const status = document.createElement('p');
      status.className = 'focus-status';
      status.textContent = ui.watch;
      const tray = document.createElement('div');
      tray.className = 'focus-tray';
      const grid = document.createElement('div');
      grid.className = 'focus-seq';
      stage.appendChild(heading);
      stage.appendChild(status);
      stage.appendChild(tray);
      stage.appendChild(grid);
      const byId = {};
      pool.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.disabled = true;
        const emoji = document.createElement('span');
        emoji.className = 'emoji';
        emoji.textContent = item.emoji || '';
        const label = document.createElement('span');
        label.textContent = item.label || '';
        button.appendChild(emoji);
        button.appendChild(label);
        button.dataset.id = item.id;
        byId[item.id] = button;
        grid.appendChild(button);
      });
      const undo = document.createElement('button');
      undo.type = 'button';
      undo.className = 'btn-hint hidden';
      undo.textContent = ui.undo;
      stage.appendChild(undo);
      const picked = [];
      let ready = false;

      function paintTray() {
        tray.textContent = '';
        picked.forEach((id) => {
          const chip = document.createElement('span');
          chip.className = 'option-btn';
          const item = pool.filter((row) => row.id === id)[0];
          chip.textContent = item ? item.label : id;
          tray.appendChild(chip);
        });
      }

      function finishTap() {
        if (picked.length !== expected.length) return;
        ready = false;
        undo.classList.add('hidden');
        const ok = picked.every((id, i) => id === expected[i]);
        Array.prototype.forEach.call(grid.children, (btn) => {
          btn.disabled = true;
        });
        settle(ok, round.explain, round);
      }

      pool.forEach((item) => {
        byId[item.id].addEventListener('click', () => {
          if (!ready || phase !== 'play') return;
          if (picked.indexOf(item.id) !== -1) return;
          picked.push(item.id);
          byId[item.id].disabled = true;
          byId[item.id].classList.add('picked');
          paintTray();
          if (picked.length === expected.length) finishTap();
        });
      });

      undo.addEventListener('click', () => {
        if (!ready || !picked.length || phase !== 'play') return;
        const id = picked.pop();
        const button = byId[id];
        if (button) {
          button.disabled = false;
          button.classList.remove('picked');
        }
        paintTray();
      });

      let lit = 0;
      function peek() {
        if (phase !== 'play') return;
        if (lit >= steps.length) {
          ready = true;
          status.textContent = round.reverse ? ui.yourTurnBack : ui.yourTurn;
          undo.classList.remove('hidden');
          Array.prototype.forEach.call(grid.children, (btn) => {
            btn.disabled = false;
          });
          return;
        }
        const button = byId[steps[lit].id];
        if (button) button.classList.add('focus-peek');
        later(() => {
          if (button) button.classList.remove('focus-peek');
          lit += 1;
          later(peek, 200);
        }, 720);
      }
      later(peek, 360);
    }

    function renderRound(round) {
      stopTimers();
      stage.textContent = '';
      feedback.classList.add('hidden');
      feedback.textContent = '';
      nextBtn.classList.add('hidden');
      showHintFor(round);
      const prev = index > 0 ? rounds[index - 1] : null;
      if (round.ruleId && prev && prev.ruleId && prev.ruleId !== round.ruleId && !round.introPlayed) {
        round.introPlayed = true;
        const banner = document.createElement('div');
        banner.className = 'focus-banner';
        const strong = document.createElement('strong');
        strong.textContent = ui.newRule;
        const lineEl = document.createElement('p');
        lineEl.className = 'focus-rule';
        lineEl.textContent = round.prompt || '';
        banner.appendChild(strong);
        banner.appendChild(lineEl);
        stage.appendChild(banner);
        hintArea.classList.add('hidden');
        later(() => renderRound(round), 1400);
        return;
      }
      if (round.mode === 'inhibit') renderInhibit(round);
      else if (round.mode === 'hold') renderHold(round);
      else if (round.mode === 'mirror') renderMirror(round);
      else if (round.mode === 'switch') renderSwitch(round);
      else if (round.mode === 'track') renderTrack(round);
      else if (round.mode === 'reverse') renderReverse(round);
    }

    function renderBreak() {
      stopTimers();
      stage.textContent = '';
      feedback.classList.add('hidden');
      nextBtn.classList.add('hidden');
      hintArea.classList.add('hidden');
      const emoji = document.createElement('div');
      emoji.className = 'focus-hold';
      emoji.textContent = '🚶';
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = ui.breakTitle;
      const body = document.createElement('p');
      body.className = 'text-lg text-center font-medium text-slate-600 mb-6';
      body.textContent = ui.breakBody;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-primary';
      button.textContent = ui.breakBtn;
      const wrap = document.createElement('div');
      wrap.className = 'text-center';
      wrap.appendChild(button);
      stage.appendChild(emoji);
      stage.appendChild(heading);
      stage.appendChild(body);
      stage.appendChild(wrap);
      button.addEventListener('click', () => {
        breakDone = true;
        phase = 'play';
        persist();
        showStep();
      });
    }

    function renderFeedbackOnly() {
      const round = rounds[index];
      stopTimers();
      stage.textContent = '';
      hintArea.classList.add('hidden');
      const heading = document.createElement('h2');
      heading.className = 'focus-rule';
      heading.textContent = (round && round.prompt) || title;
      stage.appendChild(heading);
      paintFeedback(!!lastOk, (round && round.explain) || '');
    }

    function finish() {
      if (finished) return;
      finished = true;
      stopTimers();
      phase = 'done';
      card.classList.add('hidden');
      header.classList.add('hidden');
      result.classList.remove('hidden');
      scoreEl.textContent = String(score);
      totalEl.textContent = String(rounds.length);
      const mistakes = Math.max(0, rounds.length - score);
      if (mistakes === 0) {
        message.textContent = ui.perfect;
        if (fun()) fun().celebratePerfect();
      } else if (mistakes <= 2) message.textContent = ui.good;
      else message.textContent = ui.retry;
      bar.style.width = '100%';
      hud.textContent = ui.score + ': ' + score + ' / ' + rounds.length;
      clearPersisted();
      if (gameId && global.NolanProgress && global.NolanProgress.recordResult) {
        const recorded = global.NolanProgress.recordResult(gameId, {
          score: score,
          total: rounds.length,
          skipXp: true
        });
        if (recorded) {
          document.dispatchEvent(new CustomEvent('nolan:progress', { detail: recorded }));
          if (recorded.medal === 'gold' && fun()) fun().confetti({ count: 20 });
        }
      }
    }

    function showStep() {
      if (finished) return;
      if (index >= rounds.length) {
        finish();
        return;
      }
      if (index === breakAfter && !breakDone) {
        phase = 'break';
        updateChrome();
        persist();
        renderBreak();
        return;
      }
      phase = 'play';
      updateChrome();
      persist();
      renderRound(rounds[index]);
    }

    function resumeOrStart() {
      updateChrome();
      if (phase === 'feedback' && rounds[index]) {
        renderFeedbackOnly();
        return;
      }
      if (phase === 'break' || (index === breakAfter && !breakDone && index < rounds.length)) {
        phase = 'break';
        updateChrome();
        renderBreak();
        return;
      }
      showStep();
    }

    function loadRounds(fresh) {
      if (!fresh && gameId && global.NolanProgress && global.NolanProgress.loadCheckpoint) {
        const cp = global.NolanProgress.loadCheckpoint(gameId);
        if (cp && cp.extra && Array.isArray(cp.extra.rounds) && cp.extra.rounds.length) {
          rounds = cp.extra.rounds;
          index = Math.max(0, Math.min(rounds.length, Number(cp.index) || 0));
          score = Math.max(0, Number(cp.score) || 0);
          streak = cp.extra.streak ? Number(cp.extra.streak) : 0;
          breakDone = !!cp.extra.breakDone;
          phase = cp.extra.phase || 'play';
          lastOk = cp.extra.lastOk;
          resumed = index > 0 || score > 0 || phase === 'feedback' || phase === 'break';
          if (index >= rounds.length) {
            clearPersisted();
          } else {
            if (resumed && global.NolanProgress.showResumeToast) {
              global.NolanProgress.showResumeToast(ui.resume);
            }
            resumeOrStart();
            return;
          }
        }
      }
      rounds = (config.buildRounds && config.buildRounds()) || [];
      index = 0;
      score = 0;
      streak = 0;
      breakDone = false;
      phase = 'play';
      lastOk = null;
      showStep();
    }

    hintBtn.addEventListener('click', () => {
      const round = rounds[index];
      if (!round || !round.hint || phase !== 'play') return;
      hintText.textContent = '';
      const strong = document.createElement('strong');
      strong.textContent = ui.owl + ' ';
      hintText.appendChild(strong);
      hintText.appendChild(document.createTextNode(round.hint));
      hintText.classList.remove('hidden');
    });

    nextBtn.addEventListener('click', () => {
      if (phase !== 'feedback') return;
      index += 1;
      lastOk = null;
      phase = 'play';
      showStep();
    });

    againBtn.addEventListener('click', () => {
      finished = false;
      resumed = false;
      clearPersisted();
      result.classList.add('hidden');
      header.classList.remove('hidden');
      card.classList.remove('hidden');
      loadRounds(true);
    });

    loadRounds(false);
  }

  global.FocusEngine = { mount: mount };
})(window);
