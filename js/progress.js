/**
 * Learning Adventure progress: multi-child profiles, fruit PIN, medals, XP,
 * public Netlify Blobs sync (localStorage cache).
 */
(function (global) {
  (function ensureNameModeration() {
    if (global.NameModeration) return;
    let src = 'js/name-moderation.js';
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('progress.js') !== -1) {
        src = scripts[i].src.replace(/progress\.js(\?.*)?$/, 'name-moderation.js');
        break;
      }
    }
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', src, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 400 && xhr.responseText) {
        // eslint-disable-next-line no-eval
        (0, eval)(xhr.responseText);
      }
    } catch (e) { /* offline / file:// may fail; create still uses empty check */ }
  })();

  const STORE_KEY = 'nolan-hub-v1';
  const SESSION_KEY = 'nolan-hub-session';
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
  const DIRTY_KEY = 'nolan-hub-dirty';
  const MAX_AWARDED_KEYS = 400;
  const RETRY_DELAYS_MS = [1000, 2000, 5000, 15000, 15000, 15000, 15000, 15000];

  let pushTimer = null;
  let criticalPushTimer = null;
  let retryTimer = null;
  let syncing = false;
  let pushing = false;
  let retryAttempt = 0;
  let flushBound = false;

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

  const XP_PER_CORRECT = 10;
  const ARCADE_XP = 2;
  const ARCADE_CAP = 6;
  const CREDIT_CAP = 6;
  const CREDIT_TODAY = 40;
  const CREDIT_WEEK = 120;

  function questStep(id, kind, title) {
    return { id: id, kind: kind, title: title };
  }

  const QUEST_PATHS = {
    math: [
      questStep('math/place-value-quiz', 'quiz', 'Place Value Quiz'),
      questStep('math/stop-or-go', 'focus', 'Stop or Go'),
      questStep('math/biscuit-bandits', 'play', 'Biscuit Bandits'),
      questStep('math/biscuit-run', 'arcade', 'Biscuit Run'),
      questStep('math/arithmetic-trail', 'quiz', 'Arithmetic Trail'),
      questStep('math/fair-houses', 'arcade', 'Fair Houses'),
      questStep('math/hold-the-number', 'focus', 'Hold the Number'),
      questStep('math/sum-lane', 'arcade', 'Sum Lane'),
      questStep('math/tens-cave', 'arcade', 'Tens Cave'),
      questStep('math/hour-tower', 'arcade', 'Hour Tower'),
      questStep('math/lantern-crumbs', 'arcade', 'Crumb Maze')
    ],
    science: [
      questStep('science/plants-living-quiz', 'quiz', 'Plants & Living Quiz'),
      questStep('science/rule-flip', 'focus', 'Rule Flip'),
      questStep('science/sprout-disco', 'play', 'Sprout Disco'),
      questStep('science/sprout-hop', 'arcade', 'Sprout Hop'),
      questStep('science/plant-needs-garden', 'quiz', 'Plant Needs Garden'),
      questStep('science/garden-patrol', 'arcade', 'Garden Patrol'),
      questStep('science/living-or-not-sort', 'quiz', 'Living or Not?'),
      questStep('science/seed-slide', 'arcade', 'Seed Slide'),
      questStep('science/habitat-hop', 'arcade', 'Habitat Hop'),
      questStep('science/food-factory', 'arcade', 'Food Factory'),
      questStep('science/lantern-hut', 'arcade', 'Hut Door')
    ],
    english: [
      questStep('english/story-sleuth', 'reading', 'Story Sleuth'),
      questStep('english/mirror-letters', 'focus', 'Mirror Letters'),
      questStep('english/runway-roar', 'play', 'Runway Roar'),
      questStep('english/covering-run', 'arcade', 'Covering Run'),
      questStep('english/sentence-clue', 'reading', 'Sentence Clue'),
      questStep('english/pronoun-pop', 'arcade', 'Pronoun Pop'),
      questStep('english/word-sweep', 'focus', 'Word Sweep'),
      questStep('english/always-river', 'arcade', 'Always River'),
      questStep('english/order-climb', 'arcade', 'Order Climb'),
      questStep('english/cause-bridge', 'arcade', 'Cause Bridge'),
      questStep('english/lantern-crates', 'arcade', 'Crate Catch')
    ],
    french: [
      questStep('french/lecture-maligne', 'reading', 'Lecture maligne'),
      questStep('french/lettres-miroir', 'focus', 'Lettres miroir'),
      questStep('french/gouter-volant', 'play', 'Goûter volant'),
      questStep('french/gouter-run', 'arcade', 'Goûter Run'),
      questStep('french/phrase-indice', 'reading', 'Phrase indice'),
      questStep('french/qui-maze', 'arcade', 'Qui Maze'),
      questStep('french/mot-manquant', 'reading', 'Mot manquant'),
      questStep('french/mot-hop', 'arcade', 'Mot Hop'),
      questStep('french/ordre-cases', 'arcade', 'Ordre des cases'),
      questStep('french/lettre-express', 'arcade', 'Lettre Express'),
      questStep('french/lantern-logs', 'arcade', 'Rondins')
    ],
    hpe: [
      questStep('hpe/organ-jobs-quiz', 'quiz', 'Organ Jobs Quiz'),
      questStep('hpe/body-sequence', 'focus', 'Body Sequence'),
      questStep('hpe/robot-boing', 'play', 'Robot Boing'),
      questStep('hpe/organ-run', 'arcade', 'Organ Run'),
      questStep('hpe/super-teeth-care', 'quiz', 'Super Teeth Care'),
      questStep('hpe/brush-beat', 'arcade', 'Brush Beat'),
      questStep('hpe/move-it-loco', 'quiz', 'Move It! Loco'),
      questStep('hpe/move-gate', 'arcade', 'Move Gate'),
      questStep('hpe/snack-dodge', 'arcade', 'Snack Dodge'),
      questStep('hpe/day-loop', 'arcade', 'Day Loop'),
      questStep('hpe/lantern-buddy', 'arcade', 'Buddy Steps')
    ],
    thai: [
      questStep('thai/consonant-class-sort', 'quiz', 'Consonant Class Sort'),
      questStep('thai/hat-shop-hop', 'play', 'Hat Shop Hop'),
      questStep('thai/hear-the-word', 'quiz', 'Hear the Word'),
      questStep('thai/letter-hop', 'arcade', 'Letter Hop'),
      questStep('thai/tone-mark-match', 'quiz', 'Tone Mark Match'),
      questStep('thai/tone-hats', 'arcade', 'Tone Hats'),
      questStep('thai/thai-digits-race', 'quiz', 'Thai Digits Race'),
      questStep('thai/digit-coins', 'arcade', 'Digit Coins'),
      questStep('thai/mae-cave', 'arcade', 'Mae Cave'),
      questStep('thai/listen-chase', 'arcade', 'Listen Chase'),
      questStep('thai/lantern-listen', 'arcade', 'Listen Step')
    ],
    computing: [
      questStep('computing/arrow-bot', 'arcade', 'Arrow Bot'),
      questStep('computing/bug-walk', 'arcade', 'Bug Walk'),
      questStep('computing/parts-room', 'arcade', 'Parts Room'),
      questStep('computing/keep-it-private', 'arcade', 'Keep It Private'),
      questStep('computing/predict-the-stop', 'arcade', 'Predict the Stop'),
      questStep('computing/lantern-blocks', 'arcade', 'Block Path')
    ]
  };

  const ARCADE_ORDER = {
    math: ['math/biscuit-run', 'math/fair-houses', 'math/sum-lane', 'math/tens-cave', 'math/hour-tower', 'math/lantern-crumbs'],
    science: ['science/sprout-hop', 'science/garden-patrol', 'science/seed-slide', 'science/habitat-hop', 'science/food-factory', 'science/lantern-hut'],
    english: ['english/covering-run', 'english/pronoun-pop', 'english/always-river', 'english/order-climb', 'english/cause-bridge', 'english/lantern-crates'],
    french: ['french/gouter-run', 'french/qui-maze', 'french/mot-hop', 'french/ordre-cases', 'french/lettre-express', 'french/lantern-logs'],
    hpe: ['hpe/organ-run', 'hpe/brush-beat', 'hpe/move-gate', 'hpe/snack-dodge', 'hpe/day-loop', 'hpe/lantern-buddy'],
    thai: ['thai/letter-hop', 'thai/tone-hats', 'thai/digit-coins', 'thai/mae-cave', 'thai/listen-chase', 'thai/lantern-listen'],
    computing: ['computing/arrow-bot', 'computing/bug-walk', 'computing/parts-room', 'computing/keep-it-private', 'computing/predict-the-stop', 'computing/lantern-blocks']
  };
  const STREAK_XP = [
    { min: 8, bonus: 15 },
    { min: 5, bonus: 10 },
    { min: 3, bonus: 5 }
  ];

  /** Stable short key from question/step content (survives shuffle). */
  function questionKey(parts) {
    const raw = (Array.isArray(parts) ? parts : [parts])
      .map((p) => String(p == null ? '' : p).trim().toLowerCase().replace(/\s+/g, ' '))
      .join('|');
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function streakBonus(streak) {
    const n = Number(streak) || 0;
    for (let i = 0; i < STREAK_XP.length; i++) {
      if (n >= STREAK_XP[i].min) return STREAK_XP[i].bonus;
    }
    return 0;
  }

  function loadDirty() {
    try {
      const raw = localStorage.getItem(DIRTY_KEY);
      if (!raw) return {};
      const o = JSON.parse(raw);
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function saveDirty(dirty) {
    try {
      localStorage.setItem(DIRTY_KEY, JSON.stringify(dirty || {}));
    } catch (e) { /* ignore */ }
  }

  function markDirty(id, updatedAt) {
    if (!id) return;
    const dirty = loadDirty();
    dirty[id] = updatedAt || nowIso();
    saveDirty(dirty);
  }

  function clearDirtyIfUnchanged(ids, pushedUpdatedAt) {
    if (!ids || !ids.length) return;
    const dirty = loadDirty();
    const data = load();
    let stillDirty = false;
    ids.forEach((id) => {
      const local = data.profiles[id];
      const pushedAt = pushedUpdatedAt && pushedUpdatedAt[id];
      const localAt = local && local.updatedAt;
      // Only clear if local profile was not mutated after the snapshot we pushed
      if (pushedAt && localAt && localAt === pushedAt) {
        delete dirty[id];
      } else if (dirty[id]) {
        stillDirty = true;
        if (localAt) dirty[id] = localAt;
      }
    });
    saveDirty(dirty);
    return stillDirty;
  }

  function touchProfile(p) {
    if (p) {
      p.updatedAt = nowIso();
      if (p.id) markDirty(p.id, p.updatedAt);
    }
    return p;
  }

  function capAwardedKeys(entry) {
    if (!entry || !entry.awardedKeys || typeof entry.awardedKeys !== 'object') return;
    const keys = Object.keys(entry.awardedKeys);
    if (keys.length <= MAX_AWARDED_KEYS) return;
    keys.sort((a, b) => {
      const atA = Date.parse((entry.awardedKeys[a] && entry.awardedKeys[a].at) || 0) || 0;
      const atB = Date.parse((entry.awardedKeys[b] && entry.awardedKeys[b].at) || 0) || 0;
      return atA - atB;
    });
    const drop = keys.length - MAX_AWARDED_KEYS;
    for (let i = 0; i < drop; i++) delete entry.awardedKeys[keys[i]];
  }

  function mergeAwardedKeys(a, b) {
    const out = Object.assign({}, a || {});
    Object.keys(b || {}).forEach((k) => {
      if (!out[k]) {
        out[k] = b[k];
        return;
      }
      const atA = Date.parse((out[k] && out[k].at) || 0) || 0;
      const atB = Date.parse((b[k] && b[k].at) || 0) || 0;
      if (atB && (!atA || atB < atA)) out[k] = b[k];
    });
    return out;
  }

  function mergeGameEntry(local, remote) {
    if (!local) return remote;
    if (!remote) return local;
    const awardedKeys = mergeAwardedKeys(local.awardedKeys, remote.awardedKeys);
    capAwardedKeys({ awardedKeys });
    const localScore = local.bestScore || 0;
    const remoteScore = remote.bestScore || 0;
    const useRemoteScore =
      remoteScore > localScore ||
      (remoteScore === localScore && (remote.bestTotal || 0) > 0 && (remote.bestTotal || 0) < (local.bestTotal || Infinity));
    const localCp = local.checkpoint;
    const remoteCp = remote.checkpoint;
    let checkpoint = localCp || remoteCp || undefined;
    if (localCp && remoteCp) {
      const lt = Date.parse(localCp.updatedAt || 0) || 0;
      const rt = Date.parse(remoteCp.updatedAt || 0) || 0;
      checkpoint = rt >= lt ? remoteCp : localCp;
    }
    const localPlayed = Date.parse(local.lastPlayed || 0) || 0;
    const remotePlayed = Date.parse(remote.lastPlayed || 0) || 0;
    const merged = {
      bestMedal: betterMedal(local.bestMedal, remote.bestMedal),
      bestScore: useRemoteScore ? remoteScore : localScore,
      bestTotal: useRemoteScore ? remote.bestTotal || local.bestTotal || 1 : local.bestTotal || remote.bestTotal || 1,
      plays: Math.max(local.plays || 0, remote.plays || 0),
      lastPlayed:
        remotePlayed >= localPlayed
          ? remote.lastPlayed || local.lastPlayed || null
          : local.lastPlayed || remote.lastPlayed || null,
      awardedKeys,
      liveXp: !!(local.liveXp || remote.liveXp || Object.keys(awardedKeys).length)
    };
    if (checkpoint) merged.checkpoint = checkpoint;
    return merged;
  }

  function mergeQuest(local, remote) {
    const out = {};
    [local || {}, remote || {}].forEach((quest) => {
      Object.keys(quest).forEach((key) => {
        const n = Number(quest[key]) || 0;
        if (n > (out[key] || 0)) out[key] = n;
      });
    });
    return out;
  }

  function mergeActivity(local, remote) {
    const days = {};
    const ld = (local && local.days) || {};
    const rd = (remote && remote.days) || {};
    const keys = {};
    Object.keys(ld).forEach((k) => {
      keys[k] = true;
    });
    Object.keys(rd).forEach((k) => {
      keys[k] = true;
    });
    Object.keys(keys).forEach((key) => {
      const a = ld[key] || {};
      const b = rd[key] || {};
      days[key] = {
        xp: Math.max(a.xp || 0, b.xp || 0),
        exercises: Math.max(a.exercises || 0, b.exercises || 0),
        questions: Math.max(a.questions || 0, b.questions || 0),
        arcadeXp: Math.max(a.arcadeXp || 0, b.arcadeXp || 0),
        arcadeCreditsSpent: Math.max(a.arcadeCreditsSpent || 0, b.arcadeCreditsSpent || 0),
        arcadePlays: Math.max(a.arcadePlays || 0, b.arcadePlays || 0),
        arcadeSeconds: Math.max(a.arcadeSeconds || 0, b.arcadeSeconds || 0),
        arcadeGates: Math.max(a.arcadeGates || 0, b.arcadeGates || 0)
      };
    });
    return { days };
  }

  function mergeTwoProfiles(local, remote) {
    if (!local) return remote;
    if (!remote) return local;
    const games = {};
    const lg = local.games || {};
    const rg = remote.games || {};
    const gids = {};
    Object.keys(lg).forEach((k) => {
      gids[k] = true;
    });
    Object.keys(rg).forEach((k) => {
      gids[k] = true;
    });
    Object.keys(gids).forEach((gid) => {
      games[gid] = mergeGameEntry(lg[gid], rg[gid]);
    });
    const xp = Math.max(local.xp || 0, remote.xp || 0);
    const remoteAt = Date.parse(remote.updatedAt || 0) || 0;
    const localAt = Date.parse(local.updatedAt || 0) || 0;
    const newer = remoteAt >= localAt ? remote : local;
    return {
      id: local.id || remote.id,
      name: newer.name || local.name || remote.name,
      avatarEmoji: newer.avatarEmoji || local.avatarEmoji || remote.avatarEmoji,
      pinFruit: local.pinFruit || remote.pinFruit || null,
      xp,
      level: levelFromXp(xp),
      games,
      activity: mergeActivity(local.activity, remote.activity),
      quest: mergeQuest(local.quest, remote.quest),
      disabled: !!(newer.disabled || local.disabled || remote.disabled),
      disabledReason: newer.disabledReason || local.disabledReason || remote.disabledReason || null,
      updatedAt: remoteAt >= localAt ? remote.updatedAt || local.updatedAt : local.updatedAt || remote.updatedAt
    };
  }

  function todayKey(d) {
    const dt = d || new Date();
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function ensureActivity(p) {
    if (!p.activity || typeof p.activity !== 'object') p.activity = { days: {} };
    if (!p.activity.days || typeof p.activity.days !== 'object') p.activity.days = {};
    return p.activity;
  }

  function bumpActivity(p, opts = {}) {
    const activity = ensureActivity(p);
    const key = todayKey();
    if (!activity.days[key]) activity.days[key] = { xp: 0, exercises: 0, questions: 0 };
    const row = activity.days[key];
    const xp = Math.max(0, Number(opts.xp) || 0);
    row.xp = (row.xp || 0) + xp;
    row.exercises = (row.exercises || 0) + Math.max(0, Number(opts.exercises) || 0);
    row.questions = (row.questions || 0) + Math.max(0, Number(opts.questions) || 0);
    if (opts.arcade) row.arcadeXp = (row.arcadeXp || 0) + xp;
    row.arcadePlays = (row.arcadePlays || 0) + Math.max(0, Number(opts.arcadePlays) || 0);
    row.arcadeSeconds = (row.arcadeSeconds || 0) + Math.max(0, Number(opts.arcadeSeconds) || 0);
    row.arcadeGates = (row.arcadeGates || 0) + Math.max(0, Number(opts.arcadeGates) || 0);
    return row;
  }

  function practiceXp(row) {
    return Math.max(0, (Number(row && row.xp) || 0) - (Number(row && row.arcadeXp) || 0));
  }

  function questIndexOf(profile, subject) {
    const quest = profile && profile.quest;
    return Math.max(0, Number(quest && quest[subject]) || 0);
  }

  function arcadeCreditState(profile) {
    const days = (profile && profile.activity && profile.activity.days) || {};
    const now = new Date();
    const today = todayKey(now);
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    let todayPractice = 0;
    let weekPractice = 0;
    let spent = 0;
    Object.keys(days).forEach((key) => {
      const row = days[key] || {};
      const practice = practiceXp(row);
      if (key === today) {
        todayPractice = practice;
        spent = Number(row.arcadeCreditsSpent) || 0;
      }
      const dt = parseDayKey(key);
      if (dt && dt >= weekStart && dt <= now) weekPractice += practice;
    });
    const earned = Math.min(
      CREDIT_CAP,
      1 + Math.floor(todayPractice / CREDIT_TODAY) + Math.floor(weekPractice / CREDIT_WEEK)
    );
    return {
      earned: earned,
      spent: spent,
      left: Math.max(0, earned - spent),
      todayPractice: todayPractice,
      weekPractice: weekPractice
    };
  }

  function spendArcadeCredit() {
    const profile = getActiveProfile();
    if (!profile) return { ok: true, guest: true, left: 1, earned: 1 };
    const state = arcadeCreditState(profile);
    if (state.left <= 0) return { ok: false, earned: state.earned, spent: state.spent, left: 0 };
    const data = load();
    const p = data.profiles[profile.id];
    if (!p) return { ok: false, left: 0 };
    const activity = ensureActivity(p);
    const key = todayKey();
    if (!activity.days[key]) activity.days[key] = { xp: 0, exercises: 0, questions: 0 };
    activity.days[key].arcadeCreditsSpent = (activity.days[key].arcadeCreditsSpent || 0) + 1;
    touchProfile(p);
    save(data);
    schedulePush();
    return { ok: true, earned: state.earned, spent: state.spent + 1, left: state.left - 1 };
  }

  function refundArcadeCredit() {
    const profile = getActiveProfile();
    if (!profile) return { ok: false };
    const data = load();
    const p = data.profiles[profile.id];
    if (!p) return { ok: false };
    const activity = ensureActivity(p);
    const key = todayKey();
    const row = activity.days[key];
    if (!row || !(row.arcadeCreditsSpent > 0)) return { ok: false };
    row.arcadeCreditsSpent -= 1;
    touchProfile(p);
    save(data);
    schedulePush();
    return { ok: true, left: arcadeCreditState(p).left };
  }

  function recordArcadeSession({ plays, seconds, gates } = {}) {
    const profile = getActiveProfile();
    if (!profile) return null;
    const data = load();
    const p = data.profiles[profile.id];
    if (!p) return null;
    bumpActivity(p, {
      arcadePlays: plays || 0,
      arcadeSeconds: seconds || 0,
      arcadeGates: gates || 0
    });
    touchProfile(p);
    save(data);
    scheduleCriticalPush();
    return true;
  }

  function arcadeLocked(gameId) {
    if (!gameId) return false;
    const subject = String(gameId).split('/')[0];
    const order = ARCADE_ORDER[subject];
    if (!order) return false;
    const at = order.indexOf(gameId);
    if (at < 0 || at < 3) return false;
    const path = QUEST_PATHS[subject] || [];
    const stepAt = path.findIndex((step) => step.id === gameId);
    if (stepAt < 0) return true;
    return questIndexOf(getActiveProfile(), subject) < stepAt;
  }

  function noteQuestFinish(p, gameId) {
    const subject = String(gameId || '').split('/')[0];
    const path = QUEST_PATHS[subject];
    if (!path) return;
    if (!p.quest || typeof p.quest !== 'object') p.quest = {};
    const index = Math.max(0, Number(p.quest[subject]) || 0);
    const step = path[index];
    if (step && step.id === gameId) p.quest[subject] = index + 1;
  }

  function questSnapshot(subject) {
    const path = QUEST_PATHS[subject] || [];
    const index = questIndexOf(getActiveProfile(), subject);
    return {
      index: index,
      done: path.length > 0 && index >= path.length,
      steps: path.map((step, i) => ({
        id: step.id,
        kind: step.kind,
        title: step.title,
        href: 'games/' + step.id.split('/')[1] + '.html',
        state: i < index ? 'done' : i === index ? 'now' : 'later'
      }))
    };
  }

  function parseDayKey(key) {
    const parts = String(key || '').split('-');
    if (parts.length !== 3) return null;
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  function activitySummary(profile) {
    const span = () => ({ xp: 0, exercises: 0, questions: 0, arcadePlays: 0, arcadeSeconds: 0, arcadeGates: 0 });
    const empty = {
      today: span(),
      week: span(),
      month: span(),
      year: span(),
      exercisesTotal: 0,
      questionsTotal: 0,
      xpLogged: 0,
      arcadePlays: 0,
      arcadeSeconds: 0,
      arcadeGates: 0
    };
    if (!profile) return empty;
    const days = (profile.activity && profile.activity.days) || {};
    const now = new Date();
    const today = todayKey(now);
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const month = now.getMonth();
    const year = now.getFullYear();

    const sum = { xp: 0, exercises: 0, questions: 0 };
    Object.keys(days).forEach((key) => {
      const row = days[key] || {};
      const xp = Number(row.xp) || 0;
      const exercises = Number(row.exercises) || 0;
      const questions = Number(row.questions) || 0;
      const arcadePlays = Number(row.arcadePlays) || 0;
      const arcadeSeconds = Number(row.arcadeSeconds) || 0;
      const arcadeGates = Number(row.arcadeGates) || 0;
      sum.xp += xp;
      sum.exercises += exercises;
      sum.questions += questions;
      empty.arcadePlays += arcadePlays;
      empty.arcadeSeconds += arcadeSeconds;
      empty.arcadeGates += arcadeGates;

      if (key === today) {
        empty.today.xp += xp;
        empty.today.exercises += exercises;
        empty.today.questions += questions;
        empty.today.arcadePlays += arcadePlays;
        empty.today.arcadeSeconds += arcadeSeconds;
        empty.today.arcadeGates += arcadeGates;
      }
      const dt = parseDayKey(key);
      if (!dt) return;
      if (dt >= weekStart && dt <= now) {
        empty.week.xp += xp;
        empty.week.exercises += exercises;
        empty.week.questions += questions;
        empty.week.arcadePlays += arcadePlays;
        empty.week.arcadeSeconds += arcadeSeconds;
        empty.week.arcadeGates += arcadeGates;
      }
      if (dt.getFullYear() === year && dt.getMonth() === month) {
        empty.month.xp += xp;
        empty.month.exercises += exercises;
        empty.month.questions += questions;
      }
      if (dt.getFullYear() === year) {
        empty.year.xp += xp;
        empty.year.exercises += exercises;
        empty.year.questions += questions;
      }
    });
    empty.exercisesTotal = sum.exercises;
    empty.questionsTotal = sum.questions;
    empty.xpLogged = sum.xp;
    return empty;
  }

  function listProfiles() {
    const data = load();
    return Object.values(data.profiles).sort((a, b) => a.name.localeCompare(b.name));
  }

  function listPlayableProfiles() {
    return listProfiles().filter((p) => !p.disabled);
  }

  function getProfile(id) {
    return load().profiles[id] || null;
  }

  function getActiveProfile() {
    const unlocked = getSessionUnlockedId();
    if (!unlocked) return null;
    const p = getProfile(unlocked);
    if (p && p.disabled) return null;
    return p;
  }

  function isUnlocked() {
    return !!getActiveProfile();
  }

  function createProfile({ name, avatarEmoji, pinFruit }) {
    const clean = String(name || '').trim().slice(0, 24);
    const nameCheck = checkName(clean);
    if (!nameCheck.ok) throw new Error(nameErrorMessage(nameCheck.reason));
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
      games: {},
      activity: { days: {} },
      disabled: false,
      disabledReason: null
    });
    save(data);
    schedulePush();
    return data.profiles[id];
  }

  function renameProfile(id, newName) {
    const clean = String(newName || '').trim().slice(0, 24);
    const nameCheck = checkName(clean);
    if (!nameCheck.ok) return { ok: false, reason: nameCheck.reason, message: nameErrorMessage(nameCheck.reason) };
    const data = load();
    const p = data.profiles[id];
    if (!p) return { ok: false, reason: 'missing', message: 'Profile not found.' };
    p.name = clean;
    p.disabled = false;
    p.disabledReason = null;
    touchProfile(p);
    save(data);
    schedulePush();
    return { ok: true, profile: p };
  }

  function unlockProfile(id, fruit) {
    const profile = getProfile(id);
    if (!profile) return { ok: false, reason: 'missing' };
    if (profile.disabled) return { ok: false, reason: 'disabled' };
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

  function awardAnswerXp(gameId, { key, correct, streak, arcade, runId } = {}) {
    const profile = getActiveProfile();
    if (!profile || !gameId) {
      return { xpGained: 0, base: 0, bonus: 0, totalXp: 0, alreadyAwarded: false };
    }
    if (!correct) {
      return {
        xpGained: 0,
        base: 0,
        bonus: 0,
        totalXp: profile.xp || 0,
        alreadyAwarded: false
      };
    }
    const qKey = String(key || '').trim();
    if (!qKey) {
      return { xpGained: 0, base: 0, bonus: 0, totalXp: profile.xp || 0, alreadyAwarded: false };
    }

    const data = load();
    const p = data.profiles[profile.id];
    if (!p) {
      return { xpGained: 0, base: 0, bonus: 0, totalXp: 0, alreadyAwarded: false };
    }
    const entry = ensureGameEntry(p, gameId);
    if (!entry.awardedKeys) entry.awardedKeys = {};
    if (entry.awardedKeys[qKey]) {
      return {
        xpGained: 0,
        base: 0,
        bonus: 0,
        totalXp: p.xp || 0,
        alreadyAwarded: true
      };
    }

    const isArcade = arcade === true;
    const base = isArcade ? ARCADE_XP : XP_PER_CORRECT;
    const bonus = isArcade ? 0 : streakBonus(streak);
    let gained = base + bonus;
    if (isArcade) {
      const rid = String(runId || 'run');
      if (entry.arcadeRunId !== rid) {
        entry.arcadeRunId = rid;
        entry.arcadeRunXp = 0;
      }
      const room = ARCADE_CAP - (entry.arcadeRunXp || 0);
      if (room <= 0) {
        return {
          xpGained: 0,
          base: 0,
          bonus: 0,
          totalXp: p.xp || 0,
          alreadyAwarded: false,
          capped: true
        };
      }
      gained = Math.min(gained, room);
      entry.arcadeRunXp = (entry.arcadeRunXp || 0) + gained;
    }
    entry.awardedKeys[qKey] = {
      base,
      bonus,
      streak: Number(streak) || 0,
      at: nowIso()
    };
    capAwardedKeys(entry);
    entry.liveXp = true;
    p.xp = (p.xp || 0) + gained;
    p.level = levelFromXp(p.xp);
    bumpActivity(p, { xp: gained, questions: 1, arcade: isArcade });
    touchProfile(p);
    save(data);
    scheduleCriticalPush();

    const result = {
      xpGained: gained,
      base,
      bonus,
      totalXp: p.xp,
      xp: p.xp,
      level: p.level,
      levelTitle: levelTitle(p.level, p.avatarEmoji),
      alreadyAwarded: false
    };
    document.dispatchEvent(new CustomEvent('nolan:progress', { detail: result }));
    return result;
  }

  function recordResult(gameId, { score, total, skipXp } = {}) {
    const profile = getActiveProfile();
    if (!profile || !gameId) return null;
    const s = Math.max(0, Number(score) || 0);
    const t = Math.max(1, Number(total) || 1);
    const clamped = Math.min(s, t);
    const mistakes = Math.max(0, t - clamped);
    const medal = medalFromMistakes(mistakes);

    const data = load();
    const p = data.profiles[profile.id];
    if (!p) return null;
    const prev = ensureGameEntry(p, gameId, t);
    const prevBest = prev.bestScore || 0;
    const nextMedal = betterMedal(medal, prev.bestMedal);
    const betterScore =
      clamped > prevBest || (clamped === prevBest && t <= (prev.bestTotal || t));

    const hasLiveAwards =
      !!prev.liveXp || (prev.awardedKeys && Object.keys(prev.awardedKeys).length > 0);
    let gained = 0;
    if (!skipXp && !hasLiveAwards) {
      // Legacy / custom games: XP only for newly beaten best score (corrects only).
      gained = XP_PER_CORRECT * Math.max(0, clamped - prevBest);
    }

    p.games[gameId] = {
      bestMedal: nextMedal,
      bestScore: betterScore ? clamped : prevBest,
      bestTotal: betterScore ? t : prev.bestTotal || t,
      plays: (prev.plays || 0) + 1,
      lastPlayed: nowIso(),
      awardedKeys: prev.awardedKeys || {},
      liveXp: prev.liveXp || false
    };
    capAwardedKeys(p.games[gameId]);
    if (prev.checkpoint) p.games[gameId].checkpoint = prev.checkpoint;
    p.xp = (p.xp || 0) + gained;
    p.level = levelFromXp(p.xp);
    const legacyQuestions = !skipXp && !hasLiveAwards ? Math.max(0, clamped - prevBest) : 0;
    bumpActivity(p, {
      xp: gained,
      exercises: 1,
      questions: legacyQuestions
    });
    noteQuestFinish(p, gameId);
    touchProfile(p);
    save(data);
    scheduleCriticalPush();
    document.dispatchEvent(new CustomEvent('nolan:progress', { detail: { quest: true } }));

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

  const SUBJECT_LABELS = {
    math: 'Math',
    science: 'Science',
    english: 'English',
    french: 'French',
    hpe: 'HPE',
    thai: 'Thai',
    computing: 'Computing'
  };

  function subjectStats(profile) {
    const order = ['math', 'science', 'english', 'french', 'hpe', 'thai', 'computing'];
    const buckets = {};
    order.forEach((s) => {
      buckets[s] = {
        subject: s,
        label: SUBJECT_LABELS[s] || s,
        gamesSucceeded: 0,
        gamesPlayed: 0,
        questionsCorrect: 0,
        gold: 0,
        silver: 0,
        bronze: 0
      };
    });
    const games = (profile && profile.games) || {};
    Object.keys(games).forEach((gid) => {
      const slash = gid.indexOf('/');
      const subject = slash > 0 ? gid.slice(0, slash) : 'other';
      if (!buckets[subject]) {
        buckets[subject] = {
          subject,
          label: SUBJECT_LABELS[subject] || subject,
          gamesSucceeded: 0,
          gamesPlayed: 0,
          questionsCorrect: 0,
          gold: 0,
          silver: 0,
          bronze: 0
        };
      }
      const g = games[gid] || {};
      const medal = g.bestMedal;
      const awarded = g.awardedKeys && typeof g.awardedKeys === 'object' ? Object.keys(g.awardedKeys).length : 0;
      const succeeded =
        (medal === 'gold' || medal === 'silver' || medal === 'bronze') ||
        (Number(g.bestScore) || 0) > 0 ||
        awarded > 0;
      if ((g.plays || 0) > 0 || medal || awarded) buckets[subject].gamesPlayed += 1;
      if (succeeded) buckets[subject].gamesSucceeded += 1;
      buckets[subject].questionsCorrect += awarded;
      if (medal === 'gold') buckets[subject].gold += 1;
      if (medal === 'silver') buckets[subject].silver += 1;
      if (medal === 'bronze') buckets[subject].bronze += 1;
    });
    return order
      .map((s) => buckets[s])
      .concat(Object.keys(buckets).filter((s) => order.indexOf(s) === -1).map((s) => buckets[s]));
  }

  function checkName(name) {
    if (global.NameModeration && typeof global.NameModeration.isNameAllowed === 'function') {
      return global.NameModeration.isNameAllowed(name);
    }
    const clean = String(name || '').trim();
    if (!clean) return { ok: false, reason: 'empty' };
    if (clean.length > 24) return { ok: false, reason: 'long' };
    return { ok: true };
  }

  function nameErrorMessage(reason) {
    if (reason === 'empty') return 'Please enter a first name.';
    if (reason === 'long') return 'Name is too long (max 24).';
    if (reason === 'shape') {
      return 'Please use a short first name (up to 2 words, letters only).';
    }
    return 'Please choose a kinder first name — no rude or mean words.';
  }

  function applyNamePolicyToStore(data) {
    let changed = false;
    Object.keys(data.profiles || {}).forEach((id) => {
      const p = data.profiles[id];
      if (!p) return;
      const check = checkName(p.name);
      if (!check.ok) {
        const safe =
          global.NameModeration && typeof global.NameModeration.safeReplacementName === 'function'
            ? global.NameModeration.safeReplacementName(p)
            : 'Friend';
        const needsRewrite = p.name !== safe;
        const needsDisable = !p.disabled || p.disabledReason !== 'name';
        if (needsRewrite || needsDisable) {
          p.name = safe;
          p.disabled = true;
          p.disabledReason = 'name';
          touchProfile(p);
          markDirty(id, p.updatedAt);
          changed = true;
        }
        if (data.activeProfileId === id) data.activeProfileId = null;
        if (getSessionUnlockedId() === id) setSessionUnlockedId(null);
      } else if (p.disabled && p.disabledReason === 'name') {
        // Keep disabled until rename clears it explicitly; do not auto-enable.
      }
    });
    return changed;
  }

  function enforceNamePolicy() {
    const data = load();
    if (applyNamePolicyToStore(data)) {
      save(data);
      document.dispatchEvent(new CustomEvent('nolan:profiles', { detail: { count: Object.keys(data.profiles).length } }));
    }
  }

  function leaderboardRows() {
    return listProfiles()
      .filter((p) => !p.disabled)
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

  async function fetchGlobalLeaderboard() {
    try {
      const data = await apiPost({ action: 'leaderboard' });
      const rows = (data.rows || []).map((row) =>
        Object.assign({}, row, {
          levelTitle: levelTitle(row.level || 1, row.avatarEmoji)
        })
      );
      return rows;
    } catch (e) {
      return leaderboardRows();
    }
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
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 10000) : null;
    let res;
    try {
      res = await fetch(apiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      });
    } finally {
      if (timer) clearTimeout(timer);
    }
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

  function applyCloudProfiles(incoming) {
    if (!incoming || typeof incoming !== 'object') return;
    const dirtyBefore = loadDirty();
    const data = load();
    Object.keys(incoming).forEach((id) => {
      const remote = incoming[id];
      if (!remote || !remote.id) return;
      const local = data.profiles[id];
      const wasDirty = !!dirtyBefore[id];
      if (!local) {
        data.profiles[id] = remote;
        return;
      }
      data.profiles[id] = mergeTwoProfiles(local, remote);
      // Keep dirty so local exercise/medal gains are re-pushed after merge
      if (wasDirty && data.profiles[id]) {
        markDirty(id, data.profiles[id].updatedAt || nowIso());
      }
    });
    save(data);
    enforceNamePolicy();
    document.dispatchEvent(new CustomEvent('nolan:profiles', { detail: { count: Object.keys(data.profiles).length } }));
  }

  function pruneArchivedProfiles(archivedIds) {
    if (!Array.isArray(archivedIds) || !archivedIds.length) return false;
    const blocked = new Set(archivedIds.map((id) => String(id)));
    const data = load();
    let changed = false;
    Object.keys(data.profiles || {}).forEach((id) => {
      if (!blocked.has(id)) return;
      delete data.profiles[id];
      changed = true;
      if (data.activeProfileId === id) data.activeProfileId = null;
      if (getSessionUnlockedId() === id) setSessionUnlockedId(null);
    });
    const dirty = loadDirty();
    let dirtyChanged = false;
    Object.keys(dirty).forEach((id) => {
      if (!blocked.has(id)) return;
      delete dirty[id];
      dirtyChanged = true;
    });
    if (dirtyChanged) saveDirty(dirty);
    if (changed) {
      save(data);
      document.dispatchEvent(new CustomEvent('nolan:profiles', { detail: { count: Object.keys(data.profiles).length } }));
    }
    return changed;
  }

  function collectDirtyProfiles() {
    const data = load();
    const dirty = loadDirty();
    const out = {};
    Object.keys(dirty).forEach((id) => {
      if (data.profiles[id]) out[id] = data.profiles[id];
    });
    return out;
  }

  function scheduleRetry() {
    clearTimeout(retryTimer);
    if (retryAttempt >= RETRY_DELAYS_MS.length) retryAttempt = RETRY_DELAYS_MS.length - 1;
    const delay = RETRY_DELAYS_MS[retryAttempt] || 15000;
    retryAttempt += 1;
    retryTimer = setTimeout(() => {
      pushProfiles().catch(() => {});
    }, delay);
  }

  async function pullProfiles() {
    try {
      const data = await apiPost({ action: 'list' });
      applyCloudProfiles(data.profiles || {});
      pruneArchivedProfiles(data.archivedIds || []);
      enforceNamePolicy();
      return data.profiles;
    } catch (e) {
      return null;
    }
  }

  async function pushProfiles() {
    if (pushing) return null;
    const toPush = collectDirtyProfiles();
    const ids = Object.keys(toPush);
    if (!ids.length) {
      retryAttempt = 0;
      return load().profiles;
    }
    const pushedUpdatedAt = {};
    ids.forEach((id) => {
      pushedUpdatedAt[id] = toPush[id] && toPush[id].updatedAt;
    });
    pushing = true;
    try {
      const res = await apiPost({ action: 'push', profiles: toPush });
      applyCloudProfiles(res.profiles || {});
      pruneArchivedProfiles(res.archivedIds || []);
      const stillDirty = clearDirtyIfUnchanged(ids, pushedUpdatedAt);
      retryAttempt = 0;
      clearTimeout(retryTimer);
      if (stillDirty) schedulePush();
      return res.profiles;
    } catch (e) {
      scheduleRetry();
      return null;
    } finally {
      pushing = false;
    }
  }

  function schedulePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      pushProfiles().catch(() => {});
    }, 600);
  }

  function scheduleCriticalPush() {
    clearTimeout(criticalPushTimer);
    clearTimeout(pushTimer);
    criticalPushTimer = setTimeout(() => {
      pushProfiles().catch(() => {});
    }, 150);
  }

  function flushPushNow() {
    clearTimeout(pushTimer);
    clearTimeout(criticalPushTimer);
    pushProfiles().catch(() => {});
  }

  function bindFlushListeners() {
    if (flushBound || typeof document === 'undefined') return;
    flushBound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushPushNow();
    });
    window.addEventListener('online', () => {
      retryAttempt = 0;
      flushPushNow();
    });
    window.addEventListener('pagehide', flushPushNow);
  }

  async function ensureProfilesReady() {
    if (syncing) return true;
    syncing = true;
    try {
      bindFlushListeners();
      await pullProfiles();
      await pushProfiles();
    } finally {
      syncing = false;
    }
    return true;
  }

  bindFlushListeners();

  global.NolanProgress = {
    PIN_FRUITS,
    AVATARS,
    AVATAR_CREATURES,
    LEVEL_EPITHETS,
    XP_PER_LEVEL,
    listProfiles,
    listPlayableProfiles,
    getProfile,
    getActiveProfile,
    isUnlocked,
    createProfile,
    renameProfile,
    unlockProfile,
    lock,
    checkName,
    nameErrorMessage,
    enforceNamePolicy,
    recordResult,
    awardAnswerXp,
    questionKey,
    XP_PER_CORRECT,
    ARCADE_XP,
    ARCADE_CAP,
    arcadeCreditState,
    spendArcadeCredit,
    refundArcadeCredit,
    recordArcadeSession,
    arcadeLocked,
    questSnapshot,
    activitySummary,
    subjectStats,
    bumpActivity,
    todayKey,
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
    fetchGlobalLeaderboard,
    pullProfiles,
    pushProfiles,
    ensureProfilesReady,
    schedulePush,
    scheduleCriticalPush,
    flushPushNow,
    xpToNext(profile) {
      const xp = (profile && profile.xp) || 0;
      const level = levelFromXp(xp);
      const nextAt = level * XP_PER_LEVEL;
      return { level, nextAt, into: xp - (level - 1) * XP_PER_LEVEL, need: XP_PER_LEVEL };
    }
  };
})(window);
