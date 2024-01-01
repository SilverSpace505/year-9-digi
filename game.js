
var ghostPlayer = new Player(0, 0, 0.25)
ghostPlayer.isGhost = true

var time = 0
var timing = false
var finished = false

var popupAlpha = 0

var nextLevelButton = new ui.Button("rect", "Next Level")
var retryButton = new ui.Button("rect", "Retry")
var replayBestButton = new ui.Button("rect", "Replay Best")
var menuButton = new ui.Button("rect", "Menu")
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

var tooLong = false
var accountFull = false

var leaderboardReplay = false

var expected = 0

var forward = 0

function gameTickTrue() {

    if (!finished && timing) {
        timeInTicks++
    }

    if (mobile) {
        delete keys["KeyA"]
        delete keys["KeyD"]
        delete keys["KeyW"]
        for (let touch in input.touches) {
            if (input.touches[touch].x > canvas.width/2) {
                keys["KeyD"] = true
                if (forward == 0) forward = 1
            }
            if (input.touches[touch].x < canvas.width/2) {
                keys["KeyA"] = true
                if (forward == 0) forward = 1
            }
            
        }
        if (forward >= 8) {
            keys["KeyW"] = true
        }
    }

    if (forward > 0) forward += 1
    
    if (!replay && !finished) {
        if (timing) {
            replayT += gameDelta
            replayT = Math.round(replayT*1000)/1000
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
            if (cKeys.includes(key) && !(key in lastKeys)) {
                inputs[key] = true
                replayInputs.push([true, key, replayT])
            }
        }
        
        lastKeys = {...inputs}
    }

    if (replay && time > expected && time != 0 && expected != -1) {
        if (!leaderboardReplay) {
            account.bestTimes[mapIndex] = -1
            account.bestReplays[mapIndex] = []
            saveData()
        }
        finished = true
        invalid = true
        timing = false
        time = 0
    }

    if (!replay && (time >= 100 || replayInputs.length > 100)) {
        tooLong = true
        finished = true
        timing = false
        time = 0
    }

    player.update()

    let oldInputs = JSON.parse(JSON.stringify(inputs))
    inputs = JSON.parse(JSON.stringify(ghostInputs))

    if (ghostReplayInputs && ghostReplayInputs.length > 0 && timing && !replay) {
        ghostReplayT += gameDelta
        ghostReplayT = Math.round(ghostReplayT*1000)/1000
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
        time = Math.round(time*1000)/1000
    }

    if (replay && replayInputsC.length > 0) {
        replayT += gameDelta
        replayT = Math.round(replayT*1000)/1000
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
var targetTicks = 40
var gameDelta = 1/targetTicks
var invalid = false

var vtime = 0

setInterval(() => {
    // console.log(fps)
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

    if (jKeys["KeyR"] && !replay) {
        loadMap(mapIndex)
        replay = false
    }

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

    if (account.bestReplays[mapIndex] && account.bestReplays[mapIndex].length > 0 && (timing || finished) && !replay && account.bestReplays[mapIndex][0][1] != null) {
        ctx.globalAlpha = 0.25
        ghostPlayer.draw()
        ctx.globalAlpha = 1
    }
    
    player.draw()

    if (finished) { timing = false }

    // ui.textShadow.multiply = 0.75
    vtime = Math.ceil(lerp(vtime, time, delta*20)*10000)/10000
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
    if (invalid) {
        ui.text(canvas.width/2, canvas.height/2 - 225*su, 75*su, "Invalid Replay", {align: "center"})
        ui.text(canvas.width/2, canvas.height/2 - 150*su, 30*su, "Replay detected as invalid", {align: "center", wrap: 500*su})
    } else if (tooLong) {
        ui.text(canvas.width/2, canvas.height/2 - 225*su, 75*su, "Too Slow", {align: "center"})
        ui.text(canvas.width/2, canvas.height/2 - 150*su, 30*su, "You either took longer than 100s or pressed too many buttons.", {align: "center", wrap: 500*su})
    } else if (accountFull) {
        ui.text(canvas.width/2, canvas.height/2 - 225*su, 75*su, "Account Full", {align: "center"})
        ui.text(canvas.width/2, canvas.height/2 - 150*su, 30*su, "Try pressing less buttons in your runs.", {align: "center", wrap: 500*su})
    } else {
        ui.text(canvas.width/2, canvas.height/2 - 225*su, 75*su, "Complete!", {align: "center"})
        ui.text(canvas.width/2, canvas.height/2 - 150*su, 37.5*su, "Time: " + Math.round(time*100)/100, {align: "center"})
        if (!leaderboardReplay && mapIndex < account.bestTimes.length && account.bestTimes[mapIndex] != -1) {
            ui.text(canvas.width/2, canvas.height/2 - 105*su, 37.5*su, "Best Time: " + Math.round(account.bestTimes[mapIndex]*100)/100, {align: "center"})
        }
    }
    
    if (!leaderboardReplay) {
        if (finished) {
            if (mapIndex < maps.length-1) {
                nextLevelButton.text = "Next Level"
            } else {
                nextLevelButton.text = "Restart"
            }
        }
        nextLevelButton.set(canvas.width/2, canvas.height/2, 300*su, 75*su)
        nextLevelButton.bgColour = [0, 0, 0, 0.5]
        nextLevelButton.textSize = 45*su
        if (finished) {
            nextLevelButton.basic()
        }
        nextLevelButton.draw()
    
        retryButton.set(canvas.width/2, canvas.height/2 + 82.5*su, 300*su, 75*su)
        retryButton.bgColour = [0, 0, 0, 0.5]
        retryButton.textSize = 45*su
        retryButton.text = "Retry"
        if (finished) {
            retryButton.basic()
        }
        retryButton.draw()
    
        if (account.bestReplays[mapIndex] && account.bestReplays[mapIndex].length > 0) {
            replayBestButton.set(canvas.width/2, canvas.height/2 + 82.5*2*su, 300*su, 75*su)
            replayBestButton.bgColour = [0, 0, 0, 0.5]
            replayBestButton.textSize = 40*su
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
        if (replayBestButton.hovered() && account.bestReplays[mapIndex] && account.bestReplays[mapIndex].length > 0 && mouse.lclick && finished) {
            replayBestButton.click()
            replay = true
            replayT = 0
            inputs = {}
            replayInputs = JSON.parse(JSON.stringify(account.bestReplays[mapIndex]))
            replayInputsC = JSON.parse(JSON.stringify(replayInputs))
            expected = account.bestTimes[mapIndex]
            loadMap(mapIndex, false)
        }
    } else {
        retryButton.set(canvas.width/2, canvas.height/2, 300*su, 75*su)
        retryButton.bgColour = [0, 0, 0, 0.5]
        retryButton.textSize = 45*su
        retryButton.text = "Back"
        if (finished) {
            retryButton.basic()
        }
        retryButton.draw()
        if (retryButton.hovered() && mouse.lclick && finished) {
            retryButton.click()
            scene = "leaderboard"
        }
    }
}

function onFinish() {
    if (finished) return
    finished = true
    timing = false

    while (replayInputs.length > 100 && !replay) {
        replayInputs.splice(replayInputs.length-1, 1)
    }

    if (!replay) {
        while (mapIndex >= account.bestTimes.length) {
            account.bestTimes.push(-1)
            account.bestReplays.push([])
        }
    
        if (time < account.bestTimes[mapIndex] || account.bestTimes[mapIndex] == -1) {
            account.bestTimes[mapIndex] = time
            account.bestReplays[mapIndex] = JSON.parse(JSON.stringify(replayInputs))
            saveData()
        }
    
    } else {
        if (Math.round(time*100)/100 != Math.round(expected*100)/100) {
            if (!leaderboardReplay) {
                account.bestTimes[mapIndex] = -1
                account.bestReplays[mapIndex] = []
                saveData()
            }
            invalid = true
            time = 0
        }
    }
}