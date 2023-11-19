
var selected = -1
var typing = false
var typed = ""

var sLayer = 0

function editorTick() {

    zoomT = 1

    if (jKeys["Enter"]) {
        typing = !typing
        if (!typing) {
            if (parseInt(typed) != -1 && parseInt(typed) < maps.length) {
                loadMap(parseInt(typed))
            }
        }
        typed = ""
    }

    if (typing) {
        for (let key in jKeysRaw) {
            if (key.length == 1) {
                typed += key
            } else if (key == "Backspace") {
                typed = typed.substring(0, typed.length-1)
            }
            
        }
    }

    if (jKeys["KeyN"] && !typing) {
        maps.splice(mapIndex+1, 0, [[], [0, 0]])
        mapSpawns.splice(mapIndex+1, 0, {x: 50, y: 0, rot: -Math.PI/2})
        loadMap(mapIndex+1)
    }
    if (jKeys["KeyM"] && !typing) {
        maps.splice(mapIndex, 1)
        mapSpawns.splice(mapIndex, 1)
        let newI = mapIndex-1
        if (maps.length < 1) {
            maps.push([[], [0, 0]])
            mapSpawns.push({x: 50, y: 0, rot: -Math.PI/2})
        }
        if (newI < 0) {
            newI = 0
        }
        loadMap(newI)
    }

    if (jKeys["KeyJ"] && !typing) {
        selected = -1
        sLayer += 1
        if (sLayer >= mapData.length-2) {
            mapData.splice(mapData.length-1, 0, [])
        }
    }
    if (jKeys["KeyK"] && !typing) {
        selected = -1
        sLayer -= 1
        if (sLayer < 0) {
            sLayer = 0
        }
    }
    for (let i = 0; i < mapData.length-1; i++) {
        if (mapData[i].length < 1 && sLayer != i) {
            mapData.splice(i, 1)
            if (i < sLayer) {
                sLayer -= 1
            }
            i--
        }
    }
    
    if (keys["KeyW"] && !typing) {
        camera.y -= 10
    }
    if (keys["KeyS"] && !typing) {
        camera.y += 10
    }
    if (keys["KeyA"] && !typing) {
        camera.x -= 10
    }
    if (keys["KeyD"] && !typing) {
        camera.x += 10
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw()
    }

    player.draw()

    let gx = Math.round(((mouse.x-canvas.width/2)/camera.zoom+camera.x)/50)*50
    let gy = Math.round(((mouse.y-canvas.height/2)/camera.zoom+camera.y)/50)*50

    map = mapData.slice(0, mapData.length-1)

    if (mouse.lclick) {
        
        let i = 0
        let lastSelected = selected
        selected = -1
        for (let point of mapData[sLayer]) {
            if (Math.sqrt((gx-point[0])**2 + (gy-point[1])**2) < 25) {
                selected = i
            }
            i++
        }
        
        if (lastSelected == selected) {
            mapData[sLayer].push([gx, gy])
        }
        if (selected == -1 && lastSelected != selected) {
            mapData[sLayer].splice(lastSelected+1, 0, [gx, gy])
        }
    }

    if (jKeys["Backspace"] && selected != -1 && !typing) {
        mapData[sLayer].splice(selected, 1)
        selected = -1
    }

    if (jKeys["ArrowUp"] && selected != -1) {
        mapData[sLayer][selected][1] -= 50
    }
    if (jKeys["ArrowDown"] && selected != -1) {
        mapData[sLayer][selected][1] += 50
    }
    if (jKeys["ArrowLeft"] && selected != -1) {
        mapData[sLayer][selected][0] -= 50
    }
    if (jKeys["ArrowRight"] && selected != -1) {
        mapData[sLayer][selected][0] += 50
    }

    if (jKeys["KeyF"] && selected != -1) {
        mapData[mapData.length-1][0] = sLayer
        mapData[mapData.length-1][1] = selected
    }  
    if (jKeys["KeyG"] && selected != -1) {
        mapData[mapData.length-1][0] = sLayer
        mapData[mapData.length-1][2] = selected
    }  

    map = mapData.slice(0, mapData.length-1)

    let mapI = 0
    for (let m of map) {
        if (mapI == sLayer) {
            ctx.globalAlpha = 1
        } else {
            ctx.globalAlpha = 0.5
        }
        for (let i = 0; i < m.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = "grey"
            ctx.arc((m[i][0]-camera.x)*camera.zoom+canvas.width/2, (m[i][1]-camera.y)*camera.zoom+canvas.height/2, 20*su, 0, Math.PI*2)
            ctx.fill()
        }
        mapI++
    }

    mapI = 0
    for (let m of map) {
        if (m.length <= 0) {
            mapI++
            continue
        }
        if (mapI == sLayer) {
            ctx.globalAlpha = 1
        } else {
            ctx.globalAlpha = 0.5
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
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.fillStyle = "rgb(0, 255, 255)"
    ctx.arc((gx-camera.x)*camera.zoom+canvas.width/2, (gy-camera.y)*camera.zoom+canvas.height/2, 10, 0, Math.PI*2)
    ctx.fill()

    if (selected != -1) {
        ctx.beginPath()
        ctx.strokeStyle = "rgb(0, 255, 255)"
        ctx.arc((map[sLayer][selected][0]-camera.x)*camera.zoom+canvas.width/2, (map[sLayer][selected][1]-camera.y)*camera.zoom+canvas.height/2, 20, 0, Math.PI*2)
        ctx.lineWidth = 5
        ctx.stroke()
    }

    if (typing) {
        ui.text(canvas.width/2, canvas.height/2-100*su, 100*su, "Go to level:", {align: "center"})
        ui.text(canvas.width/2, canvas.height/2, 100*su, typed, {align: "center"})
    }

    menuButton.set(canvas.width - 210*su, 60*su, 200*su, 50*su)
    menuButton.bgColour = [255, 0, 0, 0.5]
    menuButton.textSize = 35*su

    menuButton.basic()
    menuButton.draw()
    
    if (menuButton.hovered() && mouse.lclick) {
        menuButton.click()
        scene = "menu"
    }
}