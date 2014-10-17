var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');
var mainState = {
preload: function() {  
    game.load.audio('jump', 'assets/jump.wav');  
    game.stage.backgroundColor = '#71c5cf';
    game.load.image('bird', 'assets/bird.png'); 
    game.load.image('pipe', 'assets/pipe.png');  
},
create: function() {  
    var zero = false;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.score = -1;  
    this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
    this.bird = this.game.add.sprite(100, 245, 'bird');
    this.pipes = game.add.group(); // Create a group  
    this.pipes.enableBody = true;  // Add physics to the group  
    this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;  
    this.bird.anchor.setTo(-0.2, 0.5);  
    this.timer = game.time.events.loop(1500, this.addRowOfPipes0, this);
    this.jumpSound = game.add.audio('jump');  
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);     
},
update: function() {  
    if (this.bird.angle < 20)  
    this.bird.angle += 1;
    if (this.bird.inWorld == false)
        this.restartGame();
game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);  
},
jump: function() {
    if (this.bird.alive == false)  
    return; 
    this.jumpSound.play();  
    game.add.tween(this.bird).to({angle: -20}, 100).start();  
    this.bird.body.velocity.y = -350;
},
restartGame: function() {  
    game.state.start('menu');
},
    addOnePipe: function(x, y) {  
    var pipe = this.pipes.getFirstDead();
    pipe.reset(x, y);
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},
    addRowOfPipes0: function() {
        this.score = this.score + 1;  
        this.labelScore.text = this.score;  
        this.addRowOfPipes();
    },
    addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 5) + 1;
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);
    },
    hitPipe: function() {
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);
    }
};
var menuState = {
    preload: function(){
        game.stage.backgroundColor = '#71c5cf';
    },
    create: function(){
        this.text1 = game.add.text(115, 190, "Flappy Block", { font: "30px Arial", fill: "#000" });
        this.text = game.add.text(100, 225, "Press Space To Start!", { font: "20px Arial", fill: "#ffffff" });
        var spacePress = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacePress.onDown.add(this.spaceEvent, this);     
    },
    update: function(){
    
    },
    spaceEvent: function(){
        game.state.start('main');
    }
}
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('menu');