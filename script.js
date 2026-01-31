// Create a new Phaser game instance
const game = new Phaser.Game({
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
});

// Preload assets
function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('platform', 'assets/platform.png');
  this.load.image('enemy', 'assets/enemy.png');
}

// Create game objects and set up the game world
function create() {
  // Create the player
  this.player = this.physics.add.sprite(100, 450, 'player');
  this.player.setCollideWorldBounds(true);
  this.player.body.setSize(32, 64);
  this.player.body.setOffset(0, 16);

  // Create the platforms
  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400, 500, 'platform').setScale(2).refreshBody();
  this.platforms.create(600, 400, 'platform');
  this.platforms.create(200, 300, 'platform');

  // Create the enemies
  this.enemies = this.physics.add.group();
  for (let i = 0; i < 5; i++) {
    const enemy = this.enemies.create(Math.random() * 800, 100, 'enemy');
    enemy.setCollideWorldBounds(true);
    enemy.body.setAllowGravity(false);
    enemy.body.setSize(32, 64);
    enemy.body.setOffset(0, 16);
    enemy.setVelocity(Math.random() * 100 - 50, 0);
  }

  // Set up the camera
  this.cameras.main.startFollow(this.player);

  // Enable collision detection between the player and platforms/enemies
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.enemies, this.platforms);
  this.physics.add.collider(this.player, this.enemies, handleCollision, null, this);

  // Enable player movement
  this.cursors = this.input.keyboard.createCursorKeys();
  this.player.setVelocityX(0);
  this.player.body.drag.set(1000);
  this.player.body.maxVelocity.set(500);
  this.player.body.acceleration.x = 0;

  // Enable player abilities
  this.playerAbilities = {
    jump: false,
    dash: false
  };

  // Enable input for player abilities
  this.input.keyboard.on('keydown-J', () => {
    this.playerAbilities.jump = true;
  });

  this.input.keyboard.on('keydown-D', () => {
    this.playerAbilities.dash = true;
  });
}

// Update game objects and handle player input
function update() {
  // Handle player movement
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
  } else {
    this.player.setVelocityX(0);
  }

  // Handle player abilities
  if (this.playerAbilities.jump && this.player.body.touching.down) {
    this.player.setVelocityY(-500);
    this.playerAbilities.jump = false;
  }

  if (this.playerAbilities.dash && this.player.body.touching.down) {
    this.player.setVelocityX(400);
    this.playerAbilities.dash = false;
  }

  // Handle collisions between the player and enemies
  this.physics.world.collide(this.player, this.enemies, handleCollision, null, this);
}