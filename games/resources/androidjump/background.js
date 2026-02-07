export class Background {
    constructor(game) {
        this.game = game
        this.width = this.game.width
        this.height = this.game.height
        this.image = document.querySelector('#bg')
        this.x = 0
        this.y = 0
    }

    update(){
        if(this.y > this.height){
            this.y = 0
            this.game.add_platforms(-this.height, -15)
            this.game.add_broken_platforms(-this.height, -15)
            this.game.change_difficulty()

            if(Math.random() < this.game.enemyChance/100){
                this.game.add_enemy()
            }
        } 
        else{
            this.y += this.game.vy
            this.game.score += Math.trunc(this.game.vy * 0.1)
        }
    }

    draw(context) {
    context.save();

    // Create a vertical gradient: Pitch black at the bottom, dark blood-red at the top
    // This creates the illusion of climbing out of a dark abyss
    let gradient = context.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1a0000'); // Top: Dark Crimson
    gradient.addColorStop(1, '#000000'); // Bottom: Pure Black
    
    context.fillStyle = gradient;
    
    // We draw two rectangles to simulate the infinite scrolling, 
    // just like you did with the images!
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillRect(this.x, this.y - this.height, this.width, this.height);

    // Optional: Add a "Vignette" effect (darker edges) to make it extra creepy
    let vignette = context.createRadialGradient(
        this.width / 2, this.height / 2, 0, 
        this.width / 2, this.height / 2, this.width
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.8)');
    context.fillStyle = vignette;
    context.fillRect(0, 0, this.width, this.height);

    context.restore();
}
}