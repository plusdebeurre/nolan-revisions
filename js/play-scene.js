/**
 * Toy scenes: a character reacts when the child gives, catches, or builds.
 * PlayScene.mount({ subject, lang, title, subtitle, backHref, homeHref, buildRounds })
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
      add: 'Add a biscuit',
      back: 'Put one back',
      serve: 'Serve!',
      listen: '🔊 Listen',
      resume: 'Resuming…'
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
      add: 'Un de plus',
      back: 'J’en retire un',
      serve: 'Je sers !',
      listen: '🔊 Écoute',
      resume: 'On reprend…'
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
    const title = config.title || 'Play';
    const subtitle = config.subtitle || '';
    const backHref = config.backHref || '../index.html';
    const homeHref = config.homeHref || '../../../index.html';

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
    let phase = 'play';
    let lastOk = null;
    let worn = [];
    let finished = false;

    app.innerHTML =
      '<div class="score-hud" id="live-score"></div>' +
      '<div class="nav-bar">' +
      '<a class="nav-link" id="play-back" href="' + backHref + '"></a>' +
      '<a class="nav-link" id="play-home" href="' + homeHref + '"></a>' +
      '</div>' +
      '<div class="mb-6 text-center animate-pop" id="play-header">' +
      '<h1 class="text-3xl md:text-4xl font-bold mb-2" id="play-title" style="color: var(--accent-dark)"></h1>' +
      '<p class="text-lg text-slate-500 font-medium" id="play-sub"></p>' +
      '<div class="progress-track"><div id="play-bar" class="progress-bar-fill"></div></div>' +
      '<p id="play-tracker" class="mt-2 text-sm font-semibold" style="color: var(--accent)"></p>' +
      '<p id="play-line" class="live-score-line"></p>' +
      '</div>' +
      '<div id="play-card" class="question-card p-6 md:p-8 animate-pop">' +
      '<div id="play-stage" class="play-stage"></div>' +
      '<div id="play-hint-area" class="mb-4 hidden">' +
      '<button type="button" id="play-hint" class="btn-hint"></button>' +
      '<div id="play-hint-text" class="hidden mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 font-medium"></div>' +
      '</div>' +
      '<div id="play-feedback" class="hidden text-center p-4 rounded-xl mb-6 text-lg font-medium"></div>' +
      '<div class="text-center"><button type="button" id="play-next" class="hidden btn-primary"></button></div>' +
      '</div>' +
      '<div id="play-result" class="hidden question-card p-8 text-center animate-pop">' +
      '<div class="text-6xl mb-4">🏆</div>' +
      '<h2 class="text-4xl font-bold mb-4" id="play-done" style="color: var(--accent-dark)"></h2>' +
      '<p class="text-2xl font-medium text-slate-600 mb-6"><span id="play-scored-label"></span> <span id="play-score" class="font-bold text-3xl" style="color: var(--accent)"></span> <span id="play-outof"></span> <span id="play-total"></span></p>' +
      '<p id="play-message" class="text-lg text-slate-500 mb-8 font-medium"></p>' +
      '<button type="button" id="play-again" class="btn-primary"></button>' +
      '</div>';

    document.getElementById('play-back').textContent = '← ' + subjectLabel;
    document.getElementById('play-home').textContent = ui.home;
    document.getElementById('play-title').textContent = title;
    document.getElementById('play-sub').textContent = subtitle;
    document.getElementById('play-hint').textContent = ui.hint;
    document.getElementById('play-done').textContent = ui.doneTitle;
    document.getElementById('play-scored-label').textContent = ui.scored;
    document.getElementById('play-outof').textContent = ui.outOf;
    document.getElementById('play-again').textContent = ui.again;

    const bar = document.getElementById('play-bar');
    const tracker = document.getElementById('play-tracker');
    const line = document.getElementById('play-line');
    const hud = document.getElementById('live-score');
    const header = document.getElementById('play-header');
    const card = document.getElementById('play-card');
    const stage = document.getElementById('play-stage');
    const hintArea = document.getElementById('play-hint-area');
    const hintBtn = document.getElementById('play-hint');
    const hintText = document.getElementById('play-hint-text');
    const feedback = document.getElementById('play-feedback');
    const nextBtn = document.getElementById('play-next');
    const result = document.getElementById('play-result');
    const scoreEl = document.getElementById('play-score');
    const totalEl = document.getElementById('play-total');
    const message = document.getElementById('play-message');

    function persist() {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.saveCheckpoint || finished) return;
      global.NolanProgress.saveCheckpoint(gameId, {
        index: index,
        score: score,
        extra: { rounds: rounds, streak: streak, phase: phase, lastOk: lastOk, worn: worn }
      });
    }

    function clearPersisted() {
      if (gameId && global.NolanProgress && global.NolanProgress.clearCheckpoint) {
        global.NolanProgress.clearCheckpoint(gameId);
      }
    }

    function updateChrome() {
      const total = rounds.length || 1;
      tracker.textContent = ui.round + ' ' + Math.min(index + 1, rounds.length) + ' ' + ui.of + ' ' + rounds.length;
      bar.style.width = Math.min(100, (index / total) * 100) + '%';
      const text = ui.score + ': ' + score + ' / ' + rounds.length;
      hud.textContent = text;
      line.textContent = ui.score + ': ' + score;
      totalEl.textContent = String(rounds.length);
    }

    function award(round) {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.awardAnswerXp) return;
      const key = global.NolanProgress.questionKey
        ? global.NolanProgress.questionKey([gameId, round.key || round.prompt || index])
        : String(round.key || index);
      const awarded = global.NolanProgress.awardAnswerXp(gameId, { key: key, correct: true, streak: streak });
      if (fun() && fun().showXpGain) {
        fun().showXpGain(awarded.xpGained, {
          alreadyAwarded: !!awarded.alreadyAwarded,
          bonus: awarded.bonus,
          anchor: hud
        });
      }
    }

    function paintFeedback(ok, text) {
      feedback.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
      feedback.textContent = '';
      if (ok) feedback.classList.add('bg-green-100', 'text-green-800');
      else feedback.classList.add('bg-red-100', 'text-red-800');
      const strong = document.createElement('strong');
      strong.textContent = ok ? ui.yes : ui.nope;
      feedback.appendChild(strong);
      if (text) {
        feedback.appendChild(document.createElement('br'));
        feedback.appendChild(document.createTextNode(text));
      }
      nextBtn.textContent = index >= rounds.length - 1 ? ui.seeScore : ui.next;
      nextBtn.classList.remove('hidden');
      hintBtn.classList.add('hidden');
    }

    function settle(ok, round, clicked) {
      if (phase !== 'play' || finished) return;
      phase = 'feedback';
      lastOk = !!ok;
      const actor = stage.querySelector('.play-actor');
      if (ok) {
        score += 1;
        streak += 1;
        if (actor) {
          actor.classList.remove('boing');
          void actor.offsetWidth;
          actor.classList.add('boing');
        }
        if (round.wear && clicked && clicked.emoji) worn.push(clicked.emoji);
        if (fun()) fun().showStreak(streak);
        award(round);
        if (fun()) fun().pulseScore(hud);
        paintFeedback(true, round.cheer || round.explain || '');
      } else {
        streak = 0;
        if (clicked && clicked.el) clicked.el.classList.add('bonk');
        if (fun()) fun().shake(card);
        paintFeedback(false, round.explain || '');
      }
      stage.querySelectorAll('button').forEach((node) => {
        node.disabled = true;
      });
      updateChrome();
      persist();
    }

    function cast(round) {
      stage.textContent = '';
      feedback.classList.add('hidden');
      feedback.textContent = '';
      nextBtn.classList.add('hidden');
      if (round.hint && phase === 'play') {
        hintArea.classList.remove('hidden');
        hintBtn.classList.remove('hidden');
        hintText.classList.add('hidden');
        hintText.textContent = '';
      } else hintArea.classList.add('hidden');

      const wornRow = document.createElement('div');
      wornRow.className = 'play-worn';
      worn.forEach((emoji) => {
        const bit = document.createElement('span');
        bit.textContent = emoji;
        wornRow.appendChild(bit);
      });
      const actor = document.createElement('div');
      actor.className = 'play-actor';
      actor.textContent = round.actor || '🌟';
      const bubble = document.createElement('p');
      bubble.className = 'play-bubble';
      bubble.textContent = round.prompt || '';
      stage.appendChild(wornRow);
      stage.appendChild(actor);
      stage.appendChild(bubble);
      stage.dataset.goal = round.answer != null ? String(round.answer) : String(round.answerCount);
      if (round.listen && round.listen.text) {
        const listen = document.createElement('button');
        listen.type = 'button';
        listen.className = 'btn-hint';
        listen.style.marginBottom = '0.8rem';
        listen.textContent = ui.listen;
        listen.addEventListener('click', () => {
          const spoke = global.NolanSpeak && global.NolanSpeak.speak(round.listen.text, round.listen.lang || 'th-TH');
          if (!spoke && round.listen.fallback) {
            bubble.textContent = (round.prompt || '') + ' · ' + round.listen.fallback;
          }
        });
        stage.appendChild(listen);
      }
      return bubble;
    }

    function renderPick(round) {
      cast(round);
      const props = round.props || [];
      const grid = document.createElement('div');
      grid.className = 'play-props' + (props.length > 2 ? ' cols-3' : ' cols-2');
      props.forEach((prop) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn play-prop' + (round.fly ? ' fly' : '');
        button.dataset.propId = prop.id;
        const emo = document.createElement('span');
        emo.className = 'emo';
        emo.textContent = prop.emoji || '';
        const lab = document.createElement('span');
        lab.textContent = prop.label || '';
        button.appendChild(emo);
        button.appendChild(lab);
        button.addEventListener('click', () => {
          const ok = prop.id === round.answer;
          settle(ok, round, { emoji: prop.emoji, el: button });
        });
        grid.appendChild(button);
      });
      stage.appendChild(grid);
    }

    function renderStack(round) {
      cast(round);
      let count = 0;
      const plate = document.createElement('div');
      plate.className = 'play-plate';
      plate.textContent = '🍽️';
      const actions = document.createElement('div');
      actions.className = 'play-actions';
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'btn-primary';
      add.textContent = ui.add;
      const back = document.createElement('button');
      back.type = 'button';
      back.className = 'btn-hint';
      back.style.marginTop = '0';
      back.textContent = ui.back;
      const serve = document.createElement('button');
      serve.type = 'button';
      serve.className = 'btn-primary';
      serve.textContent = ui.serve;
      function paintPlate() {
        plate.textContent = count ? new Array(count + 1).join(round.unit || '🍪') : '🍽️';
      }
      add.addEventListener('click', () => {
        if (phase !== 'play') return;
        if (count >= (round.max || 12)) {
          if (fun()) fun().shake(plate);
          return;
        }
        count += 1;
        paintPlate();
      });
      back.addEventListener('click', () => {
        if (phase !== 'play' || count <= 0) return;
        count -= 1;
        paintPlate();
      });
      serve.addEventListener('click', () => {
        const ok = count === round.answerCount;
        settle(ok, round, { el: plate, emoji: ok ? (round.unit || '🍪') : '' });
      });
      actions.appendChild(add);
      actions.appendChild(back);
      actions.appendChild(serve);
      stage.appendChild(plate);
      stage.appendChild(actions);
    }

    function renderRound(round) {
      if (round.mode === 'stack') renderStack(round);
      else renderPick(round);
    }

    function renderFeedbackOnly() {
      const round = rounds[index];
      cast(round || {});
      paintFeedback(!!lastOk, lastOk ? ((round && round.cheer) || (round && round.explain) || '') : ((round && round.explain) || ''));
    }

    function finish() {
      if (finished) return;
      finished = true;
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
      phase = 'play';
      updateChrome();
      persist();
      renderRound(rounds[index]);
    }

    function loadRounds(fresh) {
      if (!fresh && gameId && global.NolanProgress && global.NolanProgress.loadCheckpoint) {
        const cp = global.NolanProgress.loadCheckpoint(gameId);
        if (cp && cp.extra && Array.isArray(cp.extra.rounds) && cp.extra.rounds.length) {
          rounds = cp.extra.rounds;
          index = Math.max(0, Math.min(rounds.length, Number(cp.index) || 0));
          score = Math.max(0, Number(cp.score) || 0);
          streak = cp.extra.streak ? Number(cp.extra.streak) : 0;
          phase = cp.extra.phase || 'play';
          lastOk = cp.extra.lastOk;
          worn = Array.isArray(cp.extra.worn) ? cp.extra.worn : [];
          const resumed = index > 0 || score > 0 || phase === 'feedback';
          if (index >= rounds.length) clearPersisted();
          else {
            if (resumed && global.NolanProgress.showResumeToast) global.NolanProgress.showResumeToast(ui.resume);
            updateChrome();
            if (phase === 'feedback' && rounds[index]) renderFeedbackOnly();
            else showStep();
            return;
          }
        }
      }
      rounds = (config.buildRounds && config.buildRounds()) || [];
      index = 0;
      score = 0;
      streak = 0;
      phase = 'play';
      lastOk = null;
      worn = [];
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

    document.getElementById('play-again').addEventListener('click', () => {
      finished = false;
      clearPersisted();
      result.classList.add('hidden');
      header.classList.remove('hidden');
      card.classList.remove('hidden');
      loadRounds(true);
    });

    loadRounds(false);
  }

  global.PlayScene = { mount: mount };
})(window);
