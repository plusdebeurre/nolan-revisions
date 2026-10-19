/**
 * Ten French reading games, end of semester 1. Six short rounds each.
 * Mechanics differ from the English set.
 */
(function (global) {
  var motManquant = [
    { id: 'mm1', skill: 'Mot', prompt: 'Quel mot manque ?', passage: 'Il pleut. Minou est mouillé. Tom prend une ____ pour le sécher.', options: ['serviette', 'voiture', 'lune'], answer: 0, hint: 'On se sèche avec un linge doux.', why: 'Tom sèche le chat avec une serviette.' },
    { id: 'mm2', skill: 'Mot', prompt: 'Quel mot manque ?', passage: 'Léa a faim. Maman lui donne une ____. Léa la croque sur le canapé.', options: ['pomme', 'maison', 'étoile'], answer: 0, hint: 'C’est un fruit que l’on croque.', why: 'Elle croque une pomme.' },
    { id: 'mm3', skill: 'Mot', prompt: 'Quel mot manque ?', passage: 'Le ballon roule sous la ____. Papa la avance un peu. Inès dit merci.', options: ['voiture', 'lune', 'soupe'], answer: 0, hint: 'Papa peut avancer cet objet pour libérer le ballon.', why: 'Le ballon est sous la voiture.' },
    { id: 'mm4', skill: 'Mot', prompt: 'Quel mot manque ?', passage: 'Noah veut un livre sur les ____. La bibliothécaire lui donne un grand livre bleu.', options: ['dinosaures', 'chapeaux', 'nuages'], answer: 0, hint: 'Ce sont de grands animaux d’il y a longtemps.', why: 'Le livre parle des dinosaures.' },
    { id: 'mm5', skill: 'Mot', prompt: 'Quel mot manque ?', passage: 'Sam pose le pot près de la ____. Le soleil éclaire la graine.', options: ['fenêtre', 'piscine', 'lune'], answer: 0, hint: 'Le soleil entre par cette ouverture de la maison.', why: 'Le pot est près de la fenêtre.' },
    { id: 'mm6', skill: 'Mot', prompt: 'Quel mot manque ?', passage: 'Chloé a sept ans. Après le gâteau, les enfants jouent à ____ dans le jardin.', options: ['cache-cache', 'fusée', 'neige'], answer: 0, hint: 'On se cache et on cherche les amis.', why: 'Ils jouent à cache-cache.' }
  ];

  var ouiNon = [
    { id: 'on1', skill: 'Oui ou non', prompt: 'Est-ce vrai ?', passage: 'Inès joue dans la cour. Le ballon roule sous la voiture. Elle dit merci à Papa.', lead: 'Inès dit merci.', options: ['Oui', 'Non'], answer: 0, hint: 'Cherche le mot merci dans la dernière phrase.', why: 'Oui, elle dit merci à Papa.' },
    { id: 'on2', skill: 'Oui ou non', prompt: 'Est-ce vrai ?', passage: 'Inès joue dans la cour. Le ballon roule sous la voiture.', lead: 'Le ballon est sur le toit.', options: ['Oui', 'Non'], answer: 1, hint: 'Le texte dit où le ballon s’arrête. Est-ce le toit ?', why: 'Non. Le ballon est sous la voiture, pas sur le toit.' },
    { id: 'on3', skill: 'Oui ou non', prompt: 'Est-ce vrai ?', passage: 'Léa mange une pomme, puis elle lit sur le canapé.', lead: 'Léa lit sur le canapé.', options: ['Oui', 'Non'], answer: 0, hint: 'Regarde ce qu’elle fait après la pomme.', why: 'Oui, elle lit sur le canapé.' },
    { id: 'on4', skill: 'Oui ou non', prompt: 'Est-ce vrai ?', passage: 'Il pleut. Minou entre. Tom le sèche avec une serviette.', lead: 'Tom sèche Minou avec un livre.', options: ['Oui', 'Non'], answer: 1, hint: 'Quel objet Tom utilise-t-il vraiment ?', why: 'Non. Il utilise une serviette.' },
    { id: 'on5', skill: 'Oui ou non', prompt: 'Est-ce vrai ?', passage: 'La classe va à la bibliothèque mardi. Noah emprunte un livre bleu.', lead: 'Le livre de Noah est bleu.', options: ['Oui', 'Non'], answer: 0, hint: 'Une couleur est écrite à la fin.', why: 'Oui, le livre est bleu.' },
    { id: 'on6', skill: 'Oui ou non', prompt: 'Est-ce vrai ?', passage: 'Chloé a sept ans. Les ballons sont rouges.', lead: 'Chloé a trois ans.', options: ['Oui', 'Non'], answer: 1, hint: 'Compare le nombre du texte et celui de la phrase.', why: 'Non. Elle a sept ans.' }
  ];

  var dansHistoire = [
    { id: 'dh1', skill: 'Dans le texte', prompt: 'Touche TOUT ce qui est dans l’histoire, puis vérifie.', passage: 'C’est l’anniversaire de Chloé. Il y a des ballons rouges et un gâteau au chocolat. Les amis jouent dans le jardin.', choices: [{ text: 'Des ballons rouges', in: true }, { text: 'Un gâteau au chocolat', in: true }, { text: 'Un vélo bleu', in: false }, { text: 'Un bateau', in: false }], hint: 'Deux choses de la fête sont écrites. Les deux autres non.', why: 'Le texte parle des ballons rouges et du gâteau, pas du vélo ni du bateau.' },
    { id: 'dh2', skill: 'Dans le texte', prompt: 'Touche TOUT ce qui est dans l’histoire, puis vérifie.', passage: 'Sam met une graine dans un pot. Il l’arrose près de la fenêtre. Une tige verte sort.', choices: [{ text: 'Une graine', in: true }, { text: 'Un pot', in: true }, { text: 'Un cheval', in: false }, { text: 'Une fusée', in: false }], hint: 'Cherche ce que Sam touche au début.', why: 'Il y a une graine et un pot. Pas de cheval ni de fusée.' },
    { id: 'dh3', skill: 'Dans le texte', prompt: 'Touche TOUT ce qui est dans l’histoire, puis vérifie.', passage: 'Pour le pique-nique, Maman met du pain, des pommes et de l’eau dans le sac.', choices: [{ text: 'Du pain', in: true }, { text: 'Des pommes', in: true }, { text: 'De la soupe', in: false }, { text: 'Un gâteau', in: false }], hint: 'Touche seulement les aliments écrits dans le sac.', why: 'Le sac a du pain et des pommes. Pas de soupe ni de gâteau.' },
    { id: 'dh4', skill: 'Dans le texte', prompt: 'Touche TOUT ce qui est dans l’histoire, puis vérifie.', passage: 'Noah emprunte un livre bleu sur les dinosaures. Il le lira dans son lit.', choices: [{ text: 'Un livre bleu', in: true }, { text: 'Des dinosaures', in: true }, { text: 'Un ballon', in: false }, { text: 'Une voiture', in: false }], hint: 'Le livre a une couleur et un sujet.', why: 'Livre bleu et dinosaures sont dans le texte.' },
    { id: 'dh5', skill: 'Dans le texte', prompt: 'Touche TOUT ce qui est dans l’histoire, puis vérifie.', passage: 'Il pleut. Minou rentre. Tom prend une serviette. Le chat ronronne.', choices: [{ text: 'La pluie', in: true }, { text: 'Une serviette', in: true }, { text: 'La neige', in: false }, { text: 'Un tambour', in: false }], hint: 'Quel temps fait-il, et avec quoi Tom sèche-t-il le chat ?', why: 'Il pleut et il y a une serviette. Pas de neige ni de tambour.' },
    { id: 'dh6', skill: 'Dans le texte', prompt: 'Touche TOUT ce qui est dans l’histoire, puis vérifie.', passage: 'Inès joue au ballon dans la cour. Papa avance la voiture. Inès dit merci.', choices: [{ text: 'Un ballon', in: true }, { text: 'La cour', in: true }, { text: 'La mer', in: false }, { text: 'Un avion', in: false }], hint: 'Où joue-t-elle, et avec quoi ?', why: 'Elle a un ballon et elle est dans la cour.' }
  ];

  var questionInverse = [
    { id: 'qi1', skill: 'Question', prompt: 'Quelle question va avec cette réponse ?', lead: 'Réponse : sept ans', passage: 'Chloé fête son anniversaire. Elle a sept ans. Les ballons sont rouges.', options: ['Quel âge a Chloé ?', 'Où est le chat ?', 'Quelle heure est-il ?'], answer: 0, hint: 'La réponse est un âge. Quelle question demande un âge ?', why: '« Sept ans » répond à « Quel âge a Chloé ? »' },
    { id: 'qi2', skill: 'Question', prompt: 'Quelle question va avec cette réponse ?', lead: 'Réponse : sous la voiture', passage: 'Le ballon d’Inès roule sous la voiture. Papa l’aide.', options: ['Où est le ballon ?', 'Qui a sept ans ?', 'Que mange Léa ?'], answer: 0, hint: 'La réponse est un lieu.', why: '« Sous la voiture » répond à « Où est le ballon ? »' },
    { id: 'qi3', skill: 'Question', prompt: 'Quelle question va avec cette réponse ?', lead: 'Réponse : une pomme', passage: 'Léa a faim. Elle mange une pomme sur le canapé.', options: ['Que mange Léa ?', 'Quel temps fait-il ?', 'De quelle couleur est le livre ?'], answer: 0, hint: 'La réponse est un aliment.', why: '« Une pomme » répond à « Que mange Léa ? »' },
    { id: 'qi4', skill: 'Question', prompt: 'Quelle question va avec cette réponse ?', lead: 'Réponse : une serviette', passage: 'Tom sèche Minou avec une serviette parce qu’il pleut.', options: ['Avec quoi Tom sèche-t-il Minou ?', 'Où est l’école ?', 'Combien d’oiseaux restent ?'], answer: 0, hint: 'La réponse est un objet utilisé pour sécher.', why: 'La serviette répond à « Avec quoi ? »' },
    { id: 'qi5', skill: 'Question', prompt: 'Quelle question va avec cette réponse ?', lead: 'Réponse : ce soir', passage: 'Noah a un livre bleu. Il le lira ce soir dans son lit.', options: ['Quand lira-t-il le livre ?', 'Qui est le chat ?', 'Que plante Sam ?'], answer: 0, hint: 'La réponse est un moment.', why: '« Ce soir » répond à « Quand ? »' },
    { id: 'qi6', skill: 'Question', prompt: 'Quelle question va avec cette réponse ?', lead: 'Réponse : Papa', passage: 'Inès n’attrape pas le ballon. Papa avance la voiture.', options: ['Qui aide Inès ?', 'Où est la lune ?', 'Quelle est la couleur du sac ?'], answer: 0, hint: 'La réponse est une personne.', why: 'Papa est celui qui aide Inès.' }
  ];

  var bdOrdre = [
    { id: 'bd1', skill: 'Bande dessinée', prompt: 'Remets les cases dans l’ordre.', passage: 'Sam plante, arrose, puis voit une tige.', steps: ['🌱 Sam met la graine dans le pot', '💧 Il arrose chaque matin', '🌿 Une tige verte sort'], hint: 'La plante ne peut pas sortir avant d’être semée.', why: 'D’abord la graine, ensuite l’eau, puis la tige.' },
    { id: 'bd2', skill: 'Bande dessinée', prompt: 'Remets les cases dans l’ordre.', passage: 'Le goûter de Léa, puis la lecture.', steps: ['🍎 Léa prend une pomme', '😋 Elle croque la pomme', '📖 Elle lit sur le canapé'], hint: 'On croque le fruit avant de s’asseoir pour lire.', why: 'Prendre, manger, puis lire.' },
    { id: 'bd3', skill: 'Bande dessinée', prompt: 'Remets les cases dans l’ordre.', passage: 'Minou rentre de la pluie.', steps: ['🌧️ Il pleut sur le jardin', '🐱 Minou entre dans la maison', '🧺 Tom le sèche'], hint: 'Le chat est mouillé avant d’être séché.', why: 'La pluie, puis Minou rentre, puis la serviette.' },
    { id: 'bd4', skill: 'Bande dessinée', prompt: 'Remets les cases dans l’ordre.', passage: 'Le ballon coincé, puis l’aide de Papa.', steps: ['⚽ Le ballon roule', '🚗 Il passe sous la voiture', '🙏 Inès dit merci'], hint: 'On dit merci après l’aide.', why: 'Le ballon part, se coince, puis Inès remercie.' },
    { id: 'bd5', skill: 'Bande dessinée', prompt: 'Remets les cases dans l’ordre.', passage: 'Noah à la bibliothèque.', steps: ['🚶 La classe marche vers la bibliothèque', '🦕 Noah choisit un livre sur les dinosaures', '🛏️ Il le lira ce soir'], hint: 'Il choisit le livre avant de le lire au lit.', why: 'Le chemin, le choix, puis la lecture du soir.' },
    { id: 'bd6', skill: 'Bande dessinée', prompt: 'Remets les cases dans l’ordre.', passage: 'La fête de Chloé.', steps: ['🎈 Ils voient les ballons rouges', '🎂 Les amis mangent le gâteau', '🌳 Ils jouent dans le jardin'], hint: 'Attention : les ballons sont là en arrivant, avant le jeu.', why: 'D’abord les ballons, puis le gâteau, puis le jeu dans le jardin.' }
  ];

  var ouCa = [
    { id: 'oc1', skill: 'Lieu', prompt: 'Où se passe cette scène ?', passage: 'Léa pose son assiette, croque une pomme et s’assoit près du four.', options: ['🍳 La cuisine', '🛏️ La chambre', '🌳 Le jardin'], answer: 0, hint: 'Le four et l’assiette sont dans une pièce de la maison.', why: 'L’assiette et le four montrent la cuisine.' },
    { id: 'oc2', skill: 'Lieu', prompt: 'Où se passe cette scène ?', passage: 'Noah met son pyjama, éteint la lampe et ouvre son livre.', options: ['🛏️ La chambre', '🏫 L’école', '🛒 Le magasin'], answer: 0, hint: 'Le pyjama et la lampe vont avec le sommeil.', why: 'Il se prépare à lire au lit, dans la chambre.' },
    { id: 'oc3', skill: 'Lieu', prompt: 'Où se passe cette scène ?', passage: 'Inès court sur l’herbe. Le ballon passe près des fleurs.', options: ['🌳 Le jardin', '🛁 La salle de bain', '📚 La bibliothèque'], answer: 0, hint: 'L’herbe et les fleurs sont dehors.', why: 'Elle joue dehors, dans le jardin.' },
    { id: 'oc4', skill: 'Lieu', prompt: 'Où se passe cette scène ?', passage: 'La maîtresse dit : « Sortez les cahiers. » Les enfants s’assoient à leur table.', options: ['🏫 La classe', '🏖️ La plage', '🚂 Le train'], answer: 0, hint: 'Les cahiers et la maîtresse vont avec l’école.', why: 'C’est la classe.' },
    { id: 'oc5', skill: 'Lieu', prompt: 'Où se passe cette scène ?', passage: 'Maman ouvre le robinet. Sam se lave les mains avec du savon.', options: ['🚰 La salle de bain', '🎪 Le cirque', '⛺️ La tente'], answer: 0, hint: 'Le robinet et le savon servent à se laver.', why: 'On se lave les mains dans la salle de bain.' },
    { id: 'oc6', skill: 'Lieu', prompt: 'Où se passe cette scène ?', passage: 'Chloé et ses amis cherchent un copain derrière un grand arbre. Ils rient dans l’herbe.', options: ['🌳 Le jardin', '🛏️ Sous le lit', '🚌 Le bus'], answer: 0, hint: 'Un arbre et de l’herbe, c’est dehors.', why: 'Ils jouent dans le jardin.' }
  ];

  var avantApres = [
    { id: 'aa1', skill: 'Ordre', prompt: 'Qu’est-ce qui arrive en premier ?', passage: 'D’abord, les enfants se lavent les mains. Ensuite, ils mangent la soupe.', options: ['Ils se lavent les mains', 'Ils mangent la soupe', 'Ils vont au lit'], answer: 0, hint: 'Le mot d’abord montre le début.', why: 'Ils se lavent les mains avant la soupe.' },
    { id: 'aa2', skill: 'Ordre', prompt: 'Qu’est-ce qui arrive en premier ?', passage: 'Sam met la graine dans le pot. Plus tard, une tige verte sort.', options: ['Il plante la graine', 'La tige sort', 'Il cueille une fleur'], answer: 0, hint: 'La tige ne peut pas sortir avant la graine.', why: 'Il plante d’abord.' },
    { id: 'aa3', skill: 'Ordre', prompt: 'Qu’est-ce qui arrive en premier ?', passage: 'Le ballon roule sous la voiture. Puis Papa avance la voiture. Enfin Inès dit merci.', options: ['Le ballon roule', 'Inès dit merci', 'Papa ferme la maison'], answer: 0, hint: 'Merci vient après l’aide.', why: 'Le ballon part en premier.' },
    { id: 'aa4', skill: 'Ordre', prompt: 'Qu’est-ce qui arrive en dernier ?', passage: 'Noah choisit un livre. Le soir, il le lit dans son lit.', options: ['Il lit dans son lit', 'Il choisit le livre', 'Il nage'], answer: 0, hint: 'La question demande la fin, pas le début.', why: 'Il lit dans son lit à la fin.' },
    { id: 'aa5', skill: 'Ordre', prompt: 'Qu’est-ce qui arrive en dernier ?', passage: 'Léa croque une pomme. Après, elle lit sur le canapé.', options: ['Elle lit sur le canapé', 'Elle croque la pomme', 'Elle prend le bus'], answer: 0, hint: 'Le mot après montre ce qui vient ensuite.', why: 'La lecture est après la pomme.' },
    { id: 'aa6', skill: 'Ordre', prompt: 'Qu’est-ce qui arrive en premier ?', passage: 'Il pleut sur Minou. Ensuite Tom ouvre la porte. Puis il le sèche.', options: ['La pluie tombe', 'Tom le sèche', 'Minou chante'], answer: 0, hint: 'Le chat est mouillé à cause de ce qui commence l’histoire.', why: 'La pluie arrive en premier.' }
  ];

  var laLettre = [
    { id: 'll1', skill: 'Lettre', prompt: 'À qui est cette lettre ?', passage: 'Salut Léo,\nViens au parc samedi. J’apporte le ballon.\nNina', options: ['À Léo', 'À la maîtresse', 'Au chat'], answer: 0, hint: 'Le prénom juste après « Salut » est le destinataire.', why: 'Nina écrit à Léo.' },
    { id: 'll2', skill: 'Lettre', prompt: 'Qu’est-ce que Nina apporte ?', passage: 'Salut Léo,\nViens au parc samedi. J’apporte le ballon.\nNina', options: ['Le ballon', 'Un gâteau', 'Un livre'], answer: 0, hint: 'Elle dit « j’apporte » puis un objet.', why: 'Elle apporte le ballon.' },
    { id: 'll3', skill: 'Lettre', prompt: 'Où se retrouvent-ils ?', passage: 'Cher Omar,\nRetrouvons-nous à la bibliothèque après l’école.\nNoah', options: ['À la bibliothèque', 'À la piscine', 'Au cinéma'], answer: 0, hint: 'Cherche le lieu après « retrouvons-nous ».', why: 'Ils se retrouvent à la bibliothèque.' },
    { id: 'll4', skill: 'Lettre', prompt: 'Qui a écrit la lettre ?', passage: 'Maman,\nJe dors chez Chloé ce soir. Je prends mon pyjama.\nBisous, Inès', options: ['Inès', 'Maman', 'Chloé'], answer: 0, hint: 'La signature est en bas.', why: 'Inès signe la lettre.' },
    { id: 'll5', skill: 'Lettre', prompt: 'Que prend Inès ?', passage: 'Maman,\nJe dors chez Chloé ce soir. Je prends mon pyjama.\nBisous, Inès', options: ['Son pyjama', 'Un vélo', 'Un parapluie'], answer: 0, hint: 'Elle écrit « je prends ».', why: 'Elle prend son pyjama.' },
    { id: 'll6', skill: 'Lettre', prompt: 'Quand est le match ?', passage: 'Salut Nia,\nLe match de ballon est dimanche matin. Apporte tes chaussures.\nLéo', options: ['Dimanche matin', 'Lundi soir', 'Vendredi midi'], answer: 0, hint: 'Un jour et un moment sont dans la deuxième ligne.', why: 'Le match est dimanche matin.' }
  ];

  var laListe = [
    { id: 'ls1', skill: 'Liste', prompt: 'Qu’est-ce qui EST sur la liste ?', passage: 'Pique-nique :\n- pain\n- pommes\n- eau\n- fromage', options: ['Des pommes', 'De la soupe', 'Un gâteau'], answer: 0, hint: 'Descends la liste ligne par ligne.', why: 'Les pommes sont écrites sur la liste.' },
    { id: 'ls2', skill: 'Liste', prompt: 'Qu’est-ce qui N’EST PAS sur la liste ?', passage: 'Pique-nique :\n- pain\n- pommes\n- eau\n- fromage', options: ['Du gâteau', 'Du pain', 'De l’eau'], answer: 0, hint: 'Deux réponses sont sur la liste. Cherche l’intrus.', why: 'Le gâteau n’est pas écrit.' },
    { id: 'ls3', skill: 'Liste', prompt: 'Qu’est-ce qu’il faut apporter en classe ?', passage: 'Pour la classe :\n- crayons\n- colle\n- cahier', options: ['La colle', 'Un oreiller', 'Une tente'], answer: 0, hint: 'Ce sont des affaires d’école.', why: 'La colle est sur la liste de la classe.' },
    { id: 'ls4', skill: 'Liste', prompt: 'Quel animal est sur l’affiche ?', passage: 'Animaux du livre :\n- chat\n- chien\n- lapin', options: ['Le lapin', 'Le lion', 'La baleine'], answer: 0, hint: 'Trois petits animaux familiers sont cités.', why: 'Le lapin est sur l’affiche. Pas le lion ni la baleine.' },
    { id: 'ls5', skill: 'Liste', prompt: 'Que boit-on d’après la liste ?', passage: 'Goûter :\n- jus de pomme\n- biscuits\n- banane', options: ['Du jus de pomme', 'Du lait chaud', 'De la limonade'], answer: 0, hint: 'Une ligne est une boisson.', why: 'La boisson de la liste est le jus de pomme.' },
    { id: 'ls6', skill: 'Liste', prompt: 'Quelle couleur de ballon faut-il acheter ?', passage: 'Courses pour la fête :\n- ballons rouges\n- assiettes\n- bougies', options: ['Rouges', 'Bleus', 'Verts'], answer: 0, hint: 'La couleur est collée au mot ballons.', why: 'La liste dit des ballons rouges.' }
  ];

  var lePiege = [
    { id: 'lp1', skill: 'Piège', prompt: 'Touche la phrase qui est FAUSSE.', passage: 'Chloé a sept ans. Les ballons de sa fête sont rouges. Les amis jouent dans le jardin.', options: ['Chloé a dix ans.', 'Elle a sept ans.', 'Les ballons sont rouges.'], answer: 0, hint: 'Deux phrases recopient le texte. Une change un nombre.', why: 'Chloé a sept ans, pas dix. Cette phrase est fausse.' },
    { id: 'lp2', skill: 'Piège', prompt: 'Touche la phrase qui est FAUSSE.', passage: 'Le ballon roule sous la voiture. Papa aide Inès. Elle dit merci.', options: ['Le ballon est sur le toit.', 'Papa aide Inès.', 'Elle dit merci.'], answer: 0, hint: 'Vérifie le lieu du ballon.', why: 'Le ballon est sous la voiture, pas sur le toit.' },
    { id: 'lp3', skill: 'Piège', prompt: 'Touche la phrase qui est FAUSSE.', passage: 'Léa mange une pomme. Ensuite elle lit sur le canapé.', options: ['Léa mange le gâteau.', 'Léa mange une pomme.', 'Elle lit sur le canapé.'], answer: 0, hint: 'Quel aliment est vraiment mangé ?', why: 'Elle mange une pomme, pas le gâteau.' },
    { id: 'lp4', skill: 'Piège', prompt: 'Touche la phrase qui est FAUSSE.', passage: 'Il pleut. Tom sèche Minou avec une serviette. Minou ronronne.', options: ['Tom utilise un balai.', 'Tom utilise une serviette.', 'Minou ronronne.'], answer: 0, hint: 'L’objet pour sécher n’est pas un outil de sol.', why: 'Il utilise une serviette, pas un balai.' },
    { id: 'lp5', skill: 'Piège', prompt: 'Touche la phrase qui est FAUSSE.', passage: 'Noah lit un livre bleu sur les dinosaures, ce soir, dans son lit.', options: ['Le livre parle de camions.', 'Le livre est bleu.', 'Il lit ce soir.'], answer: 0, hint: 'Le sujet du livre est un animal ancien.', why: 'Le livre parle de dinosaures, pas de camions.' },
    { id: 'lp6', skill: 'Piège', prompt: 'Touche la phrase qui est FAUSSE.', passage: 'Sam arrose une graine près de la fenêtre. Une tige verte sort. Sam sourit.', options: ['Sam est en colère.', 'Une tige verte sort.', 'Le pot est près de la fenêtre.'], answer: 0, hint: 'Regarde le visage de Sam à la fin.', why: 'Sam sourit, il n’est pas en colère.' }
  ];

  global.ReadingPackFr = {
    motManquant: motManquant,
    ouiNon: ouiNon,
    dansHistoire: dansHistoire,
    questionInverse: questionInverse,
    bdOrdre: bdOrdre,
    ouCa: ouCa,
    avantApres: avantApres,
    laLettre: laLettre,
    laListe: laListe,
    lePiege: lePiege
  };
})(typeof window !== 'undefined' ? window : globalThis);
