/**
 * Public profiles + leaderboard API (Netlify Blobs).
 * POST actions: list | push | leaderboard | resetProfile | deleteByIds | archiveByIds
 * (legacy create/join/pull/push-family accepted as aliases where useful)
 *
 * Archived IDs are tombstoned so stale client caches cannot re-push them.
 */
const { getStore, connectLambda } = require('@netlify/blobs');
const NameModeration = require('../../js/name-moderation.js');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

const PROFILES_KEY = 'global-profiles';
const LEGACY_LB_KEY = 'global-leaderboard';
const SITE_ID =
  process.env.SITE_ID ||
  process.env.NETLIFY_SITE_ID ||
  'c393b98c-b56b-4891-ad0c-d8db4c430bde';

function json(status, body) {
  return { statusCode: status, headers: CORS, body: JSON.stringify(body) };
}

function archivedIds(store) {
  return Object.keys((store && store.archived) || {});
}

function publicPayload(store) {
  return {
    ok: true,
    profiles: (store && store.profiles) || {},
    archivedIds: archivedIds(store)
  };
}

const MEDAL_RANK = { gold: 3, silver: 2, bronze: 1, played: 0 };

function betterMedal(a, b) {
  return (MEDAL_RANK[a] || 0) >= (MEDAL_RANK[b] || 0) ? a : b;
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
  const localScore = local.bestScore || 0;
  const remoteScore = remote.bestScore || 0;
  const useRemoteScore =
    remoteScore > localScore ||
    (remoteScore === localScore &&
      (remote.bestTotal || 0) > 0 &&
      (remote.bestTotal || 0) < (local.bestTotal || Infinity));
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
    bestTotal: useRemoteScore
      ? remote.bestTotal || local.bestTotal || 1
      : local.bestTotal || remote.bestTotal || 1,
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
      questions: Math.max(a.questions || 0, b.questions || 0)
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
    level: Math.max(1, Math.floor(xp / 150) + 1),
    games,
    activity: mergeActivity(local.activity, remote.activity),
    disabled: !!(newer.disabled || local.disabled || remote.disabled),
    disabledReason: newer.disabledReason || local.disabledReason || remote.disabledReason || null,
    updatedAt: remoteAt >= localAt ? remote.updatedAt || local.updatedAt : local.updatedAt || remote.updatedAt
  };
}

function sanitizeProfileName(profile) {
  if (!profile || typeof profile !== 'object') return profile;
  const check = NameModeration.isNameAllowed(profile.name);
  if (!check.ok) {
    return Object.assign({}, profile, {
      disabled: true,
      disabledReason: 'name'
    });
  }
  return profile;
}

function mergeProfiles(existing, incoming, archived) {
  const blocked = new Set(Object.keys(archived || {}));
  const next = { ...(existing || {}) };
  Object.keys(incoming || {}).forEach((id) => {
    if (blocked.has(id)) return;
    const remote = sanitizeProfileName(incoming[id]);
    if (!remote || typeof remote !== 'object' || !remote.id) return;
    const local = next[id];
    if (!local) {
      next[id] = remote;
      return;
    }
    next[id] = sanitizeProfileName(mergeTwoProfiles(local, remote));
  });
  return next;
}

function archiveProfilesByIds(store, ids, protect) {
  if (!store.archived) store.archived = {};
  if (!store.profiles) store.profiles = {};
  let archivedCount = 0;
  const archivedNow = [];
  const at = new Date().toISOString();
  ids.forEach((id) => {
    if (protect.has(id)) return;
    const live = store.profiles[id];
    if (live) {
      store.archived[id] = { ...live, archivedAt: at };
      delete store.profiles[id];
      archivedCount++;
      archivedNow.push(id);
      return;
    }
    // Tombstone even if already missing so a later client push cannot resurrect it
    if (!store.archived[id]) {
      store.archived[id] = { id, archivedAt: at, tombstone: true };
      archivedNow.push(id);
    }
  });
  return { archivedCount, archivedNow };
}

function countMedals(profile) {
  const counts = { gold: 0, silver: 0, bronze: 0 };
  const games = (profile && profile.games) || {};
  Object.keys(games).forEach((gid) => {
    const m = games[gid] && games[gid].bestMedal;
    if (m === 'gold' || m === 'silver' || m === 'bronze') counts[m]++;
  });
  return counts;
}

function publicRow(profile) {
  const medals = countMedals(profile);
  const xp = profile.xp || 0;
  const level = Math.max(1, Math.floor(xp / 150) + 1);
  return {
    id: profile.id,
    name: profile.name,
    avatarEmoji: profile.avatarEmoji || '🦊',
    xp,
    level,
    gold: medals.gold,
    silver: medals.silver,
    bronze: medals.bronze,
    updatedAt: profile.updatedAt || new Date().toISOString()
  };
}

function openStore(context, storeName) {
  if (context) {
    try {
      connectLambda(context);
    } catch (e) { /* ignore */ }
  }
  const token = process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const opts = { name: storeName, consistency: 'strong' };
  if (token) {
    opts.siteID = SITE_ID;
    opts.token = token;
  }
  return getStore(opts);
}

