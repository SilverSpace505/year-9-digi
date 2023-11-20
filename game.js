

var time = 0
var timing = false
var finished = false

var popupAlpha = 0

var nextLevelButton = new ui.Button(0, 0, 0, 0, "rect", "Next Level")
var retryButton = new ui.Button(0, 0, 0, 0, "rect", "Retry")
var menuButton = new ui.Button(0, 0, 0, 0, "rect", "Menu")
nextLevelButton.hoverMul = 0.925
retryButton.hoverMul = 0.925

var inputs = {}
var inputCooldown = 0

var replayInputs = []

var replay = false
var replayT = 0
var replayInputsC = []

var lastKeys = {}

var gameTicks = 0

var timeInTicks = 0

function gameTickTrue() {

    if (!finished && timing) {
        timeInTicks++
    }
    // if (finished) {
    //     console.log(timeInTicks)
    // }
    
    if (!replay && !finished) {
        if (timing) {
            replayT += gameDelta
        } else {
            replayT = 0
        }
        for (let key in lastKeys) {
            if (!(key in keys)) {
                inputs[key] = false
                replayInputs.push([false, key, replayT])
            }
        }
    
        for (let key in keys) {
            if (!(key in lastKeys)) {
                inputs[key] = true
                replayInputs.push([true, key, replayT])
            }
        }
        
        lastKeys = {...keys}
    }
    
    if (replay && replayInputsC.length > 0) {
        replayT += gameDelta
        while (replayInputsC.length > 0 && replayInputsC[0][2] < replayT) {
            inputs[replayInputsC[0][1]] = replayInputsC[0][0]
            replayInputsC.splice(0, 1)
        }
        
    } else {
        replay = false
        replayInputsC = JSON.parse(JSON.stringify(replayInputs))
    }
    
    // if (inputCooldown <= 0) {
    //     if (replay) {
    //         console.log(replayI)
    //         if (finished && replayI < replayInputs.length) {
    //             console.log("Run Invalid", replayI, ">", replayInputs.length)
    //             replay = false
    //         }
    //         inputs = {...replayInputs[replayI]}
    //         replayI++
    //         if (replayI >= replayInputs.length) {
    //             if (!finished) {
    //                 console.log("Run Invalid", replayI-1, "<", replayInputs.length)
    //             }
    //             replayI = 0
    //             replay = false
    //         }
    //     } else if (!finished) {
    //         inputs = {...keys}
    //         if (timing) {
    //             replayInputs.push({...keys})
    //         }
    //     }
    //     if (timing) {
    //         inputCooldown = 1/20
    //     }
    // }
    // inputCooldown -= delta

    player.update()

    for (let i = 0; i < particles.length; i++) {
        particles[i].move()
        particles[i].draw()

        if (particles[i].lifetime > 0.02) {
            particles.splice(i, 1)
            i--
        }
    }

    if (timing) {
        time += gameDelta
    }

}

var runTime = 0
var targetTicks = 30
var gameDelta = 1/targetTicks

var vtime = 0

function gameTick() {
    if (jKeys["KeyR"]) {
        replay = !replay
        if (replay) {
            replayT = 0
            inputs = {}
            loadMap(mapIndex, false)
        }
    }

    runTime += delta
    while (gameTicks < runTime*targetTicks) {
        gameTickTrue()
        gameTicks += 1
    }

    player.vx = lerp(player.vx, player.x, delta*15)
    player.vy = lerp(player.vy, player.y, delta*15)
    player.vrot = lerp(player.vrot, player.rot, delta*15)
    player.vdragRot = lerp(player.vdragRot, player.dragRot, delta*15)

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
        particles[i].draw()
    }

    player.draw()

    if (finished) { timing = false }

    // ui.textShadow.multiply = 0.75
    vtime = lerp(vtime, time, delta*20)
    ui.text(50*su, 50*su, 50*su, `TIME: ${Math.round(vtime*100)/100}`)

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