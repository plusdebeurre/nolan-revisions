/**
 * Shared micro-interactions for Nolan Learning Hub.
 * FunEffects.confetti(), FunEffects.shake(el), FunEffects.showStreak(n), FunEffects.pulseScore(el)
 */
(function (global) {
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

  function confetti(opts) {
    const count = (opts && opts.count) || 28;
    const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#0ea5e9', '#ec4899'];
    const root = document.createElement('div');
    root.className = 'confetti-root';
    document.body.appendChild(root);
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.35 + 's';
      piece.style.animationDuration = 0.9 + Math.random() * 0.8 + 's';
      piece.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      root.appendChild(piece);
    }
    setTimeout(() => root.remove(), 2200);
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
    const el = ensureStreakEl();
    el.textContent = n >= 5 ? '🔥 Hot streak ×' + n + '!' : '⭐ Streak ×' + n;
    el.classList.add('streak-badge-show');
    clearTimeout(showStreak._t);
    showStreak._t = setTimeout(() => el.classList.remove('streak-badge-show'), 1400);
  }

  function pulseScore(el) {
    if (!el) return;
    el.classList.remove('score-pulse');
    void el.offsetWidth;
    el.classList.add('score-pulse');
  }

  function celebratePerfect() {
    confetti({ count: 40 });
  }

  global.FunEffects = { confetti, shake, showStreak, pulseScore, celebratePerfect };
})(window);
