# Learning Adventure (Grade 2)

Static revision games for a Grade 2 learner (age ~7). Child UI is **English**. Parent revision guides may stay in French. Brand uses the **active profile name** in game text (`{{name}}`), not a fixed child name.

## How to open

Open the live Netlify site (recommended — cloud profile sync needs Functions), or [`index.html`](../index.html) / [`app.html`](../app.html) locally. For local Functions/Blobs: `npm install` then `netlify dev`.

## Structure

```
nolan-revisions/
├── index.html                 # Home — Learning Adventure
├── app.html                   # Play shell (fullscreen + iframe stage)
├── netlify/functions/         # family-api + feedback (Discord webhook)
├── css/shared.css
├── js/quiz-engine.js
├── js/fun-effects.js
├── js/progress.js             # Profiles, XP, medals, checkpoints, public sync
├── js/shell.js                # Profile gate, leaderboard, fullscreen
├── package.json               # @netlify/blobs for Functions
├── subjects/ …
└── docs/
```

## Quality bar

Every game shows a **numeric score** (live HUD and/or end screen), **Play Again**, Back/Home nav, and uses shared micro-interactions where possible (`FunEffects`).

## Subjects and games

### Computing (5) — Oxford International Primary Computing, Year 2
- Arcade only, 2 XP per learning gate, 6 XP max a run: `arrow-bot` (program the robot), `bug-walk` (fix one command), `parts-room` (screen and keyboard), `keep-it-private`, `predict-the-stop`.

### Math (41) — large fixed banks for long practice
- Arcade: `biscuit-run`, `fair-houses`, `sum-lane`, `tens-cave`, `hour-tower`. Coins do not give XP.
- Play: `biscuit-bandits.html` — stack a fair share or a group of 2, 5, or 10. A wrong plate makes the raccoon steal the biscuits.
- Focus: `stop-or-go.html` — catch a card only when the rule is true (even/odd, bigger, ×2 ×5 ×10). `hold-the-number.html` — remember a number through a short question, then use it.
- `arithmetic-trail.html` — typed answers, end of semester 1 (within 20, 2-digit +/−, mental ±10 / +100, ×2 ×5 ×10)
- `place-value-quiz.html` — 30+ place value / odd-even / compare
- `add-subtract-adventure.html` — 30+ regrouping +/−
- `skip-counting-race.html` — 24 rounds (2s/5s/10s/3s)
- `times-tables-match.html` — memory ×2/×5/×10 (+ extras)
- `share-fair-division.html` — 20 sharing rounds
- `number-compare-battle.html` — 24 compare rounds
- `number-bond-builder.html` — bonds to 10/20/100
- `word-problem-quest.html` — story +/−/×/÷
- `clock-o-rama.html` — hour / half-hour
- `money-market.html` — count coins to a total
- `shape-spy.html` — 2D shapes
- `pattern-detective.html` — number & shape patterns
- Challenge (harder, generated): `hundreds-trail`, `times-three-four`, `fair-shares-plus`, `half-and-quarter`, `two-step-quest`, `quarter-clock`, `change-maker`, `hundreds-house`, `number-duel`, `missing-factor`, `fence-builder`, `jump-the-line`, `balance-scale`, `array-garden`, `pizza-fractions`, `nearest-ten`, `double-dash`, `graph-reader`, `day-counter`, `challenge-mix`

### Science (19)
- Arcade: `sprout-hop`, `garden-patrol`, `seed-slide`, `habitat-hop`, `food-factory`.
- Play: `sprout-disco.html` — toss water, light, air, soil, or space. The sprout dances and grows.
- Focus: `rule-flip.html` — sort living / non-living, then the rule switches to animal / plant or mammal / bird / fish / reptile.
- `plants-living-quiz.html`, `plant-parts-label.html`, `plant-needs-garden.html`
- `living-or-not-sort.html`, `mrs-gren-detective.html`, `animal-or-plant.html`
- `photosynthesis-factory.html` — ordered ingredients
- `seed-journey.html` — germination stages
- `habitat-match.html` — creature → habitat
- `true-false-scientist.html` — rapid T/F
- `care-the-plant-sim.html` — care choices + health
- `classify-speed-round.html` — timed living / not

