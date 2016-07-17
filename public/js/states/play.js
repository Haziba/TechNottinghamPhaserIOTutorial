var playState = {
  create: function(){
    this.playerSprite = game.add.graphics(400, 300);

    this.playerSprite.beginFill(0xFFFF00);
    this.playerSprite.drawRect(-50, -50, 100, 100);
    this.playerSprite.endFill();
  },
}
