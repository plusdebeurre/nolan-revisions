/**
 * Learning Adventure progress: multi-child profiles, fruit PIN, medals, XP,
 * Netlify Blobs family sync (localStorage cache).
 */
(function (global) {
  const STORE_KEY = 'nolan-hub-v1';
  const SESSION_KEY = 'nolan-hub-session';
  const FAMILY_KEY = 'nolan-family-code';
  const PIN_FRUITS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🍒', '🥝'];
  const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐯', '🐰', '🐻', '🐨', '🦄', '🐶'];
  const AVATAR_CREATURES = {
    '🦊': 'Fox',
    '🐼': 'Panda',
    '🦁': 'Lion',
    '🐸': 'Frog',
    '🐯': 'Tiger',
    '🐰': 'Bunny',
    '🐻': 'Bear',
    '🐨': 'Koala',
    '🦄': 'Unicorn',
    '🐶': 'Puppy'
  };
  const LEVEL_EPITHETS = [
    'Sleepy',
    'Rookie',
    'Speedy',
    'Clever',
    'Wizard',
    'Indy',
    'Ninja',
    'Goal King',
    'Super Saiyan'
  ];
  const XP_PER_LEVEL = 150;
  const MEDAL_RANK = { gold: 3, silver: 2, bronze: 1, played: 0 };

  let pushTimer = null;
  let syncing = false;

  function uid() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function apiUrl() {
    return '/.netlify/functions/family-api';
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { activeProfileId: null, familyCode: getFamilyCode(), profiles: {} };
      const data = JSON.parse(raw);
      if (!data.profiles) data.profiles = {};
      if (!data.familyCode) data.familyCode = getFamilyCode();
      return data;
    } catch (e) {
      return { activeProfileId: null, familyCode: getFamilyCode(), profiles: {} };
    }
  }

  function save(data) {
    if (data.familyCode) setFamilyCode(data.familyCode);
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  function getFamilyCode() {
    try {
      return (localStorage.getItem(FAMILY_KEY) || '').toUpperCase() || null;
    } catch (e) {
      return null;
    }
  }

  function setFamilyCode(code) {
    try {
      if (code) localStorage.setItem(FAMILY_KEY, String(code).toUpperCase());
      else localStorage.removeItem(FAMILY_KEY);
    } catch (e) { /* ignore */ }
  }

  function hasFamily() {
    const c = getFamilyCode();
    return !!(c && c.length >= 6);
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

  function avatarCreature(emoji) {
    return AVATAR_CREATURES[emoji] || 'Hero';
  }

  function levelEpithet(level) {
    const lv = Math.max(1, Number(level) || 1);
    if (lv <= LEVEL_EPITHETS.length) return LEVEL_EPITHETS[lv - 1];
    const x = lv - LEVEL_EPITHETS.length;
    return x === 1 ? 'Super Saiyan X' : 'Super Saiyan X' + x;
  }

  function levelTitle(level, avatarEmoji) {
    return levelEpithet(level) + ' ' + avatarCreature(avatarEmoji);
  }

  function levelFruit() {
    return '';
  }

  function playerName() {
    const p = getActiveProfile();
    return (p && p.name) || 'You';
  }

  function fillName(text) {
    const name = playerName();
    return String(text || '')
      .replace(/\{\{name\}\}/gi, name)
      .replace(/\{\{Name\}\}/g, name);
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

  function touchProfile(p) {
    if (p) p.updatedAt = nowIso();
    return p;
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
    data.profiles[id] = touchProfile({
      id,
      name: clean,
      avatarEmoji: avatar,
      pinFruit,
      xp: 0,
      level: 1,
      games: {}
    });
    save(data);
    schedulePush();
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
      updatedAt: nowIso()
    };
    touchProfile(p);
    save(data);
    schedulePush();
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
    touchProfile(p);
    save(data);
    schedulePush();
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
      lastPlayed: nowIso()
    };
    p.xp = (p.xp || 0) + gained;
    p.level = levelFromXp(p.xp);
    touchProfile(p);
    save(data);
    schedulePush();

    return {
      medal,
      bestMedal: nextMedal,
      xpGained: gained,
      xp: p.xp,
      level: p.level,
      levelTitle: levelTitle(p.level, p.avatarEmoji),
      levelFruit: '',
      mistakes
    };
  }

  function getGameProgress(gameId) {
    const profile = getActiveProfile();
    if (!profile || !gameId) return null;
    return (profile.games && profile.games[gameId]) || null;
  }

  function countMedals(profile) {
    const counts = { gold: 0, silver: 0, bronze: 0 };
    if (!profile || !profile.games) return counts;
    Object.keys(profile.games).forEach((gid) => {
      const m = profile.games[gid] && profile.games[gid].bestMedal;
      if (m === 'gold' || m === 'silver' || m === 'bronze') counts[m]++;
    });
    return counts;
  }

  function leaderboardRows() {
    return listProfiles()
      .map((p) => {
        const medals = countMedals(p);
        return {
          id: p.id,
          name: p.name,
          avatarEmoji: p.avatarEmoji,
          xp: p.xp || 0,
          level: p.level || levelFromXp(p.xp || 0),
          levelTitle: levelTitle(p.level || 1, p.avatarEmoji),
          gold: medals.gold,
          silver: medals.silver,
          bronze: medals.bronze
        };
      })
      .sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        if (b.gold !== a.gold) return b.gold - a.gold;
        if (b.silver !== a.silver) return b.silver - a.silver;
        return a.name.localeCompare(b.name);
      });
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

  async function apiPost(payload) {
    const res = await fetch(apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = { ok: false, error: 'Bad response' };
    }
    if (!res.ok || !data.ok) {
      const err = new Error((data && data.error) || 'Sync failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function applyFamily(family) {
    if (!family || !family.code) return;
    const data = load();
    data.familyCode = family.code;
    setFamilyCode(family.code);
    const incoming = family.profiles || {};
    Object.keys(incoming).forEach((id) => {
      const remote = incoming[id];
      if (!remote) return;
      const local = data.profiles[id];
      if (!local) {
        data.profiles[id] = remote;
        return;
      }
      const remoteAt = Date.parse(remote.updatedAt || 0) || 0;
      const localAt = Date.parse(local.updatedAt || 0) || 0;
      if (remoteAt >= localAt) data.profiles[id] = remote;
    });
    save(data);
    document.dispatchEvent(new CustomEvent('nolan:family', { detail: { code: family.code } }));
  }

  async function createFamily() {
    const data = await apiPost({ action: 'create' });
    applyFamily(data.family);
    // Push any local profiles that existed before family
    await pushFamily();
    return data.family;
  }

  async function joinFamily(code) {
    const data = await apiPost({ action: 'join', code: String(code || '').toUpperCase() });
    applyFamily(data.family);
    await pushFamily();
    return data.family;
  }

  async function pullFamily() {
    const code = getFamilyCode();
    if (!code) return null;
    try {
      const data = await apiPost({ action: 'pull', code });
      applyFamily(data.family);
      return data.family;
    } catch (e) {
      return null;
    }
  }

  async function pushFamily() {
    const code = getFamilyCode();
    if (!code) return null;
    const data = load();
    try {
      const res = await apiPost({ action: 'push', code, profiles: data.profiles });
      applyFamily(res.family);
      return res.family;
    } catch (e) {
      return null;
    }
  }

  function schedulePush() {
    if (!hasFamily()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      pushFamily().catch(() => {});
    }, 600);
  }

  async function ensureFamilyReady() {
    if (hasFamily()) {
      if (!syncing) {
        syncing = true;
        try {
          await pullFamily();
        } finally {
          syncing = false;
        }
      }
      return true;
    }
    return false;
  }

  global.NolanProgress = {
    PIN_FRUITS,
    AVATARS,
    AVATAR_CREATURES,
    LEVEL_EPITHETS,
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
    avatarCreature,
    levelEpithet,
    levelTitle,
    levelFromXp,
    medalFromMistakes,
    inferGameIdFromPath,
    watchResultScreens,
    playerName,
    fillName,
    countMedals,
    leaderboardRows,
    hasFamily,
    getFamilyCode,
    createFamily,
    joinFamily,
    pullFamily,
    pushFamily,
    ensureFamilyReady,
    schedulePush,
    xpToNext(profile) {
      const xp = (profile && profile.xp) || 0;
      const level = levelFromXp(xp);
      const nextAt = level * XP_PER_LEVEL;
      return { level, nextAt, into: xp - (level - 1) * XP_PER_LEVEL, need: XP_PER_LEVEL };
    }
  };
})(window);
