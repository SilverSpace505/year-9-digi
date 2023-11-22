
var ghostPlayer = new Player(0, 0, 0.25)
ghostPlayer.isGhost = true

var time = 0
var timing = false
var finished = false

var popupAlpha = 0

var nextLevelButton = new ui.Button(0, 0, 0, 0, "rect", "Next Level")
var retryButton = new ui.Button(0, 0, 0, 0, "rect", "Retry")
var replayBestButton = new ui.Button(0, 0, 0, 0, "rect", "Replay Best")
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

var ghostReplayT = 0
var ghostReplayInputs = []
var ghostInputs = []

var fps = 0

function gameTickTrue() {

    if (!finished && timing) {
        timeInTicks++
    }
    // if (finished) {
    //     console.log(timeInTicks)
    // }

    let oldInputs = JSON.parse(JSON.stringify(inputs))
    inputs = JSON.parse(JSON.stringify(ghostInputs))

    if (ghostReplayInputs && ghostReplayInputs.length > 0 && timing && !replay) {
        ghostReplayT += gameDelta
        while (ghostReplayInputs.length > 0 && ghostReplayInputs[0][2] < ghostReplayT) {
            inputs[ghostReplayInputs[0][1]] = ghostReplayInputs[0][0]
            if (!inputs[ghostReplayInputs[0][1]]) {
                delete inputs[ghostReplayInputs[0][1]]
            }
            ghostReplayInputs.splice(0, 1)
        }
    }

    ghostPlayer.update()

    ghostInputs = JSON.parse(JSON.stringify(inputs))

    inputs = oldInputs
    
    if (!replay && !finished) {
        if (timing) {
            replayT += gameDelta
        } else {
            replayT = 0
        }
        for (let key in lastKeys) {
            if (!(key in keys)) {
                delete inputs[key]
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

    if (replay && time > bestTimes[mapIndex]) {
        bestTimes[mapIndex] = -1
        bestReplays[mapIndex] = []
        localStorage.setItem("bestTimes", JSON.stringify(bestTimes))
        localStorage.setItem("bestReplays", JSON.stringify(bestReplays))
        finished = true
        invalid = true
        timing = false
        time = 0
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

    if (replay && replayInputsC.length > 0) {
        replayT += gameDelta
        while (replayInputsC.length > 0 && replayInputsC[0][2] < replayT) {
            inputs[replayInputsC[0][1]] = replayInputsC[0][0]
            if (!inputs[replayInputsC[0][1]]) {
                delete inputs[replayInputsC[0][1]]
            }
            replayInputsC.splice(0, 1)
        }        
    } else {
        replayInputsC = JSON.parse(JSON.stringify(replayInputs))
    }

}

var runTime = 0
var targetTicks = 30
var gameDelta = 1/targetTicks
var invalid = false

var vtime = 0

setInterval(() => {
    console.log(fps)
    fps = 0
}, 1000)

function gameTick() {
    // if (jKeys["KeyR"]) {
    //     replay = !replay
    //     if (replay) {
    //         replayT = 0
    //         inputs = {}
    //         loadMap(mapIndex, false)
    //     }
    // }

    runTime += delta
    while (gameTicks < runTime*targetTicks) {
        gameTickTrue()
        gameTicks += 1
    }

    fps++

    player.vx = lerp(player.vx, player.x, delta*15)
    player.vy = lerp(player.vy, player.y, delta*15)
    player.vrot = lerp(player.vrot, player.rot, delta*15)
    player.vdragRot = lerp(player.vdragRot, player.dragRot, delta*15)

    ghostPlayer.vx = lerp(ghostPlayer.vx, ghostPlayer.x, delta*15)
    ghostPlayer.vy = lerp(ghostPlayer.vy, ghostPlayer.y, delta*15)
    ghostPlayer.vrot = lerp(ghostPlayer.vrot, ghostPlayer.rot, delta*15)
    ghostPlayer.vdragRot = lerp(ghostPlayer.vdragRot, ghostPlayer.dragRot, delta*15)

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

    if (bestReplays[mapIndex] && bestReplays[mapIndex].length > 0 && (timing || finished) && !replay) {
        ctx.globalAlpha = 0.25
        ghostPlayer.draw()
        ctx.globalAlpha = 1
    }
    
    player.draw()

    if (finished) { timing = false }

    // ui.textShadow.multiply = 0.75
    vtime = lerp(vtime, time, delta*20)
    ui.text(50*su, 50*su, 50*su, `TIME: ${Math.round(vtime*100)/100}`)

    menuButton.set(canvas.width - 170*su, (75/2+20)*su, 300*su, 75*su)
    menuButton.bgColour = [255, 0, 0, 0.5]
    menuButton.textSize = 52.5*su

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

    ui.rect(canvas.width/2, canvas.height/2, 900*su, 600*su, [50, 50, 50, 0.7], 15*su, [255, 255, 255, 1])
    if (!invalid) {
        ui.text(canvas.width/2, canvas.height/2 - 225*su, 75*su, "Complete!", {align: "center"})

        ui.text(canvas.width/2, canvas.height/2 - 150*su, 37.5*su, "Time: " + Math.round(time*100)/100, {align: "center"})
        if (bestTimes[mapIndex] != -1) {
            ui.text(canvas.width/2, canvas.height/2 - 105*su, 37.5*su, "Best Time: " + Math.round(bestTimes[mapIndex]*100)/100, {align: "center"})
        }
    } else {
        ui.text(canvas.width/2, canvas.height/2 - 225*su, 75*su, "Invalid Replay", {align: "center"})
    }
    

    if (finished) {
        if (mapIndex < maps.length-1) {
            nextLevelButton.text = "Next Level"
        } else {
            nextLevelButton.text = "Restart"
        }
    }
    nextLevelButton.set(canvas.width/2, canvas.height/2, 300*su, 75*su)
    nextLevelButton.bgColour = [0, 0, 0, 0.5]
    nextLevelButton.textSize = 52.5*su
    if (finished) {
        nextLevelButton.basic()
    }
    nextLevelButton.draw()

    retryButton.set(canvas.width/2, canvas.height/2 + 82.5*su, 300*su, 75*su)
    retryButton.bgColour = [0, 0, 0, 0.5]
    retryButton.textSize = 52.5*su
    if (finished) {
        retryButton.basic()
    }
    retryButton.draw()

    if (bestReplays[mapIndex].length > 0) {
        replayBestButton.set(canvas.width/2, canvas.height/2 + 82.5*2*su, 300*su, 75*su)
        replayBestButton.bgColour = [0, 0, 0, 0.5]
        replayBestButton.textSize = 45*su
        if (finished) {
            replayBestButton.basic()
        }
        replayBestButton.draw()
    }

    ctx.globalAlpha = 1

    if (nextLevelButton.hovered() && mouse.lclick && finished) {
        nextLevelButton.click()
        if (mapIndex < maps.length-1) {
            loadMap(mapIndex+1)
        } else {
            loadMap(0)
        }
        replay = false
    }
    if (retryButton.hovered() && mouse.lclick && finished) {
        retryButton.click()
        loadMap(mapIndex)
        replay = false
    }
    if (replayBestButton.hovered() && bestReplays[mapIndex].length > 0 && mouse.lclick && finished) {
        replayBestButton.click()
        replay = true
        replayT = 0
        inputs = {}
        replayInputs = JSON.parse(JSON.stringify(bestReplays[mapIndex]))
        replayInputsC = JSON.parse(JSON.stringify(replayInputs))
        loadMap(mapIndex, false)
    }
}

function onFinish() {
    if (finished) return
    finished = true
    timing = false

    if (!replay) {
        while (mapIndex >= bestTimes.length) {
            bestTimes.push(-1)
            bestReplays.push([])
        }
    
        if (time < bestTimes[mapIndex] || bestTimes[mapIndex] == -1) {
            bestTimes[mapIndex] = time
            bestReplays[mapIndex] = JSON.parse(JSON.stringify(replayInputs))
        }
    
        localStorage.setItem("bestTimes", JSON.stringify(bestTimes))
        localStorage.setItem("bestReplays", JSON.stringify(bestReplays))
    } else {
        if (Math.round(time*100)/100 != Math.round(bestTimes[mapIndex]*100)/100) {
            bestTimes[mapIndex] = -1
            bestReplays[mapIndex] = []
            localStorage.setItem("bestTimes", JSON.stringify(bestTimes))
            localStorage.setItem("bestReplays", JSON.stringify(bestReplays))
            invalid = true
            time = 0
        }
    }
}