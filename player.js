class Player {
    x = 0
    y = 0
    size = 1
    rot = 0
    velX = 0
    velY = 0
    speed = 375
    rotSpeed = 5
    dragRot = 0
    distance = 0
    rDistance = 0
    maxDistance = 150
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
    }
    update() {
        if (keys["KeyW"] && !finished) {
            timing = true
            this.velX -= Math.sin(this.rot)*this.speed*delta * ((this.maxDistance - this.rDistance)/37.5+1)
            this.velY -= Math.cos(this.rot)*this.speed*delta * ((this.maxDistance - this.rDistance)/37.5+1)
            for (let i = 0; i < 2; i++) {
                let rotOff = (Math.random()-0.5)*2 * Math.PI/2
                particles.push(new Particle(this.x, this.y, 
                    Math.sin(this.rot+rotOff)*this.speed*delta * ((this.maxDistance - this.rDistance)/15+1)*500, 
                    Math.cos(this.rot+rotOff)*this.speed*delta * ((this.maxDistance - this.rDistance)/15+1)*500, 
                    1))
                particles[particles.length-1].size = (this.maxDistance-this.rDistance)/this.maxDistance*2.5
            }
        }
        if (keys["KeyS"] && !finished) {
            timing = true
            this.velX += Math.sin(this.rot)*this.speed/2*delta
            this.velY += Math.cos(this.rot)*this.speed/2*delta
        }
        if (keys["KeyA"] && !finished) {
            timing = true
            if (keys["KeyS"]) {
                this.rot -= this.rotSpeed*delta
                // if (this.checkCollide()) {
                //     this.rot += this.rotSpeed*delta
                // }
            } else {
                this.rot += this.rotSpeed*delta
                // if (this.checkCollide()) {
                //     this.rot -= this.rotSpeed*delta
                // }
            }
        }
        if (keys["KeyD"] && !finished) {
            timing = true
            if (keys["KeyS"]) {
                this.rot += this.rotSpeed*delta
                // if (this.checkCollide()) {
                //     this.rot -= this.rotSpeed*delta
                // }
            } else {
                this.rot -= this.rotSpeed*delta
                // if (this.checkCollide()) {
                //     this.rot += this.rotSpeed*delta
                // }
            }
        }
        this.velX = lerp(this.velX, 0, delta*100*(1-0.99))
        this.velY = lerp(this.velY, 0, delta*100*(1-0.99))
        
        for (let i = 0; i < 100; i++) {
            this.x += this.velX * delta / 100
            if (this.fixCollision()) {
                this.velX *= 0.9999
                // if (this.rDistance > 50) {
                //     this.velX *= -0.25
                //     this.velY *= 0.8
                //     break
                // } else {
                //     this.velX *= 0.999
                // }
            }
            this.y += this.velY * delta / 100
            if (this.fixCollision()) {
                this.velY *= 0.9999
                // if (this.rDistance > 50) {
                //     this.velY *= -0.25
                //     this.velX *= 0.8
                //     break
                // } else {
                //     this.velY *= 0.999
                // }
            }
        }

        this.rDistance = this.maxDistance

        let rDistance = 0
        while (rDistance < this.maxDistance) {
            if (lineInMap(this.x, this.y, this.x + Math.sin(this.rot)*rDistance, this.y + Math.cos(this.rot)*rDistance)) {
                break
            }
            rDistance += 1
        }
        if (rDistance < this.rDistance) {
            this.rDistance = rDistance
        }

        rDistance = 0
        while (rDistance < this.maxDistance) {
            if (lineInMap(this.x, this.y, this.x + Math.sin(this.rot-Math.PI/4)*rDistance, this.y + Math.cos(this.rot-Math.PI/4)*rDistance)) {
                break
            }
            rDistance += 1
        }
        if (rDistance < this.rDistance) {
            this.rDistance = rDistance
        }

        rDistance = 0
        while (rDistance < this.maxDistance) {
            if (lineInMap(this.x, this.y, this.x + Math.sin(this.rot+Math.PI/4)*rDistance, this.y + Math.cos(this.rot+Math.PI/4)*rDistance)) {
                break
            }
            rDistance += 1
        }
        if (rDistance < this.rDistance) {
            this.rDistance = rDistance
        }
        
        for (let i = 0; i < 9; i++) {
            if (jKeys["Digit"+i]) {
                loadMap(i)
            }
        }
        
        // if (collided) {
        //     this.velX -= (1-0.9)*delta*this.velX * 100
        //     this.velY -= (1-0.9)*delta*thiwds.velY * 100
        // }
        this.dragRot += (this.rot-this.dragRot)*delta*10
        // this.checkCollide()
        // console.log(this.checkCollide())
    }
    fixCollision() {
        let splits = 8
        let collided = false
        let tries = 0
        let distance = 0
        while (tries < 5) {
            for (let angleI = 0; angleI < splits; angleI++) {
                let angle = Math.PI*2 / splits * angleI
                this.x += Math.sin(angle)*distance
                this.y += Math.cos(angle)*distance
                if (!this.checkCollide()) {
                    distance = 0
                    return collided
                }
                this.x -= Math.sin(angle)*distance
                this.y -= Math.cos(angle)*distance
                collided = true
            }
            distance += 0.01
            // tries++
        }
        return collided
    }
    checkCollide() {
        let ps = [
            [this.x + rv2(-100*this.size, 0*this.size, this.rot).x, this.y + rv2(-100*this.size, 0*this.size, this.rot).y],
            [this.x + rv2(100*this.size, 85*this.size, this.rot).x, this.y + rv2(100*this.size, 85*this.size, this.rot).y],
            [this.x + rv2(50*this.size, 0*this.size, this.rot).x, this.y + rv2(50*this.size, 0*this.size, this.rot).y],
            [this.x + rv2(100*this.size, -85*this.size, this.rot).x, this.y + rv2(100*this.size, -85*this.size, this.rot).y],
        ]

        let i = 0
        for (let p of ps) {
            let i2 = i + 1
            if (i2 >= ps.length) {
                i2 = 0
            }
            
            let mapI = 0
            for (let m of map) {
                let i3 = 0
                for (let l of m) {
                    let i4 = i3 + 1
                    if (i4 >= m.length) {
                        continue
                    }
                    if (mapI == mapData[mapData.length-1][0] && i3 >= mapData[mapData.length-1][1] && i3 < mapData[mapData.length-1][2]) {
                        i3++

                        if (findIntersection(
                            p[0], p[1],
                            ps[i2][0], ps[i2][1],
                            l[0], l[1],
                            m[i4][0], m[i4][1]
                        )) {
                            onFinish()
                        }

                        continue
                    }
                    if (findIntersection(
                        p[0], p[1],
                        ps[i2][0], ps[i2][1],
                        l[0], l[1],
                        m[i4][0], m[i4][1]
                    )) {
                        return true
                    }
                    i3++
                }
                mapI++
            }
            i++
        }
        return false
    }
    draw() {
        ctx.beginPath()
        ctx.moveTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).y)                              
        ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.rot).y)
        ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).y)
        ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.rot).y)
        
        ctx.closePath()

        ctx.fillStyle = "blue"
        ctx.fill()
        
        if ((Math.abs(this.velX)+Math.abs(this.velY))/2 > 25 && (!keys["KeyS"] || scene != "game")) {
            ctx.beginPath()
        
            ctx.moveTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.rot).y)
            let x = ((Math.abs(this.velX)+Math.abs(this.velY))/2/2+50+Math.random()*25)
            let y = (0+(Math.random()-0.5)*2*25)
            ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.dragRot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.dragRot).y)
            
            ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.rot).y)
            ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).y)
    
            ctx.closePath()
    
            ctx.fillStyle = "lightblue"
            ctx.fill()


            ctx.beginPath()

            let redSize = 0.75
        
            ctx.moveTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*redSize*0.83*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*redSize*0.83*this.size*camera.zoom, this.rot).y)
            x *= redSize
            ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.dragRot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.dragRot).y)
            
            ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*redSize*0.83*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*redSize*0.83*this.size*camera.zoom, this.rot).y)
            ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).y)
    
            ctx.closePath()
    
            ctx.fillStyle = "rgb(50, 127, 255)"
            ctx.fill()
        }

        ctx.beginPath()

        ctx.moveTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).y)                              
        ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.rot).y)
        ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.rot).y)
        ctx.lineTo((this.x-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.rot).x, (this.y-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.rot).y)
        
        ctx.closePath()

        ctx.lineWidth = 15*this.size*camera.zoom
        ctx.strokeStyle = "white"
        ctx.stroke()
        
    }
}