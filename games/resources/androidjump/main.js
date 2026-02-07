import {Player} from './player.js'
import {Background} from './background.js'
import {InputHandler} from './input.js'
import {Platform} from './platform.js'
import {Enemy} from './enemy.js'

const allowedDomains = ["ghastly-games.pages.dev", "localhost", "127.0.0.1"];
const currentDomain = window.location.hostname;
const officialDomain = allowedDomains[0]; 

if (!allowedDomains.some(domain => currentDomain.endsWith(domain))) {
    document.body.style.backgroundColor = "black"; 
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";
    document.body.innerHTML = `<div style="color: white; text-align: center; font-family: Helvetica, Arial, sans-serif;">
            <h1 style="font-size: 3rem; margin-bottom: 10px;">Access Denied</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">This game is only authorized for ${officialDomain}</p>
            <a href="https://${officialDomain}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; font-size: 1.2rem; font-weight: bold; border-radius: 5px;">PLAY ON ${officialDomain.toUpperCase()}</a>
        </div>`;
    throw new Error("Unauthorized domain.");
}

window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 532
    canvas.height = 850

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.background = new Background(this)
            this.inputHandler = new InputHandler(this)   
            this.reset();
        }

        reset() {
            this.vy = 0
            this.gameOver = false
            this.gameStart = false
            this.platforms = []
            this.enemies = []
            this.level = 0
            this.score = 0
            this.enemyChance = 0
            this.enemyMaxChance = 50
            this.object_vx = 3
            this.object_max_vx = 6
            this.platform_gap = 85
            this.platform_max_gap = 175
            this.blue_white_platform_chance = 0
            this.blue_white_platform_max_chance = 85
            
            // Initial generation: current screen and one screen above
            this.add_platforms(0, this.height - 15)
            this.add_broken_platforms(0, this.height - 15)
            this.add_bouncy_platforms(0, this.height - 15)
            
            this.add_platforms(-this.height, -15)
            this.add_broken_platforms(-this.height, -15)
            this.add_bouncy_platforms(-this.height, -15)
            
            this.player = new Player(this)
        }

        restart() {
            this.reset();
            this.gameStart = true;
        }
    
        update() {
            this.background.update()
            this.platforms.forEach(platform => platform.update())
            this.player.update(this.inputHandler)
            this.enemies.forEach(enemy => enemy.update())

            // --- INFINITE GENERATION LOGIC ---
            // If the highest platform (index 0) enters the screen, spawn more above it
            if (this.platforms.length > 0 && this.platforms[0].y > -this.height) {
                // We generate in the "invisible" zone above the canvas (-height to -height*2)
                this.add_platforms(-this.height * 2, -this.height);
                this.add_broken_platforms(-this.height * 2, -this.height);
                this.add_bouncy_platforms(-this.height * 2, -this.height);
                
                this.change_difficulty();

                // Small chance to spawn an enemy in the new area
                if (Math.random() * 100 < this.enemyChance) this.add_enemy();
            }

            // Cleanup
            this.platforms = this.platforms.filter(p => !p.markedForDeletion)
            this.enemies = this.enemies.filter(e => !e.markedForDeletion)
        }
    
        draw(context) {
            this.background.draw(context)

            if(!this.gameStart){
                context.font = 'bold 24px "Courier New"'
                context.fillStyle = "#660000"
                context.textAlign = 'center'
                context.fillText(`PRESS ENTER TO BEGIN THE NIGHTMARE`, this.width * 0.5, this.height * 0.5)
            } else {
                this.platforms.forEach(platform => platform.draw(context))
                this.player.draw(context)
                this.enemies.forEach(enemy => enemy.draw(context))

                context.fillStyle = "#8a0303" 
                context.font = 'bold 22px "Courier New"'
                context.textAlign = 'start'
                context.fillText(`Souls: ${this.score}`, 20, 40) 

                if(this.gameOver){
                    context.fillStyle = "rgba(0, 0, 0, 0.7)";
                    context.fillRect(0, 0, this.width, this.height);
                    context.font = 'bold 40px "Courier New"'
                    context.fillStyle = "#ff0000"
                    context.textAlign = 'center'
                    context.fillText(`YOU DIED`, this.width * 0.5, this.height * 0.5)
                    context.fillStyle = "#cccccc"
                    context.font = '16px "Courier New"'
                    context.fillText(`PRESS ENTER TO TRY AGAIN...`, this.width * 0.5, this.height * 0.5 + 50)
                }
            }
        }

        add_enemy() { this.enemies.push(new Enemy(this)) }

        add_platforms(lowerY, upperY) {
            do {
                let type = 'green'
                if(Math.random() < (this.blue_white_platform_chance / 100)){
                    type = (Math.random() < 0.5) ? 'blue' : 'white'
                }
                this.platforms.unshift(new Platform(this, lowerY, upperY, type))
            } while(this.platforms[0].y >= lowerY)
        }

        add_broken_platforms(lowerY, upperY) {
            let num = Math.floor(Math.random() * 6)
            for(let i = 0; i < num; i++){
                this.platforms.push(new Platform(this, lowerY, upperY, 'brown'))
            }
        }

        add_bouncy_platforms(lowerY, upperY) {
            let num = Math.floor(Math.random() * 2) // Spawns 0 to 1 bouncy platform per chunk
            for(let i = 0; i < num; i++){
                this.platforms.push(new Platform(this, lowerY, upperY, 'ghostly'))
            }
        }

        change_difficulty() {
            this.level++
            this.score += 10; // Increment score as you climb
            if(this.platform_max_gap > this.platform_gap) this.platform_gap += 5
            if(this.blue_white_platform_max_chance > this.blue_white_platform_chance) this.blue_white_platform_chance += 1
            if(this.level % 8 == 0 && this.object_max_vx > this.object_vx) this.object_vx++
            if(this.level % 5 == 0 && this.enemyMaxChance > this.enemyChance) this.enemyChance += 5
        }
    }
    
    const game = new Game(canvas.width, canvas.height)
    
    window.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            if (!game.gameStart) {
                game.gameStart = true;
            } else if (game.gameOver) {
                game.restart();
            }
        }
    });

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if(game.gameStart && !game.gameOver) game.update()
        game.draw(ctx)
        requestAnimationFrame(animate)
    }
    
    animate()
})

HTMLAudioElement.prototype.play = function() { return Promise.resolve(); };