### English (52)
- Arcade: `covering-run`, `pronoun-pop`, `always-river`, `order-climb`, `cause-bridge`.
- Play: `runway-roar.html` — throw fur, feathers, scales, or gills, then shout They / always / never.
- Focus: `mirror-letters.html` — tap the real b/d or p/q in a word. `word-sweep.html` — tap moving words in reading order (cause and effect, frequency).
- `story-sleuth.html` — short stories, end of semester 1 (who / where / what / feeling)
- `sentence-clue.html` — tap the sentence that answers
- Reading variety: `best-title`, `true-false-flash`, `who-said-it`, `story-order`, `odd-sentence`, `feeling-faces`, `what-next`, `word-tap`, `same-story`, `ending-picker`
- `midterm-explorer-quiz.html`, `animal-groups-safari.html`, `body-coverings-match.html`
- `pronoun-rescue.html`, `frequency-meter.html`, `states-of-matter-lab.html`
- `animal-action-charades.html` — action / covering vocab
- `plural-party.html` — plurals + they/them
- `sentence-builder.html` — tap words in order
- `cause-effect-chain.html` — cause → effect
- `opposites-snap.html` — memory opposites
- `listening-lookalike.html` — close-word choices
- Challenge reading: `main-idea`, `why-it-happened`, `word-in-sentence`, `two-clues`, `listen-and-pick`, `fact-or-guess`, `what-they-want`, `four-steps`, `extra-detail`, `what-the-line-means`, `where-it-happens`, `two-characters`, `word-part`, `tiny-poem`, `follow-the-steps`, `write-back`, `news-flash`, `riddle`, `which-scene`, `reading-boss`

### French (39) — reading, then a harder challenge set
- Arcade : `gouter-run`, `qui-maze`, `mot-hop`, `ordre-cases`, `lettre-express`.
- Play: `gouter-volant.html` — attraper au vol qui, où ou quoi.
- Focus: `lettres-miroir.html` — la vraie lettre b/d ou p/q dans un mot court.
- `lecture-maligne.html` — petite histoire, puis qui / où / quoi / quand
- `phrase-indice.html` — toucher la phrase qui répond
- Variété : `mot-manquant`, `oui-non-flash`, `dans-l-histoire`, `question-inverse`, `bd-ordre`, `ou-ca`, `avant-apres`, `la-lettre`, `la-liste`, `le-piege`
- Défi : `idee-principale`, `pourquoi`, `mot-en-contexte`, `deux-indices`, `ecoute-et-choisis`, `fait-ou-idee`, `ce-qu-il-veut`, `quatre-etapes`, `detail-en-trop`, `sens-replique`, `le-lieu`, `deux-personnages`, `petit-mot-colle`, `poeme-court`, `la-consigne`, `reponse-lettre`, `fait-divers`, `la-devinette`, `quelle-scene`, `defi-lecture`

### HPE (18)
- Arcade: `organ-run`, `brush-beat`, `move-gate`, `snack-dodge`, `day-loop`.
- Play: `robot-boing.html` — pop on heart, lungs, and teeth, then jump, stretch, or run.
- Focus: `body-sequence.html` — watch organ and movement cards, tap them in order, then backwards.
- `body-organs-game.html`, `organ-jobs-quiz.html`, `super-teeth-care.html`
- `move-it-loco.html`, `healthy-day-planner.html`
- `pulse-check.html` — organ scenarios
- `brush-timer-hero.html` — brush zone sequence
- `sugar-sneak.html` — snack sort
- `loco-dance-off.html` — loco vs non-loco combos
- `posture-puzzle.html` — habit sort
- `sleep-fuel-day.html` — sleep/water/play/hygiene picks

### Thai (39)
- Arcade: `letter-hop`, `tone-hats`, `digit-coins`, `mae-cave`, `listen-chase`.
- Play: `hat-shop-hop.html` — drop a consonant, Mai Ek, a Thai digit, or a Mae family hat. Listen uses `js/speak.js`.
- `mega-quiz-40.html` — full catch-up MCQ
- `consonant-class-sort.html`, `vowel-length-lab.html`, `tone-mark-match.html`
- `mae-ending-safari.html`, `thai-digits-race.html`, `nam-sai-story-quiz.html`
- `alphabet-train.html` — next consonant
- `obsolete-letter-trap.html` — spot ฃ/ฅ
- `tone-karaoke.html` — tone mark names
- `mae-memory.html` — word ↔ Mae family
- `digit-bingo.html` — Arabic → Thai digit
- `nam-sai-comic-choice.html` — story comic choices
- Challenge with a Listen button (`js/speak.js`, browser voice, written fallback): `hear-the-word`, `hear-the-vowel`, `hear-the-tone`, `hear-the-ending`, `hear-the-letter`, `minimal-pair`, `hear-the-number`, `hear-the-class`, `which-mai-ek`, `sentence-listen`, `confirm-the-tone`, `wrong-mark`, `mae-audio`, `two-sentence-listen`, `digit-dictation`, `vowel-hunt`, `old-letter-listen`, `karaoke-listen`, `comic-listen`, `thai-boss`

