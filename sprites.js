class Particle {
    x
    y
    velX
    velY
    drag
    lifetime = 0
    size = 1
    explode = 0
    realSize = 0
    startP = 0
    endP = 0
    colour = [0, 0, 0]
    constructor(x, y, velX, velY, drag) {
        this.x = x
        this.y = y
        this.velX = velX
        this.velY = velY
        this.drag = drag
        this.size = 1 + (Math.random()-0.5)
        this.startP = Math.random()/4
        this.endP = this.startP + (Math.random()+1)/2 * 0.75
        this.colour = [(Math.random()-0.5)*2 * 25, (Math.random()-0.5)*2 * 25, (Math.random()-0.5)*2 * 25]
    }
    move() {
        if (this.explode < 1) {
            this.velX -= (1-this.drag)*delta*this.velX*100
            this.velY -= (1-this.drag)*delta*this.velY*100

            this.lifetime += delta

            for (let i = 0; i < 100; i++) {
                this.x += this.velX * delta / 100
                this.y += this.velY * delta / 100
                
                if (lineInMap(this.x, this.y, this.x+3.923*this.size, this.y+6.434*this.size)) {
                    this.lifetime = 0
                    this.explode = 1
                    return
                }
            }
        } else {
            this.realSize += (this.size-this.realSize)*delta*10
            this.x -= this.velX * delta / 10 / 25
            this.y -= this.velY * delta / 10 / 25
            this.explode += 0.1 * 60 * delta
            this.size += 0.01
            if (this.explode > 10) {
                this.lifetime = 100
            }
        }
    }
    draw() {
        var gradient = ctx.createRadialGradient(this.x-camera.x, this.y-camera.y, 0, this.x-camera.x, this.y-camera.y, 5*this.realSize)
        gradient.addColorStop(this.startP, `rgba(${150 + this.colour[0]}, ${230 + this.colour[1]}, ${255 + this.colour[2]}, 1)`)
        gradient.addColorStop(this.endP, `rgba(${150 + this.colour[0]}, ${230 + this.colour[1]}, ${255 + this.colour[2]}, 0)`)

        // if (this.explode < 1) { return }
        ctx.beginPath()
        
        ctx.arc(this.x - camera.x, this.y - camera.y, 5*this.realSize, 0, 360)
        
        ctx.fillStyle = gradient
        ctx.fill()
    }
}

fps = 60