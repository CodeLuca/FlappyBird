var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');
var mainState = {
preload: function() {  
    game.stage.backgroundColor = '#71c5cf';
    game.load.image('bird', 'assets/bird.png'); 
    game.load.image('pipe', 'assets/pipe.png');  
},
create: function() {  
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.score = 0;  
    this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
    this.bird = this.game.add.sprite(100, 245, 'bird');
    this.pipes = game.add.group(); // Create a group  
    this.pipes.enableBody = true;  // Add physics to the group  
    this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;  
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);     
},
update: function() {  
    if (this.bird.inWorld == false)
        this.restartGame();
game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);  
},
jump: function() {  
    this.bird.body.velocity.y = -350;
},
restartGame: function() {  
    game.state.start('main');
},
    addOnePipe: function(x, y) {  
    var pipe = this.pipes.getFirstDead();
    pipe.reset(x, y);
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},
    addRowOfPipes: function() {  
    var hole = Math.floor(Math.random() * 5) + 1;
        this.score += 1;  
        this.labelScore.text = this.score;  
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);
}
};
game.state.add('main', mainState);
game.state.start('main');