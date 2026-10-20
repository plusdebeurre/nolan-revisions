# Recent Changes Memory

## 2026-10-20 — Arcade touch lock

### What changed
- Arcade screens block pinch zoom and double-tap zoom on phones and tablets. A second tap on the same control within 400ms is ignored, so only a single tap counts.

### Key files
- `js/arcade-runner.js`, `css/shared.css`

## 2026-10-20 — Arcade video games

### What changed
- 35 short video games, five in each subject, plus a new Computing subject from Oxford International Primary Computing Year 2.
- A shared Phaser runner handles running, top-down, lane, and program-the-robot rounds. Kenney Pixel Platformer tiles are CC0. Phaser 4.2.1 arcade build is MIT and stored in the repo.
- Coins on screen do not give XP. Three learning gates give 2 XP each, capped at 6 per run, with no streak bonus. Quiz answers stay at 10 XP.

### User impact
- Nolan gets a moving character, jumps, and collisions, while the quizzes, Focus games, and Play scenes stay where they were. Arcade cannot outscore those exercises.

### Key files
- `vendor/phaser-arcade-physics-4.2.1.min.js`, `vendor/kenney/`, `js/arcade-runner.js`, `js/arcade-banks.js`, `js/progress.js`, `subjects/computing/`, arcade game pages, subject hubs, `docs/revision-guides/computing.md`

## 2026-10-19 — Play scenes

### What changed
- Six toy games, one per subject, in a new Play section above the existing cards. Nothing already on the hubs was removed.
- A wrong move bonks and bounces back. A right move makes the character jump. The school skill is the move that wins the scene.
- Shared helper: `js/play-scene.js`. Scene banks: `js/play-banks.js`.

### User impact
- Nolan can share biscuits, grow a dancing sprout, dress animals on a runway, catch a French snack, build a robot, and drop Thai hats, beside the quizzes and Focus games.

### Key files
- `js/play-scene.js`, `js/play-banks.js`, `css/shared.css`, six game pages, subject hubs, `docs/revision-guides/play.md`

## 2026-10-19 — Focus games

### What changed
- Seven short games train attention skills from the 7-year-old activation notes, on Grade 2 work already in the hubs: inhibition, holding a number, mirror letters, left-to-right word order, rule switching, and sequence memory.
- A stand-up cross-crawl pause sits before round 4. It is not part of the score.
- Shared helper: `js/focus-engine.js`. Round sets: `js/focus-banks.js`.

### User impact
- Nolan can practice even/odd and ×2 ×5 ×10, place value and shapes, b/d p/q in English and French, cause and effect, living things, and body organs with a different kind of attention each time.

### Key files
- `js/focus-engine.js`, `js/focus-banks.js`, `css/shared.css`, subject hubs, seven new game pages, `docs/revision-guides/focus.md`

## 2026-10-14 — Harder challenge sets

### What changed
- **20 math games** one step above semester 1: 3-digit +/−, ×3 and ×4, exact ÷2 ÷5 ÷10, halves and quarters, two-step stories, quarter hours, change, place value to 999, perimeter. Problems are generated.
- **20 English** and **20 French** reading games: main idea, inference, two clues, word meaning, order, and a Listen button on the listening rounds.
- **20 Thai games** with `speechSynthesis` (`th-TH`). A romanization stays on screen if the device has no Thai voice.
- Shared helpers: `js/speak.js`, `js/math-challenge.js`. Language rounds reuse `js/play-reading.js`.

### User impact
- Nolan gets new challenge sections on Math, English, French, and Thai instead of replaying the same easier sets.

### Key files
- `js/speak.js`, `js/math-challenge.js`, `js/play-reading.js`, `js/challenge-en.js`, `js/challenge-fr.js`, `js/challenge-th.js`, subject hubs and new game pages, docs

## 2026-10-10 — Medal stays on the game card

### What changed
- Gold, silver, and bronze medals are drawn only on exercise cards, at the card’s top-right. They are no longer injected onto the game page, where the medal sat in the top-left corner over the profile.

### Key files
- `js/shell.js`, `css/shared.css`

## 2026-10-10 — Twenty varied reading games

