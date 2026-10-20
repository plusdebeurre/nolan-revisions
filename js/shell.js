/**
 * Learning Adventure shell: profiles, leaderboard, fullscreen, hub medals.
 */
(function () {
  const FS_KEY = 'nolanWantFs';
  const IN_IFRAME = window.self !== window.top;
  const IS_APP = document.body && document.body.getAttribute('data-nolan-app') === '1';

  function assetPrefix() {
    if (IS_APP) return '';
    const path = (location.pathname || '').replace(/\\/g, '/');
    if (/\/subjects\/[^/]+\/games\//.test(path)) return '../../../';
    if (/\/subjects\/[^/]+\//.test(path)) return '../../';
    return '';
  }

  function resolveAppUrl() {
    const path = location.pathname.replace(/\\/g, '/');
    let src = 'index.html';
    const idx = path.indexOf('/subjects/');
    if (idx !== -1) src = path.slice(idx + 1);
    else if (path.endsWith('/') || /index\.html$/i.test(path) || path === '' || path === '/') {
      src = 'index.html';
    }
    return assetPrefix() + 'app.html?src=' + encodeURIComponent(src);
  }

  function ensureProgress(cb) {
    if (window.NolanProgress) {
      cb();
      return;
    }
    const s = document.createElement('script');
    s.src = assetPrefix() + 'js/progress.js';
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function paintHubMedals() {
    const NP = window.NolanProgress;
    if (!NP || !NP.isUnlocked()) return;
    document.querySelectorAll('.exercise-card[data-game-id]').forEach((card) => {
      const id = card.getAttribute('data-game-id');
      const prog = NP.getGameProgress(id);
      let chip = card.querySelector('.medal-chip');
      if (!chip) {
        chip = el('span', 'medal-chip');
        const h3 = card.querySelector('h3');
        if (h3) h3.appendChild(chip);
        else card.prepend(chip);
      }
      let cont = card.querySelector('.continue-chip');
      if (prog && prog.checkpoint) {
        if (!cont) {
          cont = el('span', 'continue-chip');
          cont.textContent = 'Continue';
          const h3 = card.querySelector('h3');
          if (h3) h3.appendChild(cont);
        }
        cont.classList.remove('hidden');
      } else if (cont) {
        cont.classList.add('hidden');
      }

      if (prog && prog.bestMedal && prog.bestMedal !== 'played') {
        chip.textContent = NP.medalEmoji(prog.bestMedal);
        chip.className = 'medal-chip medal-' + prog.bestMedal;
        chip.title = prog.bestMedal + ' · best ' + prog.bestScore + '/' + prog.bestTotal;
        card.classList.remove('medal-border-gold', 'medal-border-silver', 'medal-border-bronze');
        card.classList.add('medal-border-' + prog.bestMedal);
      } else if (prog && (prog.plays || prog.bestMedal === 'played')) {
        chip.textContent = '✓';
        chip.className = 'medal-chip medal-played';
        chip.title = 'Played';
        card.classList.remove('medal-border-gold', 'medal-border-silver', 'medal-border-bronze');
      } else {
        chip.textContent = '';
        chip.className = 'medal-chip';
        card.classList.remove('medal-border-gold', 'medal-border-silver', 'medal-border-bronze');
      }
    });
    paintHubQuest();
  }

  const ENGLISH_QUIZ = {
    'english/midterm-explorer-quiz': 1,
    'english/animal-groups-safari': 1,
    'english/body-coverings-match': 1,
    'english/pronoun-rescue': 1,
    'english/frequency-meter': 1,
    'english/states-of-matter-lab': 1,
    'english/animal-action-charades': 1,
    'english/plural-party': 1,
    'english/sentence-builder': 1,
    'english/cause-effect-chain': 1,
    'english/opposites-snap': 1,
    'english/listening-lookalike': 1
  };

  function hubSubject() {
    const themes = ['math', 'science', 'english', 'french', 'hpe', 'thai', 'computing'];
    for (let i = 0; i < themes.length; i++) {
      if (document.body.classList.contains('theme-' + themes[i])) return themes[i];
    }
    return '';
  }

  function frenchHub() {
    return document.body.classList.contains('theme-french');
  }

  function kindMeta(kind) {
    const fr = frenchHub();
    const table = {
      quiz: ['❓', fr ? 'Questionnaire' : 'Quiz'],
      reading: ['📖', fr ? 'Lecture' : 'Reading'],
      focus: ['🧠', 'Focus'],
      play: ['🎲', 'Play'],
      arcade: ['🕹️', 'Arcade']
    };
    return table[kind] || table.quiz;
  }

  function moreKind(card) {
    const id = card.getAttribute('data-game-id') || '';
    const subject = id.split('/')[0];
    if (subject === 'french') return 'reading';
    if (subject === 'english') return ENGLISH_QUIZ[id] ? 'quiz' : 'reading';
    return 'quiz';
  }

  function paintCardKinds() {
    document.querySelectorAll('main .grid').forEach((grid) => {
      let section = 'quiz';
      Array.prototype.forEach.call(grid.children, (node) => {
        if (node.tagName === 'H2') {
          const text = (node.textContent || '').toLowerCase();
          if (text.indexOf('arcade') >= 0) section = 'arcade';
          else if (text.indexOf('play') >= 0) section = 'play';
          else if (text.indexOf('focus') >= 0) section = 'focus';
          else if (text.indexOf('lecture') >= 0 || text.indexOf('read') >= 0) section = 'reading';
          else section = 'more';
          return;
        }
        if (!node.classList || !node.classList.contains('exercise-card')) return;
        const explicit = node.getAttribute('data-kind');
        const kind = explicit || (section === 'more' ? moreKind(node) : section);
        const meta = kindMeta(kind);
        const h3 = node.querySelector('h3');
        if (!h3) return;
        let mark = h3.querySelector('.kind-mark');
        if (!mark) {
          mark = document.createElement('span');
          mark.className = 'kind-mark';
          h3.insertBefore(mark, h3.firstChild);
        }
        mark.textContent = meta[0];
        mark.title = meta[1];
      });
    });
  }

  function openQuestPanel() {
    const NP = window.NolanProgress;
    const subject = hubSubject();
    if (!NP || !NP.questSnapshot || !subject) return;
    let panel = document.getElementById('quest-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'quest-panel';
      panel.className = 'quest-panel question-card p-4';
      const header = document.querySelector('header');
      if (header && header.parentNode) header.parentNode.insertBefore(panel, header.nextSibling);
      else document.querySelector('main')?.prepend(panel);
    }
    const snap = NP.questSnapshot(subject);
    const fr = frenchHub();
    const title = fr ? 'Quête' : 'Quest';
    const doneLabel = fr ? 'fait' : 'done';
    const nowLabel = fr ? 'maintenant' : 'now';
    const laterLabel = fr ? 'ensuite' : 'later';
    panel.innerHTML = '<h2 class="text-2xl font-bold mb-2">' + title + '</h2>';
    if (!snap.steps.length) {
      panel.innerHTML += '<p>' + (fr ? 'Pas encore de quête ici.' : 'No quest on this page yet.') + '</p>';
      return;
    }
    snap.steps.forEach((step) => {
      const row = document.createElement('div');
      row.className = 'quest-step' + (step.state === 'now' ? ' now' : '');
      const meta = kindMeta(step.kind);
      const label = step.state === 'done' ? doneLabel : step.state === 'now' ? nowLabel : laterLabel;
      if (step.state === 'later') {
        row.innerHTML = '<span>' + meta[0] + ' ' + escapeHtml(step.title) + '</span><span>' + label + '</span>';
      } else {
        row.innerHTML =
          '<a href="' + escapeHtml(step.href) + '">' + meta[0] + ' ' + escapeHtml(step.title) + '</a><span>' + label + '</span>';
      }
      panel.appendChild(row);
    });
    if (snap.done) {
      const end = document.createElement('p');
      end.className = 'mt-3 font-semibold';
      end.textContent = fr ? 'Quête terminée. Les jeux arcade sont ouverts.' : 'Quest complete. The arcade games are open.';
      panel.appendChild(end);
    }
    panel.classList.remove('hidden');
  }

  function paintHubQuest() {
    if (!document.body.classList.contains('subject-hub')) return;
    const NP = window.NolanProgress;
    if (!NP || !NP.isUnlocked()) return;
    paintCardKinds();
    const nav = document.querySelector('.nav-bar');
    if (nav && !document.getElementById('open-quest')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'open-quest';
      btn.className = 'nav-link';
      btn.textContent = frenchHub() ? 'Quête' : 'Quest';
      btn.addEventListener('click', openQuestPanel);
      nav.appendChild(btn);
    }
    const header = document.querySelector('header');
    if (header && NP.arcadeCreditState) {
      let line = document.getElementById('arcade-credit-line');
      if (!line) {
        line = document.createElement('p');
        line.id = 'arcade-credit-line';
        line.className = 'arcade-credit-line';
        header.appendChild(line);
      }
      const state = NP.arcadeCreditState(NP.getActiveProfile());
      line.textContent = state.left <= 0
        ? (frenchHub() ? 'Crédits arcade : 0. Fais la quête pour en gagner.' : 'Arcade credits: 0. Play Quest to earn more.')
        : (frenchHub() ? 'Crédits arcade : ' + state.left : 'Arcade credits: ' + state.left);
    }
    const subject = hubSubject();
    const snap = NP.questSnapshot ? NP.questSnapshot(subject) : null;
    const current = snap && snap.steps.find((step) => step.state === 'now');
    document.querySelectorAll('.quest-now').forEach((node) => node.remove());
    if (current) {
      const card = document.querySelector('.exercise-card[data-game-id="' + current.id + '"]');
      const h3 = card && card.querySelector('h3');
      if (h3 && !h3.querySelector('.quest-now')) {
        const star = document.createElement('span');
        star.className = 'quest-now';
        star.textContent = frenchHub() ? '★ Quête' : '★ Quest';
        h3.appendChild(star);
      }
    }
    document.querySelectorAll('.exercise-card[data-game-id]').forEach((card) => {
      const id = card.getAttribute('data-game-id');
      const locked = NP.arcadeLocked && NP.arcadeLocked(id);
      const link = card.querySelector('a.btn-primary');
      let note = card.querySelector('.quest-lock-note');
      if (locked) {
        card.classList.add('quest-locked');
        if (!note) {
          note = document.createElement('p');
          note.className = 'quest-lock-note';
          note.textContent = frenchHub()
            ? 'Tu veux plus de jeux arcade ? Ouvre la quête.'
            : 'Want more arcade games? Open Quest.';
          card.appendChild(note);
        }
        if (link) {
          if (!link.dataset.realHref) link.dataset.realHref = link.getAttribute('href') || '';
          link.dataset.questLocked = '1';
          link.setAttribute('href', '#quest');
          link.setAttribute('aria-disabled', 'true');
        }
      } else {
        card.classList.remove('quest-locked');
        if (note) note.remove();
        if (link && link.dataset.realHref) {
          link.setAttribute('href', link.dataset.realHref);
          link.removeAttribute('data-quest-locked');
          link.removeAttribute('aria-disabled');
        }
      }
    });
    const panel = document.getElementById('quest-panel');
    if (panel && !panel.classList.contains('hidden')) openQuestPanel();
  }

  document.addEventListener('click', (event) => {
    const link = event.target && event.target.closest ? event.target.closest('a[data-quest-locked="1"]') : null;
    if (!link) return;
    event.preventDefault();
    openQuestPanel();
  });

  function renderTopBar() {
    if (IN_IFRAME) return;
    const NP = window.NolanProgress;
    let bar = document.getElementById('nolan-shell-bar');
    if (!bar) {
      bar = el('div', 'nolan-shell-bar');
      bar.id = 'nolan-shell-bar';
      document.body.prepend(bar);
    }
    const profile = NP && NP.getActiveProfile();
    if (!profile) {
      bar.innerHTML = `
        <button type="button" class="shell-profile-btn" id="shell-open-profiles">👤 Who is playing?</button>
        <div class="shell-bar-right">
          <button type="button" class="shell-lb-btn" id="shell-leaderboard" title="Leaderboard">🏆</button>
          <button type="button" class="shell-fs-btn" id="shell-fullscreen" title="Fullscreen">⛶ Full screen</button>
        </div>
      `;
      document.getElementById('shell-open-profiles')?.addEventListener('click', () => openProfileModal());
    } else {
      const xpInfo = NP.xpToNext(profile);
      const pct = Math.min(100, Math.round((xpInfo.into / xpInfo.need) * 100));
      const title = NP.levelTitle(profile.level, profile.avatarEmoji);
      bar.innerHTML = `
        <button type="button" class="shell-profile-btn" id="shell-open-my-progress" title="My progress">
          <span class="shell-avatar-photo" aria-hidden="true">${profile.avatarEmoji}</span>
          <span class="shell-profile-text">
            <span class="shell-name">${escapeHtml(profile.name)}</span>
            <span class="shell-level-title" title="Level ${profile.level}">Lv ${profile.level} · ${escapeHtml(title)}</span>
          </span>
        </button>
        <div class="shell-xp-wrap" title="${profile.xp} XP">
          <div class="shell-xp-track"><div class="shell-xp-fill" style="width:${pct}%"></div></div>
          <span class="shell-xp-text">${profile.xp} XP</span>
        </div>
        <div class="shell-bar-right">
          <button type="button" class="shell-lb-btn" id="shell-leaderboard" title="Leaderboard">🏆</button>
          <button type="button" class="shell-fs-btn" id="shell-fullscreen" title="Fullscreen">⛶ Full screen</button>
          <button type="button" class="shell-logout-btn" id="shell-logout" title="Log out">Log out</button>
        </div>
      `;
      document.getElementById('shell-open-my-progress')?.addEventListener('click', () => openMyProgressModal());
      document.getElementById('shell-logout')?.addEventListener('click', logoutToProfilePicker);
    }
    document.getElementById('shell-fullscreen')?.addEventListener('click', enterFullscreenFlow);
    document.getElementById('shell-leaderboard')?.addEventListener('click', openLeaderboard);
    syncShellOffset();
  }

  function syncShellOffset() {
    if (IN_IFRAME) {
      document.documentElement.style.setProperty('--nolan-shell-h', '0px');
      return;
    }
    const bar = document.getElementById('nolan-shell-bar');
    if (!bar) return;
    const height = bar.offsetHeight;
    document.body.style.paddingTop = height + 'px';
    document.documentElement.style.setProperty('--nolan-shell-h', height + 'px');
    if (!syncShellOffset.bound) {
      syncShellOffset.bound = true;
      window.addEventListener('resize', syncShellOffset);
    }
  }

  function logoutToProfilePicker() {
    const NP = window.NolanProgress;
    if (!NP) return;
    if (IN_IFRAME) {
      try {
        window.top.postMessage({ type: 'nolan:logout' }, '*');
      } catch (e) { /* ignore */ }
      return;
    }
    NP.lock();
    updateHubLock();
    renderTopBar();
    openProfileModal();
  }

  function openMyProgressModal() {
    if (IN_IFRAME) {
      try {
        window.top.postMessage({ type: 'nolan:open-my-progress' }, '*');
      } catch (e) { /* ignore */ }
      return;
    }
    const NP = window.NolanProgress;
    if (!NP) return;
    const active = NP.getActiveProfile();
    if (!active) {
      openProfileModal();
      return;
    }
    const stats = NP.activitySummary ? NP.activitySummary(active) : null;
    const subjects = NP.subjectStats ? NP.subjectStats(active) : [];
    const title = NP.levelTitle(active.level, active.avatarEmoji);
    let modal = document.getElementById('nolan-my-progress-modal');
    if (!modal) {
      modal = el('div', 'nolan-modal-backdrop');
      modal.id = 'nolan-my-progress-modal';
      document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
    modal.classList.remove('nolan-modal-backdrop--required');
    const maxSucceeded = Math.max(1, ...subjects.map((s) => s.gamesSucceeded || 0));
    const subjectHtml = subjects.length
      ? `<div class="profile-activity" aria-label="Subject success">
          <p class="profile-activity-title">Successful exercises by subject</p>
          <div class="profile-subject-list">
            ${subjects
              .map((s) => {
                const pct = Math.round(((s.gamesSucceeded || 0) / maxSucceeded) * 100);
                return `<div class="profile-subject-row">
                  <div class="profile-subject-meta">
                    <span class="profile-subject-label">${escapeHtml(s.label)}</span>
                    <strong>${s.gamesSucceeded || 0}</strong>
                    <span class="profile-subject-extra">${s.questionsCorrect || 0} correct answers</span>
                  </div>
                  <div class="profile-subject-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
                </div>`;
              })
              .join('')}
          </div>
        </div>`
      : '';
    modal.innerHTML = `
      <div class="nolan-modal nolan-modal--profile question-card animate-pop" role="dialog" aria-modal="true">
        <h2 class="nolan-modal-title">${escapeHtml(active.avatarEmoji || '')} ${escapeHtml(active.name)}</h2>
        <p class="nolan-modal-sub">Lv ${active.level || 1} · ${escapeHtml(title)} · ${active.xp || 0} XP</p>
        ${
          stats
            ? `<div class="profile-activity" aria-label="Activity stats">
          <p class="profile-activity-title">Your progress</p>
          <div class="profile-activity-grid">
            <div><span class="profile-activity-label">XP today</span><strong>${stats.today.xp}</strong></div>
            <div><span class="profile-activity-label">This week</span><strong>${stats.week.xp}</strong></div>
            <div><span class="profile-activity-label">This month</span><strong>${stats.month.xp}</strong></div>
            <div><span class="profile-activity-label">This year</span><strong>${stats.year.xp}</strong></div>
            <div><span class="profile-activity-label">Exercises done</span><strong>${stats.exercisesTotal}</strong></div>
            <div><span class="profile-activity-label">Questions done</span><strong>${stats.questionsTotal}</strong></div>
            <div><span class="profile-activity-label">Arcade plays</span><strong>${stats.today.arcadePlays || 0} today · ${stats.week.arcadePlays || 0} this week</strong></div>
            <div><span class="profile-activity-label">Arcade time</span><strong>${stats.today.arcadeSeconds || 0}s today · ${stats.week.arcadeSeconds || 0}s this week</strong></div>
            <div><span class="profile-activity-label">Gates cleared</span><strong>${stats.today.arcadeGates || 0} today · ${stats.week.arcadeGates || 0} this week</strong></div>
          </div>
        </div>`
            : ''
        }
        ${subjectHtml}
        <button type="button" class="nav-link mt-3" id="btn-close-my-progress">Keep playing</button>
      </div>
    `;
    modal.querySelector('#btn-close-my-progress')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  function showFsChip() {
    if (IN_IFRAME || document.fullscreenElement) return;
    if (sessionStorage.getItem(FS_KEY) !== '1') return;
    let chip = document.getElementById('nolan-fs-chip');
    if (!chip) {
      chip = el('button', 'nolan-fs-chip');
      chip.id = 'nolan-fs-chip';
      chip.type = 'button';
      chip.textContent = '⛶ Tap for full screen';
      document.body.appendChild(chip);
      chip.addEventListener('click', enterFullscreenFlow);
    }
    chip.classList.remove('hidden');
  }

  function hideFsChip() {
    document.getElementById('nolan-fs-chip')?.classList.add('hidden');
  }

  function enterFullscreenFlow() {
    sessionStorage.setItem(FS_KEY, '1');
    if (IS_APP) {
      const root = document.documentElement;
      const req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) {
        req.call(root).then(() => hideFsChip()).catch(() => showFsChip());
      }
      return;
    }
    location.href = resolveAppUrl();
  }

  function isHubPage() {
    return !!(document.body && document.body.classList.contains('theme-hub') && !IS_APP);
  }

  function updateHubLock() {
    if (!document.body) return;
    if (IN_IFRAME || !isHubPage()) {
      document.body.classList.remove('hub-locked');
      return;
    }
    const NP = window.NolanProgress;
    if (NP && NP.isUnlocked()) document.body.classList.remove('hub-locked');
    else document.body.classList.add('hub-locked');
  }

  function bindPlayModeCta() {
    const btn = document.getElementById('open-play-mode');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      enterFullscreenFlow();
    });
  }

  function onProfileUnlocked() {
    updateHubLock();
    renderTopBar();
    paintHubMedals();
  }

  function openLeaderboard() {
    if (IN_IFRAME) {
      try {
        window.top.postMessage({ type: 'nolan:open-leaderboard' }, '*');
      } catch (e) { /* ignore */ }
      return;
    }
    const NP = window.NolanProgress;
    if (!NP) return;
    let modal = document.getElementById('nolan-leaderboard-modal');
    if (!modal) {
      modal = el('div', 'nolan-modal-backdrop');
      modal.id = 'nolan-leaderboard-modal';
      document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
    modal.innerHTML = `
      <div class="nolan-modal nolan-modal--wide question-card animate-pop" role="dialog" aria-modal="true">
        <h2 class="nolan-modal-title">Leaderboard</h2>
        <p class="nolan-modal-sub">All players — ranked by XP and medals</p>
        <p id="lb-status" class="text-center text-slate-500 text-sm mb-2">Loading…</p>
        <div id="lb-list" class="leaderboard-list"></div>
        <button type="button" class="nav-link mt-4" id="lb-close">Close</button>
      </div>
    `;
    modal.querySelector('#lb-close')?.addEventListener('click', () => modal.classList.add('hidden'));

    const status = modal.querySelector('#lb-status');
    const list = modal.querySelector('#lb-list');
    let rows = [];
    (async () => {
      try {
        rows = await NP.fetchGlobalLeaderboard();
        status.textContent = 'Everyone on Learning Adventure';
      } catch (e) {
        rows = NP.leaderboardRows();
        status.textContent = 'Showing local scores (offline)';
      }
      const active = NP.getActiveProfile();
      if (!rows.length) {
        list.innerHTML = '<p class="text-center text-slate-500">No players yet. Create a profile!</p>';
        return;
      }
      list.innerHTML = '';
      rows.forEach((row, i) => {
        const item = el('div', 'leaderboard-row' + (active && active.id === row.id ? ' is-you' : ''));
        item.innerHTML = `
          <span class="lb-rank">${i + 1}</span>
          <span class="shell-avatar-photo">${row.avatarEmoji || '🦊'}</span>
          <span class="lb-meta">
            <span class="lb-name">${escapeHtml(row.name)}${active && active.id === row.id ? ' (you)' : ''}</span>
            <span class="lb-title">${escapeHtml(row.levelTitle || '')}</span>
          </span>
          <span class="lb-stats">
            <span class="lb-xp">${row.xp || 0} XP</span>
            <span class="lb-medals">🥇${row.gold || 0} 🥈${row.silver || 0} 🥉${row.bronze || 0}</span>
          </span>
        `;
        list.appendChild(item);
      });
    })();
  }

  function openProfileModal() {
    if (IN_IFRAME) {
      try {
        window.top.postMessage({ type: 'nolan:open-profiles' }, '*');
      } catch (e) { /* ignore */ }
      return;
    }
    const NP = window.NolanProgress;
    if (!NP) return;

    let modal = document.getElementById('nolan-profile-modal');
    if (!modal) {
      modal = el('div', 'nolan-modal-backdrop');
      modal.id = 'nolan-profile-modal';
      document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');

    const profiles = NP.listProfiles();
    const unlocked = NP.isUnlocked();

    if (!unlocked && isHubPage()) modal.classList.add('nolan-modal-backdrop--required');
    else modal.classList.remove('nolan-modal-backdrop--required');

    modal.innerHTML = `
      <div class="nolan-modal nolan-modal--profile question-card animate-pop" role="dialog" aria-modal="true">
        <h2 class="nolan-modal-title">Who is playing?</h2>
        <p class="nolan-modal-sub">Create a new profile or pick yours and tap your secret fruit.</p>
        <div id="profile-search-wrap" class="profile-search-wrap${profiles.length ? '' : ' hidden'}">
          <label class="profile-field-label" for="profile-search">Find my name</label>
          <input id="profile-search" class="profile-input profile-search-input" type="search" maxlength="24" placeholder="Type your name…" autocomplete="off" />
        </div>
        <div id="profile-list" class="profile-list"></div>
        <p id="profile-list-empty" class="profile-list-empty hidden">No name matches — try another spelling.</p>
        <button type="button" class="btn-primary w-full mt-3" id="btn-create-profile">+ New profile</button>
        <div id="profile-create" class="hidden"></div>
        <div id="profile-pin" class="hidden"></div>
        ${unlocked ? '<button type="button" class="nav-link mt-3" id="btn-close-profiles">Keep playing</button>' : ''}
      </div>
    `;

    const list = modal.querySelector('#profile-list');
    const emptyMsg = modal.querySelector('#profile-list-empty');
    const searchInput = modal.querySelector('#profile-search');

    function renderProfileList(filterText) {
      const q = String(filterText || '').trim().toLowerCase();
      list.innerHTML = '';
      const matched = profiles.filter((p) => {
        if (!q) return true;
        return String(p.name || '').toLowerCase().indexOf(q) !== -1;
      });
      matched.forEach((p) => {
        const btn = el('button', 'profile-pick-btn' + (p.disabled ? ' profile-pick-btn--disabled' : ''));
        btn.type = 'button';
        const status = p.disabled
          ? '<span class="shell-level-title">Needs a kinder name</span>'
          : `<span class="shell-level-title">${escapeHtml(NP.levelTitle(p.level || 1, p.avatarEmoji))}</span>`;
        btn.innerHTML = `<span class="shell-avatar-photo">${p.avatarEmoji}</span><span class="profile-pick-meta"><span class="profile-pick-name">${escapeHtml(p.name)}</span>${status}</span>`;
        btn.addEventListener('click', () => {
          if (p.disabled) showRenameStep(p);
          else showPinStep(p);
        });
        list.appendChild(btn);
      });
      if (emptyMsg) {
        if (profiles.length && !matched.length) emptyMsg.classList.remove('hidden');
        else emptyMsg.classList.add('hidden');
      }
    }

    renderProfileList('');
    searchInput?.addEventListener('input', () => renderProfileList(searchInput.value));
    if (profiles.length > 8) {
      setTimeout(() => searchInput?.focus(), 50);
    }

    modal.querySelector('#btn-create-profile')?.addEventListener('click', showCreateStep);
    modal.querySelector('#btn-close-profiles')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    if (!profiles.length) showCreateStep();
  }

  function hideProfilePickerChrome() {
    document.getElementById('profile-list')?.classList.add('hidden');
    document.getElementById('profile-search-wrap')?.classList.add('hidden');
    document.getElementById('profile-list-empty')?.classList.add('hidden');
    document.getElementById('btn-create-profile')?.classList.add('hidden');
    document.getElementById('btn-close-profiles')?.classList.add('hidden');
    document.getElementById('profile-pin')?.classList.add('hidden');
  }

  function showCreateStep() {
    const NP = window.NolanProgress;
    const box = document.getElementById('profile-create');
    if (!box) return;
    hideProfilePickerChrome();
    box.classList.remove('hidden');
    let avatar = NP.AVATARS[0];
    let pinFruit = null;
    box.innerHTML = `
      <h3 class="profile-step-title">Create a profile</h3>
      <label class="profile-field-label" for="create-name">First name</label>
      <input id="create-name" class="profile-input" maxlength="24" placeholder="e.g. Alex" autocomplete="off" />
      <div class="profile-create-panels">
        <div class="profile-create-panel">
          <p class="profile-field-label">Pick an avatar</p>
          <div class="fruit-grid fruit-grid--dense" id="avatar-grid"></div>
        </div>
        <div class="profile-create-panel">
          <p class="profile-field-label">Secret fruit (remember it!)</p>
          <div class="fruit-grid fruit-grid--dense" id="pin-grid-create"></div>
        </div>
      </div>
      <div class="profile-step-actions">
        <button type="button" class="btn-primary" id="btn-save-profile">Save profile</button>
        <button type="button" class="nav-link" id="btn-cancel-create">Back</button>
      </div>
      <p id="create-error" class="hidden text-red-600 font-semibold mt-2 text-center"></p>
    `;
    const avatarGrid = box.querySelector('#avatar-grid');
    NP.AVATARS.forEach((a) => {
      const b = el('button', 'fruit-btn' + (a === avatar ? ' selected' : ''));
      b.type = 'button';
      b.textContent = a;
      b.setAttribute('aria-label', 'Avatar ' + a);
      b.addEventListener('click', () => {
        avatar = a;
        avatarGrid.querySelectorAll('.fruit-btn').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
      });
      avatarGrid.appendChild(b);
    });
    const pinGrid = box.querySelector('#pin-grid-create');
    NP.PIN_FRUITS.forEach((f) => {
      const b = el('button', 'fruit-btn');
      b.type = 'button';
      b.textContent = f;
      b.setAttribute('aria-label', 'Secret fruit ' + f);
      b.addEventListener('click', () => {
        pinFruit = f;
        pinGrid.querySelectorAll('.fruit-btn').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
      });
      pinGrid.appendChild(b);
    });
    const err = box.querySelector('#create-error');
    const setErr = (msg) => {
      if (!msg) {
        err.classList.add('hidden');
        return;
      }
      err.textContent = msg;
      err.classList.remove('hidden');
    };
    box.querySelector('#btn-cancel-create')?.addEventListener('click', () => openProfileModal());
    box.querySelector('#btn-save-profile')?.addEventListener('click', () => {
      setErr('');
      const name = box.querySelector('#create-name').value;
      const nameCheck = NP.checkName ? NP.checkName(name) : { ok: !!String(name || '').trim() };
      if (!nameCheck.ok) {
        setErr(NP.nameErrorMessage ? NP.nameErrorMessage(nameCheck.reason) : 'Please enter a first name.');
        return;
      }
      if (!pinFruit) {
        setErr('Pick your secret fruit!');
        return;
      }
      try {
        const p = NP.createProfile({ name, avatarEmoji: avatar, pinFruit });
        // Confirm unlock with the fruit they just chose (same session)
        const unlocked = NP.unlockProfile(p.id, pinFruit);
        if (unlocked.ok) {
          document.getElementById('nolan-profile-modal')?.classList.add('hidden');
          onProfileUnlocked();
          if (window.FunEffects) window.FunEffects.confetti({ count: 18 });
        } else {
          showPinStep(p);
        }
      } catch (e) {
        setErr(e.message || 'Could not create profile');
      }
    });
  }

  function showRenameStep(profile) {
    const NP = window.NolanProgress;
    const box = document.getElementById('profile-create');
    if (!box) return;
    hideProfilePickerChrome();
    box.classList.remove('hidden');
    box.innerHTML = `
      <h3 class="profile-step-title">Choose a kinder name</h3>
      <p class="nolan-modal-sub" style="margin-bottom:0.75rem">This profile is paused. Pick a friendly first name to keep all your XP and medals.</p>
      <label class="profile-field-label" for="rename-name">New first name</label>
      <input id="rename-name" class="profile-input" maxlength="24" placeholder="e.g. Alex" autocomplete="off" />
      <div class="profile-step-actions">
        <button type="button" class="btn-primary" id="btn-save-rename">Save &amp; continue</button>
        <button type="button" class="nav-link" id="btn-cancel-rename">Back</button>
      </div>
      <p id="rename-error" class="hidden text-red-600 font-semibold mt-2 text-center"></p>
    `;
    const err = box.querySelector('#rename-error');
    const setErr = (msg) => {
      if (!msg) {
        err.classList.add('hidden');
        return;
      }
      err.textContent = msg;
      err.classList.remove('hidden');
    };
    box.querySelector('#btn-cancel-rename')?.addEventListener('click', () => openProfileModal());
    box.querySelector('#btn-save-rename')?.addEventListener('click', () => {
      setErr('');
      const name = box.querySelector('#rename-name').value;
      const result = NP.renameProfile(profile.id, name);
      if (!result.ok) {
        setErr(result.message || 'Could not rename');
        return;
      }
      showPinStep(result.profile);
    });
  }

  function showPinStep(profile) {
    const NP = window.NolanProgress;
    const box = document.getElementById('profile-pin');
    const create = document.getElementById('profile-create');
    create?.classList.add('hidden');
    hideProfilePickerChrome();
    box.classList.remove('hidden');
    const decoys = NP.PIN_FRUITS.slice();
    for (let i = decoys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = decoys[i];
      decoys[i] = decoys[j];
      decoys[j] = t;
    }
    box.innerHTML = `
      <h3 class="profile-step-title">Hi ${escapeHtml(profile.name)}!</h3>
      <p class="nolan-modal-sub" style="margin-bottom:0.75rem">Tap your secret fruit to unlock.</p>
      <div class="fruit-grid fruit-grid--pin" id="pin-unlock-grid"></div>
      <p id="pin-error" class="hidden text-red-600 font-semibold mt-2 text-center">Wrong fruit — try again!</p>
      <button type="button" class="nav-link mt-3" id="btn-pin-back">Back</button>
    `;
    const grid = box.querySelector('#pin-unlock-grid');
    decoys.forEach((f) => {
      const b = el('button', 'fruit-btn fruit-btn-lg');
      b.type = 'button';
      b.textContent = f;
      b.setAttribute('aria-label', 'Fruit ' + f);
      b.addEventListener('click', () => {
        const res = NP.unlockProfile(profile.id, f);
        if (res.ok) {
          document.getElementById('nolan-profile-modal')?.classList.add('hidden');
          onProfileUnlocked();
          try {
            const stage = document.getElementById('nolan-stage');
            if (stage && stage.contentWindow) {
              stage.contentWindow.postMessage({ type: 'nolan:unlocked' }, '*');
            }
          } catch (e) { /* ignore */ }
          if (window.FunEffects) window.FunEffects.confetti({ count: 18 });
        } else {
          const errEl = box.querySelector('#pin-error');
          errEl?.classList.remove('hidden');
          b.classList.add('shake-wrong');
          setTimeout(() => b.classList.remove('shake-wrong'), 450);
        }
      });
      grid.appendChild(b);
    });
    box.querySelector('#btn-pin-back')?.addEventListener('click', () => openProfileModal());
  }

  function feedbackApiUrl() {
    return '/.netlify/functions/feedback';
  }

  function ensureFeedbackBubble() {
    if (IN_IFRAME) return;
    if (document.getElementById('nolan-feedback-root')) return;

    const root = el('div', 'nolan-feedback-root');
    root.id = 'nolan-feedback-root';
    root.innerHTML = `
      <button type="button" class="nolan-feedback-fab" id="nolan-feedback-fab" aria-label="Send a message" title="Send a message">💬</button>
      <div class="nolan-feedback-panel hidden" id="nolan-feedback-panel" role="dialog" aria-label="Send a message">
        <div class="nolan-feedback-panel-head">
          <strong>Send a message</strong>
          <button type="button" class="nolan-feedback-close" id="nolan-feedback-close" aria-label="Close">×</button>
        </div>
        <p class="nolan-feedback-hint">Tell us what you like, what is broken, or what to add.</p>
        <label class="profile-field-label" for="nolan-feedback-name">Your name (optional)</label>
        <input id="nolan-feedback-name" class="profile-input" maxlength="40" placeholder="e.g. Alex or Parent" autocomplete="name" />
        <label class="profile-field-label" for="nolan-feedback-msg">Message</label>
        <textarea id="nolan-feedback-msg" class="nolan-feedback-textarea" maxlength="500" rows="4" placeholder="Write your message…"></textarea>
        <p class="nolan-feedback-count"><span id="nolan-feedback-len">0</span>/500</p>
        <button type="button" class="btn-primary w-full" id="nolan-feedback-send">Send</button>
        <p id="nolan-feedback-status" class="nolan-feedback-status hidden"></p>
      </div>
    `;
    document.body.appendChild(root);

    const fab = root.querySelector('#nolan-feedback-fab');
    const panel = root.querySelector('#nolan-feedback-panel');
    const closeBtn = root.querySelector('#nolan-feedback-close');
    const nameInput = root.querySelector('#nolan-feedback-name');
    const msgInput = root.querySelector('#nolan-feedback-msg');
    const lenEl = root.querySelector('#nolan-feedback-len');
    const sendBtn = root.querySelector('#nolan-feedback-send');
    const status = root.querySelector('#nolan-feedback-status');

    function setStatus(text, kind) {
      if (!text) {
        status.className = 'nolan-feedback-status hidden';
        status.textContent = '';
        return;
      }
      status.textContent = text;
      status.className = 'nolan-feedback-status nolan-feedback-status--' + (kind || 'info');
    }

    function openPanel() {
      const NP = window.NolanProgress;
      const active = NP && NP.isUnlocked && NP.isUnlocked() ? NP.getActiveProfile && NP.getActiveProfile() : null;
      if (active && active.name && !nameInput.value) nameInput.value = active.name;
      panel.classList.remove('hidden');
      fab.setAttribute('aria-expanded', 'true');
      setTimeout(() => msgInput.focus(), 30);
    }

    function closePanel() {
      panel.classList.add('hidden');
      fab.setAttribute('aria-expanded', 'false');
      setStatus('');
    }

    fab.addEventListener('click', () => {
      if (panel.classList.contains('hidden')) openPanel();
      else closePanel();
    });
    closeBtn.addEventListener('click', closePanel);
    msgInput.addEventListener('input', () => {
      lenEl.textContent = String(msgInput.value.length);
    });

    sendBtn.addEventListener('click', async () => {
      const message = String(msgInput.value || '').trim();
      const name = String(nameInput.value || '').trim().slice(0, 40);
      if (!message) {
        setStatus('Please write a short message.', 'error');
        return;
      }
      sendBtn.disabled = true;
      setStatus('Sending…', 'info');
      try {
        const res = await fetch(feedbackApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message.slice(0, 500),
            name: name || undefined,
            page: location.href
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Could not send');
        }
        msgInput.value = '';
        lenEl.textContent = '0';
        setStatus('Thanks! We got your message.', 'ok');
        if (window.FunEffects) window.FunEffects.confetti({ count: 12 });
        setTimeout(closePanel, 1600);
      } catch (e) {
        setStatus(e.message || 'Could not send — try again later.', 'error');
      } finally {
        sendBtn.disabled = false;
      }
    });
  }

  function boot() {
    if (IN_IFRAME) {
      sessionStorage.setItem('nolanInFrame', '1');
      document.body.classList.add('nolan-embedded');
      document.body.style.paddingTop = '0';
      document.documentElement.style.setProperty('--nolan-shell-h', '0px');
    }

    ensureProgress(() => {
      const NP = window.NolanProgress;
      const afterSync = () => {
        bindPlayModeCta();
        if (!IN_IFRAME) {
          renderTopBar();
          ensureFeedbackBubble();
          updateHubLock();
          if (!NP?.isUnlocked()) openProfileModal();
          else paintHubMedals();
          document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) hideFsChip();
            else {
              sessionStorage.setItem(FS_KEY, '0');
              hideFsChip();
            }
          });
          if (IS_APP && sessionStorage.getItem(FS_KEY) === '1' && !document.fullscreenElement) {
            showFsChip();
          }
        } else {
          if (!NP?.isUnlocked()) {
            try {
              window.top.postMessage({ type: 'nolan:open-profiles' }, '*');
            } catch (e) { /* ignore */ }
          }
          paintHubMedals();
        }

        if (document.body?.classList.contains('game') || /\/games\//.test(location.pathname)) {
          NP?.watchResultScreens();
        }
      };

      // Show UI immediately; cloud sync must not block login
      afterSync();
      if (NP?.ensureProfilesReady) {
        NP.ensureProfilesReady()
          .then(() => {
            if (!IN_IFRAME) {
              renderTopBar();
              updateHubLock();
              if (!NP?.isUnlocked()) openProfileModal();
              else paintHubMedals();
            } else {
              paintHubMedals();
            }
          })
          .catch(() => {});
      }

      document.addEventListener('nolan:progress', () => {
        if (!IN_IFRAME) renderTopBar();
        paintHubMedals();
        try {
          if (IN_IFRAME) window.top.postMessage({ type: 'nolan:progress' }, '*');
        } catch (e) { /* ignore */ }
      });
      document.addEventListener('nolan:profiles', () => {
        if (!IN_IFRAME) {
          renderTopBar();
          updateHubLock();
          paintHubMedals();
          const modal = document.getElementById('nolan-profile-modal');
          if (modal && !modal.classList.contains('hidden') && !NP?.isUnlocked()) {
            openProfileModal();
          }
        } else {
          paintHubMedals();
        }
      });
    });

    window.addEventListener('message', (ev) => {
      if (!ev.data || typeof ev.data !== 'object') return;
      if (ev.data.type === 'nolan:open-profiles' && !IN_IFRAME) openProfileModal();
      if (ev.data.type === 'nolan:open-my-progress' && !IN_IFRAME) openMyProgressModal();
      if (ev.data.type === 'nolan:logout' && !IN_IFRAME) logoutToProfilePicker();
      if (ev.data.type === 'nolan:open-leaderboard' && !IN_IFRAME) openLeaderboard();
      if (ev.data.type === 'nolan:progress' && !IN_IFRAME) {
        renderTopBar();
        paintHubMedals();
      }
      if (ev.data.type === 'nolan:unlocked' && IN_IFRAME) paintHubMedals();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
