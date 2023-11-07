
var selected = -1

function editorTick() {
   
    if (keys["KeyW"]) {
        camera.y -= 10
    }
    if (keys["KeyS"]) {
        camera.y += 10
    }
    if (keys["KeyA"]) {
        camera.x -= 10
    }
    if (keys["KeyD"]) {
        camera.x += 10
    }

    let gx = Math.round((mouse.x+camera.x)/50)*50 - camera.x
    let gy = Math.round((mouse.y+camera.y)/50)*50 - camera.y

    let wx = gx+camera.x
    let wy = gy+camera.y

    if (mouse.lclick) {
        
        let i = 0
        let lastSelected = selected
        selected = -1
        for (let point of map[0]) {
            if (Math.sqrt((wx-point[0])**2 + (wy-point[1])**2) < 25) {
                selected = i
            }
            i++
        }
        
        if (lastSelected == selected) {
            map[0].push([gx+camera.x, gy+camera.y])
        }
        if (selected == -1 && lastSelected != selected) {
            map[0].splice(lastSelected+1, 0, [gx+camera.x, gy+camera.y])
        }
    }

    if (jKeys["Backspace"] && selected != -1) {
        map[0].splice(selected, 1)
        selected = -1
    }

    if (jKeys["ArrowUp"] && selected != -1) {
        map[0][selected][1] -= 50
    }
    if (jKeys["ArrowDown"] && selected != -1) {
        map[0][selected][1] += 50
    }
    if (jKeys["ArrowLeft"] && selected != -1) {
        map[0][selected][0] -= 50
    }
    if (jKeys["ArrowRight"] && selected != -1) {
        map[0][selected][0] += 50
    }

    if (jKeys["KeyF"] && selected != -1 && selected < map[0].length-1) {
        mapData[mapData.length-1][1] = selected
    }

    ctx.beginPath()
    let mapI = 0
    for (let m of map) {
        ctx.moveTo(m[0][0]-camera.x, m[0][1]-camera.y)
        for (let i = 1; i < m.length; i++) {
            ctx.lineTo(m[i][0]-camera.x, m[i][1]-camera.y)
        }
        ctx.lineWidth = 10
        ctx.strokeStyle = "white"
        ctx.stroke()
        
        if (mapI == mapData[mapData.length-1][0]) {
            ctx.beginPath()
            let i = mapData[mapData.length-1][1]
            ctx.moveTo(m[i][0]-camera.x, m[i][1]-camera.y)
            ctx.lineTo(m[i+1][0]-camera.x, m[i+1][1]-camera.y)
            ctx.lineWidth = 10
            ctx.strokeStyle = "rgb(0, 255, 0)"
            ctx.stroke()
        }
       
        mapI++
    }
    ctx.beginPath()
    ctx.fillStyle = "rgb(0, 255, 255)"
    ctx.arc(gx, gy, 10, 0, Math.PI*2)
    ctx.fill()

    if (selected != -1) {
        ctx.beginPath()
        ctx.strokeStyle = "rgb(0, 255, 255)"
        ctx.arc(map[0][selected][0]-camera.x, map[0][selected][1]-camera.y, 20, 0, Math.PI*2)
        ctx.lineWidth = 5
        ctx.stroke()
    }
}