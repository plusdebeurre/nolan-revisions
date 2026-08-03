/**
 * Kid-safe first-name filter (EN / FR / DE / IT / TH / HE).
 * Used by progress.js create/rename and family-api push.
 */
(function (global) {
  const WORD_LIST = [
    // English
    'fuck', 'fucker', 'fucking', 'shit', 'bullshit', 'asshole', 'ass', 'bastard', 'bitch',
    'damn', 'crap', 'dick', 'cock', 'pussy', 'slut', 'whore', 'idiot', 'moron', 'stupid',
    'dumb', 'dumbass', 'retard', 'retarded', 'loser', 'hateyou', 'kill', 'killer', 'die',
    'nigger', 'nigga', 'faggot', 'fag', 'cunt', 'piss', 'sucker', 'jerk', 'bozo',
    'dummy', 'ugly', 'fatso', 'fatty', 'nerd', 'geekoff', 'shut up', 'shutup',
    // French
    'merde', 'putain', 'pute', 'salope', 'connard', 'connasse', 'con', 'conne', 'enfoire',
    'encule', 'enculer', 'bordel', 'foutre', 'nique', 'niquer', 'bite', 'couille',
    'pd', 'tapette', 'trou du cul', 'trouduc', 'abruti', 'imbecile', 'imbécile',
    'debile', 'débile', 'creatin', 'crétin', 'salaud', 'salopard', 'chiant', 'chier',
    'fdp', 'tg', 'ta gueule', 'ferme ta gueule', 'nul', 'naze', 'bouffon', 'toocard',
    // German
    'scheisse', 'scheiße', 'arschloch', 'arsch', 'fotze', 'hure', 'hurensohn', 'wichser',
    'schwuchtel', 'idiot', 'dummkopf', 'blodmann', 'blödmann', 'mistkerl', 'schwein',
    'verfickt', 'fick', 'ficken', 'kacke', 'drecksau',
    // Italian
    'cazzo', 'merda', 'stronzo', 'puttana', 'troia', 'vaffanculo', 'fanculo', 'coglione',
    'figa', 'minchia', 'bastardo', 'scemo', 'stupido', 'cretino', 'deficiente', 'idiota',
    // Thai (romanized + common script insults suitable to block for age 7)
    'hee', 'heeia', 'aihee', 'aihiia', 'kuay', 'kwai', 'sat', 'aisat', 'yaihee',
    'ควย', 'หี', 'เหี้ย', 'เย็ด', 'สัตว์', 'ไอ้สัตว์', 'ไอ้เหี้ย', 'ควาย', 'อีเหี้ย',
    'กู', 'มึง', 'สัส', 'ชิบหาย', 'ระยำ', 'อีควาย',
    // Hebrew (transliterated + script)
    'zayin', 'lezayin', 'kus', 'kusit', 'benzona', 'ben zona', 'meanyen', 'tipesh',
    'טיפש', 'מטומטם', 'זין', 'כוס', 'בן זונה', 'שרמוטה', 'חרא', 'לעזאזל'
  ];

  function normalize(raw) {
    let s = String(raw || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/0/g, 'o')
      .replace(/1/g, 'i')
      .replace(/3/g, 'e')
      .replace(/4/g, 'a')
      .replace(/5/g, 's')
      .replace(/7/g, 't')
      .replace(/\$/g, 's')
      .replace(/@/g, 'a');
    s = s.replace(/[^a-z0-9\u0e00-\u0e7f\u0590-\u05ff\s'-]/gi, ' ');
    return s.replace(/\s+/g, ' ').trim();
  }

  function compact(s) {
    return String(s || '').replace(/[\s'_-]+/g, '');
  }

  function isNameAllowed(name) {
    const clean = String(name || '').trim();
    if (!clean) return { ok: false, reason: 'empty' };
    if (clean.length > 24) return { ok: false, reason: 'long' };
    const norm = normalize(clean);
    const packed = compact(norm);
    if (!norm) return { ok: false, reason: 'empty' };

    for (let i = 0; i < WORD_LIST.length; i++) {
      const w = normalize(WORD_LIST[i]);
      const wp = compact(w);
      if (!w) continue;
      if (w.indexOf(' ') !== -1) {
        if (norm.indexOf(w) !== -1) return { ok: false, reason: 'blocked' };
      } else {
        const re = new RegExp('(?:^|[^a-z\\u0e00-\\u0e7f\\u0590-\\u05ff])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|[^a-z\\u0e00-\\u0e7f\\u0590-\\u05ff])', 'i');
        if (re.test(' ' + norm + ' ') || (wp.length >= 3 && packed.indexOf(wp) !== -1)) {
          return { ok: false, reason: 'blocked' };
        }
      }
    }
    return { ok: true };
  }

  const api = { isNameAllowed, normalize, WORD_LIST };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.NameModeration = api;
})(typeof window !== 'undefined' ? window : global);
