/**
 * Shared micro-interactions for Nolan Learning Hub.
 * FunEffects.confetti(), FunEffects.shake(el), FunEffects.showStreak(n), FunEffects.pulseScore(el)
 */
(function (global) {
  const STREAK_TIERS = [
    { min: 2, label: 'Nice one!', tier: '2', confetti: 0, flash: 0, stars: 0, shake: false, duration: 1400 },
    { min: 3, label: 'On a roll!', tier: '3', confetti: 10, flash: 0, stars: 0, shake: false, duration: 1500 },
    { min: 4, label: 'Hat-trick!', tier: '4', confetti: 18, flash: 0, stars: 0, shake: false, duration: 1600 },
    { min: 5, label: 'On fire!', tier: '5', confetti: 28, flash: 0, stars: 4, shake: false, duration: 1700 },
    { min: 6, label: 'Unstoppable!', tier: '6', confetti: 36, flash: 1, stars: 6, shake: false, duration: 1800 },
    { min: 7, label: 'MVP mode!', tier: '7', confetti: 48, flash: 1, stars: 8, shake: false, duration: 2000 },
    { min: 8, label: 'World-class!', tier: '8', confetti: 56, flash: 2, stars: 12, shake: true, duration: 2100 },
    { min: 9, label: 'Legend!', tier: '9', confetti: 70, flash: 2, stars: 16, shake: true, duration: 2300 },
    { min: 10, label: null, tier: 'goat', confetti: 90, flash: 3, stars: 20, shake: true, duration: 2600, crazy: true }
  ];

  function ensureStreakEl() {
    let el = document.getElementById('fun-streak-badge');
    if (!el) {
      el = document.createElement('div');
      el.id = 'fun-streak-badge';
      el.className = 'streak-badge';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  function tierFor(n) {
    let picked = STREAK_TIERS[0];
    for (let i = 0; i < STREAK_TIERS.length; i++) {
      if (n >= STREAK_TIERS[i].min) picked = STREAK_TIERS[i];
    }
    return picked;
  }

  function confetti(opts) {
    const count = (opts && opts.count) || 28;
    const crazy = !!(opts && opts.crazy);
    const colors = crazy
      ? ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#0ea5e9', '#ec4899', '#fbbf24', '#22d3ee', '#a3e635', '#fb7185']
      : ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#0ea5e9', '#ec4899'];
    const root = document.createElement('div');
    root.className = 'confetti-root' + (crazy ? ' confetti-crazy' : '');
    document.body.appendChild(root);
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece' + (crazy && i % 3 === 0 ? ' confetti-piece-big' : '');
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.35 + 's';
      piece.style.animationDuration = (crazy ? 1.1 : 0.9) + Math.random() * (crazy ? 1.1 : 0.8) + 's';
      piece.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      if (crazy) {
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      }
      root.appendChild(piece);
    }
    setTimeout(() => root.remove(), crazy ? 2800 : 2200);
  }

  function burstStars(count) {
    const n = count || 8;
    const root = document.createElement('div');
    root.className = 'star-burst-root';
    document.body.appendChild(root);
    for (let i = 0; i < n; i++) {
      const star = document.createElement('span');
      star.className = 'star-burst-piece';
      star.textContent = i % 2 === 0 ? '⭐' : '✨';
      const angle = (i / n) * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
      star.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      star.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      star.style.animationDelay = Math.random() * 0.12 + 's';
      root.appendChild(star);
    }
    setTimeout(() => root.remove(), 1200);
  }

  function screenFlash(intensity) {
    const level = Math.max(1, Math.min(3, intensity || 1));
    const flash = document.createElement('div');
    flash.className = 'fun-screen-flash flash-level-' + level;
    document.body.appendChild(flash);
    void flash.offsetWidth;
    flash.classList.add('fun-screen-flash-on');
    setTimeout(() => flash.remove(), 700);
  }

  function screenPulse() {
    document.body.classList.remove('fun-screen-pulse');
    void document.body.offsetWidth;
    document.body.classList.add('fun-screen-pulse');
    setTimeout(() => document.body.classList.remove('fun-screen-pulse'), 650);
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove('shake-wrong');
    void el.offsetWidth;
    el.classList.add('shake-wrong');
    setTimeout(() => el.classList.remove('shake-wrong'), 500);
  }

  function showStreak(n) {
    if (!n || n < 2) return;
    const cfg = tierFor(n);
    const el = ensureStreakEl();
    const label =
      cfg.tier === 'goat' ? 'GOAT alert! ×' + n : cfg.label + (n >= 4 ? ' ×' + n : '');

    el.className = 'streak-badge streak-tier-' + cfg.tier;
    el.textContent = label;
    el.classList.add('streak-badge-show');
    if (cfg.tier === 'goat' || cfg.tier === '9' || cfg.tier === '8') {
      el.classList.add('streak-badge-bounce');
    }

    clearTimeout(showStreak._t);
    showStreak._t = setTimeout(() => {
      el.classList.remove('streak-badge-show', 'streak-badge-bounce');
    }, cfg.duration);

    if (cfg.confetti > 0) confetti({ count: cfg.confetti, crazy: !!cfg.crazy });
    if (cfg.stars > 0) burstStars(cfg.stars);
    if (cfg.flash > 0) screenFlash(cfg.flash);
    if (cfg.shake) {
      screenPulse();
      document.documentElement.classList.remove('fun-screen-shake');
      void document.documentElement.offsetWidth;
      document.documentElement.classList.add('fun-screen-shake');
      setTimeout(() => document.documentElement.classList.remove('fun-screen-shake'), 500);
    }
  }

  function pulseScore(el) {
    if (!el) return;
    el.classList.remove('score-pulse');
    void el.offsetWidth;
    el.classList.add('score-pulse');
  }

  function showXpGain(amount, opts) {
    const gained = Math.max(0, Number(amount) || 0);
    const already = !!(opts && opts.alreadyAwarded);
    const anchor = (opts && opts.anchor) || document.getElementById('live-score') || null;

    const el = document.createElement('div');
    el.className =
      'xp-float' + (gained > 0 ? ' xp-float-gain' : already ? ' xp-float-zero' : ' xp-float-zero');
    el.setAttribute('aria-live', 'polite');
    if (gained > 0) {
      const bonus = opts && opts.bonus ? Number(opts.bonus) : 0;
      el.textContent = bonus > 0 ? '+' + gained + ' XP (streak!)' : '+' + gained + ' XP';
    } else if (already) {
      el.textContent = 'Already earned · +0 XP';
    } else {
      el.textContent = '+0 XP';
    }

    document.body.appendChild(el);
    if (anchor && anchor.getBoundingClientRect) {
      const r = anchor.getBoundingClientRect();
      el.style.left = Math.round(r.left + r.width / 2) + 'px';
      el.style.top = Math.round(r.top - 8) + 'px';
    } else {
      el.style.left = '50%';
      el.style.top = '42%';
    }
    requestAnimationFrame(() => el.classList.add('xp-float-show'));
    setTimeout(() => {
      el.classList.remove('xp-float-show');
      el.classList.add('xp-float-hide');
      setTimeout(() => el.remove(), 400);
    }, gained > 0 ? 1400 : 1100);
  }

  function celebratePerfect() {
    confetti({ count: 40 });
    burstStars(12);
    screenFlash(2);
  }

  global.FunEffects = {
    confetti,
    shake,
    showStreak,
    showXpGain,
    pulseScore,
    celebratePerfect,
    burstStars,
    screenFlash
  };
})(window);
