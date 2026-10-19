/**
 * Harder French reading. Original texts, not translations of the English set.
 */
(function (global) {
  function row(id, skill, prompt, passage, options, answer, hint, why, extra) {
    var item = { id: id, skill: skill, prompt: prompt, passage: passage, options: options, answer: answer, hint: hint, why: why };
    if (extra) Object.keys(extra).forEach(function (k) { item[k] = extra[k]; });
    return item;
  }

  var idee = [
    row('ip1', 'Idée', 'De quoi parle surtout ce texte ?', 'Le vent a emporté le chapeau de Lina jusque dans l’arbre. Son frère a secoué la branche doucement. Le chapeau est tombé dans ses mains.', ['Un chapeau récupéré dans un arbre', 'Une leçon de natation', 'Un gâteau au chocolat'], 0, 'Quel objet voyage du début à la fin ?', 'Tout le texte suit le chapeau jusqu’à ce qu’on le rattrape.'),
    row('ip2', 'Idée', 'De quoi parle surtout ce texte ?', 'Au marché, il ne restait qu’un panier de fraises. Deux familles le voulaient. La marchande l’a partagé en deux sacs.', ['Le partage du dernier panier', 'Un match de football', 'Un chat sur un toit'], 0, 'Quel problème la marchande règle-t-elle ?', 'Elle partage le seul panier entre deux familles.'),
    row('ip3', 'Idée', 'De quoi parle surtout ce texte ?', 'Le bus est resté coincé derrière un troupeau de chèvres. Les enfants ont attendu. Quand la route a été libre, le bus a redémarré.', ['Un bus retardé par des chèvres', 'Une recette de soupe', 'Un livre perdu'], 0, 'Pourquoi le bus ne roule-t-il pas tout de suite ?', 'Les chèvres bloquent la route, puis le bus repart.'),
    row('ip4', 'Idée', 'De quoi parle surtout ce texte ?', 'Mamie a oublié le sel de la soupe. Noé a couru chez le voisin. Il est revenu avec une petite boîte, et la soupe a enfin eu du goût.', ['Chercher du sel pour la soupe', 'Planter un arbre', 'Un examen de maths'], 0, 'Que manque-t-il, et qui va le chercher ?', 'L’histoire est la recherche du sel.'),
    row('ip5', 'Idée', 'De quoi parle surtout ce texte ?', 'Le cerf-volant de Sara s’est déchiré sur un fil. Elle a recollé le papier bleu. Le lendemain, il a revolé au-dessus du pré.', ['Réparer un cerf-volant', 'Fermer la bibliothèque', 'Compter des pièces'], 0, 'Quel objet est cassé puis réparé ?', 'Le cerf-volant est réparé et revolé.'),
    row('ip6', 'Idée', 'De quoi parle surtout ce texte ?', 'La classe a un poisson rouge. Vendredi, il nageait au fond. Lundi, après une eau propre, il est remonté près de la lumière.', ['Un poisson qui va mieux', 'Une inondation', 'Un chapeau dans un arbre'], 0, 'Qu’est-ce qui change pour le poisson ?', 'Il était au fond, puis il remonte.'),
    row('ip7', 'Idée', 'De quoi parle surtout ce texte ?', 'Le dessin de Yan tenait avec un seul morceau de ruban. Inès en a ajouté trois. Le dessin est resté au mur toute la semaine.', ['Faire tenir un dessin au mur', 'Partager des fraises', 'Un troupeau de chèvres'], 0, 'Quel problème de collage est résolu ?', 'Plus de ruban garde le dessin au mur.'),
    row('ip8', 'Idée', 'De quoi parle surtout ce texte ?', 'La pluie a commencé pendant la récréation. La maîtresse a ouvert la porte. Les élèves sont rentrés avec les jouets sous le bras.', ['Rentrer les jouets à cause de la pluie', 'Cuire une soupe', 'Lire un poème'], 0, 'Quel temps change le jeu ?', 'La pluie fait rentrer tout le monde.')
  ];

  var pourquoi = [
    row('pq1', 'Pourquoi', 'Pourquoi le frère secoue-t-il la branche ?', 'Le chapeau de Lina est dans l’arbre. Son frère secoue la branche. Le chapeau tombe.', ['Pour faire tomber le chapeau', 'Pour cueillir des pommes', 'Pour appeler le bus'], 0, 'Qu’est-ce qui est coincé là-haut ?', 'Il veut que le chapeau descende.'),
    row('pq2', 'Pourquoi', 'Pourquoi la marchande fait-elle deux sacs ?', 'Deux familles veulent le seul panier de fraises. Elle le partage.', ['Pour que chaque famille en ait', 'Parce que les fraises sont vertes', 'Pour les jeter'], 0, 'Combien de familles attendent ?', 'Deux familles, un seul panier : elle partage.'),
    row('pq3', 'Pourquoi', 'Pourquoi le bus attend-il ?', 'Des chèvres occupent la route. Le bus ne peut pas passer.', ['La route est bloquée', 'Le chauffeur a sommeil', 'Les enfants chantent'], 0, 'Qui est au milieu de la route ?', 'Les chèvres empêchent le bus d’avancer.'),
    row('pq4', 'Pourquoi', 'Pourquoi Noé court-il chez le voisin ?', 'La soupe n’a pas de sel. Mamie ne peut pas la servir ainsi.', ['Pour trouver du sel', 'Pour chercher un ballon', 'Pour fermer la fenêtre'], 0, 'Qu’est-ce qui manque dans la casserole ?', 'Il va chercher le sel qui manque.'),
    row('pq5', 'Pourquoi', 'Pourquoi Sara recolle-t-elle le papier ?', 'Le cerf-volant s’est déchiré. Elle veut le revoir dans le ciel.', ['Pour qu’il puisse revoler', 'Pour en faire un chapeau', 'Pour le donner aux chèvres'], 0, 'Un cerf-volant troué ne vole pas bien.', 'Elle le répare pour le faire revoler.'),
    row('pq6', 'Pourquoi', 'Pourquoi change-t-on l’eau du bocal ?', 'Le poisson nage au fond. Après une eau propre, il remonte.', ['Pour que le poisson aille mieux', 'Pour peindre le bocal', 'Pour cacher le poisson'], 0, 'L’eau propre change son nage.', 'L’eau propre l’aide à remonter.'),
    row('pq7', 'Pourquoi', 'Pourquoi Inès ajoute-t-elle du ruban ?', 'Le dessin ne tient qu’avec un morceau. Il risque de tomber.', ['Pour que le dessin reste au mur', 'Pour emballer un cadeau', 'Pour attacher des chèvres'], 0, 'Un seul morceau ne suffit pas.', 'Plus de ruban empêche le dessin de tomber.'),
    row('pq8', 'Pourquoi', 'Pourquoi les élèves rentrent-ils ?', 'La pluie commence. La maîtresse ouvre la porte.', ['Parce qu’il pleut', 'Parce que le bus klaxonne', 'Parce que la soupe est prête'], 0, 'Quel temps pousse la maîtresse à ouvrir ?', 'La pluie interrompt la récréation.')
  ];

  var motContexte = [
    row('mc1', 'Mot', 'Quel mot va dans le trou ?', 'Le chapeau est trop haut. Lina est ____ de l’attraper sans aide.', ['incapable', 'ravie', 'endormie'], 0, 'Sans aide, elle n’y arrive pas.', 'Incapable veut dire qu’elle ne peut pas.'),
    row('mc2', 'Mot', 'Quel mot va dans le trou ?', 'La marchande est ____ : chaque famille repart avec des fraises.', ['juste', 'perdue', 'gelée'], 0, 'Les deux familles reçoivent une part.', 'Juste veut dire équitable.'),
    row('mc3', 'Mot', 'Quel mot va dans le trou ?', 'Les chèvres ____ la route, alors le bus attend.', ['bloquent', 'lisent', 'cuisinent'], 0, 'Le bus ne peut pas avancer.', 'Bloquent veut dire qu’elles ferment le passage.'),
    row('mc4', 'Mot', 'Quel mot va dans le trou ?', 'Sans sel, la soupe était ____. Avec la boîte, elle a du goût.', ['fade', 'bruyante', 'carrée'], 0, 'Fade, c’est sans goût.', 'La soupe était fade avant le sel.'),
    row('mc5', 'Mot', 'Quel mot va dans le trou ?', 'Sara a ____ le papier déchiré pour que le cerf-volant revolé.', ['réparé', 'vendu', 'mangé'], 0, 'Elle remet le papier en état.', 'Réparé veut dire remis en bon état.'),
    row('mc6', 'Mot', 'Quel mot va dans le trou ?', 'Dans l’eau propre, le poisson est ____ près de la lumière.', ['remonté', 'gelé', 'écrit'], 0, 'Il était au fond, puis il va vers le haut.', 'Remonté veut dire revenu vers le haut.'),
    row('mc7', 'Mot', 'Quel mot va dans le trou ?', 'Trois rubans de plus rendent le dessin ____ au mur.', ['solide', 'liquide', 'invisible'], 0, 'Il ne tombe plus.', 'Solide ici veut dire bien fixé.'),
    row('mc8', 'Mot', 'Quel mot va dans le trou ?', 'La pluie ____ la récréation. Tout le monde rentre.', ['interrompt', 'colore', 'compte'], 0, 'Le jeu dehors s’arrête.', 'Interrompt veut dire arrête au milieu.')
  ];

  var deuxIndices = [
    row('di1', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : le chapeau est dans l’arbre. Fait 2 : une branche secouée le fait tomber.', ['Secouer la branche fait tomber le chapeau de l’arbre.', 'Lina achète un chapeau neuf.', 'Le frère cuisine une soupe.'], 0, 'Il faut l’arbre et la branche.', 'La première phrase contient les deux faits.'),
    row('di2', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : un seul panier. Fait 2 : deux familles.', ['Le panier unique est partagé entre deux familles.', 'Personne ne veut de fraises.', 'Le panier est vide.'], 0, 'Un panier et deux familles.', 'Partager relie les deux faits.'),
    row('di3', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : des chèvres sur la route. Fait 2 : le bus attend.', ['Le bus attend parce que les chèvres barrent la route.', 'Le bus vole au-dessus des chèvres.', 'Les chèvres sont dans le bus.'], 0, 'Les deux doivent expliquer l’attente.', 'Les chèvres sont la cause de l’attente.'),
    row('di4', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : la soupe n’a pas de sel. Fait 2 : Noé revient avec une boîte.', ['Noé rapporte le sel qui manquait à la soupe.', 'Noé rapporte un chapeau.', 'La soupe avait déjà trop de sel.'], 0, 'Sel et boîte vont ensemble.', 'La boîte contient ce qui manquait.'),
    row('di5', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : le cerf-volant est déchiré. Fait 2 : il revolé le lendemain.', ['Après la réparation, le cerf-volant revolé.', 'Sara jette le cerf-volant.', 'Le cerf-volant reste déchiré.'], 0, 'Déchiré puis revolé.', 'La réparation explique le deuxième vol.'),
    row('di6', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : le poisson était au fond. Fait 2 : l’eau a été changée.', ['L’eau propre aide le poisson à remonter.', 'Le poisson quitte l’école.', 'On peint le poisson.'], 0, 'Fond et eau propre.', 'L’eau explique le changement.'),
    row('di7', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : un seul ruban. Fait 2 : Inès en ajoute.', ['Plus de ruban garde le dessin qui tenait mal.', 'Inès enlève le dessin.', 'Le mur disparaît.'], 0, 'Le ruban faible et le ruban ajouté.', 'Ajouter du ruban règle le problème.'),
    row('di8', 'Deux indices', 'Quelle phrase utilise LES DEUX faits ?', 'Fait 1 : il pleut. Fait 2 : les jouets rentrent.', ['La pluie fait rentrer les jouets.', 'Les jouets restent sous la pluie.', 'Le soleil brille.'], 0, 'Pluie et jouets.', 'La pluie est la raison du retour.')
  ];

  var ecoute = [
    row('ec1', 'Écoute', 'Écoute, puis choisis le sens.', 'Le chapeau est dans l’arbre. Il faut secouer la branche.', ['Il faut aider le chapeau à tomber', 'Il faut nager', 'Il faut dormir'], 0, 'Si tu n’entends pas, lis la phrase.', 'Secouer la branche fait descendre le chapeau.', { say: 'Le chapeau est dans l’arbre. Il faut secouer la branche.', lang: 'fr-FR' }),
    row('ec2', 'Écoute', 'Écoute, puis choisis le sens.', 'Un seul panier de fraises pour deux familles.', ['Il faut partager', 'Il faut tout jeter', 'Il faut fermer le marché'], 0, 'Deux familles, un panier.', 'Partager est la solution.', { say: 'Un seul panier de fraises pour deux familles.', lang: 'fr-FR' }),
    row('ec3', 'Écoute', 'Écoute, puis choisis le sens.', 'Les chèvres sont sur la route. Le bus doit attendre.', ['Le bus est bloqué', 'Le bus peut passer vite', 'Les chèvres conduisent'], 0, 'Attendre veut dire ne pas avancer.', 'Les chèvres empêchent le passage.', { say: 'Les chèvres sont sur la route. Le bus doit attendre.', lang: 'fr-FR' }),
    row('ec4', 'Écoute', 'Écoute, puis choisis le sens.', 'La soupe n’a pas de sel. Va chercher une petite boîte.', ['Il manque du sel', 'Il manque un ballon', 'La soupe est trop salée'], 0, 'La boîte sert à ramener ce qui manque.', 'On cherche du sel.', { say: 'La soupe n’a pas de sel. Va chercher une petite boîte.', lang: 'fr-FR' }),
    row('ec5', 'Écoute', 'Écoute, puis choisis le sens.', 'Recolle le papier bleu pour que le cerf-volant revolé.', ['Il faut réparer le cerf-volant', 'Il faut le manger', 'Il faut le cacher'], 0, 'Recoller, c’est réparer.', 'Le cerf-volant doit revoler.', { say: 'Recolle le papier bleu pour que le cerf-volant revolé.', lang: 'fr-FR' }),
    row('ec6', 'Écoute', 'Écoute, puis choisis le sens.', 'Change l’eau. Le poisson remontera vers la lumière.', ['L’eau propre aide le poisson', 'Il faut vider le bocal pour toujours', 'Le poisson doit sortir de l’école'], 0, 'Remonter est un mieux.', 'L’eau propre le fait aller mieux.', { say: 'Change l’eau. Le poisson remontera vers la lumière.', lang: 'fr-FR' }),
    row('ec7', 'Écoute', 'Écoute, puis choisis le sens.', 'Ajoute du ruban, sinon le dessin tombera.', ['Le dessin a besoin de plus de ruban', 'Le dessin est déjà par terre', 'Il faut enlever le ruban'], 0, 'Sinon annonce un risque.', 'Sans ruban en plus, il tombe.', { say: 'Ajoute du ruban, sinon le dessin tombera.', lang: 'fr-FR' }),
    row('ec8', 'Écoute', 'Écoute, puis choisis le sens.', 'Il pleut. Rentrez les jouets tout de suite.', ['La pluie arrête le jeu dehors', 'On continue sous la pluie', 'On sort plus de jouets'], 0, 'Tout de suite montre l’urgence.', 'Il faut rentrer à cause de la pluie.', { say: 'Il pleut. Rentrez les jouets tout de suite.', lang: 'fr-FR' })
  ];

  var faitIdee = [
    row('fi1', 'Fait ou idée', 'Quelle phrase est seulement une idée ?', 'Le chapeau tombe de l’arbre dans les mains du frère.', ['Lina pleure toute la nuit', 'Le chapeau tombe', 'Le frère le rattrape'], 0, 'Pleurer n’est pas écrit.', 'On sait que le chapeau tombe, pas que Lina pleure.'),
    row('fi2', 'Fait ou idée', 'Quelle phrase est un fait ?', 'La marchande partage le panier en deux sacs.', ['Elle fait deux sacs', 'Les familles sont voisines', 'Les fraises sont trop chères'], 0, 'Un fait est écrit tel quel.', 'Le partage en deux sacs est écrit.'),
    row('fi3', 'Fait ou idée', 'Quelle phrase est seulement une idée ?', 'Le bus attend derrière les chèvres.', ['Le chauffeur est en colère', 'Le bus attend', 'Des chèvres sont là'], 0, 'La colère n’est pas dite.', 'On sait l’attente, pas la colère.'),
    row('fi4', 'Fait ou idée', 'Quelle phrase est un fait ?', 'Noé revient avec une petite boîte de sel.', ['Il rapporte du sel', 'Le voisin est son oncle', 'La soupe brûle'], 0, 'Cherche la boîte dans le texte.', 'La boîte de sel est un fait.'),
    row('fi5', 'Fait ou idée', 'Quelle phrase est seulement une idée ?', 'Le cerf-volant réparé revolé le lendemain.', ['Sara gagne un prix', 'Le cerf-volant revolé', 'Il avait été déchiré'], 0, 'Un prix n’est pas dans l’histoire.', 'Revoler est un fait. Le prix est une idée.'),
    row('fi6', 'Fait ou idée', 'Quelle phrase est un fait ?', 'Après l’eau propre, le poisson remonte.', ['Le poisson remonte', 'Il s’appelle Rouge', 'La classe l’oublie'], 0, 'Le mouvement est écrit.', 'Il remonte : c’est un fait.'),
    row('fi7', 'Fait ou idée', 'Quelle phrase est seulement une idée ?', 'Inès ajoute trois rubans. Le dessin reste au mur.', ['Le dessin est moche', 'Elle ajoute des rubans', 'Il reste au mur'], 0, 'Moche est un jugement non écrit.', 'On ne dit pas si le dessin est moche.'),
    row('fi8', 'Fait ou idée', 'Quelle phrase est un fait ?', 'Les élèves rentrent les jouets quand la pluie commence.', ['Ils rentrent les jouets', 'Ils sont punis', 'La récréation dure deux heures'], 0, 'La pluie et les jouets sont écrits.', 'Rentrer les jouets est un fait.')
  ];

  var veut = [
    row('cv1', 'Envie', 'Que veut le frère de Lina ?', 'Il secoue la branche et tend les mains sous le chapeau.', ['Récupérer le chapeau', 'Rester dans l’arbre', 'Manger le chapeau'], 0, 'Ses mains attendent en dessous.', 'Il veut attraper le chapeau.'),
    row('cv2', 'Envie', 'Que veulent les deux familles ?', 'Elles montrent toutes les deux le même panier.', ['Des fraises', 'Un bus', 'Un poisson'], 0, 'Un seul objet les intéresse.', 'Elles veulent le panier de fraises.'),
    row('cv3', 'Envie', 'Que veut le chauffeur ?', 'Il regarde les chèvres et garde le pied près du frein, puis sourit quand la route se vide.', ['Repartir quand la route est libre', 'Suivre les chèvres toute la journée', 'Descendre du bus'], 0, 'Il attend le moment de repartir.', 'Il veut continuer la route.'),
    row('cv4', 'Envie', 'Que veut Noé ?', 'Il court et revient vite avec la boîte.', ['Aider la soupe', 'Cacher le sel', 'Renverser la casserole'], 0, 'Il se dépêche pour Mamie.', 'Il veut rapporter ce qui manque.'),
    row('cv5', 'Envie', 'Que veut Sara ?', 'Elle recolle le papier et lève les yeux vers le pré.', ['Revoir son cerf-volant dans le ciel', 'Le ranger pour toujours', 'Le donner aux chèvres'], 0, 'Le pré est l’endroit où l’on fait voler.', 'Elle veut le faire revoler.'),
    row('cv6', 'Envie', 'Que veut la classe pour le poisson ?', 'On change l’eau et on le regarde remonter vers la lampe.', ['Qu’il aille mieux', 'Qu’il reste au fond', 'Qu’il quitte le bocal'], 0, 'Ils surveillent s’il remonte.', 'Ils veulent qu’il se porte mieux.'),
    row('cv7', 'Envie', 'Que veut Inès ?', 'Elle ajoute du ruban et recule pour vérifier que le dessin ne bouge plus.', ['Que le dessin tienne', 'Que le dessin tombe', 'Peindre le mur en noir'], 0, 'Elle vérifie qu’il ne bouge plus.', 'Elle veut le garder au mur.'),
    row('cv8', 'Envie', 'Que veut la maîtresse ?', 'Elle ouvre la porte et fait signe vers la classe quand les gouttes arrivent.', ['Faire rentrer les élèves', 'Continuer le jeu sous la pluie', 'Fermer l’école pour toujours'], 0, 'La porte ouverte est une invitation.', 'Elle veut que les élèves rentrent.')
  ];

  var quatre = [
    { id: 'q1', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Le chapeau s’envole, se pose dans l’arbre, la branche est secouée, puis il tombe.', steps: ['Le chapeau s’envole', 'Il se pose dans l’arbre', 'On secoue la branche', 'Il tombe'], hint: 'Il ne peut pas tomber avant d’être dans l’arbre.', why: 'Il s’envole, se coince, on secoue, il tombe.' },
    { id: 'q2', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Les familles arrivent, voient un seul panier, la marchande partage, chacune repart.', steps: ['Les familles arrivent', 'Elles voient un seul panier', 'La marchande partage', 'Chacune repart'], hint: 'Partager vient avant de repartir.', why: 'Arriver, voir, partager, repartir.' },
    { id: 'q3', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Les chèvres entrent sur la route, le bus s’arrête, les chèvres sortent, le bus repart.', steps: ['Les chèvres entrent sur la route', 'Le bus s’arrête', 'Les chèvres sortent', 'Le bus repart'], hint: 'Le bus ne repart pas pendant que les chèvres sont là.', why: 'Chèvres, arrêt, départ des chèvres, le bus repart.' },
    { id: 'q4', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Mamie goûte, le sel manque, Noé part, il revient avec la boîte.', steps: ['Mamie goûte la soupe', 'Le sel manque', 'Noé part', 'Il revient avec la boîte'], hint: 'On ne cherche le sel qu’après avoir goûté.', why: 'Goûter, manque, départ, retour.' },
    { id: 'q5', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Le cerf-volant se déchire, Sara recolle, la nuit passe, il revolé.', steps: ['Il se déchire', 'Sara recolle', 'La nuit passe', 'Il revolé'], hint: 'Revoler est la fin.', why: 'Déchirure, colle, nuit, vol.' },
    { id: 'q6', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Le poisson est au fond, on change l’eau, on attend, il remonte.', steps: ['Il est au fond', 'On change l’eau', 'On attend', 'Il remonte'], hint: 'Remonter est le résultat.', why: 'Fond, eau, attente, remontée.' },
    { id: 'q7', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Le dessin penche, Inès voit le ruban faible, elle en ajoute, le dessin tient.', steps: ['Le dessin penche', 'Elle voit le ruban faible', 'Elle ajoute du ruban', 'Le dessin tient'], hint: 'Tenir est la dernière étape.', why: 'Penche, voir, ajouter, tenir.' },
    { id: 'q8', skill: 'Ordre', prompt: 'Remets les quatre étapes dans l’ordre.', passage: 'Le ciel se couvre, la pluie tombe, la porte s’ouvre, les jouets rentrent.', steps: ['Le ciel se couvre', 'La pluie tombe', 'La porte s’ouvre', 'Les jouets rentrent'], hint: 'Les jouets rentrent en dernier.', why: 'Ciel, pluie, porte, jouets.' }
  ];

  var detail = [
    row('dt1', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'Le chapeau tombe de l’arbre dans les mains du frère.', ['Le frère utilise une échelle', 'Le chapeau est dans un arbre', 'Il tombe', 'Le frère le reçoit'], 0, 'Une échelle n’est pas nommée.', 'Il secoue une branche, sans échelle.'),
    row('dt2', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'La marchande partage un panier de fraises en deux sacs.', ['Elle ajoute de la crème', 'Elle partage', 'Ce sont des fraises', 'Il y a deux sacs'], 0, 'La crème est une idée nouvelle.', 'Le texte ne parle pas de crème.'),
    row('dt3', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'Des chèvres bloquent le bus. Puis la route se libère.', ['Le bus klaxonne très fort', 'Des chèvres sont là', 'Le bus attend', 'La route se libère'], 0, 'Le klaxon n’est pas écrit.', 'On sait l’attente, pas le klaxon.'),
    row('dt4', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'Noé rapporte une petite boîte de sel pour la soupe.', ['La soupe est aux champignons', 'Il rapporte du sel', 'La boîte est petite', 'C’est pour la soupe'], 0, 'Le légume n’est pas dit.', 'On ne connaît pas le contenu exact de la soupe.'),
    row('dt5', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'Sara recolle le papier bleu du cerf-volant. Il revolé.', ['Le papier est rouge', 'Elle recolle', 'Le papier était bleu', 'Il revolé'], 0, 'La couleur écrite est une seule.', 'Le papier est bleu, pas rouge.'),
    row('dt6', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'Le poisson remonte après un changement d’eau.', ['On lui donne un nom', 'Il était au fond', 'L’eau change', 'Il remonte'], 0, 'Aucun nom n’est donné.', 'Le texte ne le nomme pas.'),
    row('dt7', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'Inès ajoute trois rubans. Le dessin reste au mur.', ['Le dessin représente un dragon', 'Elle ajoute des rubans', 'Il y en a trois de plus', 'Il reste au mur'], 0, 'Le sujet du dessin n’est pas dit.', 'On ne sait pas ce que le dessin montre.'),
    row('dt8', 'Détail', 'Quel détail n’est PAS dans le texte ?', 'La pluie fait rentrer les jouets de la récréation.', ['Il neige', 'Il pleut', 'Les jouets rentrent', 'C’est la récréation'], 0, 'La neige n’est pas la pluie.', 'Le texte dit la pluie, pas la neige.')
  ];

  var replique = [
    row('sr1', 'Sens', 'Que veut dire le frère ?', 'Il dit : « Encore un petit coup, il va descendre. »', ['Le chapeau va bientôt tomber', 'Il abandonne', 'Il parle de la soupe'], 0, 'Descendre vise le chapeau.', 'Il pense qu’un geste de plus suffit.'),
    row('sr2', 'Sens', 'Que veut dire la marchande ?', 'Elle dit : « Un sac pour vous, un sac pour vous. »', ['Chacun reçoit une part', 'Personne n’a de fraises', 'Elle ferme le marché'], 0, 'Deux « pour vous ».', 'Elle donne un sac à chaque famille.'),
    row('sr3', 'Sens', 'Que veut dire le chauffeur ?', 'Il dit : « On ne force pas. On attend le troupeau. »', ['Il refuse de pousser les chèvres', 'Il veut accélérer', 'Il descend aider à la ferme'], 0, 'Ne pas forcer, c’est patienter.', 'Il choisit d’attendre.'),
    row('sr4', 'Sens', 'Que veut dire Mamie ?', 'Elle dit : « C’est fade. Il manque le petit goût blanc. »', ['Il manque du sel', 'Il manque du sucre sur un gâteau', 'La soupe est trop salée'], 0, 'Fade et goût blanc vont avec le sel.', 'Elle demande du sel.'),
    row('sr5', 'Sens', 'Que veut dire Sara ?', 'Elle dit : « Demain, le pré te reverra. »', ['Le cerf-volant revolera', 'Elle parle à un ami', 'Le pré est fermé'], 0, '« Te » est le cerf-volant.', 'Elle promet un nouveau vol.'),
    row('sr6', 'Sens', 'Que veut dire l’élève ?', 'Il dit : « Regarde, il cherche la lampe. »', ['Le poisson remonte vers la lumière', 'La lampe est cassée', 'Il parle d’un bus'], 0, 'Chercher la lampe, c’est aller vers le haut.', 'Le poisson va mieux.'),
    row('sr7', 'Sens', 'Que veut dire Inès ?', 'Elle dit : « Un seul ruban, c’est trop juste. »', ['Il en faut davantage', 'Le dessin est fini', 'Il faut enlever le ruban'], 0, 'Trop juste veut dire pas assez.', 'Elle va en ajouter.'),
    row('sr8', 'Sens', 'Que veut dire la maîtresse ?', 'Elle dit : « Les gouttes gagnent. On rentre. »', ['La pluie arrête le jeu', 'On reste dehors', 'Les gouttes sont un jeu'], 0, 'Gagnent veut dire que la pluie est plus forte.', 'Il faut rentrer.')
  ];

  var lieu = [
    row('li1', 'Lieu', 'Où est le chapeau ?', 'Des feuilles autour de lui, une branche qui bouge, le ciel derrière.', ['Dans un arbre', 'Dans une casserole', 'Dans un bus'], 0, 'Feuilles et branche.', 'Il est dans l’arbre.'),
    row('li2', 'Lieu', 'Où sont les fraises ?', 'Des étals, des sacs, des voix qui demandent le dernier panier.', ['Au marché', 'Dans une classe', 'Sur un toit'], 0, 'Les étals sont des tables de vente.', 'C’est le marché.'),
    row('li3', 'Lieu', 'Où est le bus ?', 'La route de campagne, des chèvres, un pare-brise plein de ciel.', ['Sur une route', 'Dans une cuisine', 'Dans un bocal'], 0, 'Un pare-brise et une route.', 'Le bus est sur la route.'),
    row('li4', 'Lieu', 'Où est Noé au début ?', 'Une casserole, une cuillère, Mamie qui goûte.', ['Dans la cuisine', 'Dans l’arbre', 'Au marché'], 0, 'La casserole situe la pièce.', 'Ils sont dans la cuisine.'),
    row('li5', 'Lieu', 'Où revolé le cerf-volant ?', 'De l’herbe, du vent, pas de toit, le bleu du papier dans le ciel.', ['Au-dessus d’un pré', 'Dans le bus', 'Sous l’eau'], 0, 'L’herbe ouverte est un pré.', 'Il vole au-dessus du pré.'),
    row('li6', 'Lieu', 'Où est le poisson ?', 'Un bocal, une lampe, des cahiers autour sur les tables.', ['Dans la classe', 'Sur la route', 'Dans l’arbre'], 0, 'Cahiers et tables : l’école.', 'Le bocal est dans la classe.'),
    row('li7', 'Lieu', 'Où est le dessin ?', 'Un mur, du ruban, des enfants qui reculent pour regarder.', ['Au mur', 'Dans la soupe', 'Sous le bus'], 0, 'Le ruban le fixe quelque part de vertical.', 'Il est au mur.'),
    row('li8', 'Lieu', 'Où étaient les jouets ?', 'La cour, puis des gouttes, puis les bras des élèves vers la porte.', ['Dans la cour, puis dans la classe', 'Au marché', 'Dans le pré'], 0, 'La cour est le début, la porte la fin.', 'Ils quittent la cour pour rentrer.')
  ];

  var personnages = [
    row('pe1', 'Personnages', 'En quoi Lina et son frère sont-ils différents ?', 'Lina regarde en l’air. Son frère secoue la branche.', ['Il agit, elle regarde', 'Elle secoue l’arbre', 'Ils font le même geste'], 0, 'Qui a les mains sur la branche ?', 'Le frère agit. Lina attend le chapeau.'),
    row('pe2', 'Personnages', 'En quoi les deux familles se ressemblent-elles ?', 'Chacune montre le panier. Chacune repart avec un sac.', ['Elles veulent la même chose et reçoivent une part', 'Une seule veut des fraises', 'Elles se disputent et partent sans rien'], 0, 'Le mot chacune les met ensemble.', 'Elles ont le même souhait et le même résultat.'),
    row('pe3', 'Personnages', 'En quoi le chauffeur et les chèvres sont-ils différents ?', 'Les chèvres avancent sans but sur la route. Le chauffeur attend sans klaxonner.', ['Il patiente, elles bloquent', 'Il pousse les chèvres', 'Les chèvres conduisent'], 0, 'L’un est patient, les autres occupent la route.', 'Le chauffeur choisit d’attendre.'),
    row('pe4', 'Personnages', 'En quoi Mamie et Noé sont-ils différents ?', 'Mamie reste près de la casserole. Noé sort et revient.', ['Noé se déplace, Mamie reste', 'Mamie court au marché', 'Noé goûte seulement'], 0, 'Qui quitte la cuisine ?', 'Noé fait le trajet.'),
    row('pe5', 'Personnages', 'En quoi Sara et le cerf-volant sont-ils différents ?', 'Sara recolle. Le cerf-volant ne peut pas se réparer seul.', ['Elle répare, lui subit', 'Il recolle le papier', 'Elle reste déchirée'], 0, 'Qui a les mains ?', 'Sara agit sur le cerf-volant.'),
    row('pe6', 'Personnages', 'En quoi le poisson du vendredi et celui du lundi sont-ils différents ?', 'Vendredi il est au fond. Lundi il est près de la lampe.', ['Il nage plus haut lundi', 'C’est un autre poisson', 'Il est sorti du bocal'], 0, 'Même poisson, autre hauteur.', 'Son nage a changé.'),
    row('pe7', 'Personnages', 'En quoi Yan et Inès sont-ils différents ici ?', 'Yan a mis un seul ruban. Inès en ajoute trois.', ['Elle renforce ce qu’il a commencé', 'Elle enlève son ruban', 'Yan ajoute les trois'], 0, 'Qui ajoute ?', 'Inès complète le travail de Yan.'),
    row('pe8', 'Personnages', 'En quoi la maîtresse et les élèves sont-ils différents ?', 'Elle ouvre la porte. Ils portent les jouets.', ['Elle donne le signal, ils portent', 'Ils ouvrent la porte', 'Elle porte tous les jouets'], 0, 'Un signal, puis une action de groupe.', 'Elle décide. Ils transportent.')
  ];

  var motColle = [
    row('co1', 'Mot collé', 'Que veut dire incapable ici ?', 'Lina est incapable d’atteindre le chapeau seule.', ['Pas capable', 'Très capable', 'Capable encore'], 0, 'In- veut souvent dire pas.', 'Incapable veut dire qu’elle ne peut pas.'),
    row('co2', 'Mot collé', 'Que veut dire repartager ici ?', 'La marchande doit repartager le panier.', ['Partager encore', 'Ne plus partager', 'Partager mal'], 0, 'Re- veut dire à nouveau.', 'Repartager, c’est partager une nouvelle fois.'),
    row('co3', 'Mot collé', 'Que veut dire refaire ici ?', 'Sara doit refaire le collage du cerf-volant.', ['Faire encore', 'Ne pas faire', 'Faire en dormant'], 0, 'Re- marque un deuxième essai.', 'Refaire, c’est recommencer.'),
    row('co4', 'Mot collé', 'Que veut dire inutile ici ?', 'Un seul ruban est inutile pour ce grand dessin.', ['Pas utile', 'Très utile', 'Utile demain seulement'], 0, 'In- retourne le sens.', 'Inutile veut dire que ça ne sert pas assez.'),
    row('co5', 'Mot collé', 'Que veut dire relire ici ?', 'Noé relit l’étiquette de la boîte.', ['Lire encore', 'Lire jamais', 'Lire de travers'], 0, 'Re- plus lire.', 'Relire, c’est lire une deuxième fois.'),
    row('co6', 'Mot collé', 'Que veut dire malheureux ici ?', 'Le poisson semblait malheureux au fond du bocal.', ['Pas heureux', 'Très heureux', 'Heureux encore'], 0, 'Mal- peut vouloir dire pas bien.', 'Malheureux veut dire triste, pas bien.'),
    row('co7', 'Mot collé', 'Que veut dire redescendre ici ?', 'Le chapeau peut redescendre si on secoue.', ['Descendre encore', 'Monter pour toujours', 'Rester en l’air'], 0, 'Il est déjà en haut.', 'Redescendre, c’est revenir vers le bas.'),
    row('co8', 'Mot collé', 'Que veut dire imprenable ici ?', 'La route semblait imprenable à cause des chèvres.', ['Qu’on ne peut pas prendre', 'Très facile', 'Déjà prise par le bus'], 0, 'Im- nie le verbe prendre.', 'Imprenable veut dire impossible à emprunter.')
  ];

  var poeme = [
    row('pm1', 'Poème', 'De quoi parle le poème ?', 'Un chapeau, un souffle,\nune branche, un frère.\nLes mains ouvertes\nreçoivent le bleu.', ['Un chapeau rattrapé', 'Un bus', 'Une soupe'], 0, 'Les mains qui reçoivent ferment l’histoire.', 'On récupère le chapeau.'),
    row('pm2', 'Poème', 'De quoi parle le poème ?', 'Un panier, deux regards.\nLa marchande partage.\nRouge dans deux sacs.\nPersonne ne rage.', ['Un partage de fraises', 'Un poisson', 'Un cerf-volant'], 0, 'Deux sacs pour deux personnes.', 'Les fraises sont partagées.'),
    row('pm3', 'Poème', 'De quoi parle le poème ?', 'Barbes, sabots, route étroite.\nLe bus apprend la politesse.\nOn attend le pré.\nPuis le moteur se réveille.', ['Un bus bloqué par des chèvres', 'Un dessin', 'Une pluie en classe'], 0, 'Sabots et route.', 'Les chèvres font attendre le bus.'),
    row('pm4', 'Poème', 'De quoi parle le poème ?', 'Cuillère, grimace.\nIl manque le blanc.\nPetites jambes, petite boîte.\nLa soupe dit merci.', ['La recherche du sel', 'Un chapeau', 'Un marché'], 0, 'Le goût blanc est le sel.', 'Noé rapporte ce qui manquait.'),
    row('pm5', 'Poème', 'De quoi parle le poème ?', 'Papier fendu, ciel trop grand.\nColle, doigts, carré bleu.\nDemain le pré\nrevoit son oiseau de fil.', ['Un cerf-volant réparé', 'Un poisson', 'Des chèvres'], 0, 'Fil et pré : on le fait voler.', 'Le cerf-volant est réparé.'),
    row('pm6', 'Poème', 'De quoi parle le poème ?', 'Vendredi au fond.\nLundi vers la lampe.\nL’eau a changé de robe.\nLe rouge remonte.', ['Un poisson qui va mieux', 'Un dessin au mur', 'Un chapeau'], 0, 'Fond puis lampe.', 'Le poisson remonte.'),
    row('pm7', 'Poème', 'De quoi parle le poème ?', 'Un ruban trop seul.\nTrois autres arrivent.\nLe mur garde l’image\ntoute la semaine.', ['Un dessin mieux fixé', 'Un bus', 'Une soupe'], 0, 'Le ruban sert à tenir.', 'Le dessin reste au mur.'),
    row('pm8', 'Poème', 'De quoi parle le poème ?', 'Gouttes sur la cour.\nPorte ouverte, bras chargés.\nBallon sous le pull.\nLa classe sent la pluie.', ['La fin de la récréation', 'Un cerf-volant', 'Un marché'], 0, 'La cour se vide vers la classe.', 'On rentre à cause de la pluie.')
  ];

  var consigne = [
    row('cg1', 'Consigne', 'Que fais-tu en SECOND ?', '1. Regarde l’arbre. 2. Secoue doucement. 3. Tends les mains. 4. Ramasse le chapeau.', ['Secouer doucement', 'Ramasser', 'Regarder'], 0, 'Le second vient juste après le premier.', 'L’étape 2 est de secouer.'),
    row('cg2', 'Consigne', 'Que fais-tu en DERNIER ?', '1. Compte les familles. 2. Ouvre deux sacs. 3. Partage les fraises. 4. Donne un sac à chacune.', ['Donner un sac', 'Compter les familles', 'Ouvrir les sacs'], 0, 'Dernier, c’est l’étape 4.', 'On donne les sacs à la fin.'),
    row('cg3', 'Consigne', 'Que fais-tu en PREMIER ?', '1. Regarde la route. 2. Vois les chèvres. 3. Arrête le bus. 4. Attends.', ['Regarder la route', 'Attendre', 'Arrêter le bus'], 0, 'Premier, c’est le début.', 'On regarde la route d’abord.'),
    row('cg4', 'Consigne', 'Que fais-tu en TROISIÈME ?', '1. Goûte. 2. Vois qu’il manque le sel. 3. Pars chez le voisin. 4. Reviens avec la boîte.', ['Partir chez le voisin', 'Goûter', 'Revenir'], 0, 'Troisième n’est pas la fin.', 'L’étape 3 est le départ.'),
    row('cg5', 'Consigne', 'Que fais-tu en SECOND ?', '1. Pose le cerf-volant. 2. Recolle le papier. 3. Laisse sécher. 4. Retourne au pré.', ['Recoller le papier', 'Retourner au pré', 'Poser le cerf-volant'], 0, 'On ne revolé pas tout de suite.', 'On recolle en deuxième.'),
    row('cg6', 'Consigne', 'Que fais-tu en DERNIER ?', '1. Observe le poisson. 2. Change l’eau. 3. Attends. 4. Vérifie s’il remonte.', ['Vérifier s’il remonte', 'Changer l’eau', 'Observer'], 0, 'Vérifier est la fin.', 'L’étape 4 est la vérification.'),
    row('cg7', 'Consigne', 'Que fais-tu en TROISIÈME ?', '1. Vois le dessin pencher. 2. Prends le ruban. 3. Ajoute trois morceaux. 4. Recule pour regarder.', ['Ajouter trois morceaux', 'Reculer', 'Voir le dessin'], 0, 'Ajouter vient avant de reculer.', 'L’étape 3 est d’ajouter.'),
    row('cg8', 'Consigne', 'Que fais-tu en PREMIER ?', '1. Regarde le ciel. 2. Sens les gouttes. 3. Ouvre la porte. 4. Rentre les jouets.', ['Regarder le ciel', 'Rentrer les jouets', 'Ouvrir la porte'], 0, 'Le ciel est le premier indice.', 'On regarde le ciel d’abord.')
  ];

  var reponseLettre = [
    row('rl1', 'Lettre', 'Que doit répondre Lina ?', 'Mot du frère : « Le chapeau est haut. Je secoue. Écarte-toi un peu. »', ['Je m’écarte. Merci.', 'Je grimpe sans regarder.', 'Je laisse le chapeau.'], 0, 'Il demande de s’écarter.', 'Elle doit se mettre en sécurité.'),
    row('rl2', 'Lettre', 'Que doit répondre une famille ?', 'Mot : « Je peux couper le panier en deux. Ça vous va ? »', ['Oui, la moitié nous va.', 'Non, on veut les deux sacs.', 'On ne veut plus de fraises.'], 0, 'Elle propose un partage.', 'Accepter la moitié est juste.'),
    row('rl3', 'Lettre', 'Que doit répondre un élève ?', 'Mot du chauffeur : « On attend les chèvres. Restez assis. »', ['D’accord, on reste assis.', 'On descend pousser.', 'On change de route à pied.'], 0, 'Il demande de rester assis.', 'La bonne réponse suit sa consigne.'),
    row('rl4', 'Lettre', 'Que doit répondre Noé ?', 'Mot : « Il manque le sel. Le voisin en a. Tu peux y aller ? »', ['J’y vais et je reviens.', 'Je goûte sans sel.', 'Je sors le poisson.'], 0, 'On lui demande un aller-retour.', 'Il accepte d’aller chercher le sel.'),
    row('rl5', 'Lettre', 'Que doit répondre Sara ?', 'Mot : « Le papier est déchiré. La colle est sur la table. »', ['Je vais recoller le cerf-volant.', 'Je vais le jeter.', 'Je vais le mettre dans la soupe.'], 0, 'La colle indique la réparation.', 'Elle doit recoller.'),
    row('rl6', 'Lettre', 'Que doit répondre la classe ?', 'Mot : « L’eau est trouble. Changez-la aujourd’hui. »', ['On change l’eau aujourd’hui.', 'On attend le mois prochain.', 'On sort le poisson dans la cour.'], 0, 'Aujourd’hui est clair.', 'Il faut changer l’eau maintenant.'),
    row('rl7', 'Lettre', 'Que doit répondre Inès ?', 'Mot de Yan : « Un ruban ne suffit pas. Tu en as d’autres ? »', ['Oui, j’en ajoute.', 'Non, je retire le dessin.', 'Je le mets sous la pluie.'], 0, 'Il demande plus de ruban.', 'Elle doit en ajouter.'),
    row('rl8', 'Lettre', 'Que doit répondre un élève ?', 'Mot : « Il pleut. Rentrez les ballons. »', ['Je rentre les ballons.', 'Je sors plus de ballons.', 'Je reste sous la pluie.'], 0, 'La consigne nomme les ballons.', 'Il faut les rentrer.')
  ];

  var faitDivers = [
    row('fd1', 'Fait divers', 'Quelle est la nouvelle ?', 'Ce matin, un chapeau coincé dans un arbre a été récupéré sans échelle.', ['Un chapeau a été récupéré', 'Une école a fermé', 'Un bus a gagné une course'], 0, 'La première information est la nouvelle.', 'On a récupéré le chapeau.'),
    row('fd2', 'Fait divers', 'Où cela se passe-t-il ?', 'Au marché du jeudi, le dernier panier de fraises a été partagé.', ['Au marché', 'Dans un bus', 'Dans un bocal'], 0, 'Le lieu est au début.', 'C’est le marché.'),
    row('fd3', 'Fait divers', 'Qui bloque la route ?', 'Info route : un troupeau de chèvres a retardé le bus scolaire.', ['Des chèvres', 'Des poissons', 'Des dessins'], 0, 'Le troupeau est nommé.', 'Les chèvres retardent le bus.'),
    row('fd4', 'Fait divers', 'Qu’est-ce qui manquait ?', 'Dans une cuisine du village, une soupe a attendu une boîte de sel.', ['Du sel', 'Un cerf-volant', 'Un ruban'], 0, 'La boîte a un contenu.', 'Il manquait du sel.'),
    row('fd5', 'Fait divers', 'Qu’est-ce qui a été réparé ?', 'Un cerf-volant bleu, déchiré hier, a revolé ce matin.', ['Un cerf-volant', 'Un bus', 'Un mur'], 0, 'Revolé montre l’objet.', 'Le cerf-volant a été réparé.'),
    row('fd6', 'Fait divers', 'Qu’est-ce qui a changé ?', 'Le poisson de la classe, au fond vendredi, nageait haut ce lundi.', ['Il nage plus haut', 'Il a quitté l’école', 'Il est devenu un chat'], 0, 'Haut contre fond.', 'Sa nage a changé.'),
    row('fd7', 'Fait divers', 'Combien de rubans en plus ?', 'Trois rubans ont été ajoutés pour garder un dessin au mur.', ['Trois', 'Un', 'Dix'], 0, 'Le nombre est au début.', 'On a ajouté trois rubans.'),
    row('fd8', 'Fait divers', 'Que doivent faire les élèves ?', 'Avis : dès les premières gouttes, rentrez les jouets de la cour.', ['Rentrer les jouets', 'Sortir plus de jouets', 'Compter les chèvres'], 0, 'L’avis donne un ordre.', 'Il faut rentrer les jouets.')
  ];

  var devinette = [
    row('dv1', 'Devinette', 'Qu’est-ce que c’est ?', 'Je suis bleu, je vole sans ailes d’oiseau, je me pose dans les feuilles. Qui suis-je ?', ['Un chapeau', 'Une soupe', 'Un bus'], 0, 'Il se pose dans un arbre.', 'C’est le chapeau.'),
    row('dv2', 'Devinette', 'Qu’est-ce que c’est ?', 'J’étais un seul panier. Un geste m’a fait devenir deux sacs. Qui suis-je ?', ['Des fraises à partager', 'Un poisson', 'Un ruban'], 0, 'Deux sacs viennent d’un panier.', 'Ce sont les fraises partagées.'),
    row('dv3', 'Devinette', 'Qu’est-ce que c’est ?', 'Nous avons des sabots, pas de billet, et le bus nous laisse passer. Qui sommes-nous ?', ['Des chèvres', 'Des livres', 'Des gâteaux'], 0, 'Les sabots marchent sur la route.', 'Ce sont les chèvres.'),
    row('dv4', 'Devinette', 'Qu’est-ce que c’est ?', 'Je suis blanc, je tiens dans une petite boîte, sans moi la soupe est fade. Qui suis-je ?', ['Le sel', 'Le chapeau', 'Le cerf-volant'], 0, 'Fade veut dire sans goût.', 'C’est le sel.'),
    row('dv5', 'Devinette', 'Qu’est-ce que c’est ?', 'On me déchire, on me recolle, le pré me revoit. Qui suis-je ?', ['Un cerf-volant', 'Un poisson', 'Un dessin au mur'], 0, 'Le pré et le ciel.', 'C’est le cerf-volant.'),
    row('dv6', 'Devinette', 'Qu’est-ce que c’est ?', 'Vendredi je suis bas. Lundi je cherche la lampe. Qui suis-je ?', ['Le poisson de la classe', 'Le bus', 'Le chapeau'], 0, 'Une lampe au-dessus d’un bocal.', 'C’est le poisson.'),
    row('dv7', 'Devinette', 'Qu’est-ce que c’est ?', 'Un seul de moi ne suffit pas. Trois autres sauvent un dessin. Qui suis-je ?', ['Du ruban', 'Du sel', 'Une chèvre'], 0, 'Je colle quelque chose au mur.', 'C’est le ruban.'),
    row('dv8', 'Devinette', 'Qu’est-ce que c’est ?', 'J’arrive sur la cour et les ballons rentrent sous les pulls. Qui suis-je ?', ['La pluie', 'Le soleil', 'Le sel'], 0, 'Les gouttes chassent le jeu.', 'C’est la pluie.')
  ];

  var scene = [
    row('sce1', 'Scène', 'Quelle scène est-ce ?', 'Une branche, un chapeau, deux mains ouvertes en dessous.', ['Le chapeau qui tombe', 'Le marché aux fraises', 'Le bus et les chèvres'], 0, 'Les mains attendent quelque chose qui descend.', 'C’est la scène du chapeau.'),
    row('sce2', 'Scène', 'Quelle scène est-ce ?', 'Deux sacs, des fraises rouges, une marchande au milieu.', ['Le partage au marché', 'La soupe', 'Le poisson'], 0, 'La marchande partage.', 'C’est le marché.'),
    row('sce3', 'Scène', 'Quelle scène est-ce ?', 'Un pare-brise, des chèvres, un bus arrêté.', ['Le bus bloqué', 'Le cerf-volant', 'Le mur de la classe'], 0, 'Le bus ne roule pas.', 'C’est la route.'),
    row('sce4', 'Scène', 'Quelle scène est-ce ?', 'Une casserole, une grimace, une petite boîte blanche.', ['La soupe qui attend le sel', 'La pluie dans la cour', 'Le dessin'], 0, 'La boîte blanche est le sel.', 'C’est la cuisine.'),
    row('sce5', 'Scène', 'Quelle scène est-ce ?', 'Du papier bleu, de la colle, un pré au loin.', ['Le cerf-volant réparé', 'Les chèvres', 'Le bocal'], 0, 'Colle et papier bleu.', 'C’est le cerf-volant.'),
    row('sce6', 'Scène', 'Quelle scène est-ce ?', 'Un bocal, une lampe, un poisson plus haut qu’avant.', ['Le poisson qui va mieux', 'Le chapeau', 'Le marché'], 0, 'Il a changé de hauteur.', 'C’est le bocal de la classe.'),
    row('sce7', 'Scène', 'Quelle scène est-ce ?', 'Un mur, plusieurs rubans, un dessin qui ne bouge plus.', ['Le dessin bien fixé', 'Le bus', 'La soupe'], 0, 'Les rubans tiennent une image.', 'C’est le mur de la classe.'),
    row('sce8', 'Scène', 'Quelle scène est-ce ?', 'Des gouttes, une porte ouverte, des jouets dans les bras.', ['La fin de la récréation', 'Le cerf-volant', 'Les fraises'], 0, 'On quitte la cour.', 'C’est la pluie sur la récréation.')
  ];

  var defi = [
    row('df1', 'Défi', 'De quoi ça parle surtout ?', 'Une branche, un chapeau, des mains qui le reçoivent.', ['Récupérer un chapeau', 'Nourrir un poisson', 'Partager des chèvres'], 0, 'Reste avec le chapeau.', 'On récupère le chapeau.'),
    row('df2', 'Défi', 'Pourquoi le bus attend-il ?', 'Des chèvres occupent la route étroite.', ['La route n’est pas libre', 'Le sel manque', 'Le dessin tombe'], 0, 'Regarde qui est sur la route.', 'Les chèvres bloquent le passage.'),
    row('df3', 'Défi', 'Quel mot va dans le trou ?', 'Sans la petite boîte, la soupe reste ____.', ['fade', 'bruyante', 'carrée'], 0, 'Sans sel, pas de goût.', 'Fade veut dire sans goût.'),
    row('df4', 'Défi', 'Quelle phrase a les deux faits ?', 'Le cerf-volant est déchiré. Le lendemain il revolé.', ['Il revolé après avoir été réparé.', 'Il reste au mur.', 'Les chèvres le mangent.'], 0, 'Déchiré et revolé.', 'La réparation relie les deux.'),
    row('df5', 'Défi', 'Ceci est-il un fait ou une idée ?', 'Texte : Inès ajoute trois rubans. Phrase : Le dessin est moche.', ['Une idée', 'Un fait', 'Le titre'], 0, 'Moche n’est pas écrit.', 'C’est seulement une idée.'),
    row('df6', 'Défi', 'Que veut dire « les gouttes gagnent » ?', 'La maîtresse regarde la cour.', ['Il faut rentrer', 'Il faut sortir', 'Il faut cuisiner'], 0, 'Gagner, ici, c’est être plus fort que le jeu.', 'La pluie fait rentrer les élèves.'),
    row('df7', 'Défi', 'Que fais-tu en deuxième ?', '1. Goûte. 2. Vois le manque. 3. Pars. 4. Reviens.', ['Voir le manque', 'Revenir', 'Goûter'], 0, 'Deuxième, c’est l’étape 2.', 'On voit qu’il manque quelque chose.'),
    row('df8', 'Défi', 'Qu’est-ce que c’est ?', 'Je suis rouge, j’étais un panier, me voilà dans deux sacs.', ['Des fraises partagées', 'Un chapeau', 'Un bus'], 0, 'Deux sacs viennent d’un seul panier.', 'Ce sont les fraises.')
  ];

  global.ChallengeFr = {
    idee: idee,
    pourquoi: pourquoi,
    motContexte: motContexte,
    deuxIndices: deuxIndices,
    ecoute: ecoute,
    faitIdee: faitIdee,
    veut: veut,
    quatre: quatre,
    detail: detail,
    replique: replique,
    lieu: lieu,
    personnages: personnages,
    motColle: motColle,
    poeme: poeme,
    consigne: consigne,
    reponseLettre: reponseLettre,
    faitDivers: faitDivers,
    devinette: devinette,
    scene: scene,
    defi: defi
  };
})(typeof window !== 'undefined' ? window : globalThis);
