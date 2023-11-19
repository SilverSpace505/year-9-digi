

var time = 0
var timing = false
var finished = false

var popupAlpha = 0

var nextLevelButton = new ui.Button(0, 0, 0, 0, "rect", "Next Level")
var retryButton = new ui.Button(0, 0, 0, 0, "rect", "Retry")
var menuButton = new ui.Button(0, 0, 0, 0, "rect", "Menu")
nextLevelButton.hoverMul = 0.925
retryButton.hoverMul = 0.925

function gameTick() {
    player.update()

    camera.x = lerp(camera.x, player.x+player.velX/5, delta*5)
    camera.y = lerp(camera.y, player.y+player.velY/5, delta*5)

    zoomT = 1.5 - Math.sqrt(player.velX**2 + player.velY**2)/3000

    let mapI = 0
    for (let m of map) {
        if (m.length <= 0) {
            mapI++
            continue
        }
        ctx.beginPath()
        ctx.moveTo((m[0][0]-camera.x)*camera.zoom+canvas.width/2, (m[0][1]-camera.y)*camera.zoom+canvas.height/2)
        for (let i = 1; i < m.length; i++) {
            ctx.lineTo((m[i][0]-camera.x)*camera.zoom+canvas.width/2, (m[i][1]-camera.y)*camera.zoom+canvas.height/2)
        }
        ctx.lineWidth = 10*camera.zoom
        ctx.strokeStyle = "white"
        ctx.stroke()
        
        for (let i2 = 0; i2 < m.length; i2++) {
            if (mapI == mapData[mapData.length-1][0] && (i2 >= mapData[mapData.length-1][1] && i2 < mapData[mapData.length-1][2]) && i2 < m.length-1) {
                ctx.beginPath()
                ctx.moveTo((m[i2][0]-camera.x)*camera.zoom+canvas.width/2, (m[i2][1]-camera.y)*camera.zoom+canvas.height/2)
                ctx.lineTo((m[i2+1][0]-camera.x)*camera.zoom+canvas.width/2, (m[i2+1][1]-camera.y)*camera.zoom+canvas.height/2)
                ctx.lineWidth = 10*camera.zoom
                ctx.strokeStyle = "rgba(0, 255, 0)"
                ctx.stroke()
            }
        }
       
        mapI++
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].move()
        particles[i].draw()

        if (particles[i].lifetime > 0.02) {
            particles.splice(i, 1)
            i--
        }
    }

    player.draw()

    if (finished) { timing = false }

    if (timing) {
        time += delta
    }

    // ui.textShadow.multiply = 0.75
    ui.text(50*su, 50*su, 50*su, `TIME: ${Math.round(time*100)/100}`)

    menuButton.set(canvas.width - 210*su, 60*su, 200*su, 50*su)
    menuButton.bgColour = [255, 0, 0, 0.5]
    menuButton.textSize = 35*su

    menuButton.basic()
    menuButton.draw()
    
    if (menuButton.hovered() && mouse.lclick) {
        menuButton.click()
        scene = "menu"
    }

    if (finished) {
        popupAlpha += (1 - popupAlpha) * delta * 5
    } else {
        popupAlpha += (0 - popupAlpha) * delta * 15
    }

    if (popupAlpha < 0) {
        popupAlpha = 0
    }

    ctx.globalAlpha = popupAlpha

    ui.rect(canvas.width/2, canvas.height/2, 600*su, 400*su, [50, 50, 50, 0.7], 10*su, [255, 255, 255, 1])
    ui.text(canvas.width/2, canvas.height/2 - 150*su, 50*su, "Complete!", {align: "center"})

    ui.text(canvas.width/2, canvas.height/2 - 100*su, 25*su, "Time: " + Math.round(time*100)/100, {align: "center"})
    ui.text(canvas.width/2, canvas.height/2 - 70*su, 25*su, "Best Time: " + Math.round(time*100)/100, {align: "center"})

    if (finished) {
        if (mapIndex < maps.length-1) {
            nextLevelButton.text = "Next Level"
        } else {
            nextLevelButton.text = "Restart"
        }
    }
    nextLevelButton.set(canvas.width/2, canvas.height/2, 200*su, 50*su)
    nextLevelButton.bgColour = [0, 0, 0, 0.5]
    nextLevelButton.textSize = 35*su
    if (finished) {
        nextLevelButton.basic()
    }
    nextLevelButton.draw()

    retryButton.set(canvas.width/2, canvas.height/2 + 55*su, 200*su, 50*su)
    retryButton.bgColour = [0, 0, 0, 0.5]
    retryButton.textSize = 35*su
    if (finished) {
        retryButton.basic()
    }
    retryButton.draw()

    ctx.globalAlpha = 1

    if (nextLevelButton.hovered() && mouse.lclick && finished) {
        nextLevelButton.click()
        if (mapIndex < maps.length-1) {
            loadMap(mapIndex+1)
        } else {
            loadMap(0)
        }
    }
    if (retryButton.hovered() && mouse.lclick && finished) {
        retryButton.click()
        loadMap(mapIndex)
    }

}

function onFinish() {
    finished = true
    timing = false
}