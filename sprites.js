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
    animTime = 0
    vx = 0
    vy = 0
    vrealSize = 0
    fromGhost = false
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
            // this.velX = lerp(this.velX, 0, (1-this.drag)*gameDelta*10)
            // this.velY = lerp(this.velY, 0, (1-this.drag)*gameDelta*10)

            this.lifetime += gameDelta/10

            for (let i = 0; i < 100; i++) {
                this.x += this.velX/100000 * gameDelta
                this.y += this.velY/100000 * gameDelta
                
                if (lineInMap(this.x, this.y, this.x+3.923*this.size, this.y+6.434*this.size)) {
                    this.lifetime = 0
                    this.explode = 1
                    this.vx = this.x
                    this.vy = this.y
                    break
                }
            }
        } else {
            this.realSize = lerp(this.realSize, this.size, gameDelta*10)
            this.x -= this.velX * gameDelta / 25000
            this.y -= this.velY * gameDelta / 25000
            this.explode += 0.1 * 60 * gameDelta
            if (this.explode > 10) {
                this.lifetime = 100
            }
            this.size += 0.01
        }
    }
    draw() {
        if (this.fromGhost) {
            ctx.globalAlpha = 0.25
        }
        this.vx = lerp(this.vx, this.x, delta*15)
        this.vy = lerp(this.vy, this.y, delta*15)
        this.vrealSize = lerp(this.vrealSize, this.realSize, delta*15)

        this.animTime += delta * Math.random()*2

        if (5*this.vrealSize*camera.zoom <= 0 || isNaN(5*this.vrealSize*camera.zoom)) { 
            if (this.fromGhost) {
                ctx.globalAlpha = 1
            }
            return 
        }
        var gradient = ctx.createRadialGradient((this.vx-camera.x)*camera.zoom+canvas.width/2, (this.vy-camera.y)*camera.zoom+canvas.height/2, 0, (this.vx-camera.x)*camera.zoom+canvas.width/2, (this.vy-camera.y)*camera.zoom+canvas.height/2, 5*this.vrealSize*camera.zoom)
        gradient.addColorStop(this.startP, `rgba(${150 + this.colour[0]}, ${230 + this.colour[1]}, ${255 + this.colour[2]}, 1)`)
        gradient.addColorStop(this.endP, `rgba(${150 + this.colour[0]}, ${230 + this.colour[1]}, ${255 + this.colour[2]}, 0)`)

        // if (this.explode < 1) { return }
        ctx.beginPath()
        
        ctx.arc((this.vx - camera.x)*camera.zoom + canvas.width/2, (this.vy - camera.y)*camera.zoom + canvas.height/2, 5*this.vrealSize*(Math.sin(this.animTime*50)*0.5+1)*camera.zoom, 0, 360)
        
        ctx.fillStyle = gradient
        ctx.fill()
        if (this.fromGhost) {
            ctx.globalAlpha = 1
        }
    }
}

fps = 60