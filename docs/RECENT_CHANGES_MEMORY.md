# Recent Changes Memory

## 2026-07-28 — Persistent fullscreen + in-exercise resume

### What changed
- Added `app.html` play shell: parent stays in fullscreen; navigation happens inside `#nolan-stage` iframe.
- `js/shell.js`: iframe pages skip duplicate chrome; Full screen routes into app mode; Continue chips on hubs with mid-game checkpoints.
- Checkpoint API in `js/progress.js` (`saveCheckpoint` / `loadCheckpoint` / `clearCheckpoint`); cleared on `recordResult` / finish.
- `QuizEngine` auto-resumes question index + score; round-based custom games save/restore similarly.
- Netlify: `X-Frame-Options: SAMEORIGIN`, `/play` → `/app.html`.

### User impact
- Tablet play can stay fullscreen across subjects/games. Leaving mid-quiz shows **Continue** on the hub and picks up where Nolan stopped (same device/profile).

### Key files
- `app.html`, `js/shell.js`, `js/progress.js`, `js/quiz-engine.js`, `css/shared.css`, `netlify.toml`
- Round-based `subjects/*/games/*.html`, docs

## 2026-07-28 — Profiles, medals, XP & fullscreen

### What changed
- Added multi-child profiles with fruit-emoji secret PIN (`js/progress.js`), top shell bar + fullscreen (`js/shell.js`), medal chips on hub cards.
- QuizEngine + result-screen watcher record scores → gold/silver/bronze by mistake count; XP/levels with fruit icons.
- Progress saved in `localStorage` (works on free Netlify static hosting).
- Wired all hubs/games with `data-game-id` and shared scripts.

### User impact
- Nolan (or another child) creates a profile, unlocks with a fruit, earns medals/XP, and resumes progress on the same device. Fullscreen for tablet play.

### Key files
- `js/progress.js`, `js/shell.js`, `js/quiz-engine.js`, `css/shared.css`
- All `index.html` / subject hubs / game HTML pages

## 2026-07-27 — Variety expansion (6 games/subject + deep Math banks)


### What changed
- Added `js/fun-effects.js` (confetti, shake, streak) and CSS score HUD / animations in `shared.css`.
- Enhanced `quiz-engine.js` with live Score HUD, streaks, confetti on perfect; auto-loads fun-effects.
- Polished numeric end scores on drag/sort games (plant parts, living sort, organs, consonant sort, times match, healthy day, teeth care).
- Expanded fixed Math banks (place-value 30+, add/sub 40+, skip 24, share 20, compare 24, times pairs 12).
- Added **30 new games** (6 per Math/Science/English/HPE/Thai) with varied formats and scores.
- Hub cards updated on all subject indexes.

### Catalogue totals
- Math 12 · Science 12 · English 12 · HPE 11 · Thai 13 (**60 games**)

### User impact
- Longer Math practice sessions; more variety and celebration feedback across subjects.

### Key files
- `js/fun-effects.js`, `js/quiz-engine.js`, `css/shared.css`
- `subjects/*/games/*.html`, `subjects/*/index.html`
- `docs/PROJECT_DOCUMENTATION.md`

## 2026-07-27 — Thai Grade 2 catch-up section

### What changed
- Added Thai subject (red), mega-quiz-40 with fixed 40 questions, plus focused Thai practice games and parent guide.

## 2026-07-27 — Nolan Grade 2 Learning Hub (full build)

### What changed
- Subject-based hub from flat HTML; shared CSS/engine; Math/Science/English/HPE cores migrated and expanded.
