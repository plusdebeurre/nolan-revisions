/**
 * Lantern chapter. One verb per subject. The lesson is the move that opens the way.
 * Kenney tiles only. No coins grant XP. The runner awards the three gates.
 */
(function (global) {
  function nearest(scene, key) {
    const tex = scene.textures.get(key);
    if (tex && tex.setFilter) tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  function banner(scene, text) {
    return scene.add.text(12, 8, text, {
      fontFamily: 'Fredoka, Sarabun, sans-serif',
      fontSize: '15px',
      color: '#0f172a',
      backgroundColor: '#fef3c7',
      padding: { x: 6, y: 4 }
    }).setScrollFactor(0).setDepth(20);
  }

  function tag(scene, x, y, text) {
    return scene.add.text(x, y, text, {
      fontFamily: 'Fredoka, Sarabun, sans-serif',
      fontSize: '14px',
      color: '#0f172a',
      backgroundColor: '#ffffff'
    }).setOrigin(0.5, 1);
  }

  function friend(scene, x, y) {
    return scene.add.sprite(x, y, 'hero', 1).setScale(2).setTint(0xffe14a);
  }

  function hero(scene, x, y) {
    const player = scene.physics.add.sprite(x, y, 'hero', 0);
    player.setScale(2);
    player.body.setSize(12, 16);
    player.setCollideWorldBounds(true);
    return player;
  }

  function tool(label, fn) {
    const box = document.getElementById('arcade-program');
    if (!box) return;
    box.classList.remove('hidden');
    box.innerHTML = '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-primary';
    button.textContent = label;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      fn();
    });
    box.appendChild(button);
  }

  function steer(player, pad, speed) {
    let vx = 0;
    let vy = 0;
    if (pad.left) vx = -speed;
    if (pad.right) vx = speed;
    if (pad.up) vy = -speed;
    if (pad.down) vy = speed;
    player.setVelocity(vx, vy);
  }

  function still(sprite) {
    if (!sprite.body) return;
    sprite.body.setAllowGravity(false);
    sprite.body.setImmovable(true);
    sprite.body.moves = false;
  }

  function crumbs(scene, hooks, api) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    const width = 2200;
    scene.physics.world.setBounds(0, 0, width, 270);
    scene.cameras.main.setBounds(0, 0, width, 270);
    friend(scene, 36, 180);
    const player = hero(scene, 70, 150);
    player.body.setAllowGravity(false);
    scene.cameras.main.startFollow(player, true, 0.14, 0.14);
    const note = banner(scene, 'Crumbs: 0. The door needs 10.');
    let pocket = 0;
    let beat = hooks.startGate || 0;
    let locked = false;
    const rooms = [
      { crumbs: [[220, 110, 2], [340, 70, 3], [470, 150, 5], [300, 190, 1]], door: 620 },
      { crumbs: [[980, 90, 4], [1120, 160, 6], [1240, 80, 2]], door: 1380 },
      { crumbs: [[1680, 140, 1], [1800, 80, 4], [1920, 160, 5], [1760, 190, 3]], door: 2080 }
    ];
    function paint() {
      note.setText(pocket === 10 ? 'Crumbs: 10. Open the door.' : 'Crumbs: ' + pocket + '. The door needs 10.');
    }
    rooms.forEach((room, index) => {
      const reset = scene.physics.add.sprite(room.door - 220, 210, 'tiles', 0).setScale(2).setTint(0x86efac);
      still(reset);
      tag(scene, reset.x, reset.y - 16, 'reset');
      scene.physics.add.overlap(player, reset, () => {
        if (locked || index !== beat) return;
        pocket = 0;
        paint();
      });
      room.crumbs.forEach((bit) => {
        if (index < beat) return;
        const sprite = scene.physics.add.sprite(bit[0], bit[1], 'tiles', 48).setScale(2);
        still(sprite);
        const label = tag(scene, bit[0], bit[1] - 8, String(bit[2]));
        scene.physics.add.overlap(player, sprite, () => {
          if (locked || index !== beat || !sprite.active) return;
          pocket += bit[2];
          sprite.destroy();
          label.destroy();
          paint();
        });
      });
      if (index < beat) return;
      const door = scene.physics.add.sprite(room.door, 140, 'tiles', 20).setScale(2).setTint(0xfbbf24);
      still(door);
      scene.physics.add.overlap(player, door, () => {
        if (locked || index !== beat || !door.active) return;
        if (pocket !== 10) {
          note.setText(pocket > 10 ? 'Too many. Step on reset.' : 'Need 10 crumbs.');
          return;
        }
        locked = true;
        door.destroy();
        hooks.onLessonPass('Crumbs make 10, door ' + (index + 1));
      });
    });
    if (beat > 0) player.setX(rooms[Math.min(beat, rooms.length) - 1].door + 30);
    api.onTick = () => steer(player, hooks.pad, 150);
    api.onPass = () => {
      pocket = 0;
      beat += 1;
      locked = false;
      paint();
    };
    paint();
  }

  function squareOfFour(cells) {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (cells[y][x] && cells[y][x + 1] && cells[y + 1][x] && cells[y + 1][x + 1]) return true;
      }
    }
    return false;
  }

  function hut(scene, hooks, api) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    friend(scene, 40, 210);
    scene.add.sprite(430, 210, 'tiles', 20).setScale(2).setTint(0xfbbf24);
    const cells = [];
    const images = [];
    for (let y = 0; y < 4; y++) {
      cells[y] = [];
      images[y] = [];
      for (let x = 0; x < 4; x++) {
        cells[y][x] = false;
        images[y][x] = scene.add.image(150 + x * 48, 54 + y * 48, 'tiles', 0).setScale(2).setTint(0xcbd5e1);
      }
    }
    let beat = hooks.startGate || 0;
    let locked = false;
    const note = banner(scene, 'Room ' + (beat + 1) + '. Build a closed square of 4 blocks.');
    function paint() {
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          images[y][x].setTint(cells[y][x] ? 0xf59e0b : 0xcbd5e1);
        }
      }
    }
    scene.input.on('pointerdown', (pointer) => {
      if (locked) return;
      const x = Math.floor((pointer.worldX - 126) / 48);
      const y = Math.floor((pointer.worldY - 30) / 48);
      if (x < 0 || y < 0 || x > 3 || y > 3) return;
      cells[y][x] = !cells[y][x];
      paint();
    });
    tool('Check the hut', () => {
      if (locked) return;
      if (!squareOfFour(cells)) {
        note.setText('The shape needs 4 closed sides.');
        return;
      }
      locked = true;
      hooks.onLessonPass('Closed square, room ' + (beat + 1));
    });
    api.onPass = () => {
      beat += 1;
      locked = false;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) cells[y][x] = false;
      }
      paint();
      note.setText('Room ' + (beat + 1) + '. Build a closed square of 4 blocks.');
    };
  }

  function crates(scene, hooks, api) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    scene.physics.world.setBounds(0, 0, 480, 270);
    friend(scene, 36, 40);
    const lanes = [78, 145, 212];
    const player = hero(scene, 70, lanes[1]);
    player.body.setAllowGravity(false);
    const rounds = [
      { prompt: 'Catch the next word: The small ___', words: ['hero', 'rock', 'never'], answer: 'hero' },
      { prompt: 'Catch the next word: a yellow ___', words: ['friend', 'boot', 'always'], answer: 'friend' },
      { prompt: 'Catch the next word: the lost ___', words: ['lantern', 'sock', 'never'], answer: 'lantern' }
    ];
    let beat = hooks.startGate || 0;
    let locked = false;
    let lane = 1;
    let upWas = false;
    let downWas = false;
    let spawn = 0;
    const flying = [];
    const note = banner(scene, rounds[Math.min(beat, 2)].prompt);
    function clearFlying() {
      flying.splice(0).forEach((row) => {
        if (row.sprite.active) row.sprite.destroy();
        if (row.label.active) row.label.destroy();
      });
    }
    api.onTick = (delta) => {
      if (hooks.pad.up && !upWas) lane = Math.max(0, lane - 1);
      if (hooks.pad.down && !downWas) lane = Math.min(2, lane + 1);
      upWas = !!hooks.pad.up;
      downWas = !!hooks.pad.down;
      player.setPosition(70, lanes[lane]);
      player.setVelocity(0, 0);
      if (locked) return;
      spawn += delta;
      const round = rounds[Math.min(beat, 2)];
      if (spawn > 1000) {
        spawn = 0;
        const word = round.words[Math.floor(Math.random() * round.words.length)];
        const y = lanes[Math.floor(Math.random() * lanes.length)];
        const sprite = scene.physics.add.sprite(500, y, 'tiles', 48).setScale(2);
        sprite.body.setAllowGravity(false);
        sprite.setVelocityX(-90);
        const label = tag(scene, 500, y - 6, word);
        flying.push({ sprite: sprite, label: label, word: word });
        scene.physics.add.overlap(player, sprite, () => {
          if (locked || !sprite.active) return;
          const hit = word;
          sprite.destroy();
          label.destroy();
          if (hit === round.answer) {
            locked = true;
            clearFlying();
            hooks.onLessonPass('Next word ' + hit + ' ' + (beat + 1));
          } else note.setText('Not that word. ' + round.prompt);
        });
      }
      flying.forEach((row) => {
        if (!row.sprite.active) return;
        row.label.setPosition(row.sprite.x, row.sprite.y - 6);
        if (row.sprite.x < -30) {
          row.sprite.destroy();
          row.label.destroy();
        }
      });
    };
    api.onPass = () => {
      beat += 1;
      locked = false;
      spawn = 0;
      clearFlying();
      if (rounds[beat]) note.setText(rounds[beat].prompt);
    };
  }

  function logs(scene, hooks, api) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    scene.physics.world.setBounds(0, 0, 480, 270);
    for (let x = 0; x < 480; x += 36) scene.add.image(x, 228, 'tiles', 0).setOrigin(0, 0).setScale(2);
    const floor = scene.add.rectangle(240, 252, 480, 24, 0x166534, 0);
    scene.physics.add.existing(floor, true);
    friend(scene, 28, 190);
    const player = hero(scene, 48, 180);
    scene.physics.add.collider(player, floor);
    const rounds = [
      { prompt: 'Pose le pied sur « le ».', words: ['le', 'un', 'la'], answer: 0 },
      { prompt: 'Pose le pied sur « chat ».', words: ['chien', 'chat', 'rat'], answer: 1 },
      { prompt: 'Pose le pied sur « dort ».', words: ['court', 'mange', 'dort'], answer: 2 }
    ];
    let beat = hooks.startGate || 0;
    let locked = false;
    let jumpHeld = false;
    const pieces = [];
    const note = banner(scene, rounds[Math.min(beat, 2)].prompt);
    function clearPieces() {
      pieces.splice(0).forEach((piece) => {
        if (piece.image) piece.image.destroy();
        if (piece.label) piece.label.destroy();
        if (piece.body) piece.body.destroy();
      });
    }
    function layout() {
      clearPieces();
      const round = rounds[Math.min(beat, 2)];
      note.setText(round.prompt);
      round.words.forEach((word, i) => {
        const x = 130 + i * 120;
        const image = scene.add.image(x, 168, 'tiles', 0).setScale(2);
        const label = tag(scene, x, 150, word);
        let body = null;
        if (i === round.answer) {
          body = scene.add.rectangle(x, 186, 54, 14, 0x000000, 0);
          scene.physics.add.existing(body, true);
          scene.physics.add.collider(player, body);
        }
        pieces.push({ image: image, label: label, body: body, x: x });
      });
    }
    layout();
    api.onTick = () => {
      if (!player.body) return;
      if (hooks.pad.left) player.setVelocityX(-130);
      else if (hooks.pad.right) player.setVelocityX(130);
      else player.setVelocityX(0);
      const grounded = player.body.blocked && player.body.blocked.down;
      if (hooks.pad.jump && !jumpHeld && grounded) player.setVelocityY(-380);
      jumpHeld = !!hooks.pad.jump;
      if (locked) return;
      const solid = pieces.filter((piece) => piece.body)[0];
      if (solid && grounded && Math.abs(player.x - solid.x) < 36 && player.y < 190) {
        locked = true;
        hooks.onLessonPass('Bon mot ' + (beat + 1));
      }
    };
    api.onPass = () => {
      beat += 1;
      locked = false;
      player.setPosition(48, 180);
      player.setVelocity(0, 0);
      layout();
    };
  }

  function tilesGame(scene, hooks, api, rounds, heard) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    scene.physics.world.setBounds(0, 0, 480, 270);
    const pal = friend(scene, 50, 150);
    const player = hero(scene, 50, 210);
    player.body.setAllowGravity(false);
    let beat = hooks.startGate || 0;
    let locked = false;
    const note = banner(scene, '');
    const zones = [];
    function clearZones() {
      zones.splice(0).forEach((zone) => {
        if (zone.sprite.active) zone.sprite.destroy();
        if (zone.label.active) zone.label.destroy();
      });
    }
    function layout() {
      clearZones();
      const round = rounds[Math.min(beat, rounds.length - 1)];
      note.setText(round.prompt);
      if (heard) heard(round.say);
      round.tiles.forEach((name, i) => {
        const x = 150 + i * 110;
        const sprite = scene.physics.add.sprite(x, 150, 'tiles', 0).setScale(2);
        still(sprite);
        const label = tag(scene, x, 132, name);
        zones.push({ sprite: sprite, label: label });
        scene.physics.add.overlap(player, sprite, () => {
          if (locked || beat !== layout.beat) return;
          if (name !== round.answer) {
            note.setText('Not this step. ' + round.prompt);
            return;
          }
          locked = true;
          pal.x += 60;
          hooks.onLessonPass(round.prompt + ' ' + name);
        });
      });
      layout.beat = beat;
    }
    layout.beat = -1;
    layout();
    api.onTick = () => steer(player, hooks.pad, 140);
    api.onPass = () => {
      beat += 1;
      locked = false;
      player.setPosition(50, 210);
      if (rounds[beat]) layout();
    };
  }

  function buddy(scene, hooks, api) {
    tilesGame(scene, hooks, api, [
      { prompt: 'This pumps blood. Step on it.', tiles: ['Heart', 'Lungs', 'Stomach'], answer: 'Heart' },
      { prompt: 'These take in air. Step on it.', tiles: ['Bones', 'Lungs', 'Hair'], answer: 'Lungs' },
      { prompt: 'This wakes the body. Step on it.', tiles: ['Jump', 'Sleep', 'Sit'], answer: 'Jump' }
    ]);
  }

  function listen(scene, hooks, api) {
    function speak(text) {
      const spoke = global.NolanSpeak && global.NolanSpeak.speak(text, 'th-TH');
      return !!spoke;
    }
    tool('🔊 Listen', () => {
      const round = [
        { say: 'มา' },
        { say: 'สอง' },
        { say: 'ก' }
      ][Math.min(listen.beat || 0, 2)];
      if (round && !speak(round.say)) {
        const note = scene.__lanternNote;
        if (note) note.setText('Heard: ' + round.say);
      }
    });
    tilesGame(scene, hooks, api, [
      { prompt: 'Listen, then step on that word.', say: 'มา', tiles: ['มา', 'กา', 'นา'], answer: 'มา' },
      { prompt: 'Listen, then step on that word.', say: 'สอง', tiles: ['หนึ่ง', 'สอง', 'สาม'], answer: 'สอง' },
      { prompt: 'Listen, then step on that word.', say: 'ก', tiles: ['ก', 'ด', 'ต'], answer: 'ก' }
    ], (say) => {
      listen.beat = ['มา', 'สอง', 'ก'].indexOf(say);
      scene.__lanternNote = scene.children.list.filter((child) => child.type === 'Text')[0];
      if (!speak(say) && scene.__lanternNote) scene.__lanternNote.setText('Heard: ' + say);
    });
  }

  function blocks(scene, hooks, api) {
    nearest(scene, 'tiles');
    nearest(scene, 'hero');
    friend(scene, 36, 200);
    const robot = scene.add.sprite(70, 130, 'hero', 0).setScale(2);
    const flags = [false, false, false, false, false, false];
    const images = flags.map((_, i) => scene.add.image(110 + i * 52, 130, 'tiles', 0).setScale(2).setTint(0xcbd5e1));
    let beat = hooks.startGate || 0;
    let locked = false;
    let walking = null;
    const note = banner(scene, 'Lay a path of 4 blocks. Then the robot can go.');
    function paint() {
      images.forEach((image, i) => image.setTint(flags[i] ? 0x0d9488 : 0xcbd5e1));
      const count = flags.filter(Boolean).length;
      if (!walking) note.setText('Blocks: ' + count + '. The robot needs a path of 4.');
    }
    scene.input.on('pointerdown', (pointer) => {
      if (locked || walking) return;
      const x = Math.floor((pointer.worldX - 84) / 52);
      if (x < 0 || x > 5 || pointer.worldY < 100 || pointer.worldY > 170) return;
      flags[x] = !flags[x];
      paint();
    });
    tool('Go', () => {
      if (locked || walking) return;
      const on = [];
      flags.forEach((flag, i) => {
        if (flag) on.push(i);
      });
      if (on.length !== 4) {
        note.setText('The robot needs 4 blocks.');
        return;
      }
      for (let i = 1; i < on.length; i++) {
        if (on[i] !== on[i - 1] + 1) {
          note.setText('The path has a gap.');
          return;
        }
      }
      locked = true;
      robot.setPosition(images[on[0]].x, 90);
      walking = { step: 0, ms: 0, from: on[0] };
    });
    api.onTick = (delta) => {
      if (!walking) return;
      walking.ms += delta;
      if (walking.ms < 180) return;
      walking.ms = 0;
      walking.step += 1;
      const image = images[walking.from + walking.step];
      if (image) robot.setPosition(image.x, 90);
      if (walking.step >= 3) {
        walking = null;
        hooks.onLessonPass('Path of 4, run ' + (beat + 1));
      }
    };
    api.onPass = () => {
      beat += 1;
      locked = false;
      for (let i = 0; i < flags.length; i++) flags[i] = false;
      robot.setPosition(70, 130);
      paint();
    };
    paint();
  }

  const lessons = {
    crumbs: crumbs,
    hut: hut,
    crates: crates,
    logs: logs,
    buddy: buddy,
    listen: listen,
    blocks: blocks
  };

  function mount(scene, hooks, api) {
    const run = lessons[hooks.lesson] || crumbs;
    run(scene, hooks, api);
  }

  global.LanternLessons = { mount: mount };
})(window);
