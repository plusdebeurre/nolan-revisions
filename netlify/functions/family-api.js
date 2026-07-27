/**
 * Family + global leaderboard API (Netlify Blobs).
 * POST actions: create | join | pull | push | leaderboard | resetProfile
 */
const { getStore, connectLambda } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

const GLOBAL_KEY = 'global-leaderboard';
const SITE_ID =
  process.env.SITE_ID ||
  process.env.NETLIFY_SITE_ID ||
  'c393b98c-b56b-4891-ad0c-d8db4c430bde';

function json(status, body) {
  return { statusCode: status, headers: CORS, body: JSON.stringify(body) };
}

/** Slug from family name: letters/digits only, uppercase, 3–32 chars. */
function slugifyName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 32);
}

function normalizeCode(code) {
  return slugifyName(code);
}

function emptyFamily(code, name) {
  return {
    code,
    name: String(name || code).trim().slice(0, 48) || code,
    updatedAt: new Date().toISOString(),
    profiles: {}
  };
}

function mergeProfiles(existing, incoming) {
  const next = { ...(existing || {}) };
  Object.keys(incoming || {}).forEach((id) => {
    const remote = incoming[id];
    if (!remote || typeof remote !== 'object') return;
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

function publicRow(profile, familyName) {
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
    familyName: familyName || '',
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

async function loadGlobal(meta) {
  return (await meta.get(GLOBAL_KEY, { type: 'json' })) || { updatedAt: null, profiles: {} };
}

async function saveGlobal(meta, data) {
  data.updatedAt = new Date().toISOString();
  await meta.setJSON(GLOBAL_KEY, data);
  return data;
}

async function upsertGlobalFromFamily(meta, family) {
  const global = await loadGlobal(meta);
  if (!global.profiles) global.profiles = {};
  const familyName = family.name || family.code;
  Object.keys(family.profiles || {}).forEach((id) => {
    const p = family.profiles[id];
    if (!p || !p.id) return;
    if (/^nolan$/i.test(String(p.name || '').trim())) {
      delete global.profiles[id];
      return;
    }
    global.profiles[id] = publicRow(p, familyName);
  });
  return saveGlobal(meta, global);
}

function sortedLeaderboard(global) {
  return Object.values((global && global.profiles) || {}).sort((a, b) => {
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

  let store;
  let meta;
  try {
    store = openStore(context, 'families');
    meta = openStore(context, 'meta');
  } catch (err) {
    return json(500, { ok: false, error: 'Blobs unavailable', detail: String(err && err.message) });
  }

  try {
    if (event.httpMethod === 'GET') {
      const code = normalizeCode(event.queryStringParameters && event.queryStringParameters.code);
      if (code.length < 3) return json(400, { ok: false, error: 'Invalid family name' });
      const raw = await store.get(code, { type: 'json' });
      if (!raw) return json(404, { ok: false, error: 'Family not found' });
      return json(200, { ok: true, family: raw });
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { ok: false, error: 'Method not allowed' });
    }

    const body = JSON.parse(event.body || '{}');
    const action = body.action || 'pull';

    if (action === 'create') {
      const displayName = String(body.name || '').trim().slice(0, 48);
      const code = slugifyName(displayName);
      if (code.length < 3) {
        return json(400, { ok: false, error: 'Family name too short (use at least 3 letters)' });
      }
      const existing = await store.get(code, { type: 'json' });
      if (existing) {
        return json(409, {
          ok: false,
          error: 'That family name is taken — join it or pick another name'
        });
      }
      const family = emptyFamily(code, displayName);
      await store.setJSON(code, family);
      return json(200, { ok: true, family });
    }

    if (action === 'join' || action === 'pull') {
      const code = normalizeCode(body.code || body.name);
      if (code.length < 3) return json(400, { ok: false, error: 'Invalid family name' });
      const family = await store.get(code, { type: 'json' });
      if (!family) return json(404, { ok: false, error: 'Family not found' });
      return json(200, { ok: true, family });
    }

    if (action === 'push') {
      const code = normalizeCode(body.code || body.name);
      if (code.length < 3) return json(400, { ok: false, error: 'Invalid family name' });
      const current = (await store.get(code, { type: 'json' })) || emptyFamily(code, body.name || code);
      current.profiles = mergeProfiles(current.profiles, body.profiles || {});
      Object.keys(current.profiles).forEach((id) => {
        if (/^nolan$/i.test(String(current.profiles[id].name || '').trim())) {
          delete current.profiles[id];
        }
      });
      current.updatedAt = new Date().toISOString();
      current.code = code;
      if (body.familyName) current.name = String(body.familyName).trim().slice(0, 48);
      else if (body.name && !current.name) current.name = String(body.name).trim().slice(0, 48);
      await store.setJSON(code, current);
      await upsertGlobalFromFamily(meta, current);
      return json(200, { ok: true, family: current });
    }

    if (action === 'leaderboard') {
      const global = await loadGlobal(meta);
      return json(200, { ok: true, rows: sortedLeaderboard(global) });
    }

    if (action === 'resetProfile') {
      const code = normalizeCode(body.code || body.name);
      const targetName = String(body.profileName || 'Nolan').trim();
      if (code.length < 3) return json(400, { ok: false, error: 'Invalid family name' });
      const family = await store.get(code, { type: 'json' });
      if (!family) return json(404, { ok: false, error: 'Family not found' });
      let removed = 0;
      Object.keys(family.profiles || {}).forEach((id) => {
        if (String(family.profiles[id].name || '').trim().toLowerCase() === targetName.toLowerCase()) {
          delete family.profiles[id];
          removed++;
        }
      });
      family.updatedAt = new Date().toISOString();
      await store.setJSON(code, family);
      const global = await loadGlobal(meta);
      Object.keys(global.profiles || {}).forEach((id) => {
        if (String(global.profiles[id].name || '').trim().toLowerCase() === targetName.toLowerCase()) {
          delete global.profiles[id];
        }
      });
      await saveGlobal(meta, global);
      await upsertGlobalFromFamily(meta, family);
      return json(200, { ok: true, removed, family });
    }

    return json(400, { ok: false, error: 'Unknown action' });
  } catch (err) {
    return json(500, { ok: false, error: 'Server error', detail: String(err && err.message) });
  }
};
