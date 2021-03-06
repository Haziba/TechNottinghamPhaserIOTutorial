var playState = {
  preload: function(){
    game.load.spritesheet('player_walk', 'imgs/player_walk_sprite_sheet.png', 88, 98, 15);
    game.load.image('player_face', 'imgs/player_face.png');
    game.load.image('background', 'imgs/background.png');
    game.load.image('bullet', 'imgs/bullet.png');
    game.load.image('healthbar', 'imgs/healthbar.png');
  },

  create: function(){
    var that = this;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.input.mouse.capture = true;

    game.add.tileSprite(0, 0, 800, 600, 'background');

    this.playerSprite = initialisePlayer();
    this.zombieSprites = [];
    this.bulletSprites = [];

    this.scoreText = game.add.text(game.world.centerX, 50, "Score: 0", {font: "36px Arial", align: "center"})
    this.scoreText.anchor.set(0.5);
    this.scoreText.score = 0;

    this.playerSprite.kill = function(){
      game.score = that.scoreText.score;
      game.state.start('game-over');
    }

    game.time.events.add(2000 + Math.random() * 2000, function(){
      newZombie(that.zombieSprites, that.scoreText);
    });
  },

  update: function(){
    updatePlayerRotation(this.playerSprite);
    updatePlayerMovement(this.playerSprite);
    updatePlayerDamage(this.playerSprite);

    if(this.playerSprite.reloaded && game.input.activePointer.leftButton.isDown){
      newBullet(this.playerSprite, this.bulletSprites);
    }

    for(var i = this.zombieSprites.length-1; i >= 0; i--){
      updateZombie(this.zombieSprites[i], this.playerSprite, this.bulletSprites);
    }
  },
}

var initialisePlayer = function(){
  var playerSprite = game.add.sprite(88, 98, 'player_walk');

  var face = game.make.sprite(0, 0, 'player_face');
  face.anchor = new Phaser.Point(0.5, 0.75);
  face.rotation = Math.PI;
  face.scale.x = 0.3;
  face.scale.y = 0.3;

  playerSprite.addChild(face);
  playerSprite.face = face;

  var underHealthbar = game.add.sprite(0, 0, 'healthbar');
  underHealthbar.tint = 0x000000;

  var overHealthbar = game.add.sprite(0, 0, 'healthbar');

  overHealthbar.x = underHealthbar.x = playerSprite.x - (underHealthbar.width / 2);
  overHealthbar.y = underHealthbar.y = playerSprite.y - (playerSprite.height / 2);

  playerSprite.healthbar = {over: overHealthbar, under: underHealthbar};

  playerSprite.animations.add('walk');
  playerSprite.anchor = new Phaser.Point(0.5, 0.5);

  game.physics.enable(playerSprite, Phaser.Physics.ARCADE);

  playerSprite.body.allowRotation = true;
  playerSprite.body.collideWorldBounds = true;
  playerSprite.rotationSpeed = 0.05;

  playerSprite.moving = false;
  playerSprite.forwardSpeed = 200;
  playerSprite.reloaded = true;

  playerSprite.body.immovable = true;
  playerSprite.body.setSize(60, 60, 14, 19);

  playerSprite.zombieHit = function(){
    playerSprite.damage(0.1);
    playerSprite.redTint = 120;

    // +0.1 as player is still alive unless health is < 0, meaning 0 is still alive
    playerSprite.healthbar.over.width = playerSprite.healthbar.under.width * ((playerSprite.health + 0.1) / 1.1);
  }

  return playerSprite;
}

var updatePlayerRotation = function(playerSprite){
  if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A))
    playerSprite.rotation -= playerSprite.rotationSpeed;

  if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D))
    playerSprite.rotation += playerSprite.rotationSpeed;
};

var updatePlayerMovement = function(playerSprite){
  if(game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)){
    game.physics.arcade.velocityFromRotation(playerSprite.rotation - Math.PI / 2, playerSprite.forwardSpeed, playerSprite.body.velocity);

    if(!playerSprite.moving)
      playerSprite.animations.play('walk', 30, true);

    playerSprite.moving = true;
  } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)){
    game.physics.arcade.velocityFromRotation(playerSprite.rotation - Math.PI / 2, -playerSprite.forwardSpeed, playerSprite.body.velocity);

    if(!playerSprite.moving)
      playerSprite.animations.play('walk', 30, true);

    playerSprite.moving = true;
  } else if(playerSprite.moving) {
    playerSprite.animations.stop(null, true);

    playerSprite.body.velocity.x = 0;
    playerSprite.body.velocity.y = 0;

    playerSprite.moving = false;
  }

  playerSprite.healthbar.under.x = playerSprite.healthbar.over.x = playerSprite.x - playerSprite.healthbar.under.width / 2;
  playerSprite.healthbar.under.y = playerSprite.healthbar.over.y = playerSprite.y - playerSprite.width / 2;

  game.world.bringToTop(playerSprite.healthbar.under);
  game.world.bringToTop(playerSprite.healthbar.over);
};

var updatePlayerDamage = function(playerSprite){
  if(playerSprite.redTint < 255){
    var redTintHex = Phaser.Color.componentToHex(playerSprite.redTint);
    playerSprite.tint = "0xFF" + redTintHex + redTintHex;

    playerSprite.redTint += 10;

    if(playerSprite.redTint >= 255)
      playerSprite.tint = "0xFFFFFF"

    playerSprite.face.tint = playerSprite.tint;
  }
}

var newBullet = function(playerSprite, bulletSprites){
  var bullet = game.add.sprite(playerSprite.x, playerSprite.y, 'bullet');

  bullet.anchor = new Phaser.Point(0.5, 0.5);

  game.physics.enable(bullet, Phaser.Physics.ARCADE);
  game.physics.arcade.moveToPointer(bullet, 400);

  playerSprite.reloaded = false;

  game.time.events.add(500, function(){
    playerSprite.reloaded = true;
  });

  bulletSprites.push(bullet);
}

var newZombie = function(zombieSprites, scoreText){
  var zombie = game.add.sprite(Math.random() * 800, Math.random() * 600, 'player_walk');

  zombie.animations.add('walk');
  zombie.animations.play('walk', 10, true);
  zombie.anchor = new Phaser.Point(0.5, 0.5);

  zombie.tint = 0x009688;

  game.physics.enable(zombie, Phaser.Physics.ARCADE);
  zombie.body.collideWorldBounds = true;

  zombie.body.setSize(60, 60, 14, 19);
  zombie.events.onKilled.add(function(){
    zombieSprites.splice(zombieSprites.indexOf(zombie), 1);

    scoreText.score += 100;
    scoreText.text = "Score: " + scoreText.score;
  });

  game.time.events.add(2000 + Math.random() * 2000, function(){
    newZombie(zombieSprites, scoreText);
  });

  zombieSprites.push(zombie);
}

var updateZombie = function(zombie, player, bullets){
  game.physics.arcade.moveToObject(zombie, player, zombie.touchingPlayer ? -50 : 100);

  zombie.rotation = game.physics.arcade.angleToXY(zombie, player.x, player.y) + Math.PI / 2;

  game.physics.arcade.collide(player, zombie, function(){
    if(!zombie.touchingPlayer){
      player.zombieHit();

      zombie.touchingPlayer = true;

      game.time.events.add(300, function(){
        zombie.touchingPlayer = false
      });
    }
  });

  for(var i = bullets.length-1; i >= 0; i--)
    game.physics.arcade.collide(bullets[i], zombie, function(){
      zombie.damage(0.5);

      bullets[i].destroy();
      bullets.splice(i, 1);
    });
}
