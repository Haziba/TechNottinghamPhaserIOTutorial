var gameOverState = {
  create: function(){
    var scoreText = game.add.text(0, 0, 'You got\n' + game.score + ' points',
      {
        font: '50px Arial',
        fill: '#ffffff',
        boundsAlignH: 'center',
        align: 'center',
      });

    scoreText.setTextBounds(0, 80, 800, 50);

    var startLabel = game.add.text(0, 0, 'Click anywhere to play again',
      {
        font: '25px Arial',
        fill: '#ffffff',
        boundsAlignH: 'center',
      });

    startLabel.setTextBounds(0, game.world.height / 2, game.world.width, 100);
  },

  update: function(){
    if(game.input.activePointer.leftButton.isDown){
      game.state.start('play', true);
    }
  },
}
