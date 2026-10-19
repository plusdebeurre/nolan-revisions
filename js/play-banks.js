/**
 * Toy-scene banks. Each run returns 6 plain rounds.
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

  function pick(list, n) {
    return shuffle(list).slice(0, n);
  }

  function biscuitBandits() {
    const shares = [
      [6, 2],
      [10, 2],
      [10, 5],
      [8, 2],
      [4, 2],
      [15, 5],
      [20, 5],
      [6, 3]
    ].map((pair) => {
      const biscuits = pair[0];
      const friends = pair[1];
      const each = biscuits / friends;
      return {
        mode: 'stack',
        key: 'share-' + biscuits + '-' + friends,
        actor: '🦝',
        prompt: friends + ' friends are waiting. ' + biscuits + ' biscuits are on the table. Put one fair share on the plate.',
        answerCount: each,
        max: biscuits,
        unit: '🍪',
        hint: 'Share ' + biscuits + ' biscuits between ' + friends + ' friends.',
        explain: 'Each friend gets ' + each + ' biscuits. ' + friends + ' × ' + each + ' = ' + biscuits + '.',
        cheer: 'Chomp! The friends each got ' + each + '. The raccoon missed the pile.'
      };
    });
    const groups = [2, 5, 10].map((n) => ({
      mode: 'stack',
      key: 'group-' + n,
      actor: '🦝',
      prompt: 'The friends want a group of ' + n + '. Stack that many biscuits.',
      answerCount: n,
      max: 12,
      unit: '🍪',
      hint: 'Keep adding until you can count ' + n + ' biscuits.',
      explain: 'A group of ' + n + ' is ' + n + ' biscuits.',
      cheer: n + ' biscuits land on the plate. The raccoon pouts.'
    }));
    return shuffle(pick(shares, 3).concat(groups));
  }

  function sproutDisco() {
    const needs = [
      { id: 'water', emoji: '💧', label: 'Water', explain: 'Roots drink water. The sprout dances.' },
      { id: 'light', emoji: '☀️', label: 'Light', explain: 'Leaves use light to make food. The sprout dances.' },
      { id: 'air', emoji: '💨', label: 'Air', explain: 'Leaves need air. The sprout dances.' },
      { id: 'soil', emoji: '🪴', label: 'Soil', explain: 'Soil holds the roots and the food in the ground. The sprout dances.' },
      { id: 'space', emoji: '↔️', label: 'Space', explain: 'A plant needs room to spread. The sprout dances.' }
    ];
    const actors = ['🌱', '🌿', '🪴', '🌷', '🌳'];
    const needRounds = pick(needs, 5).map((need, i) => ({
      mode: 'pick',
      key: 'need-' + need.id,
      actor: actors[i],
      wear: true,
      prompt: 'The sprout is droopy. Toss the thing it needs for a disco.',
      props: shuffle(needs.map((row) => ({ id: row.id, emoji: row.emoji, label: row.label }))),
      answer: need.id,
      hint: 'Plants need water, light, air, soil, and space.',
      explain: need.explain,
      cheer: 'Boogie! ' + need.explain
    }));
    needRounds.push({
      mode: 'pick',
      key: 'visitor-cat',
      actor: '🌱',
      prompt: 'Who can boogie into the garden?',
      props: shuffle([
        { id: 'cat', emoji: '🐱', label: 'Cat' },
        { id: 'rock', emoji: '🪨', label: 'Rock' },
        { id: 'car', emoji: '🚗', label: 'Car' }
      ]),
      answer: 'cat',
      hint: 'Living things grow and move.',
      explain: 'A cat grows and moves. A rock and a car stay as they are.',
      cheer: 'The cat dances in. The rock stays in its seat.'
    });
    return needRounds;
  }

  function runwayRoar() {
    const coverings = [
      { id: 'fur', emoji: '🧸', label: 'Fur' },
      { id: 'feathers', emoji: '🪶', label: 'Feathers' },
      { id: 'scales', emoji: '🐍', label: 'Scales' },
      { id: 'gills', emoji: '🐟', label: 'Gills' }
    ];
    const costumes = [
      { id: 'bird', actor: '🐦', answer: 'feathers', line: 'Birds always have feathers. They help them fly.' },
      { id: 'fish', actor: '🐠', answer: 'gills', line: 'Fish always have gills. They help them breathe.' },
      { id: 'snake', actor: '🐍', answer: 'scales', line: 'Snakes have dry scales. They help them crawl.' },
      { id: 'dog', actor: '🐶', answer: 'fur', line: 'Dogs usually have fur. It helps them stay warm.' }
    ];
    const costumeRounds = pick(costumes, 3).map((row) => ({
      mode: 'pick',
      key: 'costume-' + row.id,
      actor: row.actor,
      wear: true,
      prompt: 'The star is on the runway. Throw the right costume!',
      props: shuffle(coverings.map((item) => ({ id: item.id, emoji: item.emoji, label: item.label }))),
      answer: row.answer,
      hint: 'Birds have feathers. Fish have gills. Snakes have scales. Dogs have fur.',
      explain: row.line,
      cheer: 'Pose! ' + row.line
    }));
    const shouts = [
      {
        key: 'they',
        actor: '🐦',
        prompt: 'The birds have feathers. Shout the word that fits: ___ help them fly.',
        answer: 'they',
        options: [
          { id: 'they', emoji: '📣', label: 'They' },
          { id: 'them', emoji: '👉', label: 'Them' },
          { id: 'it', emoji: '☝️', label: 'It' }
        ],
        explain: 'They is the word for the birds. They help them fly.',
        cheer: 'The crowd roars: They help them fly!'
      },
      {
        key: 'never-fur',
        actor: '🐠',
        prompt: 'Fish have fur. What does the announcer shout?',
        answer: 'never',
        options: [
          { id: 'always', emoji: '💯', label: 'Always' },
          { id: 'usually', emoji: '👍', label: 'Usually' },
          { id: 'never', emoji: '🚫', label: 'Never' }
        ],
        explain: 'Fish never have fur. They have gills.',
        cheer: 'Never! The fish flicks its fins.'
      },
      {
        key: 'always-feathers',
        actor: '🦆',
        prompt: 'A duck has feathers. What does the announcer shout?',
        answer: 'always',
        options: [
          { id: 'always', emoji: '💯', label: 'Always' },
          { id: 'hardly', emoji: '🤏', label: 'Hardly ever' },
          { id: 'never', emoji: '🚫', label: 'Never' }
        ],
        explain: 'Birds always have feathers.',
        cheer: 'Always! Feathers flash under the lights.'
      }
    ];
    const shoutRounds = shouts.map((row) => ({
      mode: 'pick',
      key: 'shout-' + row.key,
      actor: row.actor,
      prompt: row.prompt,
      props: shuffle(row.options),
      answer: row.answer,
      hint: 'They starts the sentence. Always means every time. Never means not once.',
      explain: row.explain,
      cheer: row.cheer
    }));
    return shuffle(costumeRounds.concat(shoutRounds));
  }

  function gouterVolant() {
    const scenes = [
      {
        key: 'jus',
        actor: '🧃',
        prompt: 'Le jus est sur la table. Qu’est-ce qu’on boit ?',
        answer: 'jus',
        props: [
          { id: 'jus', emoji: '🧃', label: 'le jus' },
          { id: 'gateau', emoji: '🍰', label: 'le gâteau' },
          { id: 'chaise', emoji: '🪑', label: 'la chaise' }
        ],
        hint: 'La phrase dit ce qu’on boit.',
        explain: 'On boit le jus. Il est sur la table.',
        cheer: 'Gloups ! Le jus atterrit dans le verre.'
      },
      {
        key: 'jardin',
        actor: '🍰',
        prompt: 'Le gâteau est dans le jardin. Où est-il ?',
        answer: 'jardin',
        props: [
          { id: 'jardin', emoji: '🌳', label: 'le jardin' },
          { id: 'cuisine', emoji: '🍳', label: 'la cuisine' },
          { id: 'ecole', emoji: '🏫', label: 'l’école' }
        ],
        hint: 'Cherche le mot qui dit l’endroit.',
        explain: 'Le gâteau est dans le jardin.',
        cheer: 'Hop ! Le gâteau vole jusqu’au jardin.'
      },
      {
        key: 'mia',
        actor: '👧',
        prompt: 'Mia mange une pomme. Qui mange ?',
        answer: 'mia',
        props: [
          { id: 'mia', emoji: '👧', label: 'Mia' },
          { id: 'tom', emoji: '👦', label: 'Tom' },
          { id: 'chat', emoji: '🐱', label: 'le chat' }
        ],
        hint: 'La phrase donne le prénom.',
        explain: 'C’est Mia qui mange la pomme.',
        cheer: 'Mia attrape la pomme au vol.'
      },
      {
        key: 'pomme',
        actor: '🍎',
        prompt: 'Tom croque une pomme. Qu’est-ce qu’il croque ?',
        answer: 'pomme',
        props: [
          { id: 'pomme', emoji: '🍎', label: 'une pomme' },
          { id: 'soupe', emoji: '🥣', label: 'la soupe' },
          { id: 'pain', emoji: '🍞', label: 'le pain' }
        ],
        hint: 'Écoute le mot après « croque ».',
        explain: 'Tom croque une pomme.',
        cheer: 'Crounch ! La pomme est à Tom.'
      },
      {
        key: 'table',
        actor: '🫖',
        prompt: 'La tasse est sur la table. Où est la tasse ?',
        answer: 'table',
        props: [
          { id: 'table', emoji: '🪵', label: 'la table' },
          { id: 'lit', emoji: '🛏️', label: 'le lit' },
          { id: 'sac', emoji: '🎒', label: 'le sac' }
        ],
        hint: 'Le mot après « sur » dit l’endroit.',
        explain: 'La tasse est sur la table.',
        cheer: 'La tasse se pose sur la table.'
      },
      {
        key: 'lion',
        actor: '🦁',
        prompt: 'Le lion boit de l’eau. Qui boit ?',
        answer: 'lion',
        props: [
          { id: 'lion', emoji: '🦁', label: 'le lion' },
          { id: 'eau', emoji: '💧', label: 'l’eau' },
          { id: 'bol', emoji: '🥣', label: 'le bol' }
        ],
        hint: 'Qui fait l’action de boire ?',
        explain: 'C’est le lion qui boit.',
        cheer: 'Le lion bondit et boit.'
      }
    ];
    return shuffle(scenes).map((scene) => ({
      mode: 'pick',
      fly: true,
      key: 'gouter-' + scene.key,
      actor: scene.actor,
      prompt: scene.prompt,
      props: shuffle(scene.props),
      answer: scene.answer,
      hint: scene.hint,
      explain: scene.explain,
      cheer: scene.cheer
    }));
  }

  function robotBoing() {
    function part(key, prompt, answer, props, explain, cheer) {
      return {
        mode: 'pick',
        key: 'robot-' + key,
        actor: '🤖',
        wear: true,
        prompt: prompt,
        props: shuffle(props),
        answer: answer,
        hint: 'The heart pumps. The lungs breathe. Teeth get brushed. A jump moves you. A stretch stays in one place.',
        explain: explain,
        cheer: cheer
      };
    }
    return [
      part('heart', 'He is snoozing. Pop on the part that pumps blood.', 'heart', [
        { id: 'heart', emoji: '❤️', label: 'Heart' },
        { id: 'shoe', emoji: '👟', label: 'Shoe' },
        { id: 'book', emoji: '📘', label: 'Book' }
      ], 'The heart pumps blood.', 'Boing! The heart switches on.'),
      part('lungs', 'Now the part that helps him breathe.', 'lungs', [
        { id: 'lungs', emoji: '🫁', label: 'Lungs' },
        { id: 'hat', emoji: '🎩', label: 'Hat' },
        { id: 'ball', emoji: '⚽', label: 'Ball' }
      ], 'The lungs help you breathe air.', 'Whoosh! The lungs fill up.'),
      part('teeth', 'Sparkle time. What does he brush?', 'teeth', [
        { id: 'teeth', emoji: '😁', label: 'Teeth' },
        { id: 'hair', emoji: '💇', label: 'Hair' },
        { id: 'toes', emoji: '🦶', label: 'Toes' }
      ], 'Brush teeth in the morning and at night.', 'Ting! His teeth shine.'),
      part('jump', 'Send him across the room.', 'jump', [
        { id: 'jump', emoji: '🦘', label: 'Jump' },
        { id: 'stretch', emoji: '🙆', label: 'Stretch' }
      ], 'A jump is locomotor. He moves to a new place.', 'Zoom! He jumps across the room.'),
      part('stretch', 'Now he stays in one spot and gets long.', 'stretch', [
        { id: 'stretch', emoji: '🙆', label: 'Stretch' },
        { id: 'run', emoji: '🏃', label: 'Run' }
      ], 'A stretch is non-locomotor. He can stay in one place.', 'Wobble! He stretches on the spot.'),
      part('run', 'The door is over there. He wants to get to it fast.', 'run', [
        { id: 'run', emoji: '🏃', label: 'Run' },
        { id: 'turn', emoji: '🔄', label: 'Turn' }
      ], 'A run is locomotor. He moves to the door.', 'Whoosh! He runs to the door.')
    ];
  }

  function hatShopHop() {
    function hat(key, actor, prompt, answer, props, listen, fallback, explain, cheer) {
      return {
        mode: 'pick',
        key: 'hat-' + key,
        actor: actor,
        wear: true,
        prompt: prompt,
        props: shuffle(props),
        answer: answer,
        listen: { text: listen, lang: 'th-TH', fallback: fallback },
        hint: 'Listen, then drop the matching hat.',
        explain: explain,
        cheer: cheer
      };
    }
    const letters = [
      hat('ko', '🐔', 'The chicken wants its letter hat.', 'ko', [
        { id: 'ko', emoji: 'ก', label: 'ก' },
        { id: 'kho', emoji: 'ข', label: 'ข' },
        { id: 'ho', emoji: 'ฮ', label: 'ฮ' }
      ], 'ก ไก่', 'gor kai', 'ก is gor kai, the chicken letter.', 'Hop! ก lands on the chicken.'),
      hat('kho', '🥚', 'The egg pet wants the high-class letter ข.', 'kho', [
        { id: 'ko', emoji: 'ก', label: 'ก' },
        { id: 'kho', emoji: 'ข', label: 'ข' },
        { id: 'ho', emoji: 'ฮ', label: 'ฮ' }
      ], 'ข ไข่', 'kho khai', 'ข is kho khai, an egg, and a high-class letter.', 'Hop! ข sits on the egg.'),
      hat('ho', '🦉', 'The owl wants the last letter, ฮ.', 'ho', [
        { id: 'ko', emoji: 'ก', label: 'ก' },
        { id: 'kho', emoji: 'ข', label: 'ข' },
        { id: 'ho', emoji: 'ฮ', label: 'ฮ' }
      ], 'ฮ นกฮูก', 'hor nok-huk', 'ฮ is hor nok-huk, the owl, the last consonant.', 'Hop! ฮ lands on the owl.')
    ];
    const tones = hat('ek', '🎩', 'This pet wants the Mai Ek hat.', 'ek', [
      { id: 'ek', emoji: '่', label: '่ Mai Ek' },
      { id: 'tho', emoji: '้', label: '้ Mai Tho' },
      { id: 'tri', emoji: '๊', label: '๊ Mai Tri' },
      { id: 'chat', emoji: '๋', label: '๋ Mai Chattawa' }
    ], 'ไม้เอก', 'mai ek', '่ is Mai Ek.', 'The Mai Ek hat sticks. The pet bows.');
    const digit = hat('three', '🏷️', 'The price tag is 3. Drop the Thai digit.', 'sam', [
      { id: 'nueng', emoji: '๑', label: '๑' },
      { id: 'song', emoji: '๒', label: '๒' },
      { id: 'sam', emoji: '๓', label: '๓' }
    ], 'สาม', 'sam, three', '๓ is the Thai digit for 3.', 'The tag flips to ๓. Sold!');
    const mae = hat('som', '🍊', 'ส้ม ends with the M family. Which hat?', 'mae-m', [
      { id: 'mae-m', emoji: 'ม', label: 'แม่กม' },
      { id: 'mae-n', emoji: 'น', label: 'แม่กน' },
      { id: 'mae-k', emoji: 'ก', label: 'แม่กก' }
    ], 'ส้ม', 'som, orange', 'ส้ม ends with ม. That family is แม่กม.', 'Hop! The M hat sticks on the orange.');
    return shuffle(letters.concat([tones, digit, mae]));
  }

  global.PlayBanks = {
    biscuitBandits: biscuitBandits,
    sproutDisco: sproutDisco,
    runwayRoar: runwayRoar,
    gouterVolant: gouterVolant,
    robotBoing: robotBoing,
    hatShopHop: hatShopHop
  };
})(window);
