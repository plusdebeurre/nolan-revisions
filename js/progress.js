/**
 * Nolan Hub progress: multi-child profiles, fruit PIN, medals, XP/levels.
 * Persistence: localStorage only (free Netlify static compatible).
 */
(function (global) {
  const STORE_KEY = 'nolan-hub-v1';
  const SESSION_KEY = 'nolan-hub-session';
  const PIN_FRUITS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🍒', '🥝'];
  const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐯', '🐰', '🐻', '🐨', '🦄', '🐶'];
  const LEVEL_FRUITS = ['🍒', '🍓', '🍊', '🍋', '🍉', '🍇', '🥝', '🍍', '🥭', '🍎'];
  const XP_PER_LEVEL = 150;
  const MEDAL_RANK = { gold: 3, silver: 2, bronze: 1, played: 0 };

  function uid() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { activeProfileId: null, profiles: {} };
      const data = JSON.parse(raw);
      if (!data.profiles) data.profiles = {};
      return data;
    } catch (e) {
      return { activeProfileId: null, profiles: {} };
    }
  }

  function save(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  function getSessionUnlockedId() {
    try {
      return sessionStorage.getItem(SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  function setSessionUnlockedId(id) {
    try {
      if (id) sessionStorage.setItem(SESSION_KEY, id);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) { /* ignore */ }
  }

  function levelFromXp(xp) {
    return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
  }

  function levelFruit(level) {
    const idx = Math.min(LEVEL_FRUITS.length - 1, Math.max(0, level - 1));
    return LEVEL_FRUITS[idx];
  }

  function medalFromMistakes(mistakes) {
    if (mistakes === 0) return 'gold';
    if (mistakes === 1) return 'silver';
    if (mistakes === 2) return 'bronze';
    return 'played';
  }

  function medalEmoji(medal) {
    if (medal === 'gold') return '🥇';
    if (medal === 'silver') return '🥈';
    if (medal === 'bronze') return '🥉';
    return '';
  }

  function betterMedal(a, b) {
    return (MEDAL_RANK[a] || 0) >= (MEDAL_RANK[b] || 0) ? a : b;
  }

  function xpGain(score, total, mistakes) {
    const ratio = total > 0 ? score / total : 0;
    const base = Math.round(40 * ratio);
    const bonus = mistakes === 0 ? 20 : mistakes === 1 ? 10 : mistakes === 2 ? 5 : 0;
    return base + bonus;
  }

  function listProfiles() {
    const data = load();
    return Object.values(data.profiles).sort((a, b) => a.name.localeCompare(b.name));
  }

  function getProfile(id) {
    return load().profiles[id] || null;
  }

  function getActiveProfile() {
    const unlocked = getSessionUnlockedId();
    if (!unlocked) return null;
    return getProfile(unlocked);
  }

  function isUnlocked() {
    return !!getActiveProfile();
  }

  function createProfile({ name, avatarEmoji, pinFruit }) {
    const clean = String(name || '').trim().slice(0, 24);
    if (!clean) throw new Error('Name required');
    if (!PIN_FRUITS.includes(pinFruit)) throw new Error('Invalid fruit PIN');
    const avatar = AVATARS.includes(avatarEmoji) ? avatarEmoji : AVATARS[0];
    const data = load();
    const id = uid();
    data.profiles[id] = {
      id,
      name: clean,
      avatarEmoji: avatar,
      pinFruit,
      xp: 0,
      level: 1,
      games: {}
    };
    save(data);
    return data.profiles[id];
  }

  function unlockProfile(id, fruit) {
    const profile = getProfile(id);
    if (!profile) return { ok: false, reason: 'missing' };
    if (profile.pinFruit !== fruit) return { ok: false, reason: 'wrong' };
    const data = load();
    data.activeProfileId = id;
    save(data);
    setSessionUnlockedId(id);
    return { ok: true, profile };
  }

  function lock() {
    setSessionUnlockedId(null);
  }

  function ensureGameEntry(p, gameId, totalHint) {
    if (!p.games) p.games = {};
    if (!p.games[gameId]) {
      p.games[gameId] = {
        bestMedal: 'played',
        bestScore: 0,
        bestTotal: totalHint || 1,
        plays: 0,
        lastPlayed: null
      };
    }
    return p.games[gameId];
  }

  function saveCheckpoint(gameId, state) {
    const profile = getActiveProfile();
    if (!profile || !gameId || !state) return null;
    const data = load();
    const p = data.profiles[profile.id];
    if (!p) return null;
    const entry = ensureGameEntry(p, gameId, Number(state.total) || 1);
    entry.checkpoint = {
      v: 1,
      index: Math.max(0, Number(state.index) || 0),
      score: Math.max(0, Number(state.score) || 0),
      extra: state.extra && typeof state.extra === 'object' ? state.extra : {},
      updatedAt: new Date().toISOString()
    };
    save(data);
    return entry.checkpoint;
  }

  function loadCheckpoint(gameId) {
    const prog = getGameProgress(gameId);
    if (!prog || !prog.checkpoint) return null;
    return prog.checkpoint;
  }

  function clearCheckpoint(gameId) {
    const profile = getActiveProfile();
    if (!profile || !gameId) return;
    const data = load();
    const p = data.profiles[profile.id];
    if (!p || !p.games || !p.games[gameId]) return;
    delete p.games[gameId].checkpoint;
    save(data);
  }

  function recordResult(gameId, { score, total }) {
    const profile = getActiveProfile();
    if (!profile || !gameId) return null;
    const s = Math.max(0, Number(score) || 0);
    const t = Math.max(1, Number(total) || 1);
    const clamped = Math.min(s, t);
    const mistakes = Math.max(0, t - clamped);
    const medal = medalFromMistakes(mistakes);
    const gained = xpGain(clamped, t, mistakes);

    const data = load();
    const p = data.profiles[profile.id];
    if (!p) return null;
    const prev = ensureGameEntry(p, gameId, t);
    const nextMedal = betterMedal(medal, prev.bestMedal);
    const betterScore =
      clamped > (prev.bestScore || 0) ||
      (clamped === prev.bestScore && t <= (prev.bestTotal || t));

    p.games[gameId] = {
      bestMedal: nextMedal,
      bestScore: betterScore ? clamped : prev.bestScore,
      bestTotal: betterScore ? t : prev.bestTotal || t,
      plays: (prev.plays || 0) + 1,
      lastPlayed: new Date().toISOString()
      // checkpoint cleared on complete
    };
    p.xp = (p.xp || 0) + gained;
    p.level = levelFromXp(p.xp);
    save(data);

    return {
      medal,
      bestMedal: nextMedal,
      xpGained: gained,
      xp: p.xp,
      level: p.level,
      levelFruit: levelFruit(p.level),
      mistakes
    };
  }

  function getGameProgress(gameId) {
    const profile = getActiveProfile();
    if (!profile || !gameId) return null;
    return (profile.games && profile.games[gameId]) || null;
  }

  function inferGameIdFromPath() {
    const path = (location.pathname || '').replace(/\\/g, '/');
    const m = path.match(/subjects\/([^/]+)\/games\/([^/]+)\.html$/i);
    if (m) return m[1] + '/' + m[2];
    const bodyId = document.body && document.body.getAttribute('data-game-id');
    return bodyId || null;
  }

  function recordFromDom(gameId) {
    const id = gameId || inferGameIdFromPath() || document.body.getAttribute('data-game-id');
    if (!id) return null;
    const scoreEl = document.getElementById('score-display');
    let score = scoreEl ? parseInt(scoreEl.textContent, 10) : NaN;
    let total = NaN;
    const hud = document.getElementById('live-score-hud');
    if (hud && /\/\s*\d+/.test(hud.textContent)) {
      const parts = hud.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (parts) {
        if (Number.isNaN(score)) score = parseInt(parts[1], 10);
        total = parseInt(parts[2], 10);
      }
    }
    const body = document.body;
    if (Number.isNaN(total) && body && body.dataset.totalRounds) {
      total = parseInt(body.dataset.totalRounds, 10);
    }
    if (Number.isNaN(score)) score = 0;
    if (Number.isNaN(total) || total < 1) total = Math.max(score, 1);
    return recordResult(id, { score, total });
  }

  /** Watch result/win screens and auto-record once per show. */
  function watchResultScreens() {
    const gameId = inferGameIdFromPath() || (document.body && document.body.getAttribute('data-game-id'));
    if (!gameId) return;
    const targets = ['result-screen', 'win-screen'];
    let recorded = false;

    function tryRecord(node) {
      if (recorded || !node) return;
      if (node.classList.contains('hidden')) return;
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      const result = recordFromDom(gameId);
      if (result) {
        recorded = true;
        document.dispatchEvent(new CustomEvent('nolan:progress', { detail: result }));
        if (result.medal === 'gold' && global.FunEffects) global.FunEffects.confetti({ count: 24 });
      }
    }

    targets.forEach((tid) => {
      const el = document.getElementById(tid);
      if (!el) return;
      const obs = new MutationObserver(() => tryRecord(el));
      obs.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
      tryRecord(el);
    });
  }

  function showResumeToast(msg) {
    const existing = document.getElementById('nolan-resume-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'nolan-resume-toast';
    toast.className = 'nolan-resume-toast';
    toast.textContent = msg || 'Resuming where you left off…';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  /**
   * Convenience for round-based custom games.
   * indexKey: property name on a shared state object, or use restoreRound helpers.
   */
  function bindRoundCheckpoint(gameId, getters) {
    const id = gameId || inferGameIdFromPath() || (document.body && document.body.getAttribute('data-game-id'));
    if (!id) return null;
    return {
      id,
      restore() {
        const cp = loadCheckpoint(id);
        if (!cp) return null;
        showResumeToast('Resuming…');
        if (getters && typeof getters.onRestore === 'function') getters.onRestore(cp);
        return cp;
      },
      save(index, score, extra) {
        return saveCheckpoint(id, { index, score, extra: extra || {} });
      },
      clear() {
        clearCheckpoint(id);
      }
    };
  }

  global.NolanProgress = {
    PIN_FRUITS,
    AVATARS,
    XP_PER_LEVEL,
    listProfiles,
    getProfile,
    getActiveProfile,
    isUnlocked,
    createProfile,
    unlockProfile,
    lock,
    recordResult,
    recordFromDom,
    getGameProgress,
    saveCheckpoint,
    loadCheckpoint,
    clearCheckpoint,
    bindRoundCheckpoint,
    showResumeToast,
    medalEmoji,
    levelFruit,
    levelFromXp,
    medalFromMistakes,
    inferGameIdFromPath,
    watchResultScreens,
    xpToNext(profile) {
      const xp = (profile && profile.xp) || 0;
      const level = levelFromXp(xp);
      const nextAt = level * XP_PER_LEVEL;
      return { level, nextAt, into: xp - (level - 1) * XP_PER_LEVEL, need: XP_PER_LEVEL };
    }
  };
})(window);
