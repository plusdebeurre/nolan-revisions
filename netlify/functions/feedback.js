/**
 * Public feedback → Discord channel webhook.
 * Env: DISCORD_FEEDBACK_WEBHOOK (never expose to client).
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const MAX_MESSAGE = 500;
const MAX_NAME = 40;
const RATE_MS = 30000;
const rateByIp = new Map();

function json(status, body) {
  return { statusCode: status, headers: CORS, body: JSON.stringify(body) };
}

function clientIp(event) {
  const h = event.headers || {};
  return (
    h['x-nf-client-connection-ip'] ||
    h['x-forwarded-for'] ||
    h['client-ip'] ||
    'unknown'
  )
    .split(',')[0]
    .trim();
}

function allowRate(ip) {
  const now = Date.now();
  const prev = rateByIp.get(ip) || 0;
  if (now - prev < RATE_MS) return false;
  rateByIp.set(ip, now);
  if (rateByIp.size > 500) {
    const cutoff = now - RATE_MS * 2;
    for (const [k, t] of rateByIp.entries()) {
      if (t < cutoff) rateByIp.delete(k);
    }
  }
  return true;
}

function cleanText(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const webhook = process.env.DISCORD_FEEDBACK_WEBHOOK;
  if (!webhook) {
    return json(503, { ok: false, error: 'Feedback not configured' });
  }

  const ip = clientIp(event);
  if (!allowRate(ip)) {
    return json(429, { ok: false, error: 'Please wait a moment before sending again.' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const message = cleanText(body.message, MAX_MESSAGE);
  const name = cleanText(body.name, MAX_NAME);
  const page = cleanText(body.page, 300);
  if (!message) {
    return json(400, { ok: false, error: 'Message required' });
  }

  const ua = cleanText((event.headers && (event.headers['user-agent'] || event.headers['User-Agent'])) || '', 120);
  const fields = [
    { name: 'Message', value: message.slice(0, 1000) || '—' },
    { name: 'From', value: name || 'Anonymous', inline: true },
    { name: 'Page', value: page || '—', inline: false }
  ];
  if (ua) fields.push({ name: 'Browser', value: ua, inline: false });

  const payload = {
    username: 'Learning Adventure',
    embeds: [
      {
        title: 'New site feedback',
        color: 0xf59e0b,
        fields,
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return json(502, {
        ok: false,
        error: 'Could not deliver feedback',
        detail: detail.slice(0, 200)
      });
    }
    return json(200, { ok: true });
  } catch (err) {
    return json(502, { ok: false, error: 'Could not deliver feedback' });
  }
};
