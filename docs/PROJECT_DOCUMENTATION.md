# Nolan Grade 2 Learning Hub

Static, offline-friendly revision games for a Grade 2 learner (age ~7). Child UI is **English**. Parent revision guides may stay in French.

## How to open

Open [`index.html`](../index.html) in a browser (double-click or “Open with…”). No build step and no server required.

## Structure

```
nolan-revisions/
├── index.html                 # Home — pick a subject
├── css/shared.css             # Themes, score HUD, confetti/shake/streak
├── js/quiz-engine.js          # MCQ engine (auto-loads fun-effects)
├── js/fun-effects.js          # Confetti, shake, streak badge
├── subjects/
│   ├── math/                  # Amber (12 games)
│   ├── science/               # Violet (12 games)
│   ├── english/               # Emerald (12 games)
│   ├── hpe/                   # Pink/purple (11 games)
│   └── thai/                  # Red catch-up (13 games)
└── docs/
    ├── PROJECT_DOCUMENTATION.md
    ├── RECENT_CHANGES_MEMORY.md
    └── revision-guides/       # Parent notes (FR)
```

## Quality bar

Every game shows a **numeric score** (live HUD and/or end screen), **Play Again**, Back/Home nav, and uses shared micro-interactions where possible (`FunEffects`).

## Subjects and games

### Math (12) — large fixed banks for long practice
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

### Science (12)
- `plants-living-quiz.html`, `plant-parts-label.html`, `plant-needs-garden.html`
- `living-or-not-sort.html`, `mrs-gren-detective.html`, `animal-or-plant.html`
- `photosynthesis-factory.html` — ordered ingredients
- `seed-journey.html` — germination stages
- `habitat-match.html` — creature → habitat
- `true-false-scientist.html` — rapid T/F
- `care-the-plant-sim.html` — care choices + health
- `classify-speed-round.html` — timed living / not

### English (12)
- `midterm-explorer-quiz.html`, `animal-groups-safari.html`, `body-coverings-match.html`
- `pronoun-rescue.html`, `frequency-meter.html`, `states-of-matter-lab.html`
- `animal-action-charades.html` — action / covering vocab
- `plural-party.html` — plurals + they/them
- `sentence-builder.html` — tap words in order
- `cause-effect-chain.html` — cause → effect
- `opposites-snap.html` — memory opposites
- `listening-lookalike.html` — close-word choices

### HPE (11)
- `body-organs-game.html`, `organ-jobs-quiz.html`, `super-teeth-care.html`
- `move-it-loco.html`, `healthy-day-planner.html`
- `pulse-check.html` — organ scenarios
- `brush-timer-hero.html` — brush zone sequence
- `sugar-sneak.html` — snack sort
- `loco-dance-off.html` — loco vs non-loco combos
- `posture-puzzle.html` — habit sort
- `sleep-fuel-day.html` — sleep/water/play/hygiene picks

### Thai (13)
- `mega-quiz-40.html` — full catch-up MCQ
- `consonant-class-sort.html`, `vowel-length-lab.html`, `tone-mark-match.html`
- `mae-ending-safari.html`, `thai-digits-race.html`, `nam-sai-story-quiz.html`
- `alphabet-train.html` — next consonant
- `obsolete-letter-trap.html` — spot ฃ/ฅ
- `tone-karaoke.html` — tone mark names
- `mae-memory.html` — word ↔ Mae family
- `digit-bingo.html` — Arabic → Thai digit
- `nam-sai-comic-choice.html` — story comic choices

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

## Adding a new game

1. Create `subjects/<subject>/games/my-game.html`.
2. Prefer `QuizEngine` for MCQs; reuse drag/sort/race patterns for interactives.
3. Include Score X/N + Play Again + FunEffects where useful.
4. Add a card on the subject hub; update this file and `RECENT_CHANGES_MEMORY.md`.

## Parent guides

French notes in [`revision-guides/`](revision-guides/). Subject hubs link via “For parents”.
