/**
 * End of semester 1 reading banks (Grade 2 / CE2).
 * Short texts, mostly explicit who / what / where / when, plus a simple feeling.
 * Choice games shuffle answer order. Sentence games stay in story order.
 */
(function (global) {
  var storySleuth = [
    {
      id: 'park-where',
      skill: 'Where',
      passage: 'Mia and her dad went to the park after school. Mia took her red ball. She threw it, and a brown dog ran after it. Dad said the dog wanted to play. Mia laughed and rolled the ball again.',
      ask: 'Where did Mia and her dad go?',
      options: ['To the park', 'To the library', 'To the shop'],
      answer: 0,
      hint: 'Look at the first sentence. Where do they go after school?',
      why: 'The story says they went to the park after school.'
    },
    {
      id: 'park-color',
      skill: 'What',
      passage: 'Mia and her dad went to the park after school. Mia took her red ball. She threw it, and a brown dog ran after it. Dad said the dog wanted to play. Mia laughed and rolled the ball again.',
      ask: 'What color is Mia’s ball?',
      options: ['Red', 'Blue', 'Yellow'],
      answer: 0,
      hint: 'Find the color word right next to the ball.',
      why: 'Mia took her red ball.'
    },
    {
      id: 'rain-where',
      skill: 'Where',
      passage: 'It rained all morning, so Class 2 stayed inside. Ms. Kim said they could read or build. Leo built a tall tower with blocks. Nia put a paper flag on top.',
      ask: 'Where did Class 2 stay?',
      options: ['Inside', 'On the playground', 'At the pool'],
      answer: 0,
      hint: 'The rain changes the plan. Do they go out or stay in?',
      why: 'It rained, so Class 2 stayed inside.'
    },
    {
      id: 'rain-who',
      skill: 'Who',
      passage: 'It rained all morning, so Class 2 stayed inside. Ms. Kim said they could read or build. Leo built a tall tower with blocks. Nia put a paper flag on top.',
      ask: 'Who put the flag on the tower?',
      options: ['Nia', 'Leo', 'Ms. Kim'],
      answer: 0,
      hint: 'Leo builds the tower. Who puts something on top?',
      why: 'Nia put a paper flag on top of the tower.'
    },
    {
      id: 'library-what',
      skill: 'What',
      passage: 'On Tuesday, Noah’s class walked to the library. Noah wanted a book about dinosaurs. The librarian gave him a big blue book. He will read it tonight in his bed.',
      ask: 'What is Noah’s book about?',
      options: ['Dinosaurs', 'Trucks', 'The ocean'],
      answer: 0,
      hint: 'Noah tells us the topic he wants.',
      why: 'Noah wanted a book about dinosaurs.'
    },
    {
      id: 'library-when',
      skill: 'When',
      passage: 'On Tuesday, Noah’s class walked to the library. Noah wanted a book about dinosaurs. The librarian gave him a big blue book. He will read it tonight in his bed.',
      ask: 'When will Noah read the book?',
      options: ['Tonight', 'Tomorrow morning', 'At lunch'],
      answer: 0,
      hint: 'Look at the last sentence for a time word.',
      why: 'He will read it tonight in his bed.'
    },
    {
      id: 'seed-where',
      skill: 'Where',
      passage: 'Sam put a seed in a pot. He set the pot by the sunny window. Every morning he poured a little water on the soil. A small green stem came up. Sam smiled.',
      ask: 'Where did Sam put the pot?',
      options: ['By the window', 'In the fridge', 'Under the bed'],
      answer: 0,
      hint: 'He wants the seed to get sun. Where does he set the pot?',
      why: 'Sam set the pot by the sunny window.'
    },
    {
      id: 'seed-feel',
      skill: 'Feeling',
      passage: 'Sam put a seed in a pot. He set the pot by the sunny window. Every morning he poured a little water on the soil. A small green stem came up. Sam smiled.',
      ask: 'How does Sam feel at the end?',
      options: ['Happy', 'Sad', 'Scared'],
      answer: 0,
      hint: 'Look at what Sam’s face does in the last sentence.',
      why: 'Sam smiled, so he feels happy.'
    },
    {
      id: 'snack-what',
      skill: 'What',
      passage: 'After school, Lea was hungry. In the kitchen there was an apple and a cake. Mom said Lea could have the apple. Lea ate the apple. Then she sat on the sofa and read a book.',
      ask: 'What did Lea eat?',
      options: ['The apple', 'The cake', 'A sandwich'],
      answer: 0,
      hint: 'Mom names the snack Lea may take. Then Lea eats it.',
      why: 'Mom said Lea could have the apple, and Lea ate the apple.'
    },
    {
      id: 'snack-where',
      skill: 'Where',
      passage: 'After school, Lea was hungry. In the kitchen there was an apple and a cake. Mom said Lea could have the apple. Lea ate the apple. Then she sat on the sofa and read a book.',
      ask: 'Where did Lea read?',
      options: ['On the sofa', 'At her desk', 'On the bus'],
      answer: 0,
      hint: 'After the snack, where does she sit?',
      why: 'Lea sat on the sofa and read a book.'
    },
    {
      id: 'cat-why',
      skill: 'Why',
      passage: 'Rain fell on the garden. Tom’s cat Minou was outside. Tom opened the door and Minou ran in. Tom dried the cat with a towel. Minou purred.',
      ask: 'Why did Tom dry Minou?',
      options: ['Minou was in the rain', 'Minou had a bath', 'Minou went swimming'],
      answer: 0,
      hint: 'Check the weather and where the cat was.',
      why: 'Rain fell and Minou was outside, so Tom dried him.'
    },
    {
      id: 'cat-what',
      skill: 'What',
      passage: 'Rain fell on the garden. Tom’s cat Minou was outside. Tom opened the door and Minou ran in. Tom dried the cat with a towel. Minou purred.',
      ask: 'What did Tom use to dry Minou?',
      options: ['A towel', 'A blanket', 'A shirt'],
      answer: 0,
      hint: 'Find the thing Tom uses after Minou comes in.',
      why: 'Tom dried the cat with a towel.'
    }
  ];

  var sentenceClue = [
    {
      id: 'lunch-where',
      skill: 'Where',
      ask: 'Tap the sentence that tells where they sat.',
      sentences: [
        'The sun was warm.',
        'They sat under a big tree.',
        'Mom opened a basket.',
        'Everyone ate a sandwich.'
      ],
      answer: 1,
      hint: 'Look for a place word, like under something.',
      why: '“They sat under a big tree” tells the place.'
    },
    {
      id: 'kite-who',
      skill: 'Who',
      ask: 'Tap the sentence that tells who stood on the stool.',
      sentences: [
        'The kite was stuck in a tree.',
        'Ben could not reach it.',
        'His sister stood on a stool.',
        'She got the kite down.'
      ],
      answer: 2,
      hint: 'One sentence names the helper and what she stood on.',
      why: 'His sister stood on a stool.'
    },
    {
      id: 'fish-when',
      skill: 'When',
      ask: 'Tap the sentence that tells when Priya feeds her fish.',
      sentences: [
        'School ends at three.',
        'After school, Priya feeds her fish.',
        'The fish are orange.',
        'She gives them a pinch of food.'
      ],
      answer: 1,
      hint: 'Find the sentence that starts with a time.',
      why: 'She feeds them after school.'
    },
    {
      id: 'pencil-feel',
      skill: 'Feeling',
      ask: 'Tap the sentence that shows Jack is happy.',
      sentences: [
        'Jack lost his pencil.',
        'He looked in his bag.',
        'He found it under his chair.',
        'Jack smiled.'
      ],
      answer: 3,
      hint: 'A face can show a feeling. Which sentence does that?',
      why: 'Jack smiled, so he is happy.'
    },
    {
      id: 'bag-color',
      skill: 'What',
      ask: 'Tap the sentence that tells the colors of the backpack.',
      sentences: [
        'Ana has a new backpack.',
        'It is green with a yellow star.',
        'She puts her lunch inside.',
        'Then she walks to the bus.'
      ],
      answer: 1,
      hint: 'Color words name how something looks.',
      why: 'The backpack is green with a yellow star.'
    },
    {
      id: 'milk-what',
      skill: 'What',
      ask: 'Tap the sentence that tells what spilled.',
      sentences: [
        'The cup tipped over.',
        'Milk spilled on the table.',
        'Nora got a cloth.',
        'She wiped the table.'
      ],
      answer: 1,
      hint: 'Look for the thing that landed on the table.',
      why: 'Milk spilled on the table.'
    },
    {
      id: 'birds-howmany',
      skill: 'What',
      ask: 'Tap the sentence that tells how many birds stayed.',
      sentences: [
        'Three birds sat on the fence.',
        'One bird flew away.',
        'Two birds stayed.',
        'They sang a short song.'
      ],
      answer: 2,
      hint: '“Stayed” is the clue. Which sentence uses that idea?',
      why: 'Two birds stayed.'
    },
    {
      id: 'toys-what',
      skill: 'What',
      ask: 'Tap the sentence that tells what they did with the toys.',
      sentences: [
        'Dark clouds filled the sky.',
        'Dad said a storm was coming.',
        'We took the toys inside.',
        'Then we shut the window.'
      ],
      answer: 2,
      hint: 'Find the sentence that talks about the toys.',
      why: 'They took the toys inside.'
    },
    {
      id: 'rabbit-name',
      skill: 'Who',
      ask: 'Tap the sentence that tells the rabbit’s name.',
      sentences: [
        'Omar has a rabbit named Snow.',
        'Snow lives in a hutch.',
        'Omar brings him fresh grass.',
        'The rabbit wiggles his nose.'
      ],
      answer: 0,
      hint: 'The word “named” introduces a name.',
      why: 'The rabbit is named Snow.'
    },
    {
      id: 'hands-first',
      skill: 'When',
      ask: 'Tap the sentence that tells what they did first.',
      sentences: [
        'First, we washed our hands.',
        'Next, we set the forks on the table.',
        'Mom carried the soup.',
        'We ate together.'
      ],
      answer: 0,
      hint: 'Order words like first and next help you.',
      why: 'First, they washed their hands.'
    }
  ];

  var lectureMaligne = [
    {
      id: 'gouter-quoi',
      skill: 'Quoi',
      passage: 'Après l’école, Léa a faim. Dans la cuisine, il y a une pomme et un gâteau. Maman dit que Léa peut prendre la pomme. Léa mange la pomme. Ensuite, elle lit sur le canapé.',
      ask: 'Que mange Léa ?',
      options: ['La pomme', 'Le gâteau', 'Une banane'],
      answer: 0,
      hint: 'Maman nomme le goûter. Léa le mange juste après.',
      why: 'Maman dit que Léa peut prendre la pomme, et Léa mange la pomme.'
    },
    {
      id: 'gouter-ou',
      skill: 'Où',
      passage: 'Après l’école, Léa a faim. Dans la cuisine, il y a une pomme et un gâteau. Maman dit que Léa peut prendre la pomme. Léa mange la pomme. Ensuite, elle lit sur le canapé.',
      ask: 'Où est-ce que Léa lit ?',
      options: ['Sur le canapé', 'Dans le bus', 'Dans la cour'],
      answer: 0,
      hint: 'Regarde la dernière phrase : où s’assoit-elle pour lire ?',
      why: 'Léa lit sur le canapé.'
    },
    {
      id: 'chat-pourquoi',
      skill: 'Pourquoi',
      passage: 'Il pleut sur le jardin. Minou, le chat de Tom, est dehors. Tom ouvre la porte et Minou entre. Tom le sèche avec une serviette. Minou ronronne.',
      ask: 'Pourquoi Tom sèche-t-il Minou ?',
      options: ['Minou était sous la pluie', 'Minou a pris un bain', 'Minou a nagé'],
      answer: 0,
      hint: 'Regarde le temps qu’il fait et où est le chat.',
      why: 'Il pleut et Minou est dehors, alors Tom le sèche.'
    },
    {
      id: 'chat-quoi',
      skill: 'Quoi',
      passage: 'Il pleut sur le jardin. Minou, le chat de Tom, est dehors. Tom ouvre la porte et Minou entre. Tom le sèche avec une serviette. Minou ronronne.',
      ask: 'Avec quoi Tom sèche-t-il Minou ?',
      options: ['Une serviette', 'Un manteau', 'Un livre'],
      answer: 0,
      hint: 'Cherche l’objet que Tom utilise quand le chat entre.',
      why: 'Tom le sèche avec une serviette.'
    },
    {
      id: 'ballon-ou',
      skill: 'Où',
      passage: 'Inès joue au ballon dans la cour. Le ballon roule sous la voiture. Inès ne peut pas l’attraper. Papa avance un peu la voiture. Inès dit merci.',
      ask: 'Où roule le ballon ?',
      options: ['Sous la voiture', 'Sur le toit', 'Dans la maison'],
      answer: 0,
      hint: 'Le ballon part tout seul. Où s’arrête-t-il ?',
      why: 'Le ballon roule sous la voiture.'
    },
    {
      id: 'ballon-qui',
      skill: 'Qui',
      passage: 'Inès joue au ballon dans la cour. Le ballon roule sous la voiture. Inès ne peut pas l’attraper. Papa avance un peu la voiture. Inès dit merci.',
      ask: 'Qui aide Inès ?',
      options: ['Papa', 'Maman', 'Un voisin'],
      answer: 0,
      hint: 'Quelqu’un bouge la voiture. Qui est-ce ?',
      why: 'Papa avance un peu la voiture pour aider Inès.'
    },
    {
      id: 'biblio-quoi',
      skill: 'Quoi',
      passage: 'Mardi, la classe de Noah va à la bibliothèque. Noah veut un livre sur les dinosaures. La bibliothécaire lui donne un grand livre bleu. Il le lira ce soir dans son lit.',
      ask: 'De quoi parle le livre que Noah veut ?',
      options: ['Des dinosaures', 'Des chats', 'De la mer'],
      answer: 0,
      hint: 'Noah dit le sujet qu’il cherche.',
      why: 'Noah veut un livre sur les dinosaures.'
    },
    {
      id: 'biblio-quand',
      skill: 'Quand',
      passage: 'Mardi, la classe de Noah va à la bibliothèque. Noah veut un livre sur les dinosaures. La bibliothécaire lui donne un grand livre bleu. Il le lira ce soir dans son lit.',
      ask: 'Quand va-t-il lire le livre ?',
      options: ['Ce soir', 'Demain matin', 'À la récréation'],
      answer: 0,
      hint: 'La dernière phrase donne un moment de la journée.',
      why: 'Il le lira ce soir dans son lit.'
    },
    {
      id: 'graine-ou',
      skill: 'Où',
      passage: 'Sam met une graine dans un pot. Il pose le pot près de la fenêtre, au soleil. Chaque matin, il verse un peu d’eau. Une petite tige verte sort. Sam sourit.',
      ask: 'Où Sam pose-t-il le pot ?',
      options: ['Près de la fenêtre', 'Dans le frigo', 'Sous le lit'],
      answer: 0,
      hint: 'Il veut du soleil pour la graine. Où met-il le pot ?',
      why: 'Sam pose le pot près de la fenêtre.'
    },
    {
      id: 'graine-sentiment',
      skill: 'Sentiment',
      passage: 'Sam met une graine dans un pot. Il pose le pot près de la fenêtre, au soleil. Chaque matin, il verse un peu d’eau. Une petite tige verte sort. Sam sourit.',
      ask: 'Comment se sent Sam à la fin ?',
      options: ['Content', 'Triste', 'En colère'],
      answer: 0,
      hint: 'Regarde ce que fait son visage dans la dernière phrase.',
      why: 'Sam sourit, donc il est content.'
    },
    {
      id: 'anniv-age',
      skill: 'Quoi',
      passage: 'C’est l’anniversaire de Chloé. Elle a sept ans. Ses amis apportent des ballons rouges. Ils mangent un gâteau au chocolat. Puis ils jouent à cache-cache dans le jardin.',
      ask: 'Quel âge a Chloé ?',
      options: ['Sept ans', 'Cinq ans', 'Dix ans'],
      answer: 0,
      hint: 'L’âge est un nombre au début de l’histoire.',
      why: 'Chloé a sept ans.'
    },
    {
      id: 'anniv-jeu',
      skill: 'Quoi',
      passage: 'C’est l’anniversaire de Chloé. Elle a sept ans. Ses amis apportent des ballons rouges. Ils mangent un gâteau au chocolat. Puis ils jouent à cache-cache dans le jardin.',
      ask: 'À quoi jouent-ils après le gâteau ?',
      options: ['À cache-cache', 'Au football', 'À la marelle'],
      answer: 0,
      hint: 'Le mot « puis » annonce ce qu’ils font ensuite.',
      why: 'Après le gâteau, ils jouent à cache-cache dans le jardin.'
    }
  ];

  var phraseIndice = [
    {
      id: 'arbre-ou',
      skill: 'Où',
      ask: 'Touche la phrase qui dit où ils s’assoient.',
      sentences: [
        'Le soleil brille.',
        'Ils s’assoient sous un grand arbre.',
        'Maman ouvre le panier.',
        'Tout le monde mange un sandwich.'
      ],
      answer: 1,
      hint: 'Cherche un lieu, par exemple sous quelque chose.',
      why: 'Ils s’assoient sous un grand arbre.'
    },
    {
      id: 'cerf-qui',
      skill: 'Qui',
      ask: 'Touche la phrase qui dit qui monte sur le tabouret.',
      sentences: [
        'Le cerf-volant est coincé dans l’arbre.',
        'Ben ne peut pas l’atteindre.',
        'Sa sœur monte sur un tabouret.',
        'Elle décroche le cerf-volant.'
      ],
      answer: 2,
      hint: 'Une phrase donne le prénom ou le lien de famille de celle qui aide.',
      why: 'Sa sœur monte sur un tabouret.'
    },
    {
      id: 'poissons-quand',
      skill: 'Quand',
      ask: 'Touche la phrase qui dit quand Priya nourrit ses poissons.',
      sentences: [
        'L’école finit à trois heures.',
        'Après l’école, Priya nourrit ses poissons.',
        'Les poissons sont orange.',
        'Elle leur donne un peu de nourriture.'
      ],
      answer: 1,
      hint: 'Cherche la phrase qui commence par un moment.',
      why: 'Elle les nourrit après l’école.'
    },
    {
      id: 'crayon-sentiment',
      skill: 'Sentiment',
      ask: 'Touche la phrase qui montre que Jack est content.',
      sentences: [
        'Jack a perdu son crayon.',
        'Il cherche dans son sac.',
        'Il le trouve sous sa chaise.',
        'Jack sourit.'
      ],
      answer: 3,
      hint: 'Un visage peut montrer un sentiment.',
      why: 'Jack sourit, donc il est content.'
    },
    {
      id: 'sac-couleur',
      skill: 'Quoi',
      ask: 'Touche la phrase qui donne les couleurs du sac.',
      sentences: [
        'Ana a un nouveau sac.',
        'Il est vert avec une étoile jaune.',
        'Elle met son goûter dedans.',
        'Puis elle marche vers le bus.'
      ],
      answer: 1,
      hint: 'Les mots de couleur disent comment c’est.',
      why: 'Le sac est vert avec une étoile jaune.'
    },
    {
      id: 'lait-quoi',
      skill: 'Quoi',
      ask: 'Touche la phrase qui dit ce qui coule.',
      sentences: [
        'Le verre se renverse.',
        'Le lait coule sur la table.',
        'Nora prend un chiffon.',
        'Elle essuie la table.'
      ],
      answer: 1,
      hint: 'Cherche la chose qui arrive sur la table.',
      why: 'Le lait coule sur la table.'
    },
    {
      id: 'oiseaux-nombre',
      skill: 'Quoi',
      ask: 'Touche la phrase qui dit combien d’oiseaux restent.',
      sentences: [
        'Trois oiseaux sont sur la barrière.',
        'Un oiseau s’envole.',
        'Deux oiseaux restent.',
        'Ils chantent une petite chanson.'
      ],
      answer: 2,
      hint: 'Le mot « restent » est l’indice.',
      why: 'Deux oiseaux restent.'
    },
    {
      id: 'jouets-quoi',
      skill: 'Quoi',
      ask: 'Touche la phrase qui dit ce qu’ils font des jouets.',
      sentences: [
        'Des nuages noirs remplissent le ciel.',
        'Papa dit que l’orage arrive.',
        'Nous rentrons les jouets.',
        'Puis nous fermons la fenêtre.'
      ],
      answer: 2,
      hint: 'Trouve la phrase qui parle des jouets.',
      why: 'Ils rentrent les jouets.'
    },
    {
      id: 'lapin-nom',
      skill: 'Qui',
      ask: 'Touche la phrase qui dit le nom du lapin.',
      sentences: [
        'Omar a un lapin qui s’appelle Neige.',
        'Neige vit dans un clapier.',
        'Omar lui apporte de l’herbe.',
        'Le lapin bouge le nez.'
      ],
      answer: 0,
      hint: '« S’appelle » présente un nom.',
      why: 'Le lapin s’appelle Neige.'
    },
    {
      id: 'mains-dabord',
      skill: 'Quand',
      ask: 'Touche la phrase qui dit ce qu’ils font en premier.',
      sentences: [
        'D’abord, nous nous lavons les mains.',
        'Ensuite, nous posons les fourchettes.',
        'Maman apporte la soupe.',
        'Nous mangeons ensemble.'
      ],
      answer: 0,
      hint: 'Les mots d’abord et ensuite montrent l’ordre.',
      why: 'D’abord, ils se lavent les mains.'
    }
  ];

  global.ReadingBanks = {
    storySleuth: storySleuth,
    sentenceClue: sentenceClue,
    lectureMaligne: lectureMaligne,
    phraseIndice: phraseIndice
  };
})(typeof window !== 'undefined' ? window : globalThis);
