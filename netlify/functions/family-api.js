/**
 * Public profiles + leaderboard API (Netlify Blobs).
 * POST actions: list | push | leaderboard | resetProfile | deleteByIds
 * (legacy create/join/pull/push-family accepted as aliases where useful)
 */
const { getStore, connectLambda } = require('@netlify/blobs');

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

function mergeProfiles(existing, incoming) {
  const next = { ...(existing || {}) };
  Object.keys(incoming || {}).forEach((id) => {
    const remote = incoming[id];
    if (!remote || typeof remote !== 'object' || !remote.id) return;
    const local = next[id];
    if (!local) {
      next[id] = remote;
      return;
    }
    const remoteAt = Date.parse(remote.updatedAt || 0) || 0;
    const localAt = Date.parse(local.updatedAt || 0) || 0;
    next[id] = remoteAt >= localAt ? remote : local;
  });
  return next;
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
  const data = (await meta.get(PROFILES_KEY, { type: 'json' })) || { updatedAt: null, profiles: {} };
  if (!data.profiles) data.profiles = {};
  // One-time enrich from legacy public leaderboard rows (no PIN)
  if (!Object.keys(data.profiles).length) {
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
  return data;
}

async function saveProfiles(meta, data) {
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
      return json(200, { ok: true, profiles: store.profiles });
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { ok: false, error: 'Method not allowed' });
    }

    const body = JSON.parse(event.body || '{}');
    const action = body.action || 'list';

    if (action === 'list' || action === 'pull' || action === 'join') {
      const store = await loadProfiles(meta);
      return json(200, { ok: true, profiles: store.profiles });
    }

    if (action === 'push' || action === 'upsert') {
      const store = await loadProfiles(meta);
      const incoming = body.profiles || {};
      if (body.profile && body.profile.id) {
        incoming[body.profile.id] = body.profile;
      }
      store.profiles = mergeProfiles(store.profiles, incoming);
      await saveProfiles(meta, store);
      return json(200, { ok: true, profiles: store.profiles });
    }

    if (action === 'leaderboard') {
      const store = await loadProfiles(meta);
      return json(200, { ok: true, rows: sortedLeaderboard(store) });
    }

    if (action === 'resetProfile') {
      const targetName = String(body.profileName || 'Nolan').trim().toLowerCase();
      const store = await loadProfiles(meta);
      let removed = 0;
      Object.keys(store.profiles || {}).forEach((id) => {
        if (String(store.profiles[id].name || '').trim().toLowerCase() === targetName) {
          delete store.profiles[id];
          removed++;
        }
      });
      await saveProfiles(meta, store);
      return json(200, { ok: true, removed, profiles: store.profiles });
    }

    if (action === 'deleteByIds') {
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
      let removed = 0;
      const removedIds = [];
      ids.forEach((id) => {
        if (store.profiles && store.profiles[id]) {
          delete store.profiles[id];
          removed++;
          removedIds.push(id);
        }
      });
      await saveProfiles(meta, store);
      return json(200, {
        ok: true,
        removed,
        removedIds,
        profiles: store.profiles
      });
    }

    // Legacy family create no longer needed — treat as list so old clients don't hard-fail
    if (action === 'create') {
      const store = await loadProfiles(meta);
      return json(200, { ok: true, profiles: store.profiles, legacy: true });
    }

    return json(400, { ok: false, error: 'Unknown action' });
  } catch (err) {
    return json(500, { ok: false, error: 'Server error', detail: String(err && err.message) });
  }
};
