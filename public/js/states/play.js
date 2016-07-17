var playState = {
  preload: function(){
    game.load.spritesheet('player_walk', 'imgs/player_walk_sprite_sheet.png', 88, 98, 15);
    game.load.image('player_face', 'imgs/player_face.png');
  },

  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.playerSprite = initialisePlayer();
  },

  update: function(){
    updatePlayerRotation(this.playerSprite);
    updatePlayerMovement(this.playerSprite);
  }
}

var initialisePlayer = function(){
  var playerSprite = game.add.sprite(88, 98, 'player_walk');

  var face = game.make.sprite(0, 0, 'player_face');
  face.anchor = new Phaser.Point(0.5, 0.75);
  face.rotation = Math.PI;
  face.scale.x = 0.3;
  face.scale.y = 0.3;

  playerSprite.addChild(face);

  playerSprite.animations.add('walk');
  playerSprite.anchor = new Phaser.Point(0.5, 0.5);

  game.physics.enable(playerSprite, Phaser.Physics.ARCADE);

  playerSprite.body.allowRotation = true;
  playerSprite.rotationSpeed = 0.05;

  playerSprite.moving = false;
  playerSprite.forwardSpeed = 200;

  return playerSprite
}

var updatePlayerRotation = function(playerSprite){
  if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    playerSprite.rotation -= playerSprite.rotationSpeed;

  if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    playerSprite.rotation += playerSprite.rotationSpeed;
};

var updatePlayerMovement = function(playerSprite){
  if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    game.physics.arcade.velocityFromRotation(playerSprite.rotation - Math.PI / 2, playerSprite.forwardSpeed, playerSprite.body.velocity);

    if(!playerSprite.moving)
      playerSprite.animations.play('walk', 30, true);

    playerSprite.moving = true;
  } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
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
};
