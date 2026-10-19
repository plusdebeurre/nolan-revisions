/**
 * Round builders for Focus games.
 * Each run returns 6 plain rounds the checkpoint can store.
 */
(function (global) {
  function shuffle(arr) {
    const x = arr.slice();
    for (let n = x.length - 1; n > 0; n--) {
      const j = Math.floor(Math.random() * (n + 1));
      const t = x[n];
      x[n] = x[j];
      x[j] = t;
    }
    return x;
  }

  function optionSet(correct, extras) {
    const seen = {};
    const vals = [];
    function add(v) {
      const s = String(v);
      if (seen[s]) return;
      seen[s] = true;
      vals.push(s);
    }
    add(correct);
    (extras || []).forEach(add);
    let bump = 1;
    while (vals.length < 3) {
      add(Number(correct) + bump + 2);
      bump += 1;
    }
    const options = shuffle(vals.slice(0, 3));
    return { options: options, answer: options.indexOf(String(correct)) };
  }

  function freezeQuestion(q) {
    const rows = q.options.map((opt, idx) => ({ opt: opt, idx: idx }));
    const shuffled = shuffle(rows);
    return {
      prompt: q.prompt,
      options: shuffled.map((row) => row.opt),
      answer: shuffled.findIndex((row) => row.idx === q.answer),
      explain: q.explain
    };
  }

  function inhibit(key, prompt, card, shouldCatch, hint, explain) {
    return {
      mode: 'inhibit',
      key: key,
      prompt: prompt,
      card: card,
      shouldCatch: !!shouldCatch,
      hint: hint,
      explain: explain
    };
  }

  function stopOrGo() {
    const evenHint = 'Even numbers end in 0, 2, 4, 6, or 8.';
    const oddHint = 'Odd numbers end in 1, 3, 5, 7, or 9.';
    const factHint = 'Check the ×2, ×5, or ×10 fact before you catch it.';
    const bigHint = 'Catch it when the first number is bigger.';
    const bank = [
      inhibit('even-18', 'Catch even numbers', '18', true, evenHint, '18 ends in 8, so it is even. Catch it.'),
      inhibit('even-20', 'Catch even numbers', '20', true, evenHint, '20 ends in 0, so it is even. Catch it.'),
      inhibit('even-14', 'Catch even numbers', '14', true, evenHint, '14 ends in 4, so it is even. Catch it.'),
      inhibit('even-7', 'Catch even numbers', '7', false, evenHint, '7 ends in 7, so it is odd. Let it go.'),
      inhibit('even-11', 'Catch even numbers', '11', false, evenHint, '11 ends in 1, so it is odd. Let it go.'),
      inhibit('even-15', 'Catch even numbers', '15', false, evenHint, '15 ends in 5, so it is odd. Let it go.'),
      inhibit('odd-15', 'Catch odd numbers', '15', true, oddHint, '15 ends in 5, so it is odd. Catch it.'),
      inhibit('odd-23', 'Catch odd numbers', '23', true, oddHint, '23 ends in 3, so it is odd. Catch it.'),
      inhibit('odd-9', 'Catch odd numbers', '9', true, oddHint, '9 ends in 9, so it is odd. Catch it.'),
      inhibit('odd-8', 'Catch odd numbers', '8', false, oddHint, '8 ends in 8, so it is even. Let it go.'),
      inhibit('odd-14', 'Catch odd numbers', '14', false, oddHint, '14 ends in 4, so it is even. Let it go.'),
      inhibit('odd-30', 'Catch odd numbers', '30', false, oddHint, '30 ends in 0, so it is even. Let it go.'),
      inhibit('fact-6x5', 'Catch a true times fact', '6 × 5 = 30', true, factHint, '6 × 5 = 30. Catch it.'),
      inhibit('fact-7x10', 'Catch a true times fact', '7 × 10 = 70', true, factHint, '7 × 10 = 70. Catch it.'),
      inhibit('fact-9x2', 'Catch a true times fact', '9 × 2 = 18', true, factHint, '9 × 2 = 18. Catch it.'),
      inhibit('fact-4x10', 'Catch a true times fact', '4 × 10 = 40', true, factHint, '4 × 10 = 40. Catch it.'),
      inhibit('fact-4x2', 'Catch a true times fact', '4 × 2 = 10', false, factHint, '4 × 2 = 8. Let it go.'),
      inhibit('fact-3x5', 'Catch a true times fact', '3 × 5 = 20', false, factHint, '3 × 5 = 15. Let it go.'),
      inhibit('fact-5x5', 'Catch a true times fact', '5 × 5 = 20', false, factHint, '5 × 5 = 25. Let it go.'),
      inhibit('fact-8x2', 'Catch a true times fact', '8 × 2 = 14', false, factHint, '8 × 2 = 16. Let it go.'),
      inhibit('big-18-12', 'Catch it when the first number is bigger', '18  ·  12', true, bigHint, '18 is bigger than 12. Catch it.'),
      inhibit('big-50-40', 'Catch it when the first number is bigger', '50  ·  40', true, bigHint, '50 is bigger than 40. Catch it.'),
      inhibit('big-30-25', 'Catch it when the first number is bigger', '30  ·  25', true, bigHint, '30 is bigger than 25. Catch it.'),
      inhibit('big-9-16', 'Catch it when the first number is bigger', '9  ·  16', false, bigHint, '9 is smaller than 16. Let it go.'),
      inhibit('big-11-11', 'Catch it when the first number is bigger', '11  ·  11', false, bigHint, '11 and 11 are equal. Let it go.'),
      inhibit('big-7-17', 'Catch it when the first number is bigger', '7  ·  17', false, bigHint, '7 is smaller than 17. Let it go.')
    ];
    const prompts = {};
    bank.forEach((row) => {
      if (!prompts[row.prompt]) prompts[row.prompt] = [];
      prompts[row.prompt].push(row);
    });
    const picked = [];
    shuffle(Object.keys(prompts)).slice(0, 3).forEach((prompt) => {
      const group = shuffle(prompts[prompt]);
      const yes = group.filter((row) => row.shouldCatch)[0];
      const no = group.filter((row) => !row.shouldCatch)[0];
      if (yes) picked.push(yes);
      if (no) picked.push(no);
    });
    return shuffle(picked);
  }

  const DISTRACTORS = [
    { prompt: 'How many sides does a triangle have?', options: ['3', '4', '5'], answer: 0, explain: 'A triangle has 3 sides.' },
    { prompt: 'How many sides does a square have?', options: ['3', '4', '6'], answer: 1, explain: 'A square has 4 sides.' },
    { prompt: 'How many straight sides does a circle have?', options: ['0', '1', '2'], answer: 0, explain: 'A circle is round. It has 0 straight sides.' },
    { prompt: 'What is 10 more than 20?', options: ['30', '10', '25'], answer: 0, explain: '20 + 10 = 30.' },
    { prompt: 'What is the tens digit in 47?', options: ['4', '7', '47'], answer: 0, explain: 'In 47, the tens digit is 4.' },
    { prompt: 'How many corners does a rectangle have?', options: ['4', '3', '6'], answer: 0, explain: 'A rectangle has 4 corners.' },
    { prompt: 'What is half of 10?', options: ['5', '10', '2'], answer: 0, explain: 'Half of 10 is 5.' },
    { prompt: 'What is 2 × 5?', options: ['10', '7', '25'], answer: 0, explain: '2 × 5 = 10.' }
  ];

  function distractorOk(q, n) {
    const correct = q.options[q.answer];
    if (String(correct) === String(n)) return false;
    return !new RegExp('(^|\\D)' + n + '(\\D|$)').test(q.prompt + ' ' + q.options.join(' '));
  }

  function recallFor(n, i) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const even = n % 2 === 0;
    const kinds = [
      Object.assign(
        { prompt: 'What is your number + 10?', explain: n + ' + 10 = ' + (n + 10) + '.' },
        optionSet(n + 10, [n, n + 1, n + 20])
      ),
      Object.assign(
        { prompt: 'What number did you hold?', explain: 'You held ' + n + '.' },
        optionSet(n, [n + 1, n - 1, n + 10])
      )
    ];
    const parityOptions = shuffle(['Even', 'Odd']);
    kinds.push({
      prompt: 'Is your number odd or even?',
      options: parityOptions,
      answer: parityOptions.indexOf(even ? 'Even' : 'Odd'),
      explain: n + (even ? ' is even.' : ' is odd.')
    });
    if (n >= 10) {
      kinds.push(Object.assign(
        { prompt: 'What is your number − 10?', explain: n + ' − 10 = ' + (n - 10) + '.' },
        optionSet(n - 10, [n, n + 10, ones])
      ));
      kinds.push(Object.assign(
        { prompt: 'What is the tens digit of your number?', explain: 'In ' + n + ', the tens digit is ' + tens + '.' },
        optionSet(tens, [ones, n, tens + 1])
      ));
    }
    return kinds[i % kinds.length];
  }

  function holdTheNumber() {
    const numbers = shuffle([6, 8, 11, 12, 14, 15, 17, 18, 20, 23, 30, 40]).slice(0, 6);
    const pool = shuffle(DISTRACTORS);
    return numbers.map((n, i) => {
      let distractor = null;
      for (let k = 0; k < pool.length; k++) {
        const candidate = pool[(i + k) % pool.length];
        if (distractorOk(candidate, n)) {
          distractor = freezeQuestion(candidate);
          break;
        }
      }
      if (!distractor) distractor = freezeQuestion(pool[i % pool.length]);
      const recall = recallFor(n, i);
      return {
        mode: 'hold',
        key: 'hold-' + n + '-' + i + '-' + recall.prompt,
        prompt: 'Remember this number',
        hold: n,
        hint: 'Say the number in your head, then use it.',
        distractor: distractor,
        recall: recall,
        explain: recall.explain
      };
    });
  }

  function mirrorSet(entries, prompt, hint) {
    const byWord = {};
    entries.forEach((entry) => {
      if (!byWord[entry.word]) byWord[entry.word] = [];
      byWord[entry.word].push(entry);
    });
    return shuffle(Object.keys(byWord)).slice(0, 6).map((word) => {
      const entry = shuffle(byWord[word])[0];
      const options = shuffle([entry.letter, entry.mirror]);
      return {
        mode: 'mirror',
        key: 'm-' + word + '-' + entry.index + '-' + entry.letter,
        prompt: prompt,
        word: word,
        index: entry.index,
        options: options,
        answer: options.indexOf(entry.letter),
        hint: hint,
        explain: entry.explain
      };
    });
  }

  function mirrorEn() {
    return mirrorSet([
      { word: 'bed', index: 0, letter: 'b', mirror: 'd', explain: 'bed starts with b.' },
      { word: 'bed', index: 2, letter: 'd', mirror: 'b', explain: 'bed ends with d.' },
      { word: 'bird', index: 0, letter: 'b', mirror: 'd', explain: 'bird starts with b.' },
      { word: 'duck', index: 0, letter: 'd', mirror: 'b', explain: 'duck starts with d.' },
      { word: 'pond', index: 0, letter: 'p', mirror: 'q', explain: 'pond starts with p.' },
      { word: 'pond', index: 3, letter: 'd', mirror: 'b', explain: 'pond ends with d.' },
      { word: 'queen', index: 0, letter: 'q', mirror: 'p', explain: 'queen starts with q.' },
      { word: 'baby', index: 0, letter: 'b', mirror: 'd', explain: 'baby starts with b.' },
      { word: 'door', index: 0, letter: 'd', mirror: 'b', explain: 'door starts with d.' },
      { word: 'pink', index: 0, letter: 'p', mirror: 'q', explain: 'pink starts with p.' },
      { word: 'crab', index: 3, letter: 'b', mirror: 'd', explain: 'crab ends with b.' },
      { word: 'drop', index: 0, letter: 'd', mirror: 'b', explain: 'drop starts with d.' },
      { word: 'bread', index: 0, letter: 'b', mirror: 'd', explain: 'bread starts with b.' },
      { word: 'bread', index: 4, letter: 'd', mirror: 'b', explain: 'bread ends with d.' },
      { word: 'spot', index: 1, letter: 'p', mirror: 'q', explain: 'The underlined letter in spot is p.' },
      { word: 'quad', index: 0, letter: 'q', mirror: 'p', explain: 'quad starts with q.' }
    ], 'Tap the underlined letter.', 'Read the word. Then look only at the underlined letter.');
  }

  function mirrorFr() {
    return mirrorSet([
      { word: 'bébé', index: 0, letter: 'b', mirror: 'd', explain: 'bébé commence par b.' },
      { word: 'bébé', index: 2, letter: 'b', mirror: 'd', explain: 'Dans bébé, la lettre soulignée est b.' },
      { word: 'balle', index: 0, letter: 'b', mirror: 'd', explain: 'balle commence par b.' },
      { word: 'dame', index: 0, letter: 'd', mirror: 'b', explain: 'dame commence par d.' },
      { word: 'dos', index: 0, letter: 'd', mirror: 'b', explain: 'dos commence par d.' },
      { word: 'papa', index: 0, letter: 'p', mirror: 'q', explain: 'papa commence par p.' },
      { word: 'poule', index: 0, letter: 'p', mirror: 'q', explain: 'poule commence par p.' },
      { word: 'quatre', index: 0, letter: 'q', mirror: 'p', explain: 'quatre commence par q.' },
      { word: 'coq', index: 2, letter: 'q', mirror: 'p', explain: 'coq finit par q.' },
      { word: 'robe', index: 2, letter: 'b', mirror: 'd', explain: 'Dans robe, la lettre soulignée est b.' },
      { word: 'table', index: 2, letter: 'b', mirror: 'd', explain: 'Dans table, la lettre soulignée est b.' },
      { word: 'drap', index: 0, letter: 'd', mirror: 'b', explain: 'drap commence par d.' },
      { word: 'jardin', index: 3, letter: 'd', mirror: 'b', explain: 'Dans jardin, la lettre soulignée est d.' },
      { word: 'bande', index: 0, letter: 'b', mirror: 'd', explain: 'bande commence par b.' },
      { word: 'bande', index: 3, letter: 'd', mirror: 'b', explain: 'bande finit par d.' },
      { word: 'pile', index: 0, letter: 'p', mirror: 'q', explain: 'pile commence par p.' },
      { word: 'quoi', index: 0, letter: 'q', mirror: 'p', explain: 'quoi commence par q.' }
    ], 'Touche la lettre soulignée.', 'Lis le mot. Regarde seulement la lettre soulignée.');
  }

  function wordSweep() {
    const lines = [
      ['Ice', 'melts', 'in', 'heat'],
      ['Water', 'freezes', 'into', 'ice'],
      ['Birds', 'always', 'have', 'feathers'],
      ['Fish', 'never', 'have', 'fur'],
      ['Steam', 'is', 'a', 'gas'],
      ['Mammals', 'usually', 'have', 'fur'],
      ['Snakes', 'have', 'dry', 'scales'],
      ['Heat', 'can', 'melt', 'ice']
    ];
    return shuffle(lines).slice(0, 6).map((words) => ({
      mode: 'track',
      key: 'sweep-' + words.join('-'),
      prompt: 'Tap the words in reading order.',
      words: words,
      hint: 'Say the sentence quietly, then tap the words in that order.',
      explain: words.join(' ') + '.'
    }));
  }

  function switchRound(ruleId, prompt, item, choices, answer, hint, explain) {
    return {
      mode: 'switch',
      key: ruleId + '-' + item.name,
      ruleId: ruleId,
      prompt: prompt,
      item: item,
      choices: choices,
      answer: answer,
      hint: hint,
      explain: explain
    };
  }

  function pickBoth(list, field, n) {
    const by = {};
    list.forEach((item) => {
      const key = item[field];
      if (!by[key]) by[key] = [];
      by[key].push(item);
    });
    const picked = [];
    Object.keys(by).forEach((key) => {
      picked.push(shuffle(by[key])[0]);
    });
    const rest = shuffle(list.filter((item) => picked.indexOf(item) === -1));
    while (picked.length < n && rest.length) picked.push(rest.pop());
    return shuffle(picked).slice(0, n);
  }

  function ruleFlip() {
    const lifeChoices = [
      { id: 'living', label: 'Living' },
      { id: 'nonliving', label: 'Non-living' }
    ];
    const kindChoices = [
      { id: 'animal', label: 'Animal' },
      { id: 'plant', label: 'Plant' }
    ];
    const groupChoices = [
      { id: 'mammal', label: 'Mammal' },
      { id: 'bird', label: 'Bird' },
      { id: 'fish', label: 'Fish' },
      { id: 'reptile', label: 'Reptile' }
    ];
    const life = [
      { name: 'Cat', emoji: '🐱', answer: 'living', explain: 'A cat grows, breathes, and moves. It is living.' },
      { name: 'Tree', emoji: '🌳', answer: 'living', explain: 'A tree grows and needs water and light. It is living.' },
      { name: 'Fish', emoji: '🐟', answer: 'living', explain: 'A fish moves, breathes, and grows. It is living.' },
      { name: 'Flower', emoji: '🌸', answer: 'living', explain: 'A flower grows on a plant. It is living.' },
      { name: 'Rock', emoji: '🪨', answer: 'nonliving', explain: 'A rock stays the same. It is non-living.' },
      { name: 'Chair', emoji: '🪑', answer: 'nonliving', explain: 'A chair is made by people. It is non-living.' },
      { name: 'Car', emoji: '🚗', answer: 'nonliving', explain: 'A car does not grow. It is non-living.' },
      { name: 'Book', emoji: '📘', answer: 'nonliving', explain: 'A book does not breathe or grow. It is non-living.' }
    ];
    const kinds = [
      { name: 'Dog', emoji: '🐶', answer: 'animal', explain: 'A dog eats food. It is an animal.' },
      { name: 'Bird', emoji: '🐦', answer: 'animal', explain: 'A bird eats food. It is an animal.' },
      { name: 'Fish', emoji: '🐟', answer: 'animal', explain: 'A fish eats food. It is an animal.' },
      { name: 'Rose', emoji: '🌹', answer: 'plant', explain: 'A rose makes its own food. It is a plant.' },
      { name: 'Grass', emoji: '🌱', answer: 'plant', explain: 'Grass makes its own food. It is a plant.' },
      { name: 'Cactus', emoji: '🌵', answer: 'plant', explain: 'A cactus makes its own food. It is a plant.' }
    ];
    const groups = [
      { name: 'Dog', emoji: '🐶', answer: 'mammal', explain: 'A dog has fur. It is a mammal.' },
      { name: 'Cat', emoji: '🐱', answer: 'mammal', explain: 'A cat has fur. It is a mammal.' },
      { name: 'Eagle', emoji: '🦅', answer: 'bird', explain: 'An eagle has feathers and wings. It is a bird.' },
      { name: 'Duck', emoji: '🦆', answer: 'bird', explain: 'A duck has feathers. It is a bird.' },
      { name: 'Goldfish', emoji: '🐠', answer: 'fish', explain: 'A goldfish has gills and fins. It is a fish.' },
      { name: 'Snake', emoji: '🐍', answer: 'reptile', explain: 'A snake has dry scales. It is a reptile.' }
    ];
    const phase2 = Math.random() < 0.5 ? 'kind' : 'group';
    const first = pickBoth(life, 'answer', 3).map((item) => switchRound(
      'life',
      'Is it living or non-living?',
      { emoji: item.emoji, name: item.name },
      lifeChoices,
      item.answer,
      'Living things grow and need air and water.',
      item.explain
    ));
    const secondSource = phase2 === 'kind' ? kinds : groups;
    const secondChoices = phase2 === 'kind' ? kindChoices : groupChoices;
    const secondPrompt = phase2 === 'kind' ? 'Is it an animal or a plant?' : 'Which animal group is it?';
    const secondHint = phase2 === 'kind'
      ? 'Animals eat food. Plants make their own food.'
      : 'Look at fur, feathers, scales, or gills.';
    const second = pickBoth(secondSource, 'answer', 3).map((item) => switchRound(
      phase2,
      secondPrompt,
      { emoji: item.emoji, name: item.name },
      secondChoices,
      item.answer,
      secondHint,
      item.explain
    ));
    return first.concat(second);
  }

  const BODY = [
    { id: 'brain', emoji: '🧠', label: 'Brain', fact: 'The brain thinks and tells the body what to do.' },
    { id: 'heart', emoji: '❤️', label: 'Heart', fact: 'The heart pumps blood.' },
    { id: 'lungs', emoji: '🫁', label: 'Lungs', fact: 'The lungs help you breathe air.' },
    { id: 'stomach', emoji: '🍽️', label: 'Stomach', fact: 'The stomach starts to digest food.' },
    { id: 'walk', emoji: '🚶', label: 'Walk', fact: 'Walk is locomotor. You move to a new place.' },
    { id: 'run', emoji: '🏃', label: 'Run', fact: 'Run is locomotor. You move to a new place.' },
    { id: 'jump', emoji: '🦘', label: 'Jump', fact: 'Jump is locomotor. You move to a new place.' },
    { id: 'stretch', emoji: '🙆', label: 'Stretch', fact: 'Stretch is non-locomotor. You can stay in one place.' },
    { id: 'turn', emoji: '🔄', label: 'Turn', fact: 'Turn is non-locomotor. You can turn in one spot.' },
    { id: 'push', emoji: '👐', label: 'Push', fact: 'Push is non-locomotor. You stay in your place.' }
  ];

  function bodySequence() {
    const plan = [
      { n: 3, reverse: false },
      { n: 3, reverse: false },
      { n: 4, reverse: false },
      { n: 3, reverse: true },
      { n: 3, reverse: true },
      { n: 4, reverse: true }
    ];
    return plan.map((spec, i) => {
      const steps = shuffle(BODY).slice(0, spec.n).map((row) => ({
        id: row.id,
        emoji: row.emoji,
        label: row.label
      }));
      const facts = steps.map((step) => {
        const found = BODY.filter((row) => row.id === step.id)[0];
        return found ? found.fact : '';
      });
      const order = spec.reverse ? steps.slice().reverse() : steps.slice();
      return {
        mode: 'reverse',
        ruleId: spec.reverse ? 'back' : 'forward',
        key: 'body-' + i + '-' + steps.map((step) => step.id).join('-') + (spec.reverse ? '-back' : ''),
        prompt: spec.reverse
          ? 'Watch. Then tap the cards backwards.'
          : 'Watch. Then tap the cards in the same order.',
        reverse: spec.reverse,
        steps: steps,
        pool: shuffle(steps.map((step) => ({ id: step.id, emoji: step.emoji, label: step.label }))),
        hint: facts.join(' '),
        explain: order.map((step) => step.label).join(' → ')
      };
    });
  }

  global.FocusBanks = {
    stopOrGo: stopOrGo,
    holdTheNumber: holdTheNumber,
    mirrorEn: mirrorEn,
    mirrorFr: mirrorFr,
    wordSweep: wordSweep,
    ruleFlip: ruleFlip,
    bodySequence: bodySequence
  };
})(window);
