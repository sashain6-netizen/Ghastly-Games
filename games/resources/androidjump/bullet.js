export class Bullet {
    constructor(player) {
        this.player = player
        this.sizeModifier = 0.1
        this.width = 160 * this.sizeModifier
        this.height = 512 * this.sizeModifier
        this.x = this.player.x + (this.player.width/2) - (this.width/2)
        this.y = this.player.y + (this.player.height/2) - (this.height/2)
        this.image = document.querySelector('#bullet')
        this.vy = -15
        this.markedForDeletion = false
        this.audio = new Audio('sound effects/bullet.mp3')
        this.audio.play()
    }

    update() {
        this.y += this.vy
        if(this.y < -this.height){
            this.markedForDeletion = true
        }
    }

    draw(context) {
    context.save();

    // Make the bullet a sharp, glowing diamond shape
    context.fillStyle = 'black';
    context.strokeStyle = '#bc6ff1'; // Ghostly purple border
    context.lineWidth = 2;
    context.shadowBlur = 10;
    context.shadowColor = '#bc6ff1';

    context.beginPath();
    // Start at top center of the bullet
    context.moveTo(this.x + this.width / 2, this.y); 
    // Right side
    context.lineTo(this.x + this.width, this.y + this.height / 2);
    // Bottom
    context.lineTo(this.x + this.width / 2, this.y + this.height);
    // Left side
    context.lineTo(this.x, this.y + this.height / 2);
    context.closePath();
    
    context.fill();
    context.stroke();

    context.restore();
}
}