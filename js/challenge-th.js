/**
 * Harder Thai games with a spoken prompt (say + lang).
 * lead is a romanization so the round still works if no Thai voice is installed.
 */
(function (global) {
  function row(id, skill, prompt, options, answer, hint, why, say, lead) {
    return {
      id: id,
      skill: skill,
      prompt: prompt,
      passage: '',
      lead: lead || '',
      options: options,
      answer: answer,
      hint: hint,
      why: why,
      say: say,
      lang: 'th-TH'
    };
  }

  var hearWord = [
    row('hw1', 'Word', 'Tap the word you hear.', ['แมว', 'นก', 'กบ', 'ปลา'], 0, 'A pet that says meow.', 'แมว is the cat.', 'แมว', 'Sound: maew (cat)'),
    row('hw2', 'Word', 'Tap the word you hear.', ['บ้าน', 'น้ำ', 'นา', 'บาน'], 0, 'A place where a family lives.', 'บ้าน means house.', 'บ้าน', 'Sound: baan (house)'),
    row('hw3', 'Word', 'Tap the word you hear.', ['นก', 'งู', 'หมู', 'หู'], 0, 'It has wings.', 'นก means bird.', 'นก', 'Sound: nok (bird)'),
    row('hw4', 'Word', 'Tap the word you hear.', ['น้ำ', 'นา', 'ม้า', 'มา'], 0, 'You drink it.', 'น้ำ means water.', 'น้ำ', 'Sound: naam (water)'),
    row('hw5', 'Word', 'Tap the word you hear.', ['หมา', 'มา', 'ม้า', 'หม่า'], 0, 'It barks.', 'หมา means dog.', 'หมา', 'Sound: maa (dog)'),
    row('hw6', 'Word', 'Tap the word you hear.', ['ปลา', 'ป่า', 'ปา', 'ผ่า'], 0, 'It swims.', 'ปลา means fish.', 'ปลา', 'Sound: bplaa (fish)'),
    row('hw7', 'Word', 'Tap the word you hear.', ['ช้าง', 'ช่าง', 'ข้าง', 'ฉาง'], 0, 'A very big animal.', 'ช้าง means elephant.', 'ช้าง', 'Sound: chaang (elephant)'),
    row('hw8', 'Word', 'Tap the word you hear.', ['ไข่', 'ไข้', 'ใข่', 'ข่าย'], 0, 'A chicken lays it.', 'ไข่ means egg.', 'ไข่', 'Sound: khai (egg)')
  ];

  var hearVowel = [
    row('hv1', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 1, 'The sound can stretch.', 'จา has the long aa vowel.', 'จา', 'Sound: jaa'),
    row('hv2', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 0, 'This one stops quickly.', 'จะ is a short a.', 'จะ', 'Sound: ja (short)'),
    row('hv3', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 1, 'อี stretches.', 'มี has a long ii.', 'มี', 'Sound: mee'),
    row('hv4', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 0, 'อิ is the short partner of อี.', 'มิ is a short i.', 'มิ', 'Sound: mi (short)'),
    row('hv5', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 1, 'อู lasts longer than อุ.', 'ปู has a long uu.', 'ปู', 'Sound: bpuu'),
    row('hv6', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 0, 'This u stops soon.', 'ปุ is a short u.', 'ปุ', 'Sound: bpu (short)'),
    row('hv7', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 1, 'เ- stays open.', 'เก is a long e.', 'เก', 'Sound: gay'),
    row('hv8', 'Vowel', 'Is the vowel you hear short or long?', ['Short', 'Long'], 0, 'เ-ะ closes quickly.', 'เกะ is a short e.', 'เกะ', 'Sound: ge (short)')
  ];

  var hearTone = [
    row('ht1', 'Tone mark', 'Which mark do you hear on กา?', ['no mark  กา', 'mai ek  ก่า', 'mai tho  ก้า', 'mai tri  ก๊า'], 0, 'A plain mid-class syllable with no mark.', 'กา has no tone mark.', 'กา', 'Sound: gaa (no mark)'),
    row('ht2', 'Tone mark', 'Which mark do you hear?', ['no mark  กา', 'mai ek  ก่า', 'mai tho  ก้า', 'mai chattawa  ก๋า'], 1, 'Mai ek is the first mark, one tick.', 'ก่า uses mai ek.', 'ก่า', 'Sound: gàa (mai ek)'),
    row('ht3', 'Tone mark', 'Which mark do you hear?', ['mai ek  ก่า', 'mai tho  ก้า', 'mai tri  ก๊า', 'no mark  กา'], 1, 'Mai tho looks like a small ้.', 'ก้า uses mai tho.', 'ก้า', 'Sound: gâa (mai tho)'),
    row('ht4', 'Tone mark', 'Which mark do you hear?', ['mai tri  ก๊า', 'mai ek  ก่า', 'mai tho  ก้า', 'no mark  กา'], 0, 'Mai tri looks like a small ๊.', 'ก๊า uses mai tri.', 'ก๊า', 'Sound: gáa (mai tri)'),
    row('ht5', 'Tone mark', 'Which mark do you hear?', ['mai chattawa  ก๋า', 'mai ek  ก่า', 'no mark  กา', 'mai tho  ก้า'], 0, 'Mai chattawa looks like a small ๋.', 'ก๋า uses mai chattawa.', 'ก๋า', 'Sound: gǎa (mai chattawa)'),
    row('ht6', 'Tone mark', 'Which mark is on the word you hear?', ['mai ek  ป่า', 'no mark  ปา', 'mai tho  ป้า', 'mai tri  ป๊า'], 2, 'Listen for the falling shape of mai tho.', 'ป้า uses mai tho.', 'ป้า', 'Sound: bpâa'),
    row('ht7', 'Tone mark', 'Which mark is on the word you hear?', ['no mark  คา', 'mai ek  ค่า', 'mai tri  ค๊า', 'mai chattawa  ค๋า'], 1, 'One tick over the syllable.', 'ค่า uses mai ek.', 'ค่า', 'Sound: khâa'),
    row('ht8', 'Tone mark', 'Which mark is on the word you hear?', ['mai tri  น๊า', 'mai ek  น่า', 'no mark  นา', 'mai tho  น้า'], 3, 'Mai tho is the second mark students learn.', 'น้า uses mai tho.', 'น้า', 'Sound: náa')
  ];

  var hearMae = [
    row('hm1', 'Mae', 'Which ending family do you hear?', ['Mae Gok (ก) นก', 'Mae Kong (ง) ช้าง', 'Mae Kom (ม) ส้ม', 'Mae Gob (บ) กบ'], 0, 'The word ends with a k sound.', 'นก ends with ก, Mae Gok.', 'นก', 'Sound: nok'),
    row('hm2', 'Mae', 'Which ending family do you hear?', ['Mae Kong (ง)', 'Mae Kon (น)', 'Mae Gok (ก)', 'Mae Gey (ย)'], 0, 'You hear ng at the end.', 'ช้าง ends with ง, Mae Kong.', 'ช้าง', 'Sound: chaang'),
    row('hm3', 'Mae', 'Which ending family do you hear?', ['Mae Kon (น)', 'Mae Kong (ง)', 'Mae Kom (ม)', 'Mae Geow (ว)'], 0, 'The end sounds like n.', 'บ้าน ends with น, Mae Kon.', 'บ้าน', 'Sound: baan'),
    row('hm4', 'Mae', 'Which ending family do you hear?', ['Mae Kom (ม)', 'Mae Kon (น)', 'Mae Gob (บ)', 'Mae God (ด)'], 0, 'The end sounds like m.', 'ส้ม ends with ม, Mae Kom.', 'ส้ม', 'Sound: som'),
    row('hm5', 'Mae', 'Which ending family do you hear?', ['Mae Gob (บ)', 'Mae Gok (ก)', 'Mae God (ด)', 'Mae Kom (ม)'], 0, 'The end is a p sound.', 'กบ ends with บ, Mae Gob.', 'กบ', 'Sound: gop'),
    row('hm6', 'Mae', 'Which ending family do you hear?', ['Mae God (ด)', 'Mae Gob (บ)', 'Mae Gok (ก)', 'Mae Kon (น)'], 0, 'The end is a t sound.', 'เป็ด ends with ด, Mae God.', 'เป็ด', 'Sound: pet'),
    row('hm7', 'Mae', 'Which ending family do you hear?', ['Mae Gey (ย)', 'Mae Geow (ว)', 'Mae Kong (ง)', 'Mae Kon (น)'], 0, 'The end glides like y.', 'ยาย ends with ย, Mae Gey.', 'ยาย', 'Sound: yaai'),
    row('hm8', 'Mae', 'Which ending family do you hear?', ['Mae Geow (ว)', 'Mae Gey (ย)', 'Mae Kom (ม)', 'Mae Gob (บ)'], 0, 'The end glides like w.', 'แมว ends with ว, Mae Geow.', 'แมว', 'Sound: maew')
  ];

  var hearLetter = [
    row('hl1', 'Letter', 'Tap the consonant you hear.', ['ก', 'ข', 'ค', 'ง'], 0, 'The name is gor gai.', 'กอ ไก่ is ก.', 'กอ ไก่', 'Name: gor gai'),
    row('hl2', 'Letter', 'Tap the consonant you hear.', ['ข', 'ก', 'ค', 'ฆ'], 0, 'The name is khor khai.', 'ขอ ไข่ is ข.', 'ขอ ไข่', 'Name: khor khai'),
    row('hl3', 'Letter', 'Tap the consonant you hear.', ['ค', 'ข', 'ก', 'ง'], 0, 'The name is khor khwaai.', 'คอ ควาย is ค.', 'คอ ควาย', 'Name: khor khwaai'),
    row('hl4', 'Letter', 'Tap the consonant you hear.', ['ง', 'น', 'ม', 'ย'], 0, 'The name is ngor ngu.', 'งอ งู is ง.', 'งอ งู', 'Name: ngor ngu'),
    row('hl5', 'Letter', 'Tap the consonant you hear.', ['จ', 'ช', 'ซ', 'ฌ'], 0, 'The name is jor jaan.', 'จอ จาน is จ.', 'จอ จาน', 'Name: jor jaan'),
    row('hl6', 'Letter', 'Tap the consonant you hear.', ['ด', 'ต', 'ถ', 'ท'], 0, 'The name is dor dek.', 'ดอ เด็ก is ด.', 'ดอ เด็ก', 'Name: dor dek'),
    row('hl7', 'Letter', 'Tap the consonant you hear.', ['บ', 'ป', 'ผ', 'ฝ'], 0, 'The name is bor bai mai.', 'บอ ใบไม้ is บ.', 'บอ ใบไม้', 'Name: bor bai mai'),
    row('hl8', 'Letter', 'Tap the consonant you hear.', ['ม', 'น', 'ณ', 'ญ'], 0, 'The name is mor maa.', 'มอ ม้า is ม.', 'มอ ม้า', 'Name: mor maa')
  ];

  var minimalPair = [
    row('mp1', 'Pair', 'Which spelling matches the sound?', ['กา', 'ก่า', 'ก้า', 'ก๋า'], 0, 'No extra mark.', 'The plain syllable is กา.', 'กา', 'Sound: gaa'),
    row('mp2', 'Pair', 'Which spelling matches the sound?', ['ก่า', 'กา', 'ก้า', 'ก๊า'], 0, 'Listen for mai ek.', 'Mai ek is written ก่า.', 'ก่า', 'Sound: gàa'),
    row('mp3', 'Pair', 'Which spelling matches the sound?', ['ก้า', 'ก่า', 'กา', 'ก๋า'], 0, 'Listen for mai tho.', 'Mai tho is written ก้า.', 'ก้า', 'Sound: gâa'),
    row('mp4', 'Pair', 'Which spelling matches the sound?', ['ก๋า', 'ก๊า', 'ก้า', 'กา'], 0, 'Listen for mai chattawa.', 'Mai chattawa is written ก๋า.', 'ก๋า', 'Sound: gǎa'),
    row('mp5', 'Pair', 'Which spelling matches the sound?', ['ป้า', 'ป่า', 'ปา', 'ป๊า'], 0, 'A long aa with mai tho.', 'ป้า carries mai tho.', 'ป้า', 'Sound: bpâa'),
    row('mp6', 'Pair', 'Which spelling matches the sound?', ['น่า', 'นา', 'น้า', 'น๊า'], 0, 'Mai ek over naa.', 'น่า carries mai ek.', 'น่า', 'Sound: nàa'),
    row('mp7', 'Pair', 'Which spelling matches the sound?', ['ม้า', 'มา', 'ม่ำ', 'ม๊า'], 0, 'Horse, with mai tho.', 'ม้า means horse.', 'ม้า', 'Sound: máa (horse)'),
    row('mp8', 'Pair', 'Which spelling matches the sound?', ['ไม้', 'ไม', 'ใหม่', 'ไหม'], 0, 'Wood, with mai ek.', 'ไม้ means wood.', 'ไม้', 'Sound: mai (wood)')
  ];

  var hearNumber = [
    row('hn1', 'Number', 'Tap the Thai digit you hear.', ['๑', '๒', '๓', '๔'], 0, 'It is the number one.', 'หนึ่ง is ๑.', 'หนึ่ง', 'Sound: nueng (1)'),
    row('hn2', 'Number', 'Tap the Thai digit you hear.', ['๒', '๑', '๓', '๕'], 0, 'It comes after one.', 'สอง is ๒.', 'สอง', 'Sound: song (2)'),
    row('hn3', 'Number', 'Tap the Thai digit you hear.', ['๓', '๔', '๒', '๘'], 0, 'It comes after two.', 'สาม is ๓.', 'สาม', 'Sound: saam (3)'),
    row('hn4', 'Number', 'Tap the Thai digit you hear.', ['๔', '๕', '๓', '๖'], 0, 'It comes after three.', 'สี่ is ๔.', 'สี่', 'Sound: sii (4)'),
    row('hn5', 'Number', 'Tap the Thai digit you hear.', ['๕', '๔', '๖', '๙'], 0, 'It is half of ten.', 'ห้า is ๕.', 'ห้า', 'Sound: haa (5)'),
    row('hn6', 'Number', 'Tap the Thai digit you hear.', ['๖', '๗', '๕', '๘'], 0, 'It comes after five.', 'หก is ๖.', 'หก', 'Sound: hok (6)'),
    row('hn7', 'Number', 'Tap the Thai digit you hear.', ['๗', '๘', '๖', '๙'], 0, 'It comes after six.', 'เจ็ด is ๗.', 'เจ็ด', 'Sound: jet (7)'),
    row('hn8', 'Number', 'Tap the Thai digit you hear.', ['๐', '๑', '๘', '๙'], 0, 'It means none.', 'ศูนย์ is ๐.', 'ศูนย์', 'Sound: suun (0)')
  ];

  var hearClass = [
    row('hc1', 'Class', 'What class is the letter you hear?', ['Middle', 'High', 'Low'], 0, 'Gor gai is a middle letter.', 'ก is middle class.', 'กอ ไก่', 'Name: gor gai, middle'),
    row('hc2', 'Class', 'What class is the letter you hear?', ['High', 'Middle', 'Low'], 0, 'Khor khai is high.', 'ข is high class.', 'ขอ ไข่', 'Name: khor khai, high'),
    row('hc3', 'Class', 'What class is the letter you hear?', ['Low', 'High', 'Middle'], 0, 'Khor khwaai is low.', 'ค is low class.', 'คอ ควาย', 'Name: khor khwaai, low'),
    row('hc4', 'Class', 'What class is the letter you hear?', ['Middle', 'High', 'Low'], 0, 'Jor jaan is middle.', 'จ is middle class.', 'จอ จาน', 'Name: jor jaan, middle'),
    row('hc5', 'Class', 'What class is the letter you hear?', ['High', 'Low', 'Middle'], 0, 'Sor seua is high.', 'ส is high class.', 'สอ เสือ', 'Name: sor seua, high'),
    row('hc6', 'Class', 'What class is the letter you hear?', ['Low', 'Middle', 'High'], 0, 'Mor maa is low.', 'ม is low class.', 'มอ ม้า', 'Name: mor maa, low'),
    row('hc7', 'Class', 'What class is the letter you hear?', ['Middle', 'Low', 'High'], 0, 'Dor dek is middle.', 'ด is middle class.', 'ดอ เด็ก', 'Name: dor dek, middle'),
    row('hc8', 'Class', 'What class is the letter you hear?', ['High', 'Middle', 'Low'], 0, 'Hor heep is high.', 'ห is high class.', 'หอ หีบ', 'Name: hor heep, high')
  ];

  var whichMaiEk = [
    row('we1', 'Mai ek', 'Which word has mai ek?', ['ก่า', 'กา', 'ก้า', 'ก๊า'], 0, 'Mai ek is a single tick.', 'Only ก่า has mai ek.', 'ก่า', 'Sound: gàa'),
    row('we2', 'Mai ek', 'Which word has mai ek?', ['ค่า', 'คา', 'ค้า', 'ค๊า'], 0, 'Look for one small tick.', 'ค่า has mai ek.', 'ค่า', 'Sound: khâa'),
    row('we3', 'Mai ek', 'Which word has mai ek?', ['ป่า', 'ปา', 'ป้า', 'ป๊า'], 0, 'One tick, not two.', 'ป่า has mai ek.', 'ป่า', 'Sound: bpàa'),
    row('we4', 'Mai ek', 'Which word has mai ek?', ['น่า', 'นา', 'น้า', 'น๊า'], 0, 'Ignore the plain syllable.', 'น่า has mai ek.', 'น่า', 'Sound: nàa'),
    row('we5', 'Mai ek', 'Which word has mai ek?', ['ไข่', 'ไข้', 'ใข', 'ไข'], 0, 'Egg uses mai ek.', 'ไข่ has mai ek.', 'ไข่', 'Sound: khai (egg)'),
    row('we6', 'Mai ek', 'Which word has mai ek?', ['ใหม่', 'ไหม', 'ใหม', 'หม'], 0, 'New uses mai ek.', 'ใหม่ has mai ek.', 'ใหม่', 'Sound: mai (new)'),
    row('we7', 'Mai ek', 'Which word has mai ek?', ['เก่ง', 'เกง', 'เก้ง', 'เกง'], 0, 'Clever, good at something, uses mai ek.', 'เก่ง has mai ek.', 'เก่ง', 'Sound: geng'),
    row('we8', 'Mai ek', 'Which word has mai ek?', ['เด็ก', 'เดก', 'เด้ก', 'เด๊ก'], 0, 'Child uses mai ek.', 'เด็ก has mai ek.', 'เด็ก', 'Sound: dek (child)')
  ];

  var sentenceMeaning = [
    row('sm1', 'Sentence', 'What does the sentence mean?', ['The cat is in the house.', 'The bird is in the water.', 'The dog is on the roof.', 'The fish is in the tree.'], 0, 'แมว is cat. บ้าน is house.', 'แมวอยู่ในบ้าน means the cat is in the house.', 'แมวอยู่ในบ้าน', 'แมวอยู่ในบ้าน — the cat is in the house'),
    row('sm2', 'Sentence', 'What does the sentence mean?', ['I drink water.', 'I eat an elephant.', 'I see a bird.', 'I have an egg.'], 0, 'ดื่ม is drink. น้ำ is water.', 'ฉันดื่มน้ำ means I drink water.', 'ฉันดื่มน้ำ', 'ฉันดื่มน้ำ — I drink water'),
    row('sm3', 'Sentence', 'What does the sentence mean?', ['The bird is small.', 'The bird is a house.', 'The fish is big.', 'The dog is blue.'], 0, 'เล็ก means small.', 'นกตัวเล็ก means the bird is small.', 'นกตัวเล็ก', 'นกตัวเล็ก — the bird is small'),
    row('sm4', 'Sentence', 'What does the sentence mean?', ['Mother has an egg.', 'Father has a car.', 'The cat has a book.', 'The fish has a hat.'], 0, 'แม่ is mother. ไข่ is egg.', 'แม่มีไข่ means mother has an egg.', 'แม่มีไข่', 'แม่มีไข่ — mother has an egg'),
    row('sm5', 'Sentence', 'What does the sentence mean?', ['The dog runs.', 'The dog sleeps.', 'The cat reads.', 'The bird cooks.'], 0, 'วิ่ง means run.', 'หมาวิ่ง means the dog runs.', 'หมาวิ่ง', 'หมาวิ่ง — the dog runs'),
    row('sm6', 'Sentence', 'What does the sentence mean?', ['The fish is in the water.', 'The fish is in the sky.', 'The elephant is in the cup.', 'The egg is a bird.'], 0, 'ปลา fish, น้ำ water.', 'ปลาอยู่ในน้ำ means the fish is in the water.', 'ปลาอยู่ในน้ำ', 'ปลาอยู่ในน้ำ — the fish is in the water'),
    row('sm7', 'Sentence', 'What does the sentence mean?', ['Grandmother is coming.', 'Grandmother is a cat.', 'The house is running.', 'The egg is big.'], 0, 'ยาย grandmother, มา come.', 'ยายมา means grandmother is coming.', 'ยายมา', 'ยายมา — grandmother is coming'),
    row('sm8', 'Sentence', 'What does the sentence mean?', ['The elephant is big.', 'The elephant is a fish.', 'The bird is water.', 'The egg runs.'], 0, 'ใหญ่ means big.', 'ช้างตัวใหญ่ means the elephant is big.', 'ช้างตัวใหญ่', 'ช้างตัวใหญ่ — the elephant is big')
  ];

  var confirmTone = [
    row('ct1', 'Check', 'You can read it and hear it. Which mark is on it?', ['no mark', 'mai ek', 'mai tho', 'mai tri'], 1, 'Look above the syllable and listen.', 'ค่า has mai ek.', 'ค่า', 'Written ค่า'),
    row('ct2', 'Check', 'You can read it and hear it. Which mark is on it?', ['mai tho', 'mai ek', 'no mark', 'mai chattawa'], 0, 'Two-part mark.', 'ป้า has mai tho.', 'ป้า', 'Written ป้า'),
    row('ct3', 'Check', 'You can read it and hear it. Which mark is on it?', ['no mark', 'mai ek', 'mai tho', 'mai tri'], 0, 'Nothing sits above กา.', 'กา has no tone mark.', 'กา', 'Written กา'),
    row('ct4', 'Check', 'You can read it and hear it. Which mark is on it?', ['mai tri', 'mai ek', 'mai tho', 'no mark'], 0, 'The mark looks like ๊.', 'ก๊า has mai tri.', 'ก๊า', 'Written ก๊า'),
    row('ct5', 'Check', 'You can read it and hear it. Which mark is on it?', ['mai chattawa', 'mai ek', 'no mark', 'mai tho'], 0, 'The mark looks like ๋.', 'ก๋า has mai chattawa.', 'ก๋า', 'Written ก๋า'),
    row('ct6', 'Check', 'You can read it and hear it. Which mark is on it?', ['mai ek', 'mai tho', 'no mark', 'mai tri'], 0, 'Egg uses one tick.', 'ไข่ has mai ek.', 'ไข่', 'Written ไข่'),
    row('ct7', 'Check', 'You can read it and hear it. Which mark is on it?', ['mai tho', 'mai ek', 'no mark', 'mai tri'], 0, 'Horse uses mai tho.', 'ม้า has mai tho.', 'ม้า', 'Written ม้า'),
    row('ct8', 'Check', 'You can read it and hear it. Which mark is on it?', ['no mark', 'mai ek', 'mai tho', 'mai chattawa'], 0, 'นา is a field, plain.', 'นา has no tone mark.', 'นา', 'Written นา')
  ];

  var wrongMark = [
    row('wm1', 'Spot', 'Which writing does NOT match the sound?', ['ก้า', 'กา', 'กา', 'กา'], 0, 'The sound has no mark. One choice adds one.', 'The sound is plain กา, so ก้า does not match.', 'กา', 'Sound: gaa. Three cards repeat the match. Tap the odd one.'),
    row('wm2', 'Spot', 'Which writing does NOT match the sound?', ['กา', 'ก่า', 'ก่า', 'ก่า'], 0, 'The sound uses mai ek.', 'กา is missing the mark you hear.', 'ก่า', 'Sound: gàa'),
    row('wm3', 'Spot', 'Which writing does NOT match the sound?', ['ก่า', 'ก้า', 'ก้า', 'ก้า'], 0, 'The sound uses mai tho, not mai ek.', 'ก่า is the wrong mark.', 'ก้า', 'Sound: gâa'),
    row('wm4', 'Spot', 'Which writing does NOT match the sound?', ['ปา', 'ป้า', 'ป้า', 'ป้า'], 0, 'You should hear mai tho.', 'ปา has no mark.', 'ป้า', 'Sound: bpâa'),
    row('wm5', 'Spot', 'Which writing does NOT match the sound?', ['น้า', 'น่า', 'น่า', 'น่า'], 0, 'Mai ek, not mai tho.', 'น้า has the other mark.', 'น่า', 'Sound: nàa'),
    row('wm6', 'Spot', 'Which writing does NOT match the sound?', ['ไข', 'ไข่', 'ไข่', 'ไข่'], 0, 'The egg word needs a mark.', 'ไข is missing mai ek.', 'ไข่', 'Sound: khai'),
    row('wm7', 'Spot', 'Which writing does NOT match the sound?', ['มา', 'ม้า', 'ม้า', 'ม้า'], 0, 'Horse needs mai tho.', 'มา does not mean horse.', 'ม้า', 'Sound: máa'),
    row('wm8', 'Spot', 'Which writing does NOT match the sound?', ['เด็ก', 'เดก', 'เด็ก', 'เด็ก'], 1, 'One card dropped the mark.', 'เดก is missing mai ek.', 'เด็ก', 'Sound: dek')
  ];

  var maeAudio = [
    row('ma1', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Geow (ว)', 'Mae Gok (ก)', 'Mae Kon (น)', 'Mae Kom (ม)'], 0, 'Cat ends with a w glide.', 'แมว is Mae Geow.', 'แมว', 'maew'),
    row('ma2', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Gok (ก)', 'Mae Gob (บ)', 'Mae God (ด)', 'Mae Kong (ง)'], 0, 'Bird ends with k.', 'นก is Mae Gok.', 'นก', 'nok'),
    row('ma3', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Gob (บ)', 'Mae Gok (ก)', 'Mae Kom (ม)', 'Mae Gey (ย)'], 0, 'Frog ends with p.', 'กบ is Mae Gob.', 'กบ', 'gop'),
    row('ma4', 'Mae', 'Hear the word. What is its Mae family?', ['Mae God (ด)', 'Mae Gob (บ)', 'Mae Kon (น)', 'Mae Geow (ว)'], 0, 'Duck ends with t.', 'เป็ด is Mae God.', 'เป็ด', 'pet'),
    row('ma5', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Kom (ม)', 'Mae Kong (ง)', 'Mae Kon (น)', 'Mae Gok (ก)'], 0, 'Orange ends with m.', 'ส้ม is Mae Kom.', 'ส้ม', 'som'),
    row('ma6', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Kon (น)', 'Mae Kong (ง)', 'Mae Kom (ม)', 'Mae Gey (ย)'], 0, 'House ends with n.', 'บ้าน is Mae Kon.', 'บ้าน', 'baan'),
    row('ma7', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Kong (ง)', 'Mae Kon (น)', 'Mae Geow (ว)', 'Mae Gob (บ)'], 0, 'Elephant ends with ng.', 'ช้าง is Mae Kong.', 'ช้าง', 'chaang'),
    row('ma8', 'Mae', 'Hear the word. What is its Mae family?', ['Mae Gey (ย)', 'Mae Geow (ว)', 'Mae Kom (ม)', 'Mae God (ด)'], 0, 'Grandmother ends with y.', 'ยาย is Mae Gey.', 'ยาย', 'yaai')
  ];

  var twoSentence = [
    row('ts1', 'Listen', 'Who is in the house?', ['The cat', 'The bird', 'The fish', 'The elephant'], 0, 'แมว is the animal you hear first.', 'แมวอยู่ในบ้าน — the cat is in the house.', 'แมวอยู่ในบ้าน', 'แมวอยู่ในบ้าน'),
    row('ts2', 'Listen', 'Where is the fish?', ['In the water', 'In the tree', 'On the roof', 'In the car'], 0, 'น้ำ means water.', 'ปลาอยู่ในน้ำ — the fish is in the water.', 'ปลาอยู่ในน้ำ', 'ปลาอยู่ในน้ำ'),
    row('ts3', 'Listen', 'Who is coming?', ['Grandmother', 'A bird', 'A frog', 'A duck'], 0, 'ยาย means grandmother.', 'ยายมา — grandmother is coming.', 'ยายมา', 'ยายมา'),
    row('ts4', 'Listen', 'What does the dog do?', ['It runs', 'It reads', 'It cooks', 'It flies'], 0, 'วิ่ง means run.', 'หมาวิ่ง — the dog runs.', 'หมาวิ่ง', 'หมาวิ่ง'),
    row('ts5', 'Listen', 'What does the child have?', ['An egg', 'A house', 'An elephant', 'A car'], 0, 'ไข่ means egg.', 'เด็กมีไข่ — the child has an egg.', 'เด็กมีไข่', 'เด็กมีไข่'),
    row('ts6', 'Listen', 'What is big?', ['The elephant', 'The egg', 'The water drop', 'The bird'], 0, 'ใหญ่ means big.', 'ช้างตัวใหญ่ — the elephant is big.', 'ช้างตัวใหญ่', 'ช้างตัวใหญ่'),
    row('ts7', 'Listen', 'What do I drink?', ['Water', 'A book', 'A shoe', 'A roof'], 0, 'น้ำ means water.', 'ฉันดื่มน้ำ — I drink water.', 'ฉันดื่มน้ำ', 'ฉันดื่มน้ำ'),
    row('ts8', 'Listen', 'Where is the bird?', ['It is small, not a place question — the bird is small', 'In the sea', 'In a car', 'On the moon'], 0, 'The sentence describes size, not a room.', 'นกตัวเล็ก says the bird is small.', 'นกตัวเล็ก', 'นกตัวเล็ก — the bird is small')
  ];

  var digitDictation = [
    row('dd1', 'Digits', 'Tap the Thai number you hear.', ['๒๑', '๑๒', '๒๐', '๑๑'], 0, 'Twenty and then one.', '21 is ๒๑.', 'ยี่สิบเอ็ด', 'yii-sip-et = 21'),
    row('dd2', 'Digits', 'Tap the Thai number you hear.', ['๑๕', '๕๑', '๑๔', '๕๐'], 0, 'Ten and five.', '15 is ๑๕.', 'สิบห้า', 'sip-haa = 15'),
    row('dd3', 'Digits', 'Tap the Thai number you hear.', ['๓๐', '๑๓', '๓๑', '๐๓'], 0, 'Thirty exactly.', '30 is ๓๐.', 'สามสิบ', 'saam-sip = 30'),
    row('dd4', 'Digits', 'Tap the Thai number you hear.', ['๑๐', '๐๑', '๑๑', '๒๐'], 0, 'Just ten.', '10 is ๑๐.', 'สิบ', 'sip = 10'),
    row('dd5', 'Digits', 'Tap the Thai number you hear.', ['๔๒', '๒๔', '๔๐', '๒๒'], 0, 'Forty and two.', '42 is ๔๒.', 'สี่สิบสอง', 'sii-sip-song = 42'),
    row('dd6', 'Digits', 'Tap the Thai number you hear.', ['๕๐', '๑๕', '๕๕', '๐๕'], 0, 'Five tens.', '50 is ๕๐.', 'ห้าสิบ', 'haa-sip = 50'),
    row('dd7', 'Digits', 'Tap the Thai number you hear.', ['๑๑', '๑๐', '๒๑', '๑๒'], 0, 'Ten and one.', '11 is ๑๑.', 'สิบเอ็ด', 'sip-et = 11'),
    row('dd8', 'Digits', 'Tap the Thai number you hear.', ['๒๕', '๕๒', '๒๐', '๑๕'], 0, 'Twenty and five.', '25 is ๒๕.', 'ยี่สิบห้า', 'yii-sip-haa = 25')
  ];

  var vowelHunt = [
    row('vh1', 'Vowel', 'Which vowel sound do you hear?', ['อา long aa', 'อิ short i', 'อู long uu', 'เอะ short e'], 0, 'It sounds like aa in father.', 'You hear long aa.', 'อา', 'aa'),
    row('vh2', 'Vowel', 'Which vowel sound do you hear?', ['อิ short i', 'อี long ii', 'อา long aa', 'อุ short u'], 0, 'A quick i.', 'You hear short i.', 'อิ', 'i (short)'),
    row('vh3', 'Vowel', 'Which vowel sound do you hear?', ['อี long ii', 'อิ short i', 'อุ short u', 'อา long aa'], 0, 'A long ii, as in see.', 'You hear long ii.', 'อี', 'ii'),
    row('vh4', 'Vowel', 'Which vowel sound do you hear?', ['อุ short u', 'อู long uu', 'อิ short i', 'เอ long e'], 0, 'A short u.', 'You hear short u.', 'อุ', 'u (short)'),
    row('vh5', 'Vowel', 'Which vowel sound do you hear?', ['อู long uu', 'อุ short u', 'โอ long o', 'อา long aa'], 0, 'A long uu, as in food.', 'You hear long uu.', 'อู', 'uu'),
    row('vh6', 'Vowel', 'Which vowel sound do you hear?', ['เอ long e', 'เอะ short e', 'อิ short i', 'อา long aa'], 0, 'A long e, as in gay.', 'You hear long e.', 'เอ', 'e (long)'),
    row('vh7', 'Vowel', 'Which vowel sound do you hear?', ['เอะ short e', 'เอ long e', 'อะ short a', 'อา long aa'], 0, 'The short e stops.', 'You hear short e.', 'เอะ', 'e (short)'),
    row('vh8', 'Vowel', 'Which vowel sound do you hear?', ['โอ long o', 'อุ short u', 'อิ short i', 'เอะ short e'], 0, 'A long o.', 'You hear long o.', 'โอ', 'o (long)')
  ];

  var obsoleteListen = [
    row('ob1', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Those two letters are not used in today’s words.', 'กา uses ก, not ฃ.', 'กา', 'gaa — ordinary ก'),
    row('ob2', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Chicken is written with ไก่, not the old letter.', 'ไก่ uses ก.', 'ไก่', 'gai — chicken'),
    row('ob3', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Egg uses ข, the living high letter.', 'ไข่ uses ข.', 'ไข่', 'khai — egg'),
    row('ob4', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Person uses คน with ค.', 'คน uses ค.', 'คน', 'khon — person'),
    row('ob5', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Water uses น and ำ.', 'น้ำ does not use the old letters.', 'น้ำ', 'naam — water'),
    row('ob6', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'House uses บ and น.', 'บ้าน is a normal spelling.', 'บ้าน', 'baan — house'),
    row('ob7', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Dog uses ห and ม.', 'หมา is ordinary.', 'หมา', 'maa — dog'),
    row('ob8', 'Old letters', 'Does the word you hear use ฃ or ฅ?', ['No', 'Yes'], 0, 'Fish uses ป and ล.', 'ปลา is ordinary.', 'ปลา', 'bplaa — fish')
  ];

  var karaokeListen = [
    row('ka1', 'Name the mark', 'What is the name of the mark you hear?', ['Mai ek', 'Mai tho', 'Mai tri', 'No mark'], 0, 'One tick.', 'ก่า is mai ek.', 'ก่า', 'gàa'),
    row('ka2', 'Name the mark', 'What is the name of the mark you hear?', ['Mai tho', 'Mai ek', 'Mai chattawa', 'Mai tri'], 0, 'The mark looks like ้.', 'ก้า is mai tho.', 'ก้า', 'gâa'),
    row('ka3', 'Name the mark', 'What is the name of the mark you hear?', ['Mai tri', 'Mai ek', 'Mai tho', 'No mark'], 0, 'The mark looks like ๊.', 'ก๊า is mai tri.', 'ก๊า', 'gáa'),
    row('ka4', 'Name the mark', 'What is the name of the mark you hear?', ['Mai chattawa', 'Mai tri', 'Mai ek', 'Mai tho'], 0, 'The mark looks like ๋.', 'ก๋า is mai chattawa.', 'ก๋า', 'gǎa'),
    row('ka5', 'Name the mark', 'What is the name of the mark you hear?', ['No mark', 'Mai ek', 'Mai tho', 'Mai tri'], 0, 'Nothing extra is written.', 'กา has no mark.', 'กา', 'gaa'),
    row('ka6', 'Name the mark', 'What is the name of the mark you hear?', ['Mai ek', 'Mai tho', 'No mark', 'Mai tri'], 0, 'Egg.', 'ไข่ is mai ek.', 'ไข่', 'khai'),
    row('ka7', 'Name the mark', 'What is the name of the mark you hear?', ['Mai tho', 'Mai ek', 'No mark', 'Mai chattawa'], 0, 'Horse.', 'ม้า is mai tho.', 'ม้า', 'maa horse'),
    row('ka8', 'Name the mark', 'What is the name of the mark you hear?', ['Mai ek', 'No mark', 'Mai tho', 'Mai tri'], 0, 'Child.', 'เด็ก is mai ek.', 'เด็ก', 'dek')
  ];

  var comicListen = [
    row('cl1', 'Panel', 'Which panel matches the line you hear?', ['A cat in a house', 'A fish in a tree', 'A bird in a pot', 'An egg on a bus'], 0, 'แมว and บ้าน.', 'The line puts the cat in the house.', 'แมวอยู่ในบ้าน', 'แมวอยู่ในบ้าน'),
    row('cl2', 'Panel', 'Which panel matches the line you hear?', ['A person drinking water', 'A person riding an elephant', 'A bird cooking', 'A dog reading'], 0, 'ดื่มน้ำ.', 'Someone drinks water.', 'ฉันดื่มน้ำ', 'ฉันดื่มน้ำ'),
    row('cl3', 'Panel', 'Which panel matches the line you hear?', ['A small bird', 'A huge fish in the sky', 'A house running', 'A blue egg driving'], 0, 'เล็ก means small.', 'The bird is small.', 'นกตัวเล็ก', 'นกตัวเล็ก'),
    row('cl4', 'Panel', 'Which panel matches the line you hear?', ['Grandmother walking toward you', 'A frog driving', 'A duck in a book', 'A cat that is a mountain'], 0, 'ยายมา.', 'Grandmother comes.', 'ยายมา', 'ยายมา'),
    row('cl5', 'Panel', 'Which panel matches the line you hear?', ['A dog running', 'A dog sleeping in class', 'A fish teaching', 'An egg singing'], 0, 'วิ่ง.', 'The dog runs.', 'หมาวิ่ง', 'หมาวิ่ง'),
    row('cl6', 'Panel', 'Which panel matches the line you hear?', ['A big elephant', 'A tiny elephant in a cup', 'A fish with boots', 'A bird made of water'], 0, 'ใหญ่.', 'The elephant is big.', 'ช้างตัวใหญ่', 'ช้างตัวใหญ่'),
    row('cl7', 'Panel', 'Which panel matches the line you hear?', ['A fish in water', 'A fish in a tree', 'An elephant in a cup', 'An egg flying'], 0, 'ปลา and น้ำ.', 'The fish is in the water.', 'ปลาอยู่ในน้ำ', 'ปลาอยู่ในน้ำ'),
    row('cl8', 'Panel', 'Which panel matches the line you hear?', ['A child holding an egg', 'A child holding a bus', 'A house holding a cat', 'A bird holding a mountain'], 0, 'เด็ก and ไข่.', 'The child has an egg.', 'เด็กมีไข่', 'เด็กมีไข่')
  ];

  var thaiBoss = [
    row('tb1', 'Boss', 'Tap the word.', ['น้ำ', 'นา', 'ม้า', 'มา'], 0, 'You drink it.', 'น้ำ is water.', 'น้ำ', 'naam'),
    row('tb2', 'Boss', 'Short or long?', ['Long', 'Short'], 0, 'Stretch the vowel.', 'มี is long.', 'มี', 'mee'),
    row('tb3', 'Boss', 'Which mark?', ['mai ek', 'mai tho', 'no mark', 'mai tri'], 0, 'One tick.', 'ก่า is mai ek.', 'ก่า', 'gàa'),
    row('tb4', 'Boss', 'Which Mae?', ['Mae Kon (น)', 'Mae Kong (ง)', 'Mae Gok (ก)', 'Mae Gob (บ)'], 0, 'Ends with n.', 'บ้าน is Mae Kon.', 'บ้าน', 'baan'),
    row('tb5', 'Boss', 'Which letter?', ['ม', 'น', 'ง', 'ย'], 0, 'Mor maa.', 'ม is mor maa.', 'มอ ม้า', 'mor maa'),
    row('tb6', 'Boss', 'Which class?', ['High', 'Middle', 'Low'], 0, 'Sor seua is high.', 'ส is high class.', 'สอ เสือ', 'sor seua'),
    row('tb7', 'Boss', 'Which digits?', ['๑๕', '๕๑', '๑๐', '๕๐'], 0, 'Fifteen.', '15 is ๑๕.', 'สิบห้า', '15'),
    row('tb8', 'Boss', 'What does it mean?', ['The dog runs.', 'The dog reads.', 'The cat cooks.', 'The fish flies.'], 0, 'หมา and วิ่ง.', 'หมาวิ่ง means the dog runs.', 'หมาวิ่ง', 'หมาวิ่ง')
  ];

  global.ChallengeTh = {
    hearWord: hearWord,
    hearVowel: hearVowel,
    hearTone: hearTone,
    hearMae: hearMae,
    hearLetter: hearLetter,
    minimalPair: minimalPair,
    hearNumber: hearNumber,
    hearClass: hearClass,
    whichMaiEk: whichMaiEk,
    sentenceMeaning: sentenceMeaning,
    confirmTone: confirmTone,
    wrongMark: wrongMark,
    maeAudio: maeAudio,
    twoSentence: twoSentence,
    digitDictation: digitDictation,
    vowelHunt: vowelHunt,
    obsoleteListen: obsoleteListen,
    karaokeListen: karaokeListen,
    comicListen: comicListen,
    thaiBoss: thaiBoss
  };
})(typeof window !== 'undefined' ? window : globalThis);
