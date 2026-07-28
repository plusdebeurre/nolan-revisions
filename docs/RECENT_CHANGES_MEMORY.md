# Recent Changes Memory

## 2026-07-28 — Fix Nolan profile persistence

### What changed
- Removed leftover Nolan name blacklist that deleted any profile named “Nolan” on every sync (client + Blobs `push`).
- Create and XP/checkpoints already share one store (`nolan-hub-v1` → `schedulePush` → `pushProfiles`); sync no longer wipes Nolan.

### User impact
- Creating a profile named Nolan now persists locally and in the cloud like any other child.

### Key files
- `js/progress.js`, `js/shell.js`, `netlify/functions/family-api.js`, docs

## 2026-07-28 — Public profiles (no family) + desktop login layout

### What changed
- Removed family create/join gate. Profiles are public site-wide via Blobs (`global-profiles`).
- API: `list` / `push` / `leaderboard` / `resetProfile` (no household name).
- Create profile auto-unlocks with the chosen secret fruit; fruit PIN still required when switching profiles.
- Wider profile modal on desktop: side-by-side avatar + PIN grids, no vertical scroll.

### User impact
- Open the site → create/pick a child profile immediately. Leaderboard ranks everyone. Login panels fit on desktop without scrolling.

### Key files
- `netlify/functions/family-api.js`, `js/progress.js`, `js/shell.js`, `css/shared.css`, docs

## 2026-07-28 — Named families + global leaderboard

### What changed
- Family identity is a **household name** you create (slug key, e.g. Maison Cayre → `MAISONCAYRE`), not a random 6-char code. Join with the same name.
- **Global leaderboard** blob (`meta` / `global-leaderboard`): all site profiles ranked by XP/medals; family name shown as subtitle.
- One-shot **Nolan** profile reset (local + cloud family + global index).
- API actions: `create`/`join` by name, `leaderboard`, `resetProfile`.

### User impact
- Easier multi-device setup (“type our family name”). Trophy board shows everyone on Learning Adventure, not only the same household.

### Key files
- `netlify/functions/family-api.js`, `js/progress.js`, `js/shell.js`, `css/shared.css`, docs

## 2026-07-28 — Cloud family sync, leaderboard, score feedback

### What changed
- Netlify Blobs + `netlify/functions/family-api.js`: create/join family by share code; pull/push profiles (XP, medals, checkpoints). `localStorage` is cache.
- Family leaderboard modal (🏆): XP + gold/silver/bronze counts across profiles.
- Brand/copy: **Learning Adventure**; quiz `{{name}}` → active profile name (not fixed “Nolan”).
- HPE feedback fixes: Super Teeth Care live score + wrong-bin toast; healthy-day bad-pick; organs live score; sugar-sneak / posture wrong-bin messages.

### User impact
- Same family code works on any browser/device. Kids see who is ahead on XP/medals. Sort games always say if the drop was right or wrong.

### Key files
- `netlify/functions/family-api.js`, `package.json`, `netlify.toml`
- `js/progress.js`, `js/shell.js`, `js/quiz-engine.js`, `css/shared.css`
- HPE game HTML, docs

## 2026-07-28 — Streak celebrations + profile level titles

### What changed
- Escalating streak FX in `js/fun-effects.js`: sports hype labels (Hat-trick, MVP mode, GOAT alert…) with bigger confetti, flashes, and star bursts as the streak grows.
- Replaced competing level-fruit emoji with a circular avatar “photo” and English titles like Sleepy Unicorn → Super Saiyan Unicorn X (`levelTitle` in `js/progress.js`).
- Shell bar / profile picker updated; QuizEngine no longer double-fires confetti on streak.

### User impact
- Correct-answer chains feel more exciting; profile identity is clearer (one animal photo + fun rank name).

### Key files
- `js/fun-effects.js`, `js/progress.js`, `js/shell.js`, `js/quiz-engine.js`, `css/shared.css`, docs

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
