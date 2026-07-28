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
    document.querySelectorAll('[data-game-id]').forEach((card) => {
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
  }

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
    const familyBtn = `<button type="button" class="shell-lb-btn" id="shell-leaderboard" title="Leaderboard">🏆</button>`;
    if (!profile) {
      bar.innerHTML = `
        <button type="button" class="shell-profile-btn" id="shell-open-profiles">👤 Who is playing?</button>
        ${familyBtn}
        <button type="button" class="shell-fs-btn" id="shell-fullscreen" title="Fullscreen">⛶ Full screen</button>
      `;
    } else {
      const xpInfo = NP.xpToNext(profile);
      const pct = Math.min(100, Math.round((xpInfo.into / xpInfo.need) * 100));
      const title = NP.levelTitle(profile.level, profile.avatarEmoji);
      bar.innerHTML = `
        <button type="button" class="shell-profile-btn" id="shell-open-profiles" title="Switch profile">
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
        ${familyBtn}
        <button type="button" class="shell-fs-btn" id="shell-fullscreen" title="Fullscreen">⛶ Full screen</button>
      `;
    }
    document.getElementById('shell-open-profiles')?.addEventListener('click', () => openProfileModal());
    document.getElementById('shell-fullscreen')?.addEventListener('click', enterFullscreenFlow);
    document.getElementById('shell-leaderboard')?.addEventListener('click', openLeaderboard);
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

    modal.innerHTML = `
      <div class="nolan-modal nolan-modal--profile question-card animate-pop" role="dialog" aria-modal="true">
        <h2 class="nolan-modal-title">Who is playing?</h2>
        <p class="nolan-modal-sub">Pick a profile, then tap your secret fruit.</p>
        <div id="profile-list" class="profile-list"></div>
        <button type="button" class="btn-primary w-full mt-3" id="btn-create-profile">+ New profile</button>
        <div id="profile-create" class="hidden"></div>
        <div id="profile-pin" class="hidden"></div>
        ${unlocked ? '<button type="button" class="nav-link mt-3" id="btn-close-profiles">Keep playing</button>' : ''}
      </div>
    `;

    const list = modal.querySelector('#profile-list');
    if (!profiles.length) {
      list.innerHTML = '';
    } else {
      profiles.forEach((p) => {
        const btn = el('button', 'profile-pick-btn');
        btn.type = 'button';
        btn.innerHTML = `<span class="shell-avatar-photo">${p.avatarEmoji}</span><span class="profile-pick-meta"><span class="profile-pick-name">${escapeHtml(p.name)}</span><span class="shell-level-title">${escapeHtml(NP.levelTitle(p.level || 1, p.avatarEmoji))}</span></span>`;
        btn.addEventListener('click', () => showPinStep(p));
        list.appendChild(btn);
      });
    }

    modal.querySelector('#btn-create-profile')?.addEventListener('click', showCreateStep);
    modal.querySelector('#btn-close-profiles')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    if (!profiles.length) showCreateStep();
  }

  function showCreateStep() {
    const NP = window.NolanProgress;
    const box = document.getElementById('profile-create');
    const pinBox = document.getElementById('profile-pin');
    const list = document.getElementById('profile-list');
    const createBtn = document.getElementById('btn-create-profile');
    const closeBtn = document.getElementById('btn-close-profiles');
    if (!box) return;
    list?.classList.add('hidden');
    pinBox?.classList.add('hidden');
    createBtn?.classList.add('hidden');
    closeBtn?.classList.add('hidden');
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
      if (!name.trim()) {
        setErr('Please enter a first name.');
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
          renderTopBar();
          paintHubMedals();
          if (window.FunEffects) window.FunEffects.confetti({ count: 18 });
        } else {
          showPinStep(p);
        }
      } catch (e) {
        setErr(e.message || 'Could not create profile');
      }
    });
  }

  function showPinStep(profile) {
    const NP = window.NolanProgress;
    const box = document.getElementById('profile-pin');
    const create = document.getElementById('profile-create');
    const list = document.getElementById('profile-list');
    const createBtn = document.getElementById('btn-create-profile');
    const closeBtn = document.getElementById('btn-close-profiles');
    create?.classList.add('hidden');
    list?.classList.add('hidden');
    createBtn?.classList.add('hidden');
    closeBtn?.classList.add('hidden');
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
          renderTopBar();
          paintHubMedals();
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

  function boot() {
    if (IN_IFRAME) {
      sessionStorage.setItem('nolanInFrame', '1');
      document.body.classList.add('nolan-embedded');
      document.body.style.paddingTop = '0';
    }

    ensureProgress(() => {
      const NP = window.NolanProgress;
      const afterSync = () => {
        if (!IN_IFRAME) {
          renderTopBar();
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
            if (!IN_IFRAME) renderTopBar();
            paintHubMedals();
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
        if (!IN_IFRAME) renderTopBar();
      });
    });

    window.addEventListener('message', (ev) => {
      if (!ev.data || typeof ev.data !== 'object') return;
      if (ev.data.type === 'nolan:open-profiles' && !IN_IFRAME) openProfileModal();
      if (ev.data.type === 'nolan:open-leaderboard' && !IN_IFRAME) openLeaderboard();
      if (ev.data.type === 'nolan:progress' && !IN_IFRAME) renderTopBar();
      if (ev.data.type === 'nolan:unlocked' && IN_IFRAME) paintHubMedals();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
