import {Anthony} from './anthony.js'

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

window.addEventLister('load', () => {
    const canvas = document.querySelector('#canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 850
    canvas.height = 850

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.background = new Background(this)
            this.inputHandler = new InputHandler(this)   
            this.reset();
        }

    draw(context) {
        this.anthony.draw(context)
    }
})