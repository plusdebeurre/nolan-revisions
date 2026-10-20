/**
 * Arcade round data. Three learning gates each. Coins are not in here.
 */
(function (global) {
  function gate(prompt, labels, answer, explain, hint) {
    return {
      prompt: prompt,
      options: labels.map(function (label) {
        return { id: label, label: label };
      }),
      answer: answer,
      explain: explain,
      cheer: explain,
      hint: hint || 'Read it once, then choose.'
    };
  }

  function pack(mode, title, subtitle, sky, gates, extra) {
    const row = { mode: mode, title: title, subtitle: subtitle, sky: sky, gates: gates };
    if (extra) {
      Object.keys(extra).forEach(function (key) {
        row[key] = extra[key];
      });
    }
    return row;
  }

  global.ArcadeBanks = {
    biscuitRun: pack('platform', 'Biscuit Run', 'Run, jump, and clear the biscuit gates', '#38bdf8', [
      gate('Which pile is a group of 5?', ['2', '5', '10'], '5', 'A group of 5 is five biscuits.', 'Count the group the gate asks for.'),
      gate('4 friends share 8 biscuits. How many each?', ['2', '4', '8'], '2', '8 shared by 4 friends is 2 each.', 'Share them into equal piles.'),
      gate('What is 2 × 5?', ['7', '10', '25'], '10', '2 groups of 5 make 10.', 'Two groups of five.')
    ]),
    fairHouses: pack('topdown', 'Fair Houses', 'Carry equal shares to each house', '#fbbf24', [
      gate('Two houses, 6 apples. How many at each door?', ['2', '3', '6'], '3', '6 apples shared by 2 houses is 3 each.', 'Make the two piles match.'),
      gate('10 coins, 5 houses. How many coins each?', ['2', '5', '10'], '2', '10 ÷ 5 = 2.', 'Five equal piles.'),
      gate('Which share is fair?', ['4 and 4', '5 and 3', '6 and 1'], '4 and 4', 'Fair means the same number for each.', 'Both sides match.')
    ]),
    sumLane: pack('lane', 'Sum Lane', 'Steer into the true sum', '#fb923c', [
      gate('7 + 5 = ?', ['11', '12', '13'], '12', '7 + 5 = 12.', 'Count on from 7.'),
      gate('14 − 4 = ?', ['8', '10', '18'], '10', '14 − 4 = 10.', 'Take 4 away from 14.'),
      gate('3 × 2 = ?', ['5', '6', '9'], '6', '3 groups of 2 make 6.', 'Three pairs.')
    ]),
    tensCave: pack('platform', 'Tens Cave', 'Jump to the right place value', '#64748b', [
      gate('What is the tens digit in 47?', ['4', '7', '47'], '4', 'In 47, the tens digit is 4.', 'The tens place is the left digit.'),
      gate('What is the ones digit in 36?', ['3', '6', '30'], '6', 'In 36, the ones digit is 6.', 'The ones place is the right digit.'),
      gate('How many tens are in 50?', ['0', '5', '50'], '5', '50 is 5 tens.', '5 tens make 50.')
    ]),
    hourTower: pack('platform', 'Hour Tower', 'Climb past the clock gates', '#818cf8', [
      gate('Which clock says 3 o’clock?', ['3:00', '3:30', '12:00'], '3:00', '3:00 is 3 o’clock.', 'O’clock means :00.'),
      gate('Which clock says half past 6?', ['6:00', '6:30', '7:30'], '6:30', 'Half past 6 is 6:30.', 'Half past means :30.'),
      gate('Which clock says 1 o’clock?', ['1:00', '1:30', '2:00'], '1:00', '1:00 is 1 o’clock.', 'The hour hand is on 1.')
    ]),

    sproutHop: pack('platform', 'Sprout Hop', 'Bounce across what a plant needs', '#4ade80', [
      gate('A droopy sprout needs a drink. Give it…', ['Water', 'A rock', 'A toy'], 'Water', 'Plants drink water through their roots.', 'Living plants need a drink.'),
      gate('The leaves look pale. They need…', ['Light', 'Dark', 'Candy'], 'Light', 'Leaves use light to make food.', 'Plants grow toward the sun.'),
      gate('The pot is crowded. The sprout needs…', ['Space', 'More seeds on top', 'A lid'], 'Space', 'A plant needs room to spread.', 'Give it room.')
    ]),
    gardenPatrol: pack('topdown', 'Garden Patrol', 'Water the living things', '#22c55e', [
      gate('Who should you water?', ['The flower', 'The rock', 'The car'], 'The flower', 'A flower is living. A rock and a car are not.', 'Living things grow.'),
      gate('Which one grows?', ['The tree', 'The chair', 'The book'], 'The tree', 'A tree grows. A chair does not.', 'Look for the living thing.'),
      gate('A plant also needs air. Where does it take air in?', ['The leaves', 'The pot color', 'The label'], 'The leaves', 'Leaves take in air.', 'The green parts do this job.')
    ]),
    seedSlide: pack('lane', 'Seed Slide', 'Slide through the growing order', '#a3e635', [
      gate('What comes out of the seed first?', ['Root', 'Flower', 'Fruit'], 'Root', 'The root comes first and drinks water.', 'The first part goes down.'),
      gate('After the root, what grows up?', ['Stem', 'Fruit', 'Seed coat'], 'Stem', 'The stem grows up after the root.', 'It holds the leaves.'),
      gate('What grows on the stem to catch light?', ['Leaf', 'Rock', 'Pot'], 'Leaf', 'Leaves catch the light.', 'They are the green catchers.')
    ]),
    habitatHop: pack('platform', 'Habitat Hop', 'Land each animal in its place', '#14b8a6', [
      gate('A fish belongs in the…', ['Pond', 'Desert', 'Closet'], 'Pond', 'A fish lives in water.', 'It needs to swim.'),
      gate('A camel belongs in the…', ['Desert', 'Pond', 'Snow'], 'Desert', 'A camel lives in the desert.', 'Dry and sandy.'),
      gate('A bird builds a home in a…', ['Tree', 'Oven', 'Shoe'], 'Tree', 'Many birds nest in trees.', 'Look up in the branches.')
    ]),
    foodFactory: pack('lane', 'Food Factory', 'Send sun, water, and air in order', '#84cc16', [
      gate('A leaf factory starts with…', ['Sun', 'Shoes', 'Soup'], 'Sun', 'The leaf uses light from the sun.', 'Light comes first.'),
      gate('The roots send up…', ['Water', 'Toys', 'Sandwiches'], 'Water', 'Roots send water to the leaf.', 'The drink from the ground.'),
      gate('The leaf also takes in…', ['Air', 'Rocks', 'Paint'], 'Air', 'Leaves take in air to make food.', 'Air goes in the leaf.')
    ]),

    coveringRun: pack('platform', 'Covering Run', 'Leap onto the right body covering', '#34d399', [
      gate('A bird is covered in…', ['Feathers', 'Scales', 'Fur'], 'Feathers', 'Birds have feathers.', 'They help a bird fly.'),
      gate('A fish breathes with…', ['Gills', 'Fur', 'Feathers'], 'Gills', 'Fish have gills.', 'Gills work underwater.'),
      gate('A snake has dry…', ['Scales', 'Fur', 'Wool'], 'Scales', 'Snakes have dry scales.', 'Scales cover a reptile.')
    ]),
    pronounPop: pack('lane', 'Pronoun Pop', 'Shout the word that fits', '#6ee7b7', [
      gate('The birds have feathers. ___ help them fly.', ['They', 'Them', 'It'], 'They', 'They starts the sentence about the birds.', 'The word is the subject.'),
      gate('Fish have gills. Gills help ___ breathe.', ['them', 'they', 'we'], 'them', 'Help them: them is the object.', 'It comes after help.'),
      gate('A dog has fur. ___ keeps the dog warm.', ['It', 'Them', 'They'], 'It', 'It stands in for the fur.', 'One thing, so it.')
    ]),
    alwaysRiver: pack('platform', 'Always River', 'Hop the frequency words', '#fcd34d', [
      gate('Birds ___ have feathers.', ['always', 'never', 'hardly ever'], 'always', 'Birds always have feathers.', 'Always means every time.'),
      gate('Fish ___ have fur.', ['never', 'always', 'usually'], 'never', 'Fish never have fur.', 'Never means not once.'),
      gate('Dogs ___ have fur.', ['usually', 'never', 'hardly ever'], 'usually', 'Dogs usually have fur.', 'Usually means most of the time.')
    ]),
    orderClimb: pack('platform', 'Order Climb', 'Climb first, next, and last', '#86efac', [
      gate('The seed is planted. That part is…', ['First', 'Next', 'Last'], 'First', 'Planting the seed happens first.', 'It is the start.'),
      gate('The stem grows after the root. That part is…', ['Next', 'First', 'Never'], 'Next', 'The stem comes next, after the root.', 'Next means after the start.'),
      gate('The flower opens at the end. That part is…', ['Last', 'First', 'Second'], 'Last', 'The flower is last.', 'Last means the end.')
    ]),
    causeBridge: pack('topdown', 'Cause Bridge', 'Cross from cause to effect', '#059669', [
      gate('The sun is hot. What happens to the ice?', ['It melts', 'It grows fur', 'It lays an egg'], 'It melts', 'Heat melts ice. The sun is the cause.', 'Hot makes ice turn to water.'),
      gate('The water is very cold. What happens?', ['It freezes', 'It becomes fur', 'It flies'], 'It freezes', 'Cold freezes water into ice.', 'Cold is the cause.'),
      gate('The plant gets no water. What happens?', ['It droops', 'It turns into a rock', 'It sings'], 'It droops', 'No water makes a plant droop.', 'The missing drink is the cause.')
    ]),

    gouterRun: pack('platform', 'Goûter Run', 'Cours et attrape le bon goûter', '#7dd3fc', [
      gate('Le jus est sur la table. Qu’est-ce qu’on boit ?', ['le jus', 'le gâteau', 'la chaise'], 'le jus', 'On boit le jus.', 'La phrase dit ce qu’on boit.'),
      gate('Mia mange une pomme. Qui mange ?', ['Mia', 'Tom', 'le chat'], 'Mia', 'C’est Mia qui mange.', 'Cherche le prénom.'),
      gate('Le gâteau est dans le jardin. Où est-il ?', ['le jardin', 'la cuisine', 'l’école'], 'le jardin', 'Le gâteau est dans le jardin.', 'Le mot après « dans » dit l’endroit.')
    ], { lang: 'fr' }),
    quiMaze: pack('topdown', 'Qui Maze', 'Traverse la pièce vers la bonne réponse', '#38bdf8', [
      gate('Tom croque une pomme. Qu’est-ce qu’il croque ?', ['une pomme', 'la soupe', 'le pain'], 'une pomme', 'Tom croque une pomme.', 'Regarde le mot après « croque ».'),
      gate('Le lion boit de l’eau. Qui boit ?', ['le lion', 'l’eau', 'le bol'], 'le lion', 'C’est le lion qui boit.', 'Qui fait l’action ?'),
      gate('La tasse est sur la table. Où est la tasse ?', ['la table', 'le lit', 'le sac'], 'la table', 'La tasse est sur la table.', 'Le mot après « sur » dit l’endroit.')
    ], { lang: 'fr' }),
    motHop: pack('lane', 'Mot Hop', 'Change de voie vers le bon mot', '#0ea5e9', [
      gate('Le chat dort sur le lit. Où dort-il ?', ['le lit', 'le jardin', 'l’école'], 'le lit', 'Le chat dort sur le lit.', 'Cherche l’endroit.'),
      gate('Lina lit un livre. Qui lit ?', ['Lina', 'le livre', 'la table'], 'Lina', 'C’est Lina qui lit.', 'Le prénom fait l’action.'),
      gate('Papa coupe le pain. Qu’est-ce qu’il coupe ?', ['le pain', 'l’eau', 'le vélo'], 'le pain', 'Papa coupe le pain.', 'Le mot après « coupe ».')
    ], { lang: 'fr' }),
    ordreCases: pack('platform', 'Ordre des cases', 'Saute : d’abord, ensuite, à la fin', '#0284c7', [
      gate('On met la nappe. C’est…', ['d’abord', 'ensuite', 'à la fin'], 'd’abord', 'La nappe se met d’abord.', 'C’est le début.'),
      gate('Ensuite, on pose les verres. C’est…', ['ensuite', 'd’abord', 'jamais'], 'ensuite', 'Les verres viennent ensuite.', 'Après le début.'),
      gate('À la fin, on mange le gâteau. C’est…', ['à la fin', 'd’abord', 'au milieu'], 'à la fin', 'Le gâteau est à la fin.', 'C’est le dernier moment.')
    ], { lang: 'fr' }),
    lettreExpress: pack('lane', 'Lettre Express', 'Apporte la bonne réponse', '#0369a1', [
      gate('« Apporte-moi le livre. » Tu apportes…', ['le livre', 'le ballon', 'le chien'], 'le livre', 'La demande parle du livre.', 'Lis ce qu’on te demande.'),
      gate('« Où est mon sac ? » Il est…', ['sous la chaise', 'dans la lune', 'sous l’eau'], 'sous la chaise', 'Un sac peut être sous la chaise.', 'Choisis un endroit possible.'),
      gate('« Qui a la pomme ? » C’est…', ['Léa', 'la pomme', 'la table'], 'Léa', 'Léa est une personne. Elle peut avoir la pomme.', 'Qui veut dire une personne.')
    ], { lang: 'fr' }),

    organRun: pack('platform', 'Organ Run', 'Jump to the organ that does the job', '#e879f9', [
      gate('Which part pumps blood?', ['Heart', 'Shoe', 'Book'], 'Heart', 'The heart pumps blood.', 'It sits in the chest.'),
      gate('Which parts help you breathe?', ['Lungs', 'Hair', 'Toes'], 'Lungs', 'The lungs help you breathe air.', 'You feel them when you take a big breath.'),
      gate('Which part starts to digest food?', ['Stomach', 'Elbow', 'Ear'], 'Stomach', 'The stomach starts to digest food.', 'It is in the belly.')
    ]),
    brushBeat: pack('lane', 'Brush Beat', 'Dodge toward the next brush spot', '#d946ef', [
      gate('Brushing starts on the…', ['Top teeth', 'Shoes', 'Hair'], 'Top teeth', 'Start with the top teeth.', 'Teeth, not hair.'),
      gate('Then brush the…', ['Bottom teeth', 'Ears', 'Knees'], 'Bottom teeth', 'Bottom teeth come next.', 'Still the teeth.'),
      gate('How often do you brush?', ['Morning and night', 'Once a week', 'Only on Sunday'], 'Morning and night', 'Brush in the morning and at night.', 'Two times each day.')
    ]),
    moveGate: pack('platform', 'Move Gate', 'Jump if it travels, stay if it does not', '#c026d3', [
      gate('A jump takes you to a new place. It is…', ['Locomotor', 'Non-locomotor', 'A tooth'], 'Locomotor', 'A jump is locomotor. You move somewhere new.', 'Locomotor means you travel.'),
      gate('A stretch can keep your feet in one spot. It is…', ['Non-locomotor', 'Locomotor', 'A snack'], 'Non-locomotor', 'A stretch is non-locomotor.', 'You can stay in one place.'),
      gate('A run to the door is…', ['Locomotor', 'Non-locomotor', 'Digestion'], 'Locomotor', 'A run moves you to the door.', 'You travel.')
    ]),
    snackDodge: pack('lane', 'Snack Dodge', 'Grab the tooth-friendly snack', '#a21caf', [
      gate('Which snack is kinder to teeth?', ['An apple', 'Soda', 'Sticky candy'], 'An apple', 'An apple is kinder to teeth than soda or candy.', 'Sugar sneaks into soda and candy.'),
      gate('Soda has a lot of…', ['Sugar', 'Water only', 'Vegetables'], 'Sugar', 'Soda hides a lot of sugar.', 'That sugar bothers teeth.'),
      gate('A healthy drink with lunch is…', ['Water', 'Soda', 'Candy juice'], 'Water', 'Water is the everyday drink.', 'It does not coat teeth in sugar.')
    ]),
    dayLoop: pack('topdown', 'Day Loop', 'Walk the healthy day', '#86198f', [
      gate('At night your body needs…', ['Sleep', 'Soda', 'Extra homework in bed'], 'Sleep', 'Sleep lets your body rest.', 'Night is for sleep.'),
      gate('All day your body needs…', ['Water', 'Only candy', 'No drinks'], 'Water', 'Your body needs water through the day.', 'Drink water.'),
      gate('After sitting, your body needs…', ['Play', 'More sitting', 'Skipping teeth'], 'Play', 'Play moves your body after sitting.', 'Get up and play.')
    ]),

    letterHop: pack('platform', 'Letter Hop', 'Hop onto the consonant hat', '#f87171', [
      gate('The chicken letter is…', ['ก', 'ข', 'ฮ'], 'ก', 'ก is gor kai, the chicken.', 'Gor kai starts the alphabet.'),
      gate('The egg letter, high class, is…', ['ข', 'ก', 'ฮ'], 'ข', 'ข is kho khai, the egg.', 'Kho khai is a high-class letter.'),
      gate('The owl, the last consonant, is…', ['ฮ', 'ก', 'ข'], 'ฮ', 'ฮ is hor nok-huk, the owl.', 'It is the last consonant.')
    ]),
    toneHats: pack('lane', 'Tone Hats', 'Steer into the tone mark', '#ef4444', [
      gate('Which hat is Mai Ek?', ['่', '้', '๊'], '่', '่ is Mai Ek.', 'Mai Ek is the first tone mark.'),
      gate('Which hat is Mai Tho?', ['้', '่', '๋'], '้', '้ is Mai Tho.', 'Mai Tho has two marks in its shape.'),
      gate('Which hat is Mai Tri?', ['๊', '๋', '่'], '๊', '๊ is Mai Tri.', 'Mai Tri sits higher.')
    ]),
    digitCoins: pack('platform', 'Digit Coins', 'Grab the Thai digit', '#dc2626', [
      gate('Which coin is 3?', ['๓', '๑', '๒'], '๓', '๓ is the Thai digit for 3.', 'Sam is 3.'),
      gate('Which coin is 1?', ['๑', '๔', '๕'], '๑', '๑ is the Thai digit for 1.', 'It looks like a small loop.'),
      gate('Which coin is 5?', ['๕', '๒', '๓'], '๕', '๕ is the Thai digit for 5.', 'Ha is 5.')
    ]),
    maeCave: pack('topdown', 'Mae Cave', 'Find the ending family', '#b91c1c', [
      gate('ส้ม ends with which family?', ['แม่กม', 'แม่กน', 'แม่กก'], 'แม่กม', 'ส้ม ends with ม, the แม่กม family.', 'Listen for the M ending.'),
      gate('นก ends with which family?', ['แม่กก', 'แม่กม', 'แม่เกย'], 'แม่กก', 'นก ends with ก, the แม่กก family.', 'Bird, nok, ends with a K sound.'),
      gate('บ้าน ends with which family?', ['แม่กน', 'แม่กม', 'แม่กก'], 'แม่กน', 'บ้าน ends with น, the แม่กน family.', 'House, baan, ends with N.')
    ]),
    listenChase: pack('lane', 'Listen Chase', 'Listen, then take that lane', '#991b1b', [
      Object.assign(gate('Which word did you hear?', ['ก ไก่', 'ข ไข่', 'ฮ นกฮูก'], 'ก ไก่', 'You heard gor kai, ก ไก่.', 'Play it again if you need to.'), { listen: { text: 'ก ไก่', lang: 'th-TH', fallback: 'gor kai' } }),
      Object.assign(gate('Which word did you hear?', ['แมว', 'นก', 'ส้ม'], 'แมว', 'You heard maeo, the cat.', 'Maeo is the cat.'), { listen: { text: 'แมว', lang: 'th-TH', fallback: 'maeo, cat' } }),
      Object.assign(gate('Which number did you hear?', ['๓', '๑', '๕'], '๓', 'You heard sam, 3, written ๓.', 'Sam means 3.'), { listen: { text: 'สาม', lang: 'th-TH', fallback: 'sam, three' } })
    ]),

    arrowBot: pack('program', 'Arrow Bot', 'Program four steps, then watch the robot go', '#14b8a6', [], {
      puzzles: [
        { w: 5, h: 3, start: [0, 1], flag: [3, 1], max: 4, prompt: 'The flag is to the right. Use up to four steps.' },
        { w: 5, h: 4, start: [0, 3], flag: [2, 1], max: 4, prompt: 'Go up and across. Reach the flag.' },
        { w: 4, h: 4, start: [0, 0], flag: [0, 3], max: 4, prompt: 'The flag is straight down. Reach it.' }
      ]
    }),
    bugWalk: pack('bug', 'Bug Walk', 'Swap the broken command so the robot arrives', '#0f766e', [], {
      puzzles: [
        {
          w: 5, h: 3, start: [0, 1], flag: [3, 1], max: 3,
          moves: ['right', 'up', 'right'],
          fix: 1,
          options: ['right', 'left', 'down'],
          answer: 'right',
          prompt: 'One arrow is wrong. Fix it so three rights reach the flag.'
        },
        {
          w: 4, h: 4, start: [0, 0], flag: [1, 2], max: 3,
          moves: ['down', 'up', 'right'],
          fix: 1,
          options: ['down', 'left', 'right'],
          answer: 'down',
          prompt: 'The middle step goes the wrong way. Fix it.'
        },
        {
          w: 4, h: 4, start: [2, 0], flag: [2, 2], max: 2,
          moves: ['left', 'down'],
          fix: 0,
          options: ['down', 'right', 'up'],
          answer: 'down',
          prompt: 'The first step walks away. Point it at the flag.'
        }
      ]
    }),
    partsRoom: pack('topdown', 'Parts Room', 'Collect the computer parts, leave the rock', '#2dd4bf', [
      gate('Which part shows the picture?', ['Screen', 'Rock', 'Sandwich'], 'Screen', 'The screen shows the picture.', 'You look at this part.'),
      gate('Which part do you type on?', ['Keyboard', 'Screen only', 'A pillow'], 'Keyboard', 'You type on the keyboard.', 'It has the letter keys.'),
      gate('A computer can…', ['Save a file', 'Eat lunch', 'Grow fur'], 'Save a file', 'A computer can save a file. It cannot eat lunch.', 'Pick a job a computer really does.')
    ]),
    keepPrivate: pack('lane', 'Keep It Private', 'Grab the safe choice', '#115e59', [
      gate('A stranger online asks your name. You…', ['Ask a grown-up', 'Type your name', 'Share your photo'], 'Ask a grown-up', 'Ask a grown-up before you share your name.', 'Your name stays private.'),
      gate('A useful search for homework is…', ['Plants for school', 'My home address', 'My password'], 'Plants for school', 'Search for the school topic, not your address.', 'Keep personal facts off the search.'),
      gate('Before you save a page, you…', ['Ask if it is for learning', 'Send it to strangers', 'Hide your homework'], 'Ask if it is for learning', 'Use the computer for learning, with a grown-up nearby.', 'Learning first.')
    ]),
    predictStop: pack('platform', 'Predict the Stop', 'Read the steps, then jump to the stop', '#0d9488', [
      gate('Steps: right, right. The robot started on square 0. It stops on…', ['2', '0', '4'], '2', 'Two rights move it from 0 to 2.', 'Each right adds one square.'),
      gate('Steps: down, down, down. It stops after…', ['3 downs', '1 down', '3 ups'], '3 downs', 'Three down steps stop it three squares lower.', 'Count the downs.'),
      gate('A program is…', ['Steps the computer runs', 'A sandwich', 'A nap'], 'Steps the computer runs', 'A program is a list of steps the computer runs.', 'An algorithm is that list of steps.')
    ]),

    lanternCrumbs: pack('lantern', 'Crumb Maze', 'A small hero and a yellow friend hunt a lantern. The door opens when the crumbs make 10.', '#f59e0b', [], { lesson: 'crumbs' }),
    lanternHut: pack('lantern', 'Hut Door', 'A small hero and a yellow friend hunt a lantern. The door appears when the hut has 4 closed sides.', '#65a30d', [], { lesson: 'hut' }),
    lanternCrates: pack('lantern', 'Crate Catch', 'A small hero and a yellow friend hunt a lantern. Catch only the next word.', '#0284c7', [], { lesson: 'crates' }),
    lanternLogs: pack('lantern', 'Rondins', 'Un petit héros et un ami jaune cherchent une lanterne. Pose le pied seulement sur le bon mot.', '#38bdf8', [], { lesson: 'logs', lang: 'fr' }),
    lanternBuddy: pack('lantern', 'Buddy Steps', 'A small hero and a yellow friend hunt a lantern. The friend steps only on the right body move.', '#f97316', [], { lesson: 'buddy' }),
    lanternListen: pack('lantern', 'Listen Step', 'A small hero and a yellow friend hunt a lantern. Step on the word you heard.', '#b91c1c', [], { lesson: 'listen' }),
    lanternBlocks: pack('lantern', 'Block Path', 'A small hero and a yellow friend hunt a lantern. The robot goes only when the path is 4 blocks.', '#0f766e', [], { lesson: 'blocks' })
  };
})(window);
