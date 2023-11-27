class Player {
    x = 0
    y = 0
    size = 1
    rot = 0
    velX = 0
    velY = 0
    speed = 500
    rotSpeed = 250
    dragRot = 0
    distance = 0
    rDistance = 0
    maxDistance = 150
    fixDistance = 0
    vx = 0
    vy = 0
    vrot = 0
    rotVel = 0
    vdragRot = 0
    isGhost = false
    finished = false
    wallAngle = -1
    wall = null
    toBounce = 0
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
    }
    update() {
        if ((inputs["KeyW"] || inputs["ArrowUp"]) && !finished && !this.finished) {
            timing = true

            this.velX -= Math.sin(this.rot)*this.speed*gameDelta * ((this.maxDistance - this.rDistance)**3/500000+1)
            this.velY -= Math.cos(this.rot)*this.speed*gameDelta * ((this.maxDistance - this.rDistance)**3/500000+1)
            if (!this.isGhost) {
                for (let i = 0; i < 200/targetTicks; i++) {
                    let rotOff = (Math.random()-0.5)*2 * Math.PI/2
                    particles.push(new Particle(this.x, this.y, 
                        Math.sin(this.rot+rotOff)*this.speed * ((this.maxDistance - this.rDistance)/15+1)*500, 
                        Math.cos(this.rot+rotOff)*this.speed * ((this.maxDistance - this.rDistance)/15+1)*500, 
                        1))
                    particles[particles.length-1].size = (this.maxDistance-this.rDistance)/this.maxDistance*2.5
                    particles[particles.length-1].fromGhost = this.isGhost
                }
            }
        }
        if ((inputs["KeyS"] || inputs["ArrowDown"]) && !finished && !this.finished) {
            timing = true
            this.velX += Math.sin(this.rot)*this.speed/2*gameDelta
            this.velY += Math.cos(this.rot)*this.speed/2*gameDelta
        }
        if ((inputs["KeyA"] || inputs["ArrowLeft"]) && !finished && !this.finished) {
            timing = true
            if (inputs["KeyS"]) {
                this.rotVel -= this.rotSpeed*gameDelta
                // if (this.checkCollide()) {
                //     this.rot += this.rotSpeed*gameDelta
                // }
            } else {
                this.rotVel += this.rotSpeed*gameDelta
                // if (this.checkCollide()) {
                //     this.rot -= this.rotSpeed*gameDelta
                // }
            }
        }
        if ((inputs["KeyD"] || inputs["ArrowRight"]) && !finished && !this.finished) {
            timing = true
            if (inputs["KeyS"]) {
                this.rotVel += this.rotSpeed*gameDelta
                // if (this.checkCollide()) {
                //     this.rot -= this.rotSpeed*gameDelta
                // }
            } else {
                this.rotVel -= this.rotSpeed*gameDelta
                // if (this.checkCollide()) {
                //     this.rot += this.rotSpeed*gameDelta
                // }
            }
        }
        
        this.rotVel = lerp(this.rotVel, 0, gameDelta*100*(1-0.9))
        this.rot += this.rotVel * gameDelta
        this.rotVel = 0
        this.velX = lerp(this.velX, 0, gameDelta*100*(1-0.99))
        this.velY = lerp(this.velY, 0, gameDelta*100*(1-0.99))

        this.wallAngle = -1
        this.wall = null

        this.fixCollision()

        let steps = 1/gameDelta
        for (let i = 0; i < steps; i++) {
            this.x += this.velX * gameDelta / steps
            this.y += this.velY * gameDelta / steps

            if (Math.abs(angleD(this.wallAngle, this.rot)) < Math.PI/8 && this.wallAngle != -1) {
                this.toBounce += 1
            } else {
                this.toBounce = 0
            }
            
            if (this.checkCollide()) {
               const penetrationDepth = 1
               let normal = { x: this.wall[3] - this.wall[1], y: this.wall[0] - this.wall[2] }
               const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
               normal.x /= length
               normal.y /= length
               const relativePosition = {
                   x: this.x - this.wall[0],
                   y: this.y - this.wall[1]
               }
               const dotProduct = relativePosition.x * normal.x + relativePosition.y * normal.y
    
               if (dotProduct < 0) {
                   normal.x *= -1
                   normal.y *= -1
               }
    
               const speedAlongNormal = normal.x * this.velX + normal.y * this.velY
               const velXAlongNormal = normal.x * speedAlongNormal
               const velYAlongNormal = normal.y * speedAlongNormal
    
               const friction = 1
               const velXSliding = this.velX - velXAlongNormal * friction
               const velYSliding = this.velY - velYAlongNormal * friction
    
               this.velX = lerp(this.velX, velXSliding, gameDelta)
               this.velY = lerp(this.velY, velYSliding, gameDelta)
    
               this.x += normal.x * penetrationDepth
               this.y += normal.y * penetrationDepth
            } else if (this.checkCollide()) {
                const penetrationDepth = 1
                let normal = { x: this.wall[3] - this.wall[1], y: this.wall[0] - this.wall[2] }
                const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
                normal.x /= length
                normal.y /= length
                const relativePosition = {
                    x: this.x - this.wall[0],
                    y: this.y - this.wall[1]
                }
                const dotProduct = relativePosition.x * normal.x + relativePosition.y * normal.y
     
                if (dotProduct < 0) {
                    normal.x *= -1
                    normal.y *= -1
                }
                
                this.velX = lerp(this.velX, normal.x * 500, 0.9)
                this.velY = lerp(this.velY, normal.y * 500, 0.9)

                this.x += normal.x * penetrationDepth
                this.y += normal.y * penetrationDepth
            }
        }
       
        // this.move(this.velX*gameDelta, this.velY*gameDelta, 1/gameDelta/10)
        
        // for (let i = 0; i < 100; i++) {
        //     this.x += this.velX * gameDelta / 100
        //     if (this.fixCollision()) {
        //         this.velX *= 0.99
        //         // if (this.rDistance > 50) {
        //         //     this.velX *= -0.25
        //         //     this.velY *= 0.8
        //         //     break
        //         // } else {
        //         //     this.velX *= 0.999
        //         // }
        //     }
        //     this.y += this.velY * gameDelta / 100
        //     if (this.fixCollision()) {
        //         this.velY *= 0.99
        //         // if (this.rDistance > 50) {
        //         //     this.velY *= -0.25
        //         //     this.velX *= 0.8
        //         //     break
        //         // } else {
        //         //     this.velY *= 0.999
        //         // }
        //     }
        // }

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
        
        // if (collided) {
        //     this.velX -= (1-0.9)*gameDelta*this.velX * 100
        //     this.velY -= (1-0.9)*gameDelta*thiwds.velY * 100
        // }
        this.dragRot += (this.rot-this.dragRot)*gameDelta*10
        // this.checkCollide()
        // console.log(this.checkCollide())
    }
    move(x, y, steps) {
        for (let i = 0; i < steps; i++) {
            this.x += x/steps
            if (this.checkCollide()) {
                let d = 0.1
                let out = false
                let amt = 100
                while (!out && d <= amt) {
                    this.y += d
                    // this.velY -= d
                    if (!this.checkCollide()) {
                        out = true
                    } else {
                        this.y -= d*2
                        // this.velY += d*2
                        if (!this.checkCollide()) {
                            out = true
                        } else {
                            this.y += d
                            // this.velY -= d
                        }
                    }
                    d += 0.1
                }
                if (d > amt) {
                    this.x -= x/steps
                }
            }
        }


        for (let i = 0; i < steps; i++) {
            this.y += y/steps
            if (this.checkCollide()) {
                let d = 0.1
                let out = false
                let amt = 25
                while (!out && d <= amt) {
                    this.x += d
                    // this.velY -= d
                    if (!this.checkCollide()) {
                        out = true
                    } else {
                        this.x -= d*2
                        // this.velY += d*2
                        if (!this.checkCollide()) {
                            out = true
                        } else {
                            this.x += d
                            // this.velY -= d
                        }
                    }
                    d += 0.1
                }
                if (d > amt) {
                    this.y -= y/steps
                }
            }
        }
    }
    fixCollision() {
        let splits = 16
        let collided = false
        let moved = 0
        let solutions = []
        // let start = new Date().getTime()
        while (moved < 5) {
            solutions = []
            for (let angleI = 0; angleI < splits; angleI++) {
                let angle = Math.PI*2 / splits * angleI
                this.x += Math.sin(angle)*this.fixDistance
                this.y += Math.cos(angle)*this.fixDistance
                if (!this.checkCollide()) {
                    solutions.push(angleI)
                    // this.fixDistance = 0
                    // return collided
                }
                this.x -= Math.sin(angle)*this.fixDistance
                this.y -= Math.cos(angle)*this.fixDistance
                collided = true
            }

            if (solutions.length > 0) {
                let angle = Math.PI*2 / splits * solutions[0]
                this.x += Math.sin(angle)*this.fixDistance
                this.y += Math.cos(angle)*this.fixDistance
                this.fixDistance = 0
                return
            }

            this.fixDistance += 0.1
            moved += 0.1
            // console.log(start, Date.now(), Date.now()-start)
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
                            if (this.isGhost) {
                                this.finished = true
                            } else {
                                onFinish()
                            }
                        }

                        continue
                    }
                    if (findIntersection(
                        p[0], p[1],
                        ps[i2][0], ps[i2][1],
                        l[0], l[1],
                        m[i4][0], m[i4][1]
                    )) {
                        this.wallAngle = -Math.atan2(m[i4][1]-l[1], m[i4][0]-l[0])
                        this.wall = [l[0], l[1], m[i4][0], m[i4][1]]
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
        ctx.moveTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).y)                              
        ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.vrot).y)
        ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).y)
        ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.vrot).y)
        
        ctx.closePath()

        ctx.fillStyle = "blue"
        ctx.fill()
        
        if ((Math.abs(this.velX)+Math.abs(this.velY))/2 > 25 && (!(inputs["KeyS"] || inputs["ArrowDown"]) || scene != "game")) {
            ctx.beginPath()
        
            ctx.moveTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.vrot).y)
            let x = ((Math.abs(this.velX)+Math.abs(this.velY))/2/2+50+Math.random()*25)
            let y = (0+(Math.random()-0.5)*2*25)
            ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.vdragRot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.vdragRot).y)
            
            ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.vrot).y)
            ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).y)
    
            ctx.closePath()
    
            ctx.fillStyle = "lightblue"
            ctx.fill()


            ctx.beginPath()

            let redSize = 0.75
        
            ctx.moveTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*redSize*0.83*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*redSize*0.83*this.size*camera.zoom, this.vrot).y)
            x *= redSize
            ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.vdragRot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(x*this.size*camera.zoom, y*this.size*camera.zoom, this.vdragRot).y)
            
            ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*redSize*0.83*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*redSize*0.83*this.size*camera.zoom, this.vrot).y)
            ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).y)
    
            ctx.closePath()
    
            ctx.fillStyle = "rgb(50, 127, 255)"
            ctx.fill()
        }

        ctx.beginPath()

        ctx.moveTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(-100*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).y)                              
        ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, 85*this.size*camera.zoom, this.vrot).y)
        ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(50*this.size*camera.zoom, 0*this.size*camera.zoom, this.vrot).y)
        ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.vrot).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*this.size*camera.zoom, -85*this.size*camera.zoom, this.vrot).y)
        
        ctx.closePath()

        ctx.lineWidth = 15*this.size*camera.zoom
        ctx.strokeStyle = "white"
        ctx.stroke()

        // if (this.wallAngle != -1) {
        //     ctx.beginPath()
        //     ctx.moveTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(-100*camera.zoom, 0, this.wallAngle).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(-100*camera.zoom, 0, this.wallAngle).y)
        //     ctx.lineTo((this.vx-camera.x)*camera.zoom+canvas.width/2 + rv2(100*camera.zoom, 0, this.wallAngle).x, (this.vy-camera.y)*camera.zoom+canvas.height/2 + rv2(100*camera.zoom, 0, this.wallAngle).y)
        //     ctx.lineWidth = 5*camera.zoom
        //     ctx.strokeStyle = "red"
        //     ctx.stroke()
        // }
        
    }
}