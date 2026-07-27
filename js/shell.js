/**
 * Nolan Hub shell: profile gate, top bar, fullscreen, hub medal badges.
 */
(function () {
  function assetPrefix() {
    const path = (location.pathname || '').replace(/\\/g, '/');
    if (/\/subjects\/[^/]+\/games\//.test(path)) return '../../../';
    if (/\/subjects\/[^/]+\//.test(path)) return '../../';
    return '';
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
      if (prog && prog.bestMedal && prog.bestMedal !== 'played') {
        chip.textContent = NP.medalEmoji(prog.bestMedal);
        chip.className = 'medal-chip medal-' + prog.bestMedal;
        chip.title = prog.bestMedal + ' · best ' + prog.bestScore + '/' + prog.bestTotal;
        card.classList.remove('medal-border-gold', 'medal-border-silver', 'medal-border-bronze');
        card.classList.add('medal-border-' + prog.bestMedal);
      } else if (prog) {
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
        <button type="button" class="shell-fs-btn" id="shell-fullscreen" title="Fullscreen">⛶</button>
      `;
    } else {
      const xpInfo = NP.xpToNext(profile);
      const pct = Math.min(100, Math.round((xpInfo.into / xpInfo.need) * 100));
      bar.innerHTML = `
        <button type="button" class="shell-profile-btn" id="shell-open-profiles" title="Switch profile">
          <span class="shell-avatar">${profile.avatarEmoji}</span>
          <span class="shell-name">${escapeHtml(profile.name)}</span>
          <span class="shell-level-fruit" title="Level ${profile.level}">${NP.levelFruit(profile.level)}</span>
          <span class="shell-level-label">Lv ${profile.level}</span>
        </button>
        <div class="shell-xp-wrap" title="${profile.xp} XP">
          <div class="shell-xp-track"><div class="shell-xp-fill" style="width:${pct}%"></div></div>
          <span class="shell-xp-text">${profile.xp} XP</span>
        </div>
        <button type="button" class="shell-fs-btn" id="shell-fullscreen" title="Fullscreen">⛶ Full screen</button>
      `;
    }
    document.getElementById('shell-open-profiles')?.addEventListener('click', () => openProfileModal());
    document.getElementById('shell-fullscreen')?.addEventListener('click', toggleFullscreen);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toggleFullscreen() {
    const doc = document;
    if (!doc.fullscreenElement) {
      const root = doc.documentElement;
      const req = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
      if (req) req.call(root);
    } else {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      if (exit) exit.call(doc);
    }
  }

  function openProfileModal(force) {
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

    if (!force && unlocked && profiles.length) {
      /* allow switch: show list */
    }

    modal.innerHTML = `
      <div class="nolan-modal question-card animate-pop" role="dialog" aria-modal="true">
        <h2 class="nolan-modal-title">Who is playing?</h2>
        <p class="nolan-modal-sub">Pick a profile, then tap your secret fruit.</p>
        <div id="profile-list" class="profile-list"></div>
        <button type="button" class="btn-primary w-full mt-4" id="btn-create-profile">+ New profile</button>
        <div id="profile-create" class="hidden mt-4"></div>
        <div id="profile-pin" class="hidden mt-4"></div>
        ${unlocked ? '<button type="button" class="nav-link mt-4" id="btn-close-profiles">Keep playing</button>' : ''}
      </div>
    `;

    const list = modal.querySelector('#profile-list');
    if (!profiles.length) {
      list.innerHTML = '<p class="text-slate-500 text-center">No profiles yet. Create one!</p>';
    } else {
      profiles.forEach((p) => {
        const btn = el('button', 'profile-pick-btn');
        btn.type = 'button';
        btn.innerHTML = `<span class="shell-avatar">${p.avatarEmoji}</span><span>${escapeHtml(p.name)}</span><span class="shell-level-fruit">${NP.levelFruit(p.level || 1)}</span>`;
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
    if (!box) return;
    list?.classList.add('hidden');
    pinBox?.classList.add('hidden');
    box.classList.remove('hidden');
    let avatar = NP.AVATARS[0];
    let pinFruit = null;
    box.innerHTML = `
      <h3 class="font-bold text-lg mb-2">Create a profile</h3>
      <label class="block text-sm font-semibold mb-1">First name</label>
      <input id="create-name" class="profile-input" maxlength="24" placeholder="e.g. Nolan" autocomplete="off" />
      <p class="text-sm font-semibold mt-3 mb-1">Pick an avatar</p>
      <div class="fruit-grid" id="avatar-grid"></div>
      <p class="text-sm font-semibold mt-3 mb-1">Secret fruit (remember it!)</p>
      <div class="fruit-grid" id="pin-grid-create"></div>
      <button type="button" class="btn-primary w-full mt-4" id="btn-save-profile">Save profile</button>
      <button type="button" class="nav-link mt-2" id="btn-cancel-create">Back</button>
    `;
    const avatarGrid = box.querySelector('#avatar-grid');
    NP.AVATARS.forEach((a) => {
      const b = el('button', 'fruit-btn' + (a === avatar ? ' selected' : ''));
      b.type = 'button';
      b.textContent = a;
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
      b.addEventListener('click', () => {
        pinFruit = f;
        pinGrid.querySelectorAll('.fruit-btn').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
      });
      pinGrid.appendChild(b);
    });
    box.querySelector('#btn-cancel-create')?.addEventListener('click', () => openProfileModal(true));
    box.querySelector('#btn-save-profile')?.addEventListener('click', () => {
      const name = box.querySelector('#create-name').value;
      if (!name.trim()) {
        alert('Please enter a first name.');
        return;
      }
      if (!pinFruit) {
        alert('Pick your secret fruit!');
        return;
      }
      try {
        const p = NP.createProfile({ name, avatarEmoji: avatar, pinFruit });
        showPinStep(p);
      } catch (e) {
        alert(e.message || 'Could not create profile');
      }
    });
  }

  function showPinStep(profile) {
    const NP = window.NolanProgress;
    const box = document.getElementById('profile-pin');
    const create = document.getElementById('profile-create');
    const list = document.getElementById('profile-list');
    create?.classList.add('hidden');
    list?.classList.add('hidden');
    box.classList.remove('hidden');
    const decoys = NP.PIN_FRUITS.slice().sort(() => Math.random() - 0.5);
    box.innerHTML = `
      <h3 class="font-bold text-lg mb-1">Hi ${escapeHtml(profile.name)}!</h3>
      <p class="text-slate-500 mb-3">Tap your secret fruit to unlock.</p>
      <div class="fruit-grid" id="pin-unlock-grid"></div>
      <p id="pin-error" class="hidden text-red-600 font-semibold mt-3 text-center">Wrong fruit — try again!</p>
      <button type="button" class="nav-link mt-4" id="btn-pin-back">Back</button>
    `;
    const grid = box.querySelector('#pin-unlock-grid');
    decoys.forEach((f) => {
      const b = el('button', 'fruit-btn fruit-btn-lg');
      b.type = 'button';
      b.textContent = f;
      b.addEventListener('click', () => {
        const res = NP.unlockProfile(profile.id, f);
        if (res.ok) {
          document.getElementById('nolan-profile-modal')?.classList.add('hidden');
          renderTopBar();
          paintHubMedals();
          if (window.FunEffects) window.FunEffects.confetti({ count: 18 });
        } else {
          const err = box.querySelector('#pin-error');
          err?.classList.remove('hidden');
          b.classList.add('shake-wrong');
          setTimeout(() => b.classList.remove('shake-wrong'), 450);
        }
      });
      grid.appendChild(b);
    });
    box.querySelector('#btn-pin-back')?.addEventListener('click', () => openProfileModal(true));
  }

  function boot() {
    ensureProgress(() => {
      renderTopBar();
      if (!window.NolanProgress?.isUnlocked()) {
        openProfileModal(true);
      } else {
        paintHubMedals();
      }
      if (document.body?.classList.contains('game') || /\/games\//.test(location.pathname)) {
        window.NolanProgress?.watchResultScreens();
      }
      document.addEventListener('nolan:progress', () => {
        renderTopBar();
        paintHubMedals();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
