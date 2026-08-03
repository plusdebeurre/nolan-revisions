# Recent Changes Memory

## 2026-08-03 — Thai game fixes, subject stats, kid-safe names

### What changed
- **Digit Bingo:** marked cells stay tappable so bonus calls (e.g. 11 → ๑) no longer deadlock; call order + board layout shuffle each run.
- **Nam Sai Comic Choice:** fixed `{{name}}Progress` SyntaxError → `NolanProgress`; fillName on copy; shuffle scenes/choices; clear checkpoint on finish.
- **Tone Karaoke:** only syllables with real ่ ้ ๊ ๋; shuffle verses + choice order.
- **Alphabet Train:** full 44 consonants (added ฐ ฑ ฒ ณ); tips match answers; round shuffle; clear CP on finish.
- **QuizEngine + Thai customs:** shuffle question/round order (and options) to reduce memorized-order cheating; checkpoint stores shuffle order.
- **My Progress:** subject distribution of successful exercises + first-claim correct answers (`subjectStats`).
- **Name moderation** (EN/FR/DE/IT/TH/HE): block insults on create; disable existing bad names while keeping XP/games; rename to a clean name reactivates; server sanitizes on push/load.

### User impact
- Thai games play through without soft-locks; questions vary each run; kids see per-subject success; rude profile names are paused until renamed (progress kept).

### Key files
- `subjects/thai/games/*`, `js/quiz-engine.js`, `js/progress.js`, `js/shell.js`, `js/name-moderation.js`, `netlify/functions/family-api.js`, `css/shared.css`, `index.html`, `app.html`, docs

## 2026-07-30 — Personal progress modal, Log out, anti-cache XP/medals

### What changed
- Active avatar opens **my stats only** (no other players list / create).
- Top-right **Log out** locks session and returns to Create / Pick (works via postMessage in play-mode iframe).
- Dirty map stores `updatedAt`; push clears dirty only if unchanged during flight; critical 150ms flush after answer XP and medal `recordResult`; remake dirty after cloud merge when needed; hub medals repaint on sync.

### User impact
- With many class profiles, kids no longer browse everyone from their avatar. Switching player is explicit via Log out. Exercise XP and medals are much less likely to vanish due to sync/cache races.

### Key files
- `js/shell.js`, `css/shared.css`, `js/progress.js`, docs

## 2026-07-30 — Reliable sync, hub gate, play-mode fullscreen

### What changed
- Dirty-profile push queue with retry/backoff + flush on hide/online/pagehide; `awardedKeys` capped at 400/game.
- Server deep-merge of games / awardedKeys / activity / max XP (no whole-profile clobber).
- Hub requires Create or Pick + fruit before subject tiles unlock; clearer modal copy.
- **Open play mode** uses the same fullscreen flow as the shell button; `/app` redirects to `app.html`.

### User impact
- Progress is much less likely to be lost on flaky network or multi-device play. Landing page always asks who is playing. Play mode actually requests fullscreen (chip fallback if the browser blocks it).

### Key files
- `js/progress.js`, `netlify/functions/family-api.js`, `js/shell.js`, `index.html`, `css/shared.css`, `netlify.toml`, docs

## 2026-07-30 — Archive test profiles (tombstones)

### What changed
- `family-api` now archives profiles into `archived` with tombstone IDs; `push` refuses to resurrect them.
- `deleteByIds` / `archiveByIds` move live profiles to archive (protectIds still blocks Nolan/Leon).
- Client `progress.js` prunes `archivedIds` from `localStorage` on pull/push so open tabs stop re-injecting tests.

### User impact
- Test profiles (Alex, E2EKid, duplicate Nolan) stay archived; only real NOLAN + Leon remain active.

### Key files
- `netlify/functions/family-api.js`, `js/progress.js`, docs

## 2026-07-28 — Activity stats + safe profile delete-by-id

### What changed
- API `deleteByIds` with `protectIds` guard (never wipe production by name).
- Profile `activity.days` buckets: XP / exercises / questions; summary for today, week, month, year.
- Profile modal shows activity stats for the unlocked player.

### User impact
- Trial accounts can be removed by ID without risking Nolan/Leon. Kids see how much they learned today vs the week.

### Key files
- `netlify/functions/family-api.js`, `js/progress.js`, `js/shell.js`, `css/shared.css`, docs

## 2026-07-28 — Fix Pulse Check JS syntax

### What changed
- Escaped `{{name}}'s` strings in `subjects/hpe/games/pulse-check.html` (apostrophe broke the script so the quiz never mounted).

### User impact
- Pulse Check in HPE loads and plays again.

### Key files
- `subjects/hpe/games/pulse-check.html`, docs

## 2026-07-28 — Per-answer XP (no farm)

### What changed
- XP only on first-time correct answers (`awardAnswerXp` + content `questionKey`); wrong = 0; replays show “Already earned · +0 XP”.
- Streak bonuses (+5/+10/+15 at 3/5/8) only when the question still had unclaimed base XP.
- QuizEngine awards live mid-quiz; end `recordResult` uses `skipXp`. Legacy custom games: improvement-only end XP.
- `FunEffects.showXpGain` floating animation.

### User impact
- Replaying the same exercise no longer farms XP; kids see clear +XP / already-earned feedback. Existing profile XP totals are kept.

### Key files
- `js/progress.js`, `js/quiz-engine.js`, `js/fun-effects.js`, `css/shared.css`, docs

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