## Profiles, medals & XP

- Multi-child **profiles** (first name + avatar + secret fruit emoji PIN).
- **Profile picker:** live **Find my name** search, scrollable list on all screen sizes, denser 2–3 column grid on desktop so large classes can still find a profile quickly.
- **Name moderation** (`js/name-moderation.js`): blocks rude / insulting first names (EN/FR/DE/IT/TH/HE) plus **first-name shape** rules (max 2 words, letters only, no `haha`/`lol` fillers). Create/rename rejects bad names. Existing bad names are **auto-rewritten** to the avatar creature (e.g. Fox, Unicorn) or `Friend`, kept **disabled** (XP/games kept) until the child picks a kinder first name. Server scrubs on every load/push and **persists** rewrites to Netlify Blobs so insults leave the class list.
- **Feedback bubble** (bottom-right 💬): kids/parents send a short message via `/.netlify/functions/feedback`, delivered to a Discord channel webhook (`DISCORD_FEEDBACK_WEBHOOK` Netlify env — not in client). Rate-limited; injected only outside iframes so play-mode does not double the FAB.
- **Public cloud sync** via Netlify Blobs (`family-api`): every device can see and unlock all profiles; `localStorage` is a cache. Server scrubs bad names on load/push (rewrites + disables) and persists those fixes; merges preserve `disabled`.
- Unlock by tapping the secret fruit; **Log out** (top-right) returns to Create / Pick. Clicking the active avatar opens **your stats only** (not other players).
- Completing a game awards a medal by mistakes (`total − score`): **gold** 0, **silver** 1, **bronze** 2.
- **XP** is earned per **first-time correct answer** (+10), keyed by question content (replays of the same question = +0). Wrong answers give 0. Streak bonuses (+5 / +10 / +15 at streaks 3 / 5 / 8) only on first-claim corrects. Live `+XP` float animation via `FunEffects.showXpGain`. Custom games without live awards get improvement-only XP (`+10 × max(0, score − bestScore)`).
- Dirty sync uses `updatedAt` generations so in-flight answers/medals are never marked clean if the profile changed during push; XP/medal writes flush in ~150ms.
- **Activity stats** on each profile (`activity.days`): XP / exercises / questions for today, week, month, year — shown in the profile modal when unlocked.
- **Subject success** in My Progress: `subjectStats(profile)` aggregates successful games / first-claim corrects from `games` keys (`math/…`, `thai/…`, etc.).
- Levels (every 150 XP) use a fun English title combined with the animal avatar, e.g. Sleepy Unicorn → … → Super Saiyan X.
- **Leaderboard** (trophy button): ranks **active** (non-disabled) site profiles by XP, then gold/silver/bronze.
- Quiz copy can use `{{name}}` → active profile name (`NolanProgress.fillName` / QuizEngine).
- Shared scripts: `js/name-moderation.js`, `js/progress.js`, `js/shell.js` (loaded on every page; moderation also sync-loaded from `progress.js` when needed).
- Profile create / fruit unlock modal is **wide on desktop** (side-by-side avatar + PIN) so it fits without vertical scroll.
- **QuizEngine** shuffles question order and option order each run (checkpoint stores the order for resume).

## Profile sync (Netlify Blobs)

