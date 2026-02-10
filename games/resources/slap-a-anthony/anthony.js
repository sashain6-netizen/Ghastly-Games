class Anthony {
    constructor(game) {
        this.image = new Image()
        this.image.src = 'anthony.png'
        this.sizeModifier = 0.2
        this.width = 395 * sizeModifier
        this.height = 488 * sizeModifier
        this.game = game
        this.sizeModifier = 0.2
        this.width = 395 * this.sizeModifier
        this.height = 488 * this.sizeModifier
    }

    draw(context) {
        context.drawImage(this.image, 50%, 50%, this.width, this.height)
    }
}