/**
 * Harder English reading: inference, main idea, and a few listens.
 * Eight rounds each. Not copies of the semester-1 banks.
 */
(function (global) {
  function row(id, skill, prompt, passage, options, answer, hint, why, extra) {
    var item = { id: id, skill: skill, prompt: prompt, passage: passage, options: options, answer: answer, hint: hint, why: why };
    if (extra) Object.keys(extra).forEach(function (k) { item[k] = extra[k]; });
    return item;
  }

  var mainIdea = [
    row('mi1', 'Main idea', 'What is the story mostly about?', 'The river rose all morning. By noon the path to the bridge was under water. Maya and her dad turned back and took the long road home.', ['A flood blocks the usual way home', 'Maya learns to swim', 'Dad buys a new boat'], 0, 'What problem lasts for the whole story?', 'The rising water stops them using the path, so they take another road.'),
    row('mi2', 'Main idea', 'What is the story mostly about?', 'Jo checked the nest every day after school. On Friday two pale blue eggs were there. On Monday a tiny beak showed over the rim.', ['A nest that gains eggs, then a chick', 'Jo’s lost homework', 'A trip to the zoo'], 0, 'Follow what changes in the nest.', 'The story stays with the nest from eggs to a chick.'),
    row('mi3', 'Main idea', 'What is the story mostly about?', 'The class play needed a tree. Amir painted the trunk. Nia cut paper leaves. By Thursday the tree stood at the side of the stage.', ['Friends making a tree for a play', 'A real forest walk', 'Amir’s birthday cake'], 0, 'What are they building, and why?', 'Every sentence is about the stage tree.'),
    row('mi4', 'Main idea', 'What is the story mostly about?', 'Gran’s cat would not come down from the shed roof. Liam spoke softly and shook a tin of food. At last the cat climbed down into his arms.', ['Liam coaxing a cat down', 'A cooking lesson', 'A football final'], 0, 'What problem is solved at the end?', 'The cat is stuck, then Liam gets it down.'),
    row('mi5', 'Main idea', 'What is the story mostly about?', 'The bakery had one lemon cake left. Two customers wanted it. The baker cut it in half so each person could take a piece.', ['Sharing the last cake', 'Baking bread at midnight', 'A broken oven'], 0, 'What does the baker do with the one cake?', 'He solves the problem by sharing it.'),
    row('mi6', 'Main idea', 'What is the story mostly about?', 'Rain tapped the tent all night. In the morning the sleeping bags were dry, but the map was soaked. The scouts laid the map on a rock to dry.', ['A wet map after a rainy night', 'Learning to sail', 'A lost tent'], 0, 'Which object is in trouble?', 'The map is wet and they work to dry it.'),
    row('mi7', 'Main idea', 'What is the story mostly about?', 'Priya’s plant leaned toward the window. She turned the pot each Monday. After a month the stem grew straight.', ['Turning a plant so it grows straight', 'Priya’s new puppy', 'A snow day'], 0, 'What changes from the first sentence to the last?', 'The leaning plant becomes straight because she turns it.'),
    row('mi8', 'Main idea', 'What is the story mostly about?', 'The library lights blinked twice. The librarian smiled and pointed at the clock. Children closed books and lined up with their cards.', ['Closing time at the library', 'A power cut in a storm', 'A magic spell'], 0, 'What do the lights and the clock tell the children to do?', 'They pack up because the library is closing.')
  ];

  var whyHappened = [
    row('wh1', 'Why', 'Why did Maya and her dad take the long road?', 'The river rose all morning. By noon the path to the bridge was under water. Maya and her dad turned back and took the long road home.', ['The short path was flooded', 'They wanted a longer walk', 'The bus was late'], 0, 'What was wrong with the usual path?', 'Water covered the path, so they could not use it.'),
    row('wh2', 'Why', 'Why did Liam shake a tin of food?', 'Gran’s cat would not come down from the shed roof. Liam spoke softly and shook a tin of food. The cat climbed down.', ['To tempt the cat down', 'To feed the birds', 'To call his friends'], 0, 'The cat is up high. What might bring it down?', 'The food sound gives the cat a reason to climb down.'),
    row('wh3', 'Why', 'Why did the baker cut the cake?', 'Two customers both wanted the last lemon cake. The baker cut it in half.', ['So each customer could have some', 'Because the cake was burnt', 'Because it was too hot'], 0, 'How many people wanted that one cake?', 'Two people wanted one cake, so he shared it.'),
    row('wh4', 'Why', 'Why did Priya turn the pot?', 'Priya’s plant leaned toward the window. She turned the pot each Monday. The stem grew straight.', ['So the plant would not keep leaning', 'To hide it from the cat', 'To water the leaves'], 0, 'What was the plant doing before she turned it?', 'It leaned to the light, so turning it helped it grow straight.'),
    row('wh5', 'Why', 'Why did the children line up?', 'The library lights blinked twice. The librarian pointed at the clock. Children closed their books and lined up.', ['The library was closing', 'A fire drill started', 'Their bus arrived'], 0, 'The clock and the blinking lights are a signal.', 'Those signs mean closing time, so they line up.'),
    row('wh6', 'Why', 'Why did the scouts put the map on a rock?', 'Rain tapped the tent all night. In the morning the map was soaked. They laid it on a rock in the sun.', ['To dry the map', 'To hide the map', 'To weigh the tent down'], 0, 'The map is wet. What does sun on a rock do?', 'They want the wet map to dry.'),
    row('wh7', 'Why', 'Why did Amir paint a trunk?', 'The class play needed a tree. Amir painted a brown trunk on cardboard. Nia added paper leaves.', ['The play needed a tree on stage', 'He was painting the classroom door', 'The real tree had fallen'], 0, 'Read the first sentence again.', 'The play needed a tree, so he painted one.'),
    row('wh8', 'Why', 'Why did Jo check the nest every day?', 'Jo wanted to see if the eggs would hatch. She checked the nest after school. On Monday a tiny beak showed.', ['She was waiting for a chick', 'She was looking for her pencil', 'The teacher told her to count leaves'], 0, 'What appears at the end?', 'She keeps looking because she hopes the eggs will hatch.')
  ];

  var wordSentence = [
    row('ws1', 'Word', 'Which word fits the blank?', 'The path was under water, so Maya and her dad were ____ to cross it.', ['unable', 'eager', 'asleep'], 0, 'If water covers the path, can they cross?', 'Unable means they could not cross.'),
    row('ws2', 'Word', 'Which word fits the blank?', 'Liam spoke softly so he would not ____ the cat.', ['frighten', 'feed', 'paint'], 0, 'A loud voice might scare an animal on a roof.', 'Frighten means scare.'),
    row('ws3', 'Word', 'Which word fits the blank?', 'The baker was ____ and cut the last cake in half.', ['fair', 'lost', 'frozen'], 0, 'He gives both customers a piece.', 'Fair means both people get the same chance.'),
    row('ws4', 'Word', 'Which word fits the blank?', 'The soaked map was ____ after an hour in the sun.', ['drier', 'heavier', 'colder'], 0, 'Sun on a wet map takes the water away.', 'Drier means less wet.'),
    row('ws5', 'Word', 'Which word fits the blank?', 'Priya turned the pot so the plant would grow ____.', ['straight', 'sideways', 'underground'], 0, 'She did not want it to keep leaning.', 'Straight means not bent toward one side.'),
    row('ws6', 'Word', 'Which word fits the blank?', 'The blinking lights were a ____ that the library would close.', ['signal', 'snack', 'song'], 0, 'A blink can tell people what to do next.', 'A signal is a sign with a meaning.'),
    row('ws7', 'Word', 'Which word fits the blank?', 'A tiny beak at the rim showed the egg had ____.', ['hatched', 'melted', 'flown'], 0, 'A chick comes out of an egg.', 'Hatched means the chick broke out of the egg.'),
    row('ws8', 'Word', 'Which word fits the blank?', 'Amir’s cardboard trunk and Nia’s leaves made a ____ tree.', ['pretend', 'real', 'fruit'], 0, 'It is for a play, not a garden.', 'Pretend means it looks like a tree but is not alive.')
  ];

  var twoClues = [
    row('tc1', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: The bridge path was flooded. Fact 2: Maya walked the long road.', ['Maya took the long road because the path was flooded.', 'Maya swam across the river.', 'Maya stayed at the bridge all night.'], 0, 'The right sentence must mention the water and the road.', 'Both facts are in the first choice.'),
    row('tc2', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: Two people wanted one cake. Fact 2: The baker cut it in half.', ['Each customer got half of the last cake.', 'The baker threw the cake away.', 'Only one customer came in.'], 0, 'Look for half and for more than one customer.', 'Sharing the one cake uses both facts.'),
    row('tc3', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: The cat was on the shed roof. Fact 2: Food helped it climb down.', ['Liam used food to bring the cat off the roof.', 'The cat was in a tree.', 'Liam ate the food himself.'], 0, 'The answer needs the roof and the food.', 'Food is what got the cat down from the roof.'),
    row('tc4', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: The map got wet in the night. Fact 2: They laid it in the sun.', ['They dried the rain-soaked map in the sun.', 'They drew a new map in the dark.', 'The tent blew away.'], 0, 'Wet and sun should both appear in the meaning.', 'Sun is how they deal with the wet map.'),
    row('tc5', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: The plant leaned toward the window. Fact 2: Priya turned the pot each week.', ['Turning the pot stopped the plant leaning only one way.', 'Priya moved the plant to a cupboard.', 'The window was broken.'], 0, 'Use the lean and the turning.', 'Turning the pot answers the leaning.'),
    row('tc6', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: Eggs were in the nest on Friday. Fact 2: A beak showed on Monday.', ['The eggs hatched over the weekend.', 'The nest was empty all week.', 'Jo moved the eggs to school.'], 0, 'Friday eggs and a Monday beak belong together.', 'A beak means a chick came from those eggs.'),
    row('tc7', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: The play needed a tree. Fact 2: Children built one from cardboard and paper.', ['The stage tree was made by the class.', 'They picked a tree in the park.', 'The play was cancelled.'], 0, 'The tree is for the play and it is handmade.', 'Cardboard and paper make the tree the play needs.'),
    row('tc8', 'Two clues', 'Which sentence uses BOTH facts?', 'Fact 1: The lights blinked. Fact 2: The librarian pointed at the clock.', ['Those signs meant the library was closing.', 'The lights meant a storm was inside.', 'The clock was broken.'], 0, 'Both signs together tell the children something.', 'Blinking lights plus the clock mean closing time.')
  ];

  var listenPick = [
    row('lp1', 'Listen', 'Listen, then choose the meaning.', 'The river covered the path, so they walked the long way.', ['They changed their route', 'They went swimming', 'They built a bridge'], 0, 'If you cannot hear it, read the line.', 'Covered path means they must take another way.', { say: 'The river covered the path, so they walked the long way.', lang: 'en-US' }),
    row('lp2', 'Listen', 'Listen, then choose the meaning.', 'Please close your book. The library is closing.', ['It is time to stop reading', 'It is time to shout', 'It is time to cook'], 0, 'Closing tells people to finish.', 'They should stop and get ready to leave.', { say: 'Please close your book. The library is closing.', lang: 'en-US' }),
    row('lp3', 'Listen', 'Listen, then choose the meaning.', 'The cat came down when it heard the food tin.', ['The sound of food brought the cat', 'The cat ran farther away', 'The tin was empty forever'], 0, 'What did the cat hear?', 'The tin made the cat come down.', { say: 'The cat came down when it heard the food tin.', lang: 'en-US' }),
    row('lp4', 'Listen', 'Listen, then choose the meaning.', 'Half of the lemon cake went to each customer.', ['They shared the cake', 'Nobody got any cake', 'The cake was only for the baker'], 0, 'Half and half means a share.', 'Each person got part of the same cake.', { say: 'Half of the lemon cake went to each customer.', lang: 'en-US' }),
    row('lp5', 'Listen', 'Listen, then choose the meaning.', 'Put the wet map in the sun so it can dry.', ['Sun will help the map', 'Hide the map in a puddle', 'Tear the map up'], 0, 'Dry is the goal.', 'Sun takes the water out of the map.', { say: 'Put the wet map in the sun so it can dry.', lang: 'en-US' }),
    row('lp6', 'Listen', 'Listen, then choose the meaning.', 'Turn the pot so the plant does not lean.', ['Turning helps the plant grow evenly', 'Throw the pot away', 'Stop giving it light'], 0, 'Lean means bend to one side.', 'Turning the pot fixes the lean.', { say: 'Turn the pot so the plant does not lean.', lang: 'en-US' }),
    row('lp7', 'Listen', 'Listen, then choose the meaning.', 'A small beak means the egg has hatched.', ['A chick is coming out', 'The egg rolled away', 'The nest is empty of twigs'], 0, 'Hatched is about a baby bird.', 'A beak shows the chick has broken out.', { say: 'A small beak means the egg has hatched.', lang: 'en-US' }),
    row('lp8', 'Listen', 'Listen, then choose the meaning.', 'We need a pretend tree for the school play.', ['The tree is for acting, not for a garden', 'They will plant a forest', 'The play is outdoors only'], 0, 'Pretend means not a real living tree.', 'The tree is a prop for the play.', { say: 'We need a pretend tree for the school play.', lang: 'en-US' })
  ];

  var factGuess = [
    row('fg1', 'Fact or guess', 'Is this a fact from the story or only a guess?', 'The path was under water, so Maya took the long road.', ['Fact: the path was under water', 'Guess: Maya lost her boots', 'Guess: Dad was angry'], 0, 'A fact is written. A guess is not.', 'The story states that the path was under water.'),
    row('fg2', 'Fact or guess', 'Which line is only a guess?', 'Liam shook a tin and the cat climbed down.', ['The cat was afraid of thunder', 'The cat climbed down', 'Liam shook a tin'], 0, 'Two lines are written. One is not.', 'Thunder is never mentioned, so it is a guess.'),
    row('fg3', 'Fact or guess', 'Which line is a fact?', 'The baker cut the last cake in half.', ['The cake was cut in half', 'The customers were twins', 'The cake was chocolate'], 0, 'Only one of these is written.', 'The story says he cut it in half.'),
    row('fg4', 'Fact or guess', 'Which line is only a guess?', 'The map was soaked, so they laid it in the sun.', ['The scouts were lost forever', 'The map was soaked', 'They put the map in the sun'], 0, 'Being lost is not said.', 'Wet map and sun are facts. Being lost is a guess.'),
    row('fg5', 'Fact or guess', 'Which line is a fact?', 'Priya turned the pot and the stem grew straight.', ['The stem grew straight', 'Priya hated plants', 'The pot was blue'], 0, 'Look for words that appear in the story.', 'The story says the stem grew straight.'),
    row('fg6', 'Fact or guess', 'Which line is only a guess?', 'Lights blinked and the children lined up.', ['The children were in trouble', 'The lights blinked', 'The children lined up'], 0, 'Lining up is not the same as being in trouble.', 'Nothing says they were in trouble.'),
    row('fg7', 'Fact or guess', 'Which line is a fact?', 'On Monday a tiny beak showed over the rim of the nest.', ['A beak showed on Monday', 'There were five chicks', 'Jo took an egg home'], 0, 'Count what the sentence actually gives you.', 'It states that a beak showed on Monday.'),
    row('fg8', 'Fact or guess', 'Which line is only a guess?', 'Amir painted a trunk and Nia cut paper leaves.', ['The play won a prize', 'Amir painted a trunk', 'Nia cut paper leaves'], 0, 'A prize is extra.', 'The story never mentions a prize.')
  ];

  var whatTheyWant = [
    row('wt1', 'Motive', 'What does Liam want?', 'The cat sat on the shed roof and would not come down. Liam shook a tin of food and waited.', ['He wants the cat to come down', 'He wants to climb on the roof', 'He wants to hide the tin'], 0, 'Watch what he does for the cat.', 'The food is a way to get the cat down.'),
    row('wt2', 'Motive', 'What do the two customers want?', 'Both customers pointed at the one lemon cake left in the case.', ['Each wants that cake', 'They want the baker to close', 'They want a loaf of bread'], 0, 'They are both looking at the same thing.', 'They both want the last cake.'),
    row('wt3', 'Motive', 'What does Priya want for her plant?', 'The plant leaned. Priya turned the pot every Monday until the stem grew straight.', ['A straight, healthy plant', 'A plant that leans more', 'No plant at all'], 0, 'She keeps working until the stem changes.', 'Turning the pot shows she wants it straight.'),
    row('wt4', 'Motive', 'What does Jo want?', 'Jo visited the nest every day and smiled when a beak appeared.', ['To see the eggs hatch', 'To take the nest down', 'To scare the birds'], 0, 'She keeps coming back and smiles at the end.', 'She is waiting for the chick.'),
    row('wt5', 'Motive', 'What do the scouts want?', 'They carried the soaked map to a sunny rock and held the corners flat.', ['To dry the map', 'To bury the map', 'To trade the map'], 0, 'Sun and flat corners help paper dry.', 'They are saving the map so they can read it.'),
    row('wt6', 'Motive', 'What does the librarian want the children to do?', 'She pointed at the clock and nodded toward the door.', ['To finish and leave', 'To start a new book', 'To hide under the tables'], 0, 'The clock and the door are a gentle order.', 'Closing time means she wants them to go.'),
    row('wt7', 'Motive', 'What does Maya’s dad want?', 'He looked at the flooded path, shook his head, and led Maya to the long road.', ['A safe way home', 'To swim the river', 'To camp on the bridge'], 0, 'He refuses the flooded path.', 'The long road is the safe choice.'),
    row('wt8', 'Motive', 'What do Amir and Nia want?', 'They worked until the cardboard tree could stand beside the stage.', ['A tree the play can use', 'A tree to climb at lunch', 'A tree to sell'], 0, 'The stage tells you the purpose.', 'The tree is a prop for the play.')
  ];

  var fourSteps = [
    { id: 'fs1', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'Maya saw the flooded path, turned around, walked the long road, and reached home.', steps: ['She sees the flooded path', 'She turns around', 'She walks the long road', 'She reaches home'], hint: 'She cannot get home before she chooses the long road.', why: 'See the water, turn back, walk, then arrive.' },
    { id: 'fs2', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'Jo found the nest, saw two eggs, waited through the weekend, and spotted a beak.', steps: ['She finds the nest', 'She sees two eggs', 'She waits', 'She spots a beak'], hint: 'The beak is the last surprise.', why: 'Nest, eggs, waiting, then the beak.' },
    { id: 'fs3', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'Amir painted the trunk, Nia cut leaves, they glued them on, and the tree stood on stage.', steps: ['Amir paints the trunk', 'Nia cuts leaves', 'They glue the leaves', 'The tree stands on stage'], hint: 'Glue comes after the pieces exist.', why: 'Paint, cut, glue, then the tree is ready.' },
    { id: 'fs4', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'The cat stayed on the roof, Liam shook the tin, the cat climbed down, and Liam held it.', steps: ['The cat stays on the roof', 'Liam shakes the tin', 'The cat climbs down', 'Liam holds the cat'], hint: 'He cannot hold the cat while it is still on the roof.', why: 'Stuck, tin, climb, then held.' },
    { id: 'fs5', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'Rain soaked the map, morning came, the scouts spread the map on a rock, and the paper dried.', steps: ['Rain soaks the map', 'Morning comes', 'They spread the map', 'The paper dries'], hint: 'Drying is the last step.', why: 'Soak, morning, spread, dry.' },
    { id: 'fs6', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'The plant leaned, Priya turned the pot, weeks passed, and the stem grew straight.', steps: ['The plant leans', 'Priya turns the pot', 'Weeks pass', 'The stem grows straight'], hint: 'The straight stem is the result.', why: 'Lean, turn, wait, then straight.' },
    { id: 'fs7', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'Two customers chose the same cake, the baker listened, he cut it, and each left with half.', steps: ['They choose the same cake', 'The baker listens', 'He cuts the cake', 'Each person leaves with half'], hint: 'Cutting happens before they leave.', why: 'Choose, listen, cut, leave.' },
    { id: 'fs8', skill: 'Order', prompt: 'Tap the four steps in order.', passage: 'The lights blinked, the librarian pointed to the clock, books closed, and the line formed.', steps: ['The lights blink', 'She points to the clock', 'Books close', 'A line forms'], hint: 'The line is the last action.', why: 'Blink, clock, close books, line up.' }
  ];

  var extraDetail = [
    row('ed1', 'Extra', 'Which detail is NOT in the story?', 'The river covered the path. Maya and her dad took the long road home.', ['They rowed a boat', 'The path was covered', 'They took the long road', 'Dad was with Maya'], 0, 'A boat is never named.', 'They walk. Nobody rows a boat.'),
    row('ed2', 'Extra', 'Which detail is NOT in the story?', 'Liam shook a tin. The cat climbed off the shed roof.', ['The cat wore a bell', 'Liam shook a tin', 'The cat climbed down', 'The cat was on a shed'], 0, 'A bell is an extra idea.', 'No bell is mentioned.'),
    row('ed3', 'Extra', 'Which detail is NOT in the story?', 'The baker cut the lemon cake so two customers could share it.', ['The cake was lemon', 'Two customers wanted it', 'He cut it', 'He added candles'], 0, 'Candles belong to a different kind of cake story.', 'Nothing says there were candles.'),
    row('ed4', 'Extra', 'Which detail is NOT in the story?', 'The scouts dried a soaked map on a sunny rock.', ['The map was soaked', 'They used a rock', 'The sun helped', 'They crossed a river that day'], 0, 'This story is only about the map.', 'A river crossing is not in it.'),
    row('ed5', 'Extra', 'Which detail is NOT in the story?', 'Priya turned her plant each Monday until the stem grew straight.', ['She turned it on Mondays', 'The stem grew straight', 'It had been leaning', 'She sold the plant'], 0, 'Selling is a new idea.', 'She keeps the plant and helps it grow.'),
    row('ed6', 'Extra', 'Which detail is NOT in the story?', 'Jo saw two eggs on Friday and a beak on Monday.', ['Two eggs on Friday', 'A beak on Monday', 'Jo checked the nest', 'The bird sang a song'], 0, 'A song is not written.', 'We only know about eggs and a beak.'),
    row('ed7', 'Extra', 'Which detail is NOT in the story?', 'Amir painted a trunk. Nia cut paper leaves for the play.', ['A painted trunk', 'Paper leaves', 'A school play', 'A real owl on stage'], 0, 'An owl would be a new character.', 'Only a pretend tree is described.'),
    row('ed8', 'Extra', 'Which detail is NOT in the story?', 'Blinking lights and a pointed clock sent the children to line up.', ['Lights blinked', 'She pointed at the clock', 'Children lined up', 'They ran out screaming'], 0, 'The mood in the story is calm.', 'They line up. They do not scream.')
  ];

  var lineMeans = [
    row('lm1', 'Meaning', 'What does Dad mean?', 'Dad looked at the water and said, “Not this way.”', ['The flooded path is unsafe', 'He wants to splash', 'He is asking for a drink'], 0, '“Not this way” refuses the path they can see.', 'He means they should not walk through the water.'),
    row('lm2', 'Meaning', 'What does the cat’s climb mean?', 'After the tin rattled, the cat climbed down at once.', ['The cat wanted the food', 'The cat was angry at the shed', 'The cat could not hear'], 0, 'It moves right after the food sound.', 'The rattle called it down for food.'),
    row('lm3', 'Meaning', 'What does the baker mean?', 'The baker said, “You can each take a side.”', ['They will share the cake', 'Only one person may eat', 'The cake is not for sale'], 0, '“Each” means both people.', 'A side each means half each.'),
    row('lm4', 'Meaning', 'What does the scout leader mean?', '“Flat on the rock, corners down,” she said.', ['Spread the map so it can dry', 'Fold the map smaller', 'Hide the map under a rock'], 0, 'Flat and held down is how wet paper dries.', 'She wants the map open in the sun.'),
    row('lm5', 'Meaning', 'What does Priya mean?', '“If I turn you, you will not bend only one way.”', ['Turning the pot will even out the growth', 'The plant should be thrown out', 'She will stop watering'], 0, 'She is talking to the plant about bending.', 'Turning stops it leaning to one side.'),
    row('lm6', 'Meaning', 'What does the librarian mean?', 'She tapped the clock and said, “Cards ready.”', ['It is time to check out and leave', 'It is time to start a game', 'The clock is a prize'], 0, 'Library cards are used when you finish.', 'She wants them ready to go.'),
    row('lm7', 'Meaning', 'What does Jo mean?', '“Just a beak today. Tomorrow, maybe more of you.”', ['She thinks a chick is arriving', 'She thinks the nest is a hat', 'She is talking to her brother'], 0, '“You” is the bird still mostly in the egg.', 'A beak means the chick is on the way.'),
    row('lm8', 'Meaning', 'What does Nia mean?', '“Leaves next, or it will look like a stick.”', ['The tree needs leaves to look real', 'She wants to burn the cardboard', 'A stick is the costume'], 0, 'A trunk alone looks like a stick.', 'Leaves will make it look like a tree.')
  ];

  var whereHappens = [
    row('whr1', 'Where', 'Where are they?', 'Water covered the bridge path. They could hear the river rushing.', ['Beside a flooded river path', 'Inside a library', 'On a stage'], 0, 'A bridge path and rushing water name the place.', 'They are by the river path.'),
    row('whr2', 'Where', 'Where is the cat?', 'Tiles clicked under Liam’s shoes as he looked up at the shed roof.', ['On a shed roof', 'In a bakery', 'In a tent'], 0, 'He looks up at the shed.', 'The cat is on the shed roof.'),
    row('whr3', 'Where', 'Where does this happen?', 'Glass cases, the smell of sugar, and a lemon cake on a stand.', ['In a bakery', 'In a nest', 'On a bridge'], 0, 'Sugar smell and a cake in a case.', 'Those clues belong to a bakery.'),
    row('whr4', 'Where', 'Where are the scouts?', 'Canvas walls, sleeping bags, and rain on the roof of their shelter.', ['In a tent', 'In a classroom', 'In a shop'], 0, 'Canvas and sleeping bags are camping clues.', 'They are in a tent.'),
    row('whr5', 'Where', 'Where is the plant?', 'Sun came through the glass onto the pot on the sill.', ['On a windowsill', 'Under a bridge', 'On a stage'], 0, 'A sill by the glass is part of a window.', 'The pot is on a windowsill.'),
    row('whr6', 'Where', 'Where is Jo?', 'Twigs, two blue eggs, and a branch above the garden fence.', ['At a nest by the garden', 'At a swimming pool', 'At a bakery'], 0, 'Eggs and twigs make a nest.', 'She is at a garden nest.'),
    row('whr7', 'Where', 'Where is the tree they made?', 'Curtains, painted cardboard, and rows of chairs facing them.', ['On a stage', 'In a river', 'In a tent'], 0, 'Curtains and facing chairs mean an audience.', 'They are on a stage.'),
    row('whr8', 'Where', 'Where are the children lining up?', 'Shelves of books, a checkout desk, and a round wall clock.', ['In a library', 'On a roof', 'In a nest'], 0, 'Shelves and a checkout desk name the building.', 'They are in a library.')
  ];

  var twoCharacters = [
    row('ch1', 'Characters', 'How are Maya and her dad alike here?', 'Both stopped at the water. Both turned onto the long road together.', ['They make the same safe choice', 'Maya swims and Dad drives', 'They argue and split up'], 0, 'They do the same action.', 'They both refuse the flooded path.'),
    row('ch2', 'Characters', 'How are Amir and Nia different?', 'Amir painted the brown trunk. Nia cut green paper leaves.', ['They make different parts of the tree', 'They both only paint', 'Nia paints the trunk'], 0, 'Each person has a job.', 'Trunk and leaves are different jobs.'),
    row('ch3', 'Characters', 'How are the two customers alike?', 'Each pointed at the same cake. Each left with half.', ['They both wanted the cake and both got some', 'Only one wanted cake', 'They wanted different cakes'], 0, '“Each” is a clue that they match.', 'They share the same wish and the same result.'),
    row('ch4', 'Characters', 'How is Liam different from the cat at the start?', 'The cat stayed high and still. Liam stood below and made a plan.', ['Liam acts while the cat waits', 'The cat shakes the tin', 'Liam is on the roof'], 0, 'Who moves first with a plan?', 'Liam is the one who tries a solution.'),
    row('ch5', 'Characters', 'How are Jo and the chick different at the end?', 'Jo watches and smiles. The chick is only a beak at the rim.', ['Jo is the watcher and the chick is just arriving', 'Jo is inside the egg', 'The chick checks the nest'], 0, 'One is outside looking. One is barely out.', 'Jo observes. The chick is new.'),
    row('ch6', 'Characters', 'How are the scouts alike?', 'Each scout held one corner of the wet map on the rock.', ['They work together on one map', 'Each scout has a different map', 'They refuse to help'], 0, 'Corners of the same map.', 'They share one job.'),
    row('ch7', 'Characters', 'How are Priya and the plant different?', 'Priya can turn the pot. The plant can only grow where it is turned.', ['Priya chooses and the plant responds', 'The plant turns the pot', 'Priya cannot move'], 0, 'Who has hands?', 'Priya acts. The plant grows in answer.'),
    row('ch8', 'Characters', 'How are the librarian and the children different at the end?', 'She stands by the clock. They close books and make a line.', ['She gives the signal and they follow it', 'The children point at the clock', 'She lines up with a book'], 0, 'One person signals. The group answers.', 'She leads the closing. They pack up.')
  ];

  var wordPart = [
    row('wp1', 'Word part', 'What does unable mean in this sentence?', 'Maya was unable to use the flooded path.', ['Not able', 'Very able', 'Able again'], 0, 'Un- often means not.', 'Unable means not able.'),
    row('wp2', 'Word part', 'What does reread mean here?', 'Jo will reread her nest notes tomorrow.', ['Read again', 'Read never', 'Read badly'], 0, 'Re- often means again.', 'Reread means read again.'),
    row('wp3', 'Word part', 'What does careful mean here?', 'Liam was careful not to shout at the cat.', ['Full of care', 'Without a voice', 'Full of cake'], 0, '-ful often means full of.', 'Careful means full of care.'),
    row('wp4', 'Word part', 'What does unfair mean here?', 'Giving the whole cake to one person would be unfair.', ['Not fair', 'Very fair', 'Fair again'], 0, 'Un- flips the word.', 'Unfair means not fair.'),
    row('wp5', 'Word part', 'What does rebuild mean here?', 'They had to rebuild the cardboard tree after it tipped.', ['Build again', 'Build never', 'Build smaller only'], 0, 'Re- means do it another time.', 'Rebuild means build again.'),
    row('wp6', 'Word part', 'What does hopeful mean here?', 'Jo felt hopeful when she saw the beak.', ['Full of hope', 'Without hope', 'Hope from yesterday only'], 0, '-ful means full of that feeling.', 'Hopeful means full of hope.'),
    row('wp7', 'Word part', 'What does unsafe mean here?', 'Dad said the flooded path was unsafe.', ['Not safe', 'Very safe', 'Safe again'], 0, 'Un- means not.', 'Unsafe means not safe.'),
    row('wp8', 'Word part', 'What does helpful mean here?', 'Nia’s leaves were helpful for the pretend tree.', ['Full of help', 'Against help', 'Help that is hidden'], 0, '-ful means full of.', 'Helpful means giving help.')
  ];

  var tinyPoem = [
    row('po1', 'Poem', 'What is the poem mostly about?', 'Rain on the path,\nRiver running high.\nBoots turn around.\nHome by another sky.', ['Changing the way home in the rain', 'A sunny picnic', 'A lost kite'], 0, '“Turn around” and “another” show a new route.', 'They go home a different way because of the rain.'),
    row('po2', 'Poem', 'What is the poem mostly about?', 'Tin, tin, little shake.\nRoof cat, wide eyes awake.\nDown the tiles, soft and slow.\nFood is waiting just below.', ['Calling a cat down with food', 'Baking bread', 'A school race'], 0, 'The tin and the cat are the whole poem.', 'The shake brings the cat down to food.'),
    row('po3', 'Poem', 'What is the poem mostly about?', 'One lemon moon on a plate.\nTwo hands wait.\nA knife makes two dawn halves.\nBoth leave happy.', ['Sharing one cake', 'Planting seeds', 'Closing a library'], 0, 'Two halves of one thing.', 'The cake is shared between two people.'),
    row('po4', 'Poem', 'What is the poem mostly about?', 'Paper drinks the night.\nMorning puts it in the light.\nCorners pinned, pale and flat.\nLines come back, just like that.', ['Drying a wet map', 'Painting a tree', 'Feeding a cat'], 0, 'Paper, light, and lines are map clues.', 'The wet paper dries until the lines show again.'),
    row('po5', 'Poem', 'What is the poem mostly about?', 'Lean, little stem, toward the glass.\nMonday fingers turn you as I pass.\nWeek by week you stand up tall.\nSun is shared. You use it all.', ['Helping a plant grow straight', 'A flooded bridge', 'A nest of eggs'], 0, 'Turning and standing tall are the story.', 'The plant stops leaning.'),
    row('po6', 'Poem', 'What is the poem mostly about?', 'Two blinks, then the clock.\nBooks shut. Quiet shoes.\nCards in a row.\nThe door knows.', ['The library closing', 'A cat on a roof', 'A bakery'], 0, 'Books, cards, and a door.', 'It is time to leave the library.'),
    row('po7', 'Poem', 'What is the poem mostly about?', 'Friday, two blue moons in a cup of sticks.\nMonday, a beak, a yellow tick.\nI only watch. I do not touch.\nHello, small life. I missed you much.', ['Waiting for a chick', 'Building a stage', 'Rounding numbers'], 0, 'Eggs, then a beak.', 'Someone waits and then sees a chick.'),
    row('po8', 'Poem', 'What is the poem mostly about?', 'Brown first, a trunk that cannot grow.\nGreen next, leaves that rustle, paper-slow.\nStand still, tree. The play will start.\nYou are made of hands and heart.', ['A pretend tree for a play', 'A real storm', 'A wet map'], 0, '“Cannot grow” and “made of hands.”', 'Children made a tree for a play.')
  ];

  var followSteps = [
    row('fl1', 'Steps', 'What do you do SECOND?', 'Steps: 1. Check the path. 2. If it is flooded, turn back. 3. Take the long road. 4. Go home.', ['Turn back if it is flooded', 'Go home', 'Check the path'], 0, 'Second means the step right after the first.', 'Step 2 is to turn back if the path is flooded.'),
    row('fl2', 'Steps', 'What do you do SECOND?', 'Steps: 1. Look up at the roof. 2. Shake the food tin softly. 3. Wait. 4. Hold the cat when it comes down.', ['Shake the food tin softly', 'Hold the cat', 'Look up'], 0, 'Do not skip to the end.', 'Step 2 is shaking the tin.'),
    row('fl3', 'Steps', 'What do you do THIRD?', 'Steps: 1. Listen to both customers. 2. Take the last cake. 3. Cut it in half. 4. Give each person a piece.', ['Cut it in half', 'Listen', 'Give each person a piece'], 0, 'Third is not the last step.', 'Step 3 is cutting the cake.'),
    row('fl4', 'Steps', 'What do you do FIRST?', 'Steps: 1. Carry the map outside. 2. Lay it on a sunny rock. 3. Hold the corners. 4. Wait until it dries.', ['Carry the map outside', 'Wait until it dries', 'Hold the corners'], 0, 'First is the beginning.', 'Step 1 is carrying the map out.'),
    row('fl5', 'Steps', 'What do you do LAST?', 'Steps: 1. Notice the lean. 2. Turn the pot. 3. Wait a week. 4. Check if the stem is straighter.', ['Check the stem', 'Notice the lean', 'Turn the pot'], 0, 'Last means step 4.', 'You check the stem at the end.'),
    row('fl6', 'Steps', 'What do you do SECOND?', 'Steps: 1. Find the nest. 2. Count the eggs. 3. Leave them alone. 4. Come back another day.', ['Count the eggs', 'Come back another day', 'Find the nest'], 0, 'Second comes right after finding it.', 'Step 2 is counting the eggs.'),
    row('fl7', 'Steps', 'What do you do THIRD?', 'Steps: 1. Paint the trunk. 2. Cut the leaves. 3. Glue the leaves on. 4. Stand the tree on stage.', ['Glue the leaves on', 'Paint the trunk', 'Stand the tree on stage'], 0, 'Glue is before the tree goes on stage.', 'Step 3 is gluing the leaves.'),
    row('fl8', 'Steps', 'What do you do LAST?', 'Steps: 1. See the lights blink. 2. Look at the clock. 3. Close your book. 4. Line up with your card.', ['Line up with your card', 'See the lights blink', 'Close your book'], 0, 'The line is the end of the routine.', 'Step 4 is lining up.')
  ];

  var writeBack = [
    row('wb1', 'Reply', 'What should Maya write back?', 'Dad’s note: “Path is flooded. Meet me at the long road gate.”', ['I will meet you at the long road gate.', 'I will swim the river.', 'I will stay on the bridge.'], 0, 'Answer the place he names.', 'She should agree to the safe meeting place.'),
    row('wb2', 'Reply', 'What should Liam write back?', 'Gran’s note: “The cat is on the shed. Can you help it down?”', ['I will try to coax the cat down.', 'I will paint the shed.', 'I will ignore the cat.'], 0, 'She asks for help with the cat.', 'His reply should be about helping the cat.'),
    row('wb3', 'Reply', 'What should a customer write back?', 'Baker’s note: “Only one cake left. I can give you half.”', ['Half is fine. Thank you.', 'I want the whole cake and the other half too.', 'Please close the shop.'], 0, 'He is offering a fair share.', 'Accepting half matches his offer.'),
    row('wb4', 'Reply', 'What should a scout write back?', 'Note: “Map is wet. Bring it to the sunny rock.”', ['I will bring the map to the rock.', 'I will leave the map in the rain.', 'I will bury the map.'], 0, 'Follow the place in the note.', 'The reply should take the map to the rock.'),
    row('wb5', 'Reply', 'What should Priya write back?', 'Note: “Your plant leans. Turn the pot toward the room.”', ['I will turn the pot.', 'I will stop looking at it.', 'I will put it in a dark box forever.'], 0, 'The note gives one clear action.', 'Turning the pot is the right reply.'),
    row('wb6', 'Reply', 'What should Jo write back?', 'Note: “Do not touch the eggs. Just look.”', ['I will only look.', 'I will take one egg home.', 'I will move the nest.'], 0, 'The note forbids touching.', 'Looking without touching is the reply.'),
    row('wb7', 'Reply', 'What should Nia write back?', 'Amir’s note: “Trunk is done. We still need leaves.”', ['I will cut the leaves.', 'I will paint another trunk.', 'I will cancel the play.'], 0, 'He says what is still missing.', 'Leaves are Nia’s job.'),
    row('wb8', 'Reply', 'What should a child write back?', 'Librarian’s note: “Lights blinked. Please line up.”', ['I will close my book and line up.', 'I will start a new chapter.', 'I will hide in the shelves.'], 0, 'The note is a closing instruction.', 'Lining up is the right answer.')
  ];

  var newsFlash = [
    row('nf1', 'News', 'What is the news?', 'This morning the bridge path closed after the river rose. Walkers used the long road.', ['The bridge path is closed', 'A new shop opened', 'School is cancelled'], 0, 'The first fact is the news.', 'The path closed because the river rose.'),
    row('nf2', 'News', 'Who is the story about?', 'Local boy Liam helped a cat off a shed roof before lunch.', ['Liam', 'The baker', 'A scout leader'], 0, 'The sentence names one helper.', 'Liam is the person who helped.'),
    row('nf3', 'News', 'Where did it happen?', 'At the bakery on Hill Street, the last lemon cake was shared by two customers.', ['At the bakery', 'At the river', 'In a tent'], 0, 'A street and a shop are named.', 'It happened at the bakery.'),
    row('nf4', 'News', 'What went wrong?', 'Camp news: a map was soaked in the night, then dried on a rock.', ['A map got wet', 'The tent won a prize', 'Nobody brought food'], 0, 'Soaked means the problem.', 'The map was soaked.'),
    row('nf5', 'News', 'What changed?', 'A windowsill plant that leaned for weeks is now growing straight.', ['The plant grew straight', 'The window broke', 'The plant was sold'], 0, '“Now” marks the change.', 'It no longer only leans.'),
    row('nf6', 'News', 'When did the chick show?', 'Nest watch: eggs on Friday, a beak on Monday morning.', ['Monday morning', 'Friday night', 'Next year'], 0, 'The beak has its own time.', 'The beak showed on Monday morning.'),
    row('nf7', 'News', 'What did the class make?', 'Stage news: students built a tree from cardboard and paper for tonight’s play.', ['A pretend tree', 'A real garden', 'A boat'], 0, 'Cardboard and paper are not a living tree.', 'They made a tree for the play.'),
    row('nf8', 'News', 'What should readers do?', 'Library notice: when the lights blink, close books and line up.', ['Close books and line up', 'Run and shout', 'Open ten new books'], 0, 'The notice gives an order.', 'Blinking lights mean pack up and line up.')
  ];

  var riddle = [
    row('ri1', 'Riddle', 'What is it?', 'I cover a path so feet turn around. I come from a river on a wet day. What am I?', ['Floodwater', 'A library card', 'A paper leaf'], 0, 'It blocks a path and comes from a river.', 'Floodwater covers the path.'),
    row('ri2', 'Riddle', 'What is it?', 'I rattle, I am full of dinner, and a roof cat climbs down for me. What am I?', ['A tin of food', 'A painted trunk', 'A clock'], 0, 'Dinner for a cat, in a tin.', 'The food tin brings the cat down.'),
    row('ri3', 'Riddle', 'What is it?', 'I was one, then a knife made me two, and both people smiled. What am I?', ['A shared cake', 'A flooded path', 'A nest'], 0, 'One thing becomes two fair pieces.', 'The cake was cut in half.'),
    row('ri4', 'Riddle', 'What is it?', 'I drank the rain. A rock and the sun gave my lines back. What am I?', ['A wet map', 'A cat', 'A lemon'], 0, 'Lines on paper that got wet.', 'The map dried in the sun.'),
    row('ri5', 'Riddle', 'What is it?', 'I leaned to the glass until someone turned my home. What am I?', ['A plant in a pot', 'A bridge', 'A book'], 0, 'Home that can be turned is a pot.', 'The plant leaned toward the window.'),
    row('ri6', 'Riddle', 'What is it?', 'I blink twice on the ceiling and everyone closes a book. What am I?', ['Library lights', 'A food tin', 'Paper leaves'], 0, 'Blinking plus books.', 'The lights signal closing time.'),
    row('ri7', 'Riddle', 'What is it?', 'On Friday I was two blue secrets. On Monday I grew a beak. What am I?', ['An egg that hatched', 'A cardboard tree', 'A cake'], 0, 'Blue secrets in a nest.', 'The eggs hatched into a chick.'),
    row('ri8', 'Riddle', 'What is it?', 'I have a trunk that cannot drink and leaves that never grow. Actors stand beside me. What am I?', ['A pretend stage tree', 'A real oak', 'A river'], 0, 'It cannot drink, so it is not alive.', 'It is the tree made for the play.')
  ];

  var whichScene = [
    row('sc1', 'Scene', 'Which scene matches?', 'Water over a bridge path. Two people turning away.', ['Maya and Dad leaving the flooded path', 'Children lining up in a library', 'A cat eating from a tin on the ground'], 0, 'Water and turning away.', 'That is the river scene.'),
    row('sc2', 'Scene', 'Which scene matches?', 'A boy below a shed, a tin in his hand, a cat above him.', ['Liam calling the cat down', 'Scouts holding a map', 'A baker with a knife'], 0, 'Shed, tin, cat.', 'That is Liam and the cat.'),
    row('sc3', 'Scene', 'Which scene matches?', 'One cake, two plates, a knife in the middle.', ['The baker sharing the cake', 'Jo at a nest', 'Amir painting alone'], 0, 'Two plates mean two people.', 'The cake is being shared.'),
    row('sc4', 'Scene', 'Which scene matches?', 'A pale map on a warm rock, four hands on the corners.', ['Scouts drying a map', 'Priya turning a pot', 'Lights blinking in a library'], 0, 'A map and a rock.', 'They are drying the map.'),
    row('sc5', 'Scene', 'Which scene matches?', 'A pot on a sill, a stem no longer bending.', ['Priya’s plant after many turns', 'A flooded bridge', 'A stage with no tree'], 0, 'A windowsill pot.', 'The plant has been straightened.'),
    row('sc6', 'Scene', 'Which scene matches?', 'Twigs, two shells the color of sky, then a small beak.', ['Jo’s nest', 'A bakery case', 'A cardboard trunk'], 0, 'Sky-colored shells are eggs.', 'This is the nest scene.'),
    row('sc7', 'Scene', 'Which scene matches?', 'A brown cardboard trunk and green paper leaves by red curtains.', ['The class play tree', 'A real garden', 'A tent in the rain'], 0, 'Curtains mean a stage.', 'The pretend tree is on stage.'),
    row('sc8', 'Scene', 'Which scene matches?', 'Blinking lights, a clock, closed books, a quiet line.', ['The library at closing time', 'A cat on a roof', 'A river path'], 0, 'Books and a line.', 'The library is closing.')
  ];

  var readingBoss = [
    row('rb1', 'Boss', 'What is this mostly about?', 'A boy, a tin, a roof, and a cat that finally climbs down.', ['Helping a stuck cat', 'Baking a cake', 'Drying a map'], 0, 'Stay with the cat.', 'The story is about getting the cat down.'),
    row('rb2', 'Boss', 'Why did they turn back?', 'Water covered the only short path.', ['The path was not safe to walk', 'They were hungry', 'The clock blinked'], 0, 'Water on a path is the reason.', 'They turned back because of the flood.'),
    row('rb3', 'Boss', 'Which word fits?', 'The map was soaked, so the lines were hard to ____.', ['read', 'hatch', 'paint'], 0, 'Wet ink is hard to see.', 'Read fits a map’s lines.'),
    row('rb4', 'Boss', 'Which sentence uses both facts?', 'The plant leaned. Priya turned the pot.', ['Turning the pot answered the lean.', 'Priya flooded the path.', 'The cat cut the cake.'], 0, 'Both the lean and the turn must matter.', 'The first choice uses both facts.'),
    row('rb5', 'Boss', 'Is this a fact or a guess?', 'Story: the lights blinked and children lined up. Line: The children were shouting.', ['A guess', 'A fact', 'The main idea'], 0, 'Shouting is not written.', 'It is only a guess.'),
    row('rb6', 'Boss', 'What does “each take a side” mean?', 'The baker smiled at the two customers.', ['Share the cake', 'Eat it tomorrow', 'Feed it to a cat'], 0, 'Two people, two sides.', 'It means sharing.'),
    row('rb7', 'Boss', 'What do you do second?', '1. Paint the trunk. 2. Cut leaves. 3. Glue them. 4. Set the tree on stage.', ['Cut leaves', 'Set the tree on stage', 'Paint the trunk'], 0, 'Second is step 2.', 'Cutting leaves is second.'),
    row('rb8', 'Boss', 'What is it?', 'I blink, then books close, then a line of quiet shoes. What am I?', ['A library closing', 'A flooded river', 'A nest'], 0, 'Books and quiet shoes.', 'It is the library at closing time.')
  ];

  global.ChallengeEn = {
    mainIdea: mainIdea,
    whyHappened: whyHappened,
    wordSentence: wordSentence,
    twoClues: twoClues,
    listenPick: listenPick,
    factGuess: factGuess,
    whatTheyWant: whatTheyWant,
    fourSteps: fourSteps,
    extraDetail: extraDetail,
    lineMeans: lineMeans,
    whereHappens: whereHappens,
    twoCharacters: twoCharacters,
    wordPart: wordPart,
    tinyPoem: tinyPoem,
    followSteps: followSteps,
    writeBack: writeBack,
    newsFlash: newsFlash,
    riddle: riddle,
    whichScene: whichScene,
    readingBoss: readingBoss
  };
})(typeof window !== 'undefined' ? window : globalThis);