async function loadProfiles(meta) {
  const data = (await meta.get(PROFILES_KEY, { type: 'json' })) || {
    updatedAt: null,
    profiles: {},
    archived: {}
  };
  if (!data.profiles) data.profiles = {};
  if (!data.archived) data.archived = {};
  // Drop any live profile that was archived (repair after stale push races)
  Object.keys(data.archived).forEach((id) => {
    if (data.profiles[id]) delete data.profiles[id];
  });
  // One-time enrich from legacy public leaderboard rows (no PIN)
  if (!Object.keys(data.profiles).length && !Object.keys(data.archived).length) {
    const legacy = (await meta.get(LEGACY_LB_KEY, { type: 'json' })) || {};
    if (legacy.profiles && Object.keys(legacy.profiles).length) {
      Object.keys(legacy.profiles).forEach((id) => {
        const row = legacy.profiles[id];
        if (!row || !row.id) return;
        data.profiles[id] = {
          id: row.id,
          name: row.name,
          avatarEmoji: row.avatarEmoji || '🦊',
          pinFruit: null,
          xp: row.xp || 0,
          level: row.level || 1,
          games: {},
          updatedAt: row.updatedAt || new Date().toISOString()
        };
      });
    }
  }
  Object.keys(data.profiles).forEach((id) => {
    data.profiles[id] = sanitizeProfileName(data.profiles[id]);
  });
  return data;
}

async function saveProfiles(meta, data) {
  if (!data.archived) data.archived = {};
  data.updatedAt = new Date().toISOString();
  await meta.setJSON(PROFILES_KEY, data);
  // Keep legacy LB blob in sync for any old clients
  const lb = { updatedAt: data.updatedAt, profiles: {} };
  Object.keys(data.profiles || {}).forEach((id) => {
    lb.profiles[id] = publicRow(data.profiles[id]);
  });
  await meta.setJSON(LEGACY_LB_KEY, lb);
  return data;
}

function sortedLeaderboard(store) {
  return Object.values((store && store.profiles) || {})
    .filter((p) => p && !p.disabled)
    .map(publicRow)
    .sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return String(a.name).localeCompare(String(b.name));
    });
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  let meta;
  try {
    meta = openStore(context, 'meta');
  } catch (err) {
    return json(500, { ok: false, error: 'Blobs unavailable', detail: String(err && err.message) });
  }

  try {
    if (event.httpMethod === 'GET') {
      const store = await loadProfiles(meta);
      return json(200, publicPayload(store));
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { ok: false, error: 'Method not allowed' });
    }

    const body = JSON.parse(event.body || '{}');
    const action = body.action || 'list';

    if (action === 'list' || action === 'pull' || action === 'join') {
      const store = await loadProfiles(meta);
      return json(200, publicPayload(store));
    }

    if (action === 'push' || action === 'upsert') {
      const store = await loadProfiles(meta);
      const incoming = body.profiles || {};
      if (body.profile && body.profile.id) {
        incoming[body.profile.id] = body.profile;
      }
      store.profiles = mergeProfiles(store.profiles, incoming, store.archived);
      await saveProfiles(meta, store);
      return json(200, publicPayload(store));
    }

    if (action === 'leaderboard') {
      const store = await loadProfiles(meta);
      return json(200, { ok: true, rows: sortedLeaderboard(store), archivedIds: archivedIds(store) });
    }

    if (action === 'resetProfile') {
      const targetName = String(body.profileName || 'Nolan').trim().toLowerCase();
      const store = await loadProfiles(meta);
      const ids = Object.keys(store.profiles || {}).filter(
        (id) => String(store.profiles[id].name || '').trim().toLowerCase() === targetName
      );
      const { archivedCount, archivedNow } = archiveProfilesByIds(store, ids, new Set());
      await saveProfiles(meta, store);
      return json(200, {
        ...publicPayload(store),
        removed: archivedCount,
        archivedIdsNow: archivedNow
      });
    }

    if (action === 'deleteByIds' || action === 'archiveByIds') {
      const ids = Array.isArray(body.ids) ? body.ids.map((id) => String(id)) : [];
      const protect = new Set(
        (Array.isArray(body.protectIds) ? body.protectIds : []).map((id) => String(id))
      );
      if (!ids.length) {
        return json(400, { ok: false, error: 'ids required' });
      }
      const blocked = ids.filter((id) => protect.has(id));
      if (blocked.length) {
        return json(400, {
          ok: false,
          error: 'Refused: protected profile id in delete list',
          blocked
        });
      }
      const store = await loadProfiles(meta);
      const { archivedCount, archivedNow } = archiveProfilesByIds(store, ids, protect);
      await saveProfiles(meta, store);
      return json(200, {
        ...publicPayload(store),
        removed: archivedCount,
        removedIds: archivedNow,
        archivedIdsNow: archivedNow
      });
    }

    // Legacy family create no longer needed — treat as list so old clients don't hard-fail
    if (action === 'create') {
      const store = await loadProfiles(meta);
      return json(200, { ...publicPayload(store), legacy: true });
    }

    return json(400, { ok: false, error: 'Unknown action' });
  } catch (err) {
    return json(500, { ok: false, error: 'Server error', detail: String(err && err.message) });
  }
};
