var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('game-over', gameOverState);

game.state.start('menu');