1. First visit (hub): non-dismissible **Who is playing?** modal — create a profile or pick an existing one and tap the secret fruit. Subject tiles stay locked (`hub-locked`) until unlock.
2. Boot pulls all public profiles; mutations mark profiles **dirty** with their `updatedAt`. Push sends only dirty IDs; dirty clears only if local `updatedAt` still matches the pushed snapshot (in-flight XP/medals stay dirty). Retry/backoff on failure; flush on `visibilitychange` / `online` / `pagehide`. Answer XP and `recordResult` use a fast ~150ms critical flush.
3. Server **deep-merges** games / `awardedKeys` / activity and keeps `max(xp)` so concurrent devices do not wipe progress. After pull/merge, still-dirty profiles are re-marked so local gains re-push. `awardedKeys` capped at 400 per game (oldest pruned).
4. Leaderboard uses `action: "leaderboard"` (public XP/medal rows).
5. Use `archiveByIds` / `deleteByIds` to move test profiles into `archived` with tombstone IDs so stale browser caches cannot re-push them. Clients prune `archivedIds` from `localStorage` on pull/push.

## Streak celebrations

`FunEffects.showStreak(n)` (from `js/fun-effects.js`) escalates sports-style hype as correct answers chain:

Nice one → On a roll → Hat-trick → On fire → Unstoppable → MVP mode → World-class → Legend → GOAT alert.

Bigger streaks add more confetti, star bursts, screen flash, and shake. QuizEngine and custom games that already call `showStreak` get this automatically.

## Persistent fullscreen (`app.html`)

Browsers drop fullscreen on top-level navigation. Play mode uses [`app.html`](../app.html): parent chrome stays fullscreen while subject/game pages navigate inside `#nolan-stage` iframe.

- Preferred entry: `/app.html`, `/app`, or `/play` (Netlify redirects), or hub **Open play mode** (sets `nolanWantFs` then navigates — same as shell Full screen).
- **Full screen** in the shell bar opens app mode (or requests fullscreen when already on `app.html`).
- If the browser blocks auto-FS after navigation, the **Tap for full screen** chip appears.
- `X-Frame-Options` is `SAMEORIGIN` so the same-origin iframe works.
- Pages inside the iframe skip the duplicate top bar (`nolan-embedded`).

## In-exercise checkpoints

Per profile / game, mid-run state is stored as `games[gameId].checkpoint`:

```js
{ v: 1, index, score, extra, updatedAt }
```

- API: `saveCheckpoint` / `loadCheckpoint` / `clearCheckpoint` in `js/progress.js`.
- `QuizEngine` restores on mount, saves after each answer / next, clears on finish or Play Again.
- Round-based custom games save/restore round index + score; hubs show a **Continue** chip when a checkpoint exists.
- Finishing a run (`recordResult`) clears the checkpoint.

## Shared quiz engine


```js
QuizEngine.mount({
  subject: 'math', // math | science | english | hpe | thai
  title: 'Game Title',
  subtitle: 'Short line',
  backHref: '../index.html',
  homeHref: '../../../index.html',
  quizData: [ /* { question, options, correctAnswer, explanation, hint? } */ ]
});
```

`quiz-engine.js` auto-loads `fun-effects.js` for confetti / streak / shake.

## Focus games

`js/focus-engine.js` runs the seven Focus cards (inhibition, hold, mirror letters, word sweep, rule switch, sequence). `js/focus-banks.js` builds six rounds per run. Round 4 is preceded by a stand-up pause that is not scored. Checkpoints store the generated rounds. Parent notes: [`revision-guides/focus.md`](revision-guides/focus.md).

## Play scenes

`js/play-scene.js` runs six toy scenes (biscuit stack, sprout gifts, runway costumes, flying French snack, robot parts, Thai hats). A wrong tap bonks. A right tap makes the character bounce. Parent notes: [`revision-guides/play.md`](revision-guides/play.md).

## Arcade

`js/arcade-runner.js` runs 35 video games (5 per subject, including Computing) on vendored Phaser 4.2.1 and Kenney Pixel Platformer tiles (CC0). Coins do not give XP. Three learning gates give 2 XP each, 6 XP max a run, with no streak bonus. Parent notes: [`revision-guides/computing.md`](revision-guides/computing.md).

## Adding a new game

1. Create `subjects/<subject>/games/my-game.html`.
2. Prefer `QuizEngine` for MCQs; reuse drag/sort/race patterns for interactives.
3. Include Score X/N + Play Again + FunEffects where useful.
4. Add a card on the subject hub; update this file and `RECENT_CHANGES_MEMORY.md`.

## Parent guides

French notes in [`revision-guides/`](revision-guides/). Subject hubs link via “For parents”.
