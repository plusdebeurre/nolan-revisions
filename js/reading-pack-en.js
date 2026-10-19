/**
 * Ten English reading games, end of semester 1. Six short rounds each.
 */
(function (global) {
  var bestTitle = [
    { id: 'bt1', skill: 'Title', prompt: 'Which title fits this story?', passage: 'Mia and Dad went to the park. Mia threw her red ball. A brown dog brought it back. They played until sunset.', options: ['A game with a dog', 'Mia loses her shoe', 'A day at the shop'], answer: 0, hint: 'What do Mia and the dog do for most of the story?', why: 'They play with the ball together, so the title is about a game with a dog.' },
    { id: 'bt2', skill: 'Title', prompt: 'Which title fits this story?', passage: 'Rain kept Class 2 inside. Leo built a tall tower of blocks. Nia put a paper flag on top.', options: ['Building on a rainy day', 'The swimming race', 'Nia’s new bike'], answer: 0, hint: 'They cannot go out. What do they make?', why: 'Leo builds and Nia adds a flag, on a day of rain.' },
    { id: 'bt3', skill: 'Title', prompt: 'Which title fits this story?', passage: 'Noah walked to the library with his class. He chose a big blue book about dinosaurs. He will read it tonight.', options: ['Noah’s dinosaur book', 'A football match', 'Soup for dinner'], answer: 0, hint: 'What does Noah choose, and what is it about?', why: 'The whole story is about the dinosaur book he gets.' },
    { id: 'bt4', skill: 'Title', prompt: 'Which title fits this story?', passage: 'Sam set a seed by the sunny window. Every morning he added a little water. A green stem came up, and Sam smiled.', options: ['A seed starts to grow', 'Sam’s new kite', 'The broken window'], answer: 0, hint: 'Follow the seed from the start to the end.', why: 'He plants it, waters it, and a stem appears.' },
    { id: 'bt5', skill: 'Title', prompt: 'Which title fits this story?', passage: 'Lea was hungry after school. Mom said she could have the apple, not the cake. Lea ate the apple on the sofa.', options: ['Lea’s apple snack', 'The birthday cake', 'A ride on the bus'], answer: 0, hint: 'Which food does Lea really eat?', why: 'She eats the apple, so that is what the story is about.' },
    { id: 'bt6', skill: 'Title', prompt: 'Which title fits this story?', passage: 'Rain fell on the garden. Minou the cat ran inside. Tom dried him with a towel, and Minou purred.', options: ['A wet cat comes in', 'Minou learns to swim', 'Tom buys a hat'], answer: 0, hint: 'Where was the cat, and what does Tom do?', why: 'The cat was out in the rain and comes in to be dried.' }
  ];

  var trueFalse = [
    { id: 'tf1', skill: 'True or false', prompt: 'Is this sentence true?', passage: 'Mia threw her red ball at the park. A dog brought it back and they played.', lead: 'Mia threw a red ball.', options: ['True', 'False'], answer: 0, hint: 'Check the color of the ball in the story.', why: 'The story says Mia threw her red ball. True.' },
    { id: 'tf2', skill: 'True or false', prompt: 'Is this sentence true?', passage: 'Mia threw her red ball at the park. A dog brought it back and they played.', lead: 'The dog ran away with the ball.', options: ['True', 'False'], answer: 1, hint: 'What happens after the dog gets the ball?', why: 'The dog brought it back and they played. The sentence is false.' },
    { id: 'tf3', skill: 'True or false', prompt: 'Is this sentence true?', passage: 'It rained, so Class 2 stayed inside. Leo built a tower.', lead: 'Class 2 played outside in the rain.', options: ['True', 'False'], answer: 1, hint: 'Did the rain send them out or keep them in?', why: 'They stayed inside. The sentence is false.' },
    { id: 'tf4', skill: 'True or false', prompt: 'Is this sentence true?', passage: 'It rained, so Class 2 stayed inside. Leo built a tower. Nia put a flag on top.', lead: 'Leo built a tower.', options: ['True', 'False'], answer: 0, hint: 'Find the sentence about Leo.', why: 'The story says Leo built a tower. True.' },
    { id: 'tf5', skill: 'True or false', prompt: 'Is this sentence true?', passage: 'Noah chose a book about dinosaurs. The librarian gave him a big blue one.', lead: 'The book is about trucks.', options: ['True', 'False'], answer: 1, hint: 'What topic does Noah want?', why: 'The book is about dinosaurs, not trucks. False.' },
    { id: 'tf6', skill: 'True or false', prompt: 'Is this sentence true?', passage: 'A green stem came up by the window. Sam smiled.', lead: 'Sam smiled at the end.', options: ['True', 'False'], answer: 0, hint: 'Look at the last sentence.', why: 'Sam smiled. True.' }
  ];

  var whoSaid = [
    { id: 'ws1', skill: 'Who', prompt: 'Who said this?', passage: 'At breakfast Mom said, “Eat your toast.” Dad said, “I will walk you to school.” Mia said, “I want jam.”', lead: '“I will walk you to school.”', options: ['Dad', 'Mom', 'Mia'], answer: 0, hint: 'Find these words and read the name just before them.', why: 'Dad said he would walk Mia to school.' },
    { id: 'ws2', skill: 'Who', prompt: 'Who said this?', passage: 'Ms Kim said, “Line up quietly.” Jo said, “I forgot my book.” Leo said, “I can share.”', lead: '“I forgot my book.”', options: ['Jo', 'Ms Kim', 'Leo'], answer: 0, hint: 'Who is talking about a book they forgot?', why: 'Jo said, “I forgot my book.”' },
    { id: 'ws3', skill: 'Who', prompt: 'Who said this?', passage: 'The librarian said, “This book is about dinosaurs.” Noah said, “I will take it.” His friend said, “I want a comic.”', lead: '“This book is about dinosaurs.”', options: ['The librarian', 'Noah', 'His friend'], answer: 0, hint: 'Who knows what the book is about?', why: 'The librarian tells them the topic.' },
    { id: 'ws4', skill: 'Who', prompt: 'Who said this?', passage: 'Mom said, “You may have the apple.” Lea said, “Thank you.” Dad said, “Save the cake for later.”', lead: '“Save the cake for later.”', options: ['Dad', 'Mom', 'Lea'], answer: 0, hint: 'Who talks about the cake?', why: 'Dad said to save the cake.' },
    { id: 'ws5', skill: 'Who', prompt: 'Who said this?', passage: 'Tom said, “Minou is all wet.” Mia said, “I will get a towel.” Minou just purred.', lead: '“I will get a towel.”', options: ['Mia', 'Tom', 'Minou'], answer: 0, hint: 'Who offers to fetch something?', why: 'Mia said she would get a towel.' },
    { id: 'ws6', skill: 'Who', prompt: 'Who said this?', passage: 'Coach said, “Hop on one foot.” Nia said, “This is fun.” Leo said, “My lace is loose.”', lead: '“My lace is loose.”', options: ['Leo', 'Coach', 'Nia'], answer: 0, hint: 'Who talks about a shoe problem?', why: 'Leo said his lace was loose.' }
  ];

  var storyOrder = [
    { id: 'so1', skill: 'Order', prompt: 'Tap the events in the order they happen.', passage: 'Mia put on her boots. Then she opened the door. She jumped in a puddle.', steps: ['She puts on her boots', 'She opens the door', 'She jumps in a puddle'], hint: 'What must she do before she can go outside?', why: 'Boots first, then the door, then the puddle.' },
    { id: 'so2', skill: 'Order', prompt: 'Tap the events in the order they happen.', passage: 'Leo stacked ten blocks. Nia set a flag on the tower. The class clapped.', steps: ['Leo stacks the blocks', 'Nia adds a flag', 'The class claps'], hint: 'The tower has to exist before the flag.', why: 'Build, then the flag, then the clap.' },
    { id: 'so3', skill: 'Order', prompt: 'Tap the events in the order they happen.', passage: 'Noah walked to the library. He chose a dinosaur book. He read it in bed that night.', steps: ['He walks to the library', 'He chooses a book', 'He reads it at night'], hint: 'He cannot read the book before he picks it.', why: 'Library, then the book, then bedtime reading.' },
    { id: 'so4', skill: 'Order', prompt: 'Tap the events in the order they happen.', passage: 'Sam pressed a seed into the pot. Each morning he watered it. A green stem came up.', steps: ['He plants the seed', 'He waters it', 'A stem comes up'], hint: 'The plant cannot appear before it is planted.', why: 'Plant, water, then the stem.' },
    { id: 'so5', skill: 'Order', prompt: 'Tap the events in the order they happen.', passage: 'The cup tipped over. Milk ran across the table. Nora wiped it with a cloth.', steps: ['The cup tips', 'Milk runs on the table', 'Nora wipes it up'], hint: 'The spill happens before anyone cleans.', why: 'Tip, spill, then wipe.' },
    { id: 'so6', skill: 'Order', prompt: 'Tap the events in the order they happen.', passage: 'First the children washed their hands. Next they set the forks. Then they ate soup.', steps: ['They wash their hands', 'They set the forks', 'They eat soup'], hint: 'Hands come before the meal.', why: 'Wash, set the table, then eat.' }
  ];

  var oddSentence = [
    { id: 'od1', skill: 'Odd one out', prompt: 'Which sentence does NOT belong?', passage: 'We sat on a rug in the park. We ate apples. Mom told a funny story.', options: ['We sat on a rug.', 'We ate apples.', 'A whale jumped on the rug.', 'Mom told a funny story.'], answer: 2, hint: 'Three lines are in the picnic. One is a silly extra.', why: 'A whale is not part of this park picnic.' },
    { id: 'od2', skill: 'Odd one out', prompt: 'Which sentence does NOT belong?', passage: 'Minou came in from the rain. Tom used a towel. The cat purred.', options: ['Minou came inside.', 'Tom used a towel.', 'The cat purred.', 'Minou drove a bus.'], answer: 3, hint: 'A cat in this story does quiet, cozy things.', why: 'Minou does not drive a bus.' },
    { id: 'od3', skill: 'Odd one out', prompt: 'Which sentence does NOT belong?', passage: 'Class 2 stayed inside because of the rain. Leo built a tower. Nia added a flag.', options: ['They stayed inside.', 'Leo built a tower.', 'They swam in the sea.', 'Nia added a flag.'], answer: 2, hint: 'The rain keeps them indoors.', why: 'Nobody swims in the sea in this story.' },
    { id: 'od4', skill: 'Odd one out', prompt: 'Which sentence does NOT belong?', passage: 'Noah picked a blue dinosaur book. He will read it tonight in bed.', options: ['The book is blue.', 'It is about dinosaurs.', 'He will read it tonight.', 'He cooked a pizza.'], answer: 3, hint: 'Stay with the library visit.', why: 'Cooking a pizza is not in the story.' },
    { id: 'od5', skill: 'Odd one out', prompt: 'Which sentence does NOT belong?', passage: 'Lea was hungry. She ate an apple. Then she read on the sofa.', options: ['Lea was hungry.', 'She ate an apple.', 'She read on the sofa.', 'She flew a rocket.'], answer: 3, hint: 'Her afternoon is quiet and at home.', why: 'A rocket is not in the story.' },
    { id: 'od6', skill: 'Odd one out', prompt: 'Which sentence does NOT belong?', passage: 'Sam watered a seed by the window. A green stem came up. Sam smiled.', options: ['The pot was by the window.', 'He watered the seed.', 'A stem came up.', 'The seed sang a song.'], answer: 3, hint: 'Seeds grow. They do not perform.', why: 'A seed cannot sing. That line does not belong.' }
  ];

  var feelingFaces = [
    { id: 'ff1', skill: 'Feeling', prompt: 'How does Sam feel at the end?', passage: 'A small green stem came up. Sam smiled.', options: ['😄 Happy', '😢 Sad', '😮 Surprised', '😟 Worried'], answer: 0, hint: 'Look at his face in the last sentence.', why: 'Sam smiled, so he is happy.' },
    { id: 'ff2', skill: 'Feeling', prompt: 'How does Mina feel?', passage: 'Mina could not find her bear. Her eyes were wet.', options: ['😄 Happy', '😢 Sad', '😄 Proud', '😴 Sleepy'], answer: 1, hint: 'Wet eyes usually mean a sad feeling.', why: 'She cannot find her bear and her eyes are wet, so she is sad.' },
    { id: 'ff3', skill: 'Feeling', prompt: 'How does Jo feel?', passage: 'The balloon popped beside Jo. She jumped and said, “Oh!”', options: ['😮 Surprised', '😠 Angry', '😴 Sleepy', '😋 Hungry'], answer: 0, hint: 'A sudden pop can make someone jump.', why: 'She jumps and says “Oh!” so she is surprised.' },
    { id: 'ff4', skill: 'Feeling', prompt: 'How does Tim feel?', passage: 'The sky turned dark. Tim held Mom’s hand and stayed close.', options: ['😟 Worried', '😄 Silly', '😎 Cool', '🤪 Goofy'], answer: 0, hint: 'He stays close when the sky changes.', why: 'Holding on and staying close shows he is worried.' },
    { id: 'ff5', skill: 'Feeling', prompt: 'How does Nia feel?', passage: 'Nia crossed the finish line first. She threw both arms up.', options: ['🏆 Proud', '😢 Sad', '😨 Scared', '😑 Bored'], answer: 0, hint: 'Finishing first and lifting your arms is a happy win.', why: 'She finished first and celebrated, so she feels proud and happy.' },
    { id: 'ff6', skill: 'Feeling', prompt: 'How does Leo feel?', passage: 'Leo’s tower fell over. He looked at the blocks and sighed.', options: ['😞 Disappointed', '😄 Excited', '🤗 Loved', '🤪 Silly'], answer: 0, hint: 'A sigh after something falls is not a cheer.', why: 'His tower fell and he sighed, so he is disappointed.' }
  ];

  var whatNext = [
    { id: 'wn1', skill: 'What next', prompt: 'What happens next?', passage: 'The cup tipped. Milk ran to the edge of the table. Nora grabbed a cloth.', options: ['Nora wipes the milk', 'Nora goes to sleep', 'Nora paints a picture'], answer: 0, hint: 'She already picked up the cloth. What is it for?', why: 'A cloth after a spill means she wipes the milk.' },
    { id: 'wn2', skill: 'What next', prompt: 'What happens next?', passage: 'Dark clouds covered the sun. Mom looked up and called, “Toys inside!”', options: ['They bring the toys in', 'They jump in the pool', 'They start a picnic'], answer: 0, hint: 'Listen to what Mom calls.', why: 'Mom tells them to take the toys inside before the rain.' },
    { id: 'wn3', skill: 'What next', prompt: 'What happens next?', passage: 'The librarian handed Noah a dinosaur book. Noah hugged it and walked to the checkout desk.', options: ['He borrows the book', 'He puts the book in the bin', 'He feeds the dinosaurs'], answer: 0, hint: 'The checkout desk is where you borrow books.', why: 'He is going to check the book out and take it home.' },
    { id: 'wn4', skill: 'What next', prompt: 'What happens next?', passage: 'Ben’s lace was loose. He stopped on the path and bent down.', options: ['He ties his lace', 'He buys new shoes', 'He climbs a mountain'], answer: 0, hint: 'People bend down when a lace needs fixing.', why: 'A loose lace and bending down means he ties it.' },
    { id: 'wn5', skill: 'What next', prompt: 'What happens next?', passage: 'The bread popped up. Dad reached for the butter.', options: ['He butters the toast', 'He washes the car', 'He mails a letter'], answer: 0, hint: 'Butter is for the hot bread.', why: 'Toast plus butter means he butters the toast.' },
    { id: 'wn6', skill: 'What next', prompt: 'What happens next?', passage: 'The baby rubbed her eyes and yawned. Mom turned down the lamp.', options: ['The baby goes to sleep', 'The baby goes swimming', 'The baby reads a long book'], answer: 0, hint: 'Yawns and a dim lamp point to bedtime.', why: 'She is tired, so she goes to sleep.' }
  ];

  var wordTap = [
    { id: 'wt1', skill: 'Word', prompt: 'Tap the word that tells WHERE Ben left his hat.', sentence: 'Ben left his hat at school.', answer: 'school', hint: 'A place word answers where.', why: 'He left the hat at school.' },
    { id: 'wt2', skill: 'Word', prompt: 'Tap the word that tells WHAT color the ball is.', sentence: 'Mia threw her red ball.', answer: 'red', hint: 'Color words tell how something looks.', why: 'The ball is red.' },
    { id: 'wt3', skill: 'Word', prompt: 'Tap the word that tells WHO built the tower.', sentence: 'Leo built a tall tower.', answer: 'Leo', hint: 'The name is at the start.', why: 'Leo built the tower.' },
    { id: 'wt4', skill: 'Word', prompt: 'Tap the word that tells WHEN Noah will read.', sentence: 'Noah will read the book tonight.', answer: 'tonight', hint: 'Time words tell when.', why: 'He will read tonight.' },
    { id: 'wt5', skill: 'Word', prompt: 'Tap the word that tells WHAT Lea ate.', sentence: 'Lea ate a sweet apple.', answer: 'apple', hint: 'Look for the food.', why: 'She ate an apple.' },
    { id: 'wt6', skill: 'Word', prompt: 'Tap the word that shows HOW Sam feels.', sentence: 'Sam smiled at his plant.', answer: 'smiled', hint: 'A face action can show a feeling.', why: 'He smiled, so he feels glad.' }
  ];

  var sameStory = [
    { id: 'ss1', skill: 'Same', prompt: 'What is the same in both stories?', lead: 'Story A: The cat naps in the sun.', passage: 'Story B: The dog naps in the sun.', options: ['They nap in the sun', 'They are both cats', 'They swim in a pond'], answer: 0, hint: 'Find the part that is written in BOTH stories.', why: 'Both animals nap in the sun.' },
    { id: 'ss2', skill: 'Same', prompt: 'What is the same in both stories?', lead: 'Story A: Jo reads a book in bed.', passage: 'Story B: Amir reads a book in bed.', options: ['They read in bed', 'They read at the park', 'They are the same child'], answer: 0, hint: 'Where and what do both children do?', why: 'Both children read a book in bed.' },
    { id: 'ss3', skill: 'Same', prompt: 'What is the same in both stories?', lead: 'Story A: The red bus stops at school.', passage: 'Story B: The yellow bus stops at school.', options: ['They stop at school', 'They are both red', 'They fly in the sky'], answer: 0, hint: 'The colors differ. What place is the same?', why: 'Both buses stop at school.' },
    { id: 'ss4', skill: 'Same', prompt: 'What is the same in both stories?', lead: 'Story A: Mom packs an apple for lunch.', passage: 'Story B: Dad packs an apple for lunch.', options: ['An apple is for lunch', 'Dad packs both lunches', 'They pack cake'], answer: 0, hint: 'Which food shows up twice?', why: 'Both pack an apple for lunch.' },
    { id: 'ss5', skill: 'Same', prompt: 'What is the same in both stories?', lead: 'Story A: A bird sits on the fence and sings.', passage: 'Story B: A bird sits on the roof and sings.', options: ['A bird sings', 'They sit in the same place', 'A cat sings'], answer: 0, hint: 'The places differ. What does each bird do?', why: 'Both birds sing.' },
    { id: 'ss6', skill: 'Same', prompt: 'What is the same in both stories?', lead: 'Story A: We wash our hands before lunch.', passage: 'Story B: We wash our hands before dinner.', options: ['They wash their hands', 'Both meals are lunch', 'They skip the soap'], answer: 0, hint: 'The meals differ. What action is shared?', why: 'In both stories they wash their hands.' }
  ];

  var endingPicker = [
    { id: 'ep1', skill: 'Ending', prompt: 'Which ending fits?', passage: 'Leo looked under the bed. He looked in his bag. Then he looked under the chair and saw a yellow pencil.', options: ['He had found his pencil.', 'He bought a new bike.', 'It started to snow in the kitchen.'], answer: 0, hint: 'What did he see under the chair?', why: 'He was looking for the pencil and then saw it.' },
    { id: 'ep2', skill: 'Ending', prompt: 'Which ending fits?', passage: 'The kite string slipped from Ben’s hand. The kite rose over the tree and caught on a branch.', options: ['The kite was stuck in the tree.', 'Ben ate the kite.', 'The kite became a fish.'], answer: 0, hint: 'Where did the kite stop?', why: 'It caught on a branch, so it is stuck in the tree.' },
    { id: 'ep3', skill: 'Ending', prompt: 'Which ending fits?', passage: 'Nora planted seeds in a row. She watered them every day. Tiny leaves opened in the soil.', options: ['Her plants were starting to grow.', 'The seeds turned into shoes.', 'She moved to the moon.'], answer: 0, hint: 'Leaves in the soil mean the seeds are doing their job.', why: 'Tiny leaves mean the plants are growing.' },
    { id: 'ep4', skill: 'Ending', prompt: 'Which ending fits?', passage: 'The score was tied. Nia kicked the ball. It rolled past the last cone.', options: ['Nia scored the winning goal.', 'The ball melted.', 'Everyone went swimming.'], answer: 0, hint: 'A ball that passes the last cone in a game is a point.', why: 'She kicked it past the cone, so she scored.' },
    { id: 'ep5', skill: 'Ending', prompt: 'Which ending fits?', passage: 'Dad opened the oven. The smell of cookies filled the kitchen. He set the tray on the counter to cool.', options: ['The cookies needed to cool.', 'Dad baked a snowman.', 'The oven was full of books.'], answer: 0, hint: 'Why does he set the tray down?', why: 'Hot cookies from the oven need to cool.' },
    { id: 'ep6', skill: 'Ending', prompt: 'Which ending fits?', passage: 'Mia heard a meow at the door. She opened it and Minou rubbed her legs, still damp from the rain.', options: ['Minou wanted to come in.', 'A lion asked for tea.', 'Mia closed the door and left.'], answer: 0, hint: 'A meow at the door plus rubbing legs is a hello.', why: 'The cat is at the door and greets her, so he wants to come in.' }
  ];

  global.ReadingPackEn = {
    bestTitle: bestTitle,
    trueFalse: trueFalse,
    whoSaid: whoSaid,
    storyOrder: storyOrder,
    oddSentence: oddSentence,
    feelingFaces: feelingFaces,
    whatNext: whatNext,
    wordTap: wordTap,
    sameStory: sameStory,
    endingPicker: endingPicker
  };
})(typeof window !== 'undefined' ? window : globalThis);
