var playState = {
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
  var playerSprite = game.add.graphics(400, 300);

  playerSprite.beginFill(0xFFFF00);
  playerSprite.drawRect(-50, -50, 100, 100);
  playerSprite.endFill();

  game.physics.enable(playerSprite, Phaser.Physics.ARCADE);

  playerSprite.body.allowRotation = true;
  playerSprite.rotationSpeed = 0.05;

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
  if(game.input.keyboard.isDown(Phaser.Keyboard.UP))
    game.physics.arcade.velocityFromRotation(playerSprite.rotation, playerSprite.forwardSpeed, playerSprite.body.velocity);
  else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    game.physics.arcade.velocityFromRotation(playerSprite.rotation, -playerSprite.forwardSpeed, playerSprite.body.velocity);
  else {
    playerSprite.body.velocity.x = 0;
    playerSprite.body.velocity.y = 0;
  }
};
