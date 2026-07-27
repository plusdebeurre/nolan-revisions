/**
 * Family profiles API backed by Netlify Blobs.
 * POST { action: "create" | "join" | "pull" | "push", code?, profiles? }
 * GET  ?code=ABCDEF
 */
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

function json(status, body) {
  return { statusCode: status, headers: CORS, body: JSON.stringify(body) };
}

function normalizeCode(code) {
  return String(code || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function emptyFamily(code) {
  return {
    code,
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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  let store;
  try {
    store = getStore({ name: 'families', consistency: 'strong' });
  } catch (err) {
    return json(500, { ok: false, error: 'Blobs unavailable', detail: String(err && err.message) });
  }

  try {
    if (event.httpMethod === 'GET') {
      const code = normalizeCode(event.queryStringParameters && event.queryStringParameters.code);
      if (code.length < 6) return json(400, { ok: false, error: 'Invalid code' });
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
      let code = makeCode();
      let tries = 0;
      while (tries < 8) {
        const existing = await store.get(code, { type: 'json' });
        if (!existing) break;
        code = makeCode();
        tries++;
      }
      const family = emptyFamily(code);
      await store.setJSON(code, family);
      return json(200, { ok: true, family });
    }

    if (action === 'join' || action === 'pull') {
      const code = normalizeCode(body.code);
      if (code.length < 6) return json(400, { ok: false, error: 'Invalid code' });
      const family = await store.get(code, { type: 'json' });
      if (!family) return json(404, { ok: false, error: 'Family not found' });
      return json(200, { ok: true, family });
    }

    if (action === 'push') {
      const code = normalizeCode(body.code);
      if (code.length < 6) return json(400, { ok: false, error: 'Invalid code' });
      const current = (await store.get(code, { type: 'json' })) || emptyFamily(code);
      current.profiles = mergeProfiles(current.profiles, body.profiles || {});
      current.updatedAt = new Date().toISOString();
      current.code = code;
      await store.setJSON(code, current);
      return json(200, { ok: true, family: current });
    }

    return json(400, { ok: false, error: 'Unknown action' });
  } catch (err) {
    return json(500, { ok: false, error: 'Server error', detail: String(err && err.message) });
  }
};