### What changed
- **10 English games** with different play styles: best title, true/false, who said it, story order, odd sentence, feeling faces, what happens next, word tap, same detail, pick the ending.
- **10 French games** with other styles: missing word, oui/non, multi-select what is in the text, reverse question, comic order, place picker, before/after, letter, list, spot the false sentence.
- Each run shuffles. Score, hint, XP, checkpoint, and Play Again match the other games. Six short rounds so a session stays light.

### User impact
- Reading practice changes shape every game, so a Grade 2 / CE2 child is not stuck on the same multiple-choice pattern.

### Key files
- `js/play-reading.js`, `js/reading-pack-en.js`, `js/reading-pack-fr.js`, `subjects/english/games/*`, `subjects/french/games/*`, subject hubs, docs

## 2026-10-10 — Score chip sits below the top bar

### What changed
- The fixed **Score** chip uses the real top-bar height, so it stays under the trophy / full screen / log out row when that bar wraps.

### Key files
- `css/shared.css`, `js/shell.js`

## 2026-10-10 — Reading games, English and French

### What changed
- **Story Sleuth** and **Sentence Clue** (English): short end-of-semester-1 passages. Answer who / where / what / when / why / feeling, or tap the sentence that holds the clue.
- **Lecture maligne** and **Phrase indice** (French): same level and the same two jobs, in French. New French hub tile.
- Rounds shuffle each run. Score, hints, streaks, first-try XP, checkpoint, and Play Again match the other games.
- The top bar now pads the page to its real height, so a wrapped phone bar no longer covers Back / Home.

### User impact
- Nolan can practice reading for meaning in both school English and French, on texts a Grade 2 / CE2 child meets by the end of the first semester.

### Key files
- `js/read-engine.js`, `js/reading-banks.js`, `subjects/english/games/story-sleuth.html`, `subjects/english/games/sentence-clue.html`, `subjects/french/`, `index.html`, `css/shared.css`, `js/progress.js`, docs

## 2026-10-10 — Arithmetic Trail (end of semester 1)

### What changed
- New math game **Arithmetic Trail**: 24 typed problems (keypad + keyboard), a new set each run, checkpoint stores the generated trail.
- Level is end of semester 1 for Grade 2 / CE2: facts within 20, 2-digit and 1-digit +/− with and without regrouping, mental +10 / −10 / +100 / +10 across a hundred, missing numbers, and ×2 ×5 ×10 only.
- Live score, hints, streaks, first-try XP, Play Again, and a medal on finish.

### User impact
- Nolan can practice the arithmetic he is expected to handle by January, without later-year skills (×3 and up, division, column work past 100).

### Key files
- `subjects/math/games/arithmetic-trail.html`, `subjects/math/index.html`, docs

## 2026-08-10 — Profile search picker + Discord feedback bubble

### What changed
- **Who is playing?** searchable (“Find my name”), scrollable list on desktop too, denser 2–3 column grid.
- **Feedback FAB** bottom-right → Netlify Function `feedback` → Discord webhook channel (`DISCORD_FEEDBACK_WEBHOOK`).
- Rate-limit + length caps; FAB only on non-iframe shells (no double in play mode).

### User impact
- Large classes can type a few letters to find their profile. Kids/parents can send suggestions or bug notes without leaving the site.

### Key files
- `js/shell.js`, `css/shared.css`, `netlify/functions/feedback.js`, docs

## 2026-08-10 — Kid-safe name scrub + stronger filter

### What changed
- **Name filter:** first-name shape (max 2 words, letters/`-`/`'` only, block `haha`/`lol` fillers) plus expanded insult phrases (`your mom`, `gay`, `ta mère`, …).
- **Auto-scrub:** blocked names are rewritten to the avatar creature (`Fox`, `Unicorn`, …) or `Friend`, stay disabled until rename; XP/medals kept.
- **Server persist:** `family-api` scrub on load writes cleaned names back to Netlify Blobs (list/pull no longer leaves insults in the cloud).
- **Client:** `applyNamePolicyToStore` rewrites local cache and marks dirty so corrections sync.

### User impact
- Insulting class nicknames disappear from the profile picker; kids must choose a short friendly first name before unlocking again. New phrases like “Your mom is gay…” cannot be saved.

### Key files
- `js/name-moderation.js`, `js/progress.js`, `netlify/functions/family-api.js`, docs

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
