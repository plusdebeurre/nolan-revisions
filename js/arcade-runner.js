/**
 * Short video-game rounds for the Arcade section.
 * ArcadeRunner.mount({ subject, title, subtitle, lang, mode, gates, puzzles, sky })
 * modes: platform | topdown | lane | program | bug
 * Coins never grant XP. Each of 3 gates can grant 2 XP, capped at 6 per run.
 */
(function (global) {
  const SUBJECT = {
    math: 'Math',
    science: 'Science',
    english: 'English',
    hpe: 'HPE',
    french: 'Français',
    thai: 'Thai',
    computing: 'Computing'
  };

  const COPY = {
    en: {
      home: '🏠 Home',
      score: 'Score',
      coins: 'Coins',
      hint: '🦉 Get a hint',
      owl: 'Mr. Owl says:',
      again: 'Play Again 🔄',
      doneTitle: 'Stage clear!',
      scored: 'Gates',
      outOf: 'out of',
      perfect: 'Every gate on the first try. 🌟',
      good: 'Nice run. The gates are the part that counts. 👍',
      retry: 'The coins were fun. The gates are the lesson. 💪',
      yes: 'Gate open! 🎉',
      nope: 'Not this one.',
      left: 'Left',
      right: 'Right',
      jump: 'Jump',
      up: 'Up',
      down: 'Down',
      go: 'Go!',
      undo: 'Undo',
      resume: 'Resuming…',
      time: 'Time'
    },
    fr: {
      home: '🏠 Accueil',
      score: 'Score',
      coins: 'Pièces',
      hint: '🦉 Un indice',
      owl: 'M. Hibou dit :',
      again: 'Rejouer 🔄',
      doneTitle: 'Niveau fini !',
      scored: 'Portes',
      outOf: 'sur',
      perfect: 'Toutes les portes du premier coup. 🌟',
      good: 'Belle course. Ce sont les portes qui comptent. 👍',
      retry: 'Les pièces étaient pour le plaisir. Les portes sont la leçon. 💪',
      yes: 'Porte ouverte ! 🎉',
      nope: 'Pas celui-là.',
      left: 'Gauche',
      right: 'Droite',
      jump: 'Saut',
      up: 'Haut',
      down: 'Bas',
      go: 'Partez !',
      undo: 'Annuler',
      resume: 'On reprend…',
      time: 'Temps'
    }
  };

  const DIRS = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  };

  function fun() {
    return global.FunEffects || null;
  }

  function kenney(file) {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src || '';
      if (src.indexOf('arcade-runner.js') !== -1) {
        return src.replace(/js\/arcade-runner\.js.*$/, 'vendor/kenney/' + file);
      }
    }
    return '../../../vendor/kenney/' + file;
  }

  function shuffle(arr) {
    const x = arr.slice();
    for (let n = x.length - 1; n > 0; n--) {
      const j = Math.floor(Math.random() * (n + 1));
      const t = x[n];
      x[n] = x[j];
      x[j] = t;
    }
    return x;
  }

  function walkGrid(start, moves, w, h) {
    let x = start[0];
    let y = start[1];
    const path = [[x, y]];
    moves.forEach((move) => {
      const d = DIRS[move];
      if (!d) return;
      const nx = x + d[0];
      const ny = y + d[1];
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      x = nx;
      y = ny;
      path.push([x, y]);
    });
    return { x: x, y: y, path: path };
  }

  function mount(config) {
    const lang = config.lang === 'fr' ? 'fr' : 'en';
    const ui = Object.assign({}, COPY[lang]);
    const subject = config.subject || 'math';
    const mode = config.mode || 'platform';
    const title = config.title || 'Arcade';
    const subtitle = config.subtitle || '';
    const gates = (config.gates || []).slice(0, 3);
    const puzzles = config.puzzles || [];
    const sky = config.sky || '#38bdf8';
    const backHref = config.backHref || '../index.html';
    const homeHref = config.homeHref || '../../../index.html';
    const limitMs = mode === 'program' || mode === 'bug' ? 180000 : 75000;

    const kept = [];
    if (document.body.classList.contains('nolan-embedded')) kept.push('nolan-embedded');
    if (document.body.classList.contains('hub-locked')) kept.push('hub-locked');
    document.body.className = 'game theme-' + subject + (kept.length ? ' ' + kept.join(' ') : '');

    const app = document.getElementById('app') || document.body.appendChild(document.createElement('div'));
    app.id = 'app';
    app.className = 'w-full max-w-3xl mx-auto px-4 py-6';

    const gameId =
      config.gameId ||
      (document.body && document.body.getAttribute('data-game-id')) ||
      '';

    let gateIndex = 0;
    let gateScore = 0;
    let coins = 0;
    let finished = false;
    let runId = String(Date.now());
    let firstTry = true;
    let gateBusy = false;
    let phaserGame = null;
    let sceneApi = null;
    const pad = { left: false, right: false, up: false, down: false, jump: false };

    app.innerHTML =
      '<div class="score-hud" id="live-score"></div>' +
      '<div class="nav-bar">' +
      '<a class="nav-link" id="arc-back" href="' + backHref + '"></a>' +
      '<a class="nav-link" id="arc-home" href="' + homeHref + '"></a>' +
      '</div>' +
      '<div class="mb-4 text-center" id="arc-header">' +
      '<h1 class="text-3xl font-bold mb-1" id="arc-title" style="color: var(--accent-dark)"></h1>' +
      '<p class="text-lg text-slate-500" id="arc-sub"></p>' +
      '<p id="arc-line" class="live-score-line"></p>' +
      '<p id="arc-coins" class="text-sm font-semibold text-slate-500"></p>' +
      '</div>' +
      '<div class="arcade-host" id="arcade-host"><div id="arcade-canvas"></div></div>' +
      '<div class="arcade-pad" id="arcade-pad"></div>' +
      '<div id="arcade-program" class="hidden question-card p-4 mt-3"></div>' +
      '<div id="arcade-gate" class="hidden question-card p-4 mt-3">' +
      '<p id="arcade-prompt" class="play-bubble"></p>' +
      '<div id="arcade-options" class="grid gap-3"></div>' +
      '<button type="button" id="arcade-hint" class="btn-hint"></button>' +
      '<div id="arcade-hint-text" class="hidden mt-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 font-medium"></div>' +
      '<div id="arcade-feedback" class="hidden text-center p-3 rounded-xl mt-3 font-medium"></div>' +
      '</div>' +
      '<div id="arc-result" class="hidden question-card p-8 text-center mt-4">' +
      '<div class="text-6xl mb-3">🏆</div>' +
      '<h2 class="text-3xl font-bold mb-3" id="arc-done" style="color: var(--accent-dark)"></h2>' +
      '<p class="text-2xl mb-4"><span id="arc-scored"></span> <span id="arc-score" class="font-bold text-3xl" style="color: var(--accent)"></span> <span id="arc-outof"></span> 3</p>' +
      '<p id="arc-message" class="text-lg text-slate-500 mb-6"></p>' +
      '<button type="button" id="arc-again" class="btn-primary"></button>' +
      '</div>';

    document.getElementById('arc-back').textContent = '← ' + (SUBJECT[subject] || 'Subject');
    document.getElementById('arc-home').textContent = ui.home;
    document.getElementById('arc-title').textContent = title;
    document.getElementById('arc-sub').textContent = subtitle;
    document.getElementById('arcade-hint').textContent = ui.hint;
    document.getElementById('arc-done').textContent = ui.doneTitle;
    document.getElementById('arc-scored').textContent = ui.scored;
    document.getElementById('arc-outof').textContent = ui.outOf;
    document.getElementById('arc-again').textContent = ui.again;

    const hud = document.getElementById('live-score');
    const line = document.getElementById('arc-line');
    const coinLine = document.getElementById('arc-coins');
    const gateBox = document.getElementById('arcade-gate');
    const promptEl = document.getElementById('arcade-prompt');
    const optionsEl = document.getElementById('arcade-options');
    const hintText = document.getElementById('arcade-hint-text');
    const feedback = document.getElementById('arcade-feedback');
    const result = document.getElementById('arc-result');
    const padEl = document.getElementById('arcade-pad');
    const programEl = document.getElementById('arcade-program');

    function paintScore() {
      const text = ui.score + ': ' + gateScore + ' / 3';
      hud.textContent = text;
      line.textContent = text + ' · ' + ui.time + ' ' + (sceneApi ? sceneApi.seconds() : 0) + 's';
      coinLine.textContent = ui.coins + ': ' + coins;
    }

    function persist() {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.saveCheckpoint || finished) return;
      global.NolanProgress.saveCheckpoint(gameId, {
        index: gateIndex,
        score: gateScore,
        extra: { coins: coins, runId: runId }
      });
    }

    function clearPersisted() {
      if (gameId && global.NolanProgress && global.NolanProgress.clearCheckpoint) {
        global.NolanProgress.clearCheckpoint(gameId);
      }
    }

    function award(gate) {
      if (!gameId || !global.NolanProgress || !global.NolanProgress.awardAnswerXp) {
        return { xpGained: 0 };
      }
      const key = global.NolanProgress.questionKey
        ? global.NolanProgress.questionKey([gameId, gate.prompt, gate.answer])
        : gate.prompt;
      const awarded = global.NolanProgress.awardAnswerXp(gameId, {
        key: key,
        correct: true,
        streak: 0,
        arcade: true,
        runId: runId
      });
      if (fun() && fun().showXpGain) {
        fun().showXpGain(awarded.xpGained, {
          alreadyAwarded: !!awarded.alreadyAwarded,
          bonus: 0,
          anchor: hud
        });
      }
      return awarded;
    }

    function showFeedback(ok, text) {
      feedback.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
      feedback.textContent = '';
      feedback.classList.add(ok ? 'bg-green-100' : 'bg-red-100', ok ? 'text-green-800' : 'text-red-800');
      const strong = document.createElement('strong');
      strong.textContent = ok ? ui.yes : ui.nope;
      feedback.appendChild(strong);
      feedback.appendChild(document.createElement('br'));
      feedback.appendChild(document.createTextNode(text || ''));
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (sceneApi) sceneApi.stop();
      if (phaserGame) {
        phaserGame.destroy(true);
        phaserGame = null;
      }
      gateBox.classList.add('hidden');
      programEl.classList.add('hidden');
      padEl.classList.add('hidden');
      document.getElementById('arcade-host').classList.add('hidden');
      result.classList.remove('hidden');
      document.getElementById('arc-score').textContent = String(gateScore);
      const mistakes = 3 - gateScore;
      document.getElementById('arc-message').textContent =
        mistakes <= 0 ? ui.perfect : mistakes <= 2 ? ui.good : ui.retry;
      if (mistakes <= 0 && fun()) fun().celebratePerfect();
      paintScore();
      clearPersisted();
      if (gameId && global.NolanProgress && global.NolanProgress.recordResult) {
        global.NolanProgress.recordResult(gameId, { score: gateScore, total: 3, skipXp: true });
      }
    }

    function openGate(index) {
      const gate = gates[index];
      if (!gate) {
        finish();
        return;
      }
      firstTry = true;
      promptEl.textContent = '';
      if (gate.listen && gate.listen.text) {
        const listen = document.createElement('button');
        listen.type = 'button';
        listen.className = 'btn-hint';
        listen.style.marginBottom = '0.6rem';
        listen.textContent = lang === 'fr' ? '🔊 Écoute' : '🔊 Listen';
        listen.addEventListener('click', () => {
          const spoke = global.NolanSpeak && global.NolanSpeak.speak(gate.listen.text, gate.listen.lang || 'th-TH');
          if (!spoke && gate.listen.fallback) promptEl.textContent = gate.prompt + ' · ' + gate.listen.fallback;
        });
        promptEl.appendChild(listen);
        promptEl.appendChild(document.createElement('br'));
      }
      promptEl.appendChild(document.createTextNode(gate.prompt));
      optionsEl.innerHTML = '';
      hintText.classList.add('hidden');
      feedback.classList.add('hidden');
      shuffle(gate.options || []).forEach((opt) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn play-choice';
        button.dataset.choice = opt.id;
        button.textContent = opt.label;
        button.addEventListener('click', () => choose(gate, opt.id, button));
        optionsEl.appendChild(button);
      });
      gateBox.classList.remove('hidden');
      if (sceneApi) sceneApi.pause();
    }

    function choose(gate, id, button) {
      if (gateBusy) return;
      const ok = id === gate.answer;
      if (firstTry && ok) {
        gateScore += 1;
        award(gate);
        if (fun()) fun().showStreak(0);
        paintScore();
      }
      if (!ok && firstTry) {
        if (fun()) fun().shake(gateBox);
      }
      firstTry = false;
      Array.prototype.forEach.call(optionsEl.children, (node) => {
        node.disabled = node.dataset.choice !== gate.answer && node !== button;
        if (node.dataset.choice === gate.answer) node.classList.add('correct');
        else if (node === button) node.classList.add('wrong');
      });
      showFeedback(ok, ok ? (gate.cheer || gate.explain) : gate.explain);
      if (ok) {
        gateBusy = true;
        setTimeout(() => {
          gateBusy = false;
          gateBox.classList.add('hidden');
          gateIndex += 1;
          persist();
          if (gateIndex >= 3) finish();
          else if (sceneApi) sceneApi.resumePastGate();
        }, 700);
      } else {
        Array.prototype.forEach.call(optionsEl.children, (node) => {
          node.disabled = false;
        });
      }
    }

    document.getElementById('arcade-hint').addEventListener('click', () => {
      const gate = gates[gateIndex];
      if (!gate || !gate.hint) return;
      hintText.textContent = ui.owl + ' ' + gate.hint;
      hintText.classList.remove('hidden');
    });

    function holdButton(label, key) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-primary';
      button.textContent = label;
      const down = (event) => {
        event.preventDefault();
        pad[key] = true;
      };
      const up = (event) => {
        event.preventDefault();
        pad[key] = false;
      };
      button.addEventListener('pointerdown', down);
      button.addEventListener('pointerup', up);
      button.addEventListener('pointerleave', up);
      button.addEventListener('pointercancel', up);
      padEl.appendChild(button);
    }

    function buildPad() {
      padEl.innerHTML = '';
      padEl.classList.remove('hidden');
      if (mode === 'platform') {
        holdButton(ui.left, 'left');
        holdButton(ui.jump, 'jump');
        holdButton(ui.right, 'right');
      } else if (mode === 'topdown') {
        holdButton(ui.left, 'left');
        holdButton(ui.up, 'up');
        holdButton(ui.down, 'down');
        holdButton(ui.right, 'right');
      } else if (mode === 'lane') {
        holdButton(ui.up, 'up');
        holdButton(ui.down, 'down');
      } else {
        padEl.classList.add('hidden');
      }
    }

    function bootProgram() {
      let puzzleIndex = 0;
      let moves = [];
      let locked = false;
      let firstGo = true;

      function puzzle() {
        return puzzles[puzzleIndex];
      }

      function drawSlots() {
        const row = programEl.querySelector('[data-slots]');
        if (!row) return;
        row.textContent = '';
        const current = puzzle();
        const count = (current && current.max) || 4;
        const shown = mode === 'bug' ? current.moves.slice() : moves.slice();
        if (mode === 'bug') shown[current.fix] = '?';
        for (let i = 0; i < count; i++) {
          const chip = document.createElement('span');
          chip.className = 'option-btn';
          chip.style.width = 'auto';
          chip.textContent = shown[i] ? labelDir(shown[i]) : '·';
          row.appendChild(chip);
        }
      }

      function labelDir(id) {
        if (id === 'up') return ui.up;
        if (id === 'down') return ui.down;
        if (id === 'left') return ui.left;
        if (id === 'right') return ui.right;
        return id;
      }

      function advance() {
        gateIndex += 1;
        puzzleIndex += 1;
        firstGo = true;
        persist();
        if (puzzleIndex >= puzzles.length || puzzleIndex >= 3) finish();
        else renderPuzzle();
      }

      function renderPuzzle() {
        const current = puzzle();
        if (!current) {
          finish();
          return;
        }
        moves = [];
        locked = false;
        programEl.classList.remove('hidden');
        programEl.textContent = '';
        const heading = document.createElement('p');
        heading.className = 'play-bubble';
        heading.textContent = current.prompt || (lang === 'fr' ? 'Mène le robot au drapeau.' : 'Lead the robot to the flag.');
        const slots = document.createElement('div');
        slots.dataset.slots = '1';
        slots.className = 'play-tray';
        programEl.appendChild(heading);
        programEl.appendChild(slots);
        const actions = document.createElement('div');
        actions.className = 'arcade-pad';
        if (mode === 'bug') {
          (current.options || []).forEach((opt) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-primary';
            button.textContent = labelDir(opt);
            button.addEventListener('click', () => tryBug(opt));
            actions.appendChild(button);
          });
        } else {
          ['left', 'right', 'up', 'down'].forEach((dir) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-primary';
            button.textContent = labelDir(dir);
            button.addEventListener('click', () => {
              if (locked || moves.length >= (current.max || 4)) return;
              moves.push(dir);
              drawSlots();
            });
            actions.appendChild(button);
          });
          const undo = document.createElement('button');
          undo.type = 'button';
          undo.className = 'btn-hint';
          undo.style.marginTop = '0';
          undo.textContent = ui.undo;
          undo.addEventListener('click', () => {
            if (locked) return;
            moves.pop();
            drawSlots();
          });
          const go = document.createElement('button');
          go.type = 'button';
          go.className = 'btn-primary';
          go.textContent = ui.go;
          go.addEventListener('click', () => tryPath(moves.slice()));
          actions.appendChild(undo);
          actions.appendChild(go);
        }
        programEl.appendChild(actions);
        drawSlots();
        if (sceneApi) sceneApi.showPuzzle(current);
      }

      function tryPath(list) {
        if (locked || !sceneApi) return;
        locked = true;
        const isFirst = firstGo;
        firstGo = false;
        sceneApi.playPath(puzzle(), list, (ok) => {
          locked = false;
          if (ok && isFirst) {
            gateScore += 1;
            award({ prompt: (puzzle().prompt || 'program') + '-' + puzzleIndex, answer: 'flag' });
            paintScore();
          }
          if (ok) advance();
          else if (sceneApi) sceneApi.resetRobot();
        });
      }

      function tryBug(opt) {
        if (locked || !sceneApi) return;
        const current = puzzle();
        const list = current.moves.slice();
        list[current.fix] = opt;
        const isFirst = firstGo;
        firstGo = false;
        locked = true;
        sceneApi.playPath(current, list, (ok) => {
          locked = false;
          const good = ok && opt === current.answer;
          if (good && isFirst) {
            gateScore += 1;
            award({ prompt: current.prompt, answer: current.answer });
            paintScore();
          }
          if (good) advance();
          else if (sceneApi) sceneApi.resetRobot();
        });
      }

      renderPuzzle();
    }

    function bootPhaser(startGate) {
      const hooks = {
        pad: pad,
        kenney: kenney,
        sky: sky,
        mode: mode,
        startGate: startGate,
        onCoin: () => {
          coins += 1;
          paintScore();
        },
        onGate: (index) => {
          if (index !== gateIndex || finished) return;
          openGate(index);
        },
        onTime: () => finish(),
        onFrame: () => paintScore(),
        onReady: () => {
          if (mode === 'program' || mode === 'bug') bootProgram();
        }
      };

      const scene = new Phaser.Scene('arcade');
      scene.preload = function () {
        this.load.spritesheet('hero', kenney('tilemap-characters_packed.png'), {
          frameWidth: 18,
          frameHeight: 18
        });
        this.load.spritesheet('tiles', kenney('tilemap_packed.png'), {
          frameWidth: 18,
          frameHeight: 18
        });
      };
      scene.create = function () {
        buildWorld(this, hooks);
        sceneApi = this.arcadeApi;
        global.ArcadeRunner.current = this.arcadeApi;
        paintScore();
        if (hooks.onReady) hooks.onReady();
      };
      scene.update = function (_time, delta) {
        if (this.arcadeApi) this.arcadeApi.tick(delta);
      };

      phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'arcade-canvas',
        width: 480,
        height: 270,
        backgroundColor: sky,
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: { gravity: { y: mode === 'platform' ? 1100 : 0 }, debug: false }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 480,
          height: 270
        },
        scene: scene
      });
      global.ArcadeRunner.game = phaserGame;
    }

    function boot(startGate) {
      gateIndex = startGate || 0;
      buildPad();
      document.getElementById('arcade-host').classList.remove('hidden');
      result.classList.add('hidden');
      if (mode === 'program' || mode === 'bug') bootPhaser(0);
      else bootPhaser(gateIndex);
      paintScore();
    }

    document.getElementById('arc-again').addEventListener('click', () => {
      finished = false;
      gateIndex = 0;
      gateScore = 0;
      coins = 0;
      runId = String(Date.now());
      clearPersisted();
      if (phaserGame) {
        phaserGame.destroy(true);
        phaserGame = null;
      }
      sceneApi = null;
      boot(0);
    });

    document.addEventListener('keydown', (event) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down', Space: 'jump' };
      if (map[event.code]) {
        pad[map[event.code]] = true;
        if (event.code === 'Space') event.preventDefault();
      }
    });
    document.addEventListener('keyup', (event) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down', Space: 'jump' };
      if (map[event.code]) pad[map[event.code]] = false;
    });

    let resumeGate = 0;
    if (gameId && global.NolanProgress && global.NolanProgress.loadCheckpoint) {
      const cp = global.NolanProgress.loadCheckpoint(gameId);
      if (cp && cp.index > 0 && cp.index < 3) {
        resumeGate = cp.index;
        gateScore = Math.max(0, Number(cp.score) || 0);
        coins = cp.extra && cp.extra.coins ? cp.extra.coins : 0;
        if (cp.extra && cp.extra.runId) runId = cp.extra.runId;
        if (global.NolanProgress.showResumeToast) global.NolanProgress.showResumeToast(ui.resume);
      }
    }

    boot(resumeGate);
    global.ArcadeRunner.current = null;
  }

  function buildWorld(scene, hooks) {
    const mode = hooks.mode;
    const elapsed = { ms: 0, paused: false, ended: false };
    const api = {
      seconds: () => Math.min(75, Math.floor(elapsed.ms / 1000)),
      pause: () => {
        elapsed.paused = true;
        if (scene.physics && scene.physics.world) scene.physics.world.pause();
      },
      resumePastGate: () => {
        elapsed.paused = false;
        if (scene.physics && scene.physics.world) scene.physics.world.resume();
        if (api.onPass) api.onPass();
      },
      stop: () => {
        elapsed.ended = true;
      },
      tick: (delta) => {
        if (elapsed.ended || elapsed.paused) return;
        elapsed.ms += delta;
        if (api.onTick) api.onTick(delta);
        if (hooks.onFrame) hooks.onFrame();
        if (elapsed.ms >= 75000 && mode !== 'program' && mode !== 'bug') {
          elapsed.ended = true;
          hooks.onTime();
        }
      }
    };
    scene.arcadeApi = api;

    if (mode === 'program' || mode === 'bug') {
      api.showPuzzle = (puzzle) => drawProgram(scene, puzzle);
      api.playPath = (puzzle, moves, done) => animatePath(scene, puzzle, moves, done);
      api.resetRobot = () => {
        if (scene.robotHome) scene.robot.setPosition(scene.robotHome.x, scene.robotHome.y);
      };
      return;
    }
    if (mode === 'platform') buildPlatform(scene, hooks, api);
    else if (mode === 'topdown') buildTopdown(scene, hooks, api);
    else buildLane(scene, hooks, api);
  }

  function nearest(scene, key) {
    const tex = scene.textures.get(key);
    if (tex && tex.setFilter) tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  function buildPlatform(scene, hooks, api) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    const width = 8200;
    const groundY = 220;
    for (let x = 0; x < width; x += 36) {
      const gap = (x > 900 && x < 990) || (x > 3000 && x < 3090) || (x > 5400 && x < 5490);
      if (gap) continue;
      scene.add.image(x, groundY, 'tiles', 0).setOrigin(0, 0).setScale(2);
    }
    const floor = scene.add.rectangle(width / 2, groundY + 28, width, 24, 0x166534, 0);
    scene.physics.add.existing(floor, true);
    const player = scene.physics.add.sprite(80, 160, 'hero', 0);
    player.setScale(2);
    player.setCollideWorldBounds(false);
    player.body.setSize(12, 16);
    scene.physics.add.collider(player, floor);
    scene.cameras.main.setBounds(0, 0, width, 270);
    scene.cameras.main.startFollow(player, true, 0.12, 0.12);
    const gatesX = [1600, 4200, 7000];
    const cleared = [false, false, false];
    for (let i = 0; i < hooks.startGate; i++) cleared[i] = true;
    gatesX.forEach((x, i) => {
      scene.add.image(x, groundY - 28, 'tiles', 20).setScale(2);
      const zone = scene.add.zone(x, 150, 36, 140);
      scene.physics.add.existing(zone, true);
      scene.physics.add.overlap(player, zone, () => {
        if (cleared[i] || elapsedPaused(api)) return;
        if (i !== hooks.startGate && i !== cleared.filter(Boolean).length) return;
        cleared[i] = true;
        hooks.onGate(i);
      });
    });
    for (let x = 200; x < width; x += 220) {
      const coin = scene.physics.add.sprite(x, 150, 'tiles', 48);
      coin.setScale(1.6);
      coin.body.setAllowGravity(false);
      scene.physics.add.overlap(player, coin, () => {
        if (!coin.active) return;
        coin.destroy();
        hooks.onCoin();
      });
    }
    let jumpHeld = false;
    api.onTick = () => {
      let vx = 0;
      if (hooks.pad.left) vx = -110;
      if (hooks.pad.right) vx = 110;
      player.setVelocityX(vx);
      const floorHit = player.body.blocked.down || player.body.touching.down;
      if (hooks.pad.jump && !jumpHeld && floorHit) player.setVelocityY(-380);
      jumpHeld = hooks.pad.jump;
      if (vx < 0) player.setFlipX(true);
      if (vx > 0) player.setFlipX(false);
      if (player.y > 320) player.setPosition(Math.max(40, player.x - 100), 140);
    };
    api.onPass = () => {
      player.x += 70;
    };
    if (hooks.startGate > 0) player.x = gatesX[hooks.startGate - 1] + 80;
    scene.player = player;
  }

  function elapsedPaused() {
    return false;
  }

  function buildTopdown(scene, hooks, api) {
    nearest(scene, 'hero');
    nearest(scene, 'tiles');
    const width = 6400;
    for (let x = 0; x < width; x += 36) {
      scene.add.image(x, 8, 'tiles', 2).setOrigin(0, 0).setScale(2);
      scene.add.image(x, 230, 'tiles', 2).setOrigin(0, 0).setScale(2);
    }
    const top = scene.add.rectangle(width / 2, 16, width, 32, 0x000000, 0);
    const bottom = scene.add.rectangle(width / 2, 250, width, 32, 0x000000, 0);
    scene.physics.add.existing(top, true);
    scene.physics.add.existing(bottom, true);
    const player = scene.physics.add.sprite(80, 130, 'hero', 0);
    player.setScale(2);
    player.body.setAllowGravity(false);
    scene.physics.add.collider(player, top);
    scene.physics.add.collider(player, bottom);
    scene.cameras.main.setBounds(0, 0, width, 270);
    scene.cameras.main.startFollow(player, true, 0.12, 0.12);
    const gatesX = [1500, 3600, 5600];
    const cleared = [];
    for (let i = 0; i < hooks.startGate; i++) cleared[i] = true;
    gatesX.forEach((x, i) => {
      const zone = scene.add.zone(x, 130, 40, 80);
      scene.physics.add.existing(zone, true);
      scene.add.image(x, 130, 'tiles', 22).setScale(2);
      scene.physics.add.overlap(player, zone, () => {
        if (cleared[i]) return;
        if (i !== cleared.filter(Boolean).length && i !== hooks.startGate) return;
        cleared[i] = true;
        hooks.onGate(i);
      });
    });
    api.onTick = () => {
      let vx = 0;
      let vy = 0;
      if (hooks.pad.left) vx = -100;
      if (hooks.pad.right) vx = 100;
      if (hooks.pad.up) vy = -100;
      if (hooks.pad.down) vy = 100;
      player.setVelocity(vx, vy);
      if (vx < 0) player.setFlipX(true);
      if (vx > 0) player.setFlipX(false);
    };
    api.onPass = () => {
      player.x += 80;
    };
    if (hooks.startGate > 0) player.x = gatesX[hooks.startGate - 1] + 90;
    scene.player = player;
    api.player = player;
  }

  function buildLane(scene, hooks, api) {
    nearest(scene, 'hero');
    nearest(scene, 'tiles');
    const lanes = [70, 135, 200];
    let lane = 1;
    lanes.forEach((y) => {
      scene.add.rectangle(240, y, 480, 8, 0xffffff, 0.25).setScrollFactor(0);
    });
    const player = scene.physics.add.sprite(90, lanes[lane], 'hero', 0);
    player.setScale(2);
    player.body.setAllowGravity(false);
    let upHeld = false;
    let downHeld = false;
    let spawned = 0;
    const gateAt = [16000, 38000, 60000];
    const opened = [false, false, false];
    for (let i = 0; i < hooks.startGate; i++) opened[i] = true;
    api.onTick = (delta) => {
      if (hooks.pad.up && !upHeld && lane > 0) lane -= 1;
      if (hooks.pad.down && !downHeld && lane < 2) lane += 1;
      upHeld = hooks.pad.up;
      downHeld = hooks.pad.down;
      player.y += (lanes[lane] - player.y) * 0.3;
      spawned += delta;
      if (spawned > 850) {
        spawned = 0;
        const y = lanes[Math.floor(Math.random() * 3)];
        const block = scene.physics.add.sprite(500, y, 'tiles', 8);
        block.setScale(1.5);
        block.body.setAllowGravity(false);
        block.setVelocityX(-150);
        scene.physics.add.overlap(player, block, () => {
          if (!block.active) return;
          block.destroy();
          if (fun()) fun().shake(document.getElementById('arcade-host'));
        });
      }
      gateAt.forEach((at, i) => {
        if (!opened[i] && api.seconds() * 1000 >= at) {
          opened[i] = true;
          hooks.onGate(i);
        }
      });
    };
    api.onPass = () => {};
    scene.player = player;
  }

  function drawProgram(scene, puzzle) {
    if (scene.gridLayer) scene.gridLayer.destroy(true);
    const layer = scene.add.container(0, 0);
    scene.gridLayer = layer;
    const originX = 70;
    const originY = 50;
    const size = 36;
    for (let y = 0; y < puzzle.h; y++) {
      for (let x = 0; x < puzzle.w; x++) {
        const tile = scene.add.image(originX + x * size, originY + y * size, 'tiles', 0).setScale(2);
        layer.add(tile);
      }
    }
    const flag = scene.add.image(originX + puzzle.flag[0] * size, originY + puzzle.flag[1] * size, 'tiles', 20).setScale(2);
    layer.add(flag);
    const robot = scene.add.image(originX + puzzle.start[0] * size, originY + puzzle.start[1] * size, 'hero', 0).setScale(2);
    layer.add(robot);
    scene.robot = robot;
    scene.robotHome = { x: robot.x, y: robot.y };
    scene.programOrigin = { x: originX, y: originY, size: size };
  }

  function animatePath(scene, puzzle, moves, done) {
    const walked = walkGrid(puzzle.start, moves, puzzle.w, puzzle.h);
    const origin = scene.programOrigin || { x: 70, y: 50, size: 36 };
    let step = 1;
    const next = () => {
      if (!scene.robot || step >= walked.path.length) {
        const end = walked.path[walked.path.length - 1];
        const ok = end[0] === puzzle.flag[0] && end[1] === puzzle.flag[1];
        done(ok);
        return;
      }
      const cell = walked.path[step];
      step += 1;
      scene.tweens.add({
        targets: scene.robot,
        x: origin.x + cell[0] * origin.size,
        y: origin.y + cell[1] * origin.size,
        duration: 260,
        onComplete: next
      });
    };
    if (walked.path.length < 2) done(false);
    else next();
  }

  global.ArcadeRunner = { mount: mount, current: null };
})(window);
