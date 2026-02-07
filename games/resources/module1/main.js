import {Player} from './player.js'
import {Background} from './background.js'
import {InputHandler} from './input.js'
import {Platform} from './platform.js'
import {Enemy} from './enemy.js'

// 1. Define your domains. Put your primary site first!
const allowedDomains = ["yourwebsite.com", "www.yourwebsite.com", "localhost", "127.0.0.1"];
const currentDomain = window.location.hostname;

// 2. Identify the primary domain for the text and link
const officialDomain = allowedDomains[0]; 

if (!allowedDomains.some(domain => currentDomain.endsWith(domain))) {
    document.body.style.backgroundColor = "black"; 
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";

    // 3. The text and link now use the 'officialDomain' variable
    document.body.innerHTML = `
        <div style="color: white; text-align: center; font-family: Helvetica, Arial, sans-serif;">
            <h1 style="font-size: 3rem; margin-bottom: 10px;">Access Denied</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">This game is only authorized for ${officialDomain}</p>
            
            <a href="https://${officialDomain}" 
               target="_blank"
               style="
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                font-size: 1.2rem;
                font-weight: bold;
                border-radius: 5px;
                transition: background-color 0.3s;
               "
               onmouseover="this.style.backgroundColor='#45a049'"
               onmouseout="this.style.backgroundColor='#4CAF50'">
               PLAY ON ${officialDomain.toUpperCase()}
            </a>
        </div>
    `;

    throw new Error("Unauthorized domain.");
}

// ... rest of your code

// ... rest of your code (window.addEventListener('load', ...))

window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 532
    canvas.height = 850

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            // We use this.reset() to set all initial values in one place
            this.reset();
            
            // These stay through resets
            this.background = new Background(this)
            this.inputHandler = new InputHandler(this)   
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
            
            this.add_platforms(0, this.height - 15)
            this.add_broken_platforms(0, this.height - 15)
            this.add_platforms(-this.height, -15)
            this.add_broken_platforms(-this.height, -15)
            this.player = new Player(this)
        }

        restart() {
            this.reset();
            this.gameStart = true;
            animate(); // Re-trigger the animation loop
        }
    
        update() {
            this.background.update()
            this.platforms.forEach(platform => platform.update())
            this.player.update(this.inputHandler)
            this.enemies.forEach(enemy => enemy.update())

            this.platforms = this.platforms.filter(p => !p.markedForDeletion)
            this.enemies = this.enemies.filter(e => !e.markedForDeletion)
        }
    
        draw(context) {
            this.background.draw(context)

            if(!this.gameStart){
                context.font = 'bold 25px Helvetica'
                context.fillStyle = "black"
                context.textAlign = 'center'
                context.fillText(`PRESS ENTER TO START`, this.width * 0.5, this.height * 0.5)
            } else {
                this.platforms.forEach(platform => platform.draw(context))
                this.player.draw(context)
                this.enemies.forEach(enemy => enemy.draw(context))

                context.fillStyle = "black"
                context.font = '20px Arial'
                context.textAlign = 'start'
                context.fillText(`Score: ${this.score}`, 20, 40) 

                if(this.gameOver){
                    context.font = 'bold 25px Helvetica'
                    context.fillStyle = "red"
                    context.textAlign = 'center'
                    context.fillText(`GAME OVER`, this.width * 0.5, this.height * 0.5)
                    context.fillStyle = "black"
                    context.font = '18px Helvetica'
                    context.fillText(`PRESS ENTER TO RESTART`, this.width * 0.5, this.height * 0.5 + 40)
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

        change_difficulty() {
            this.level++
            if(this.platform_max_gap > this.platform_gap) this.platform_gap += 5
            if(this.blue_white_platform_max_chance > this.blue_white_platform_chance) this.blue_white_platform_chance += 1
            if(this.level % 8 == 0 && this.object_max_vx > this.object_vx) this.object_vx++
            if(this.level % 5 == 0 && this.enemyMaxChance > this.enemyChance) this.enemyChance += 5
        }
    }
    
    const game = new Game(canvas.width, canvas.height)
    
    // KEY LISTENER INSIDE THE SCOPE
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
        if(game.gameStart) game.update()
        game.draw(ctx)
        // This loop stops when gameOver is true
        if(!game.gameOver) requestAnimationFrame(animate)
    }
    
    animate()
})