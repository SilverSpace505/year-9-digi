utils.setup()
utils.setStyles()
utils.ignoreSafeArea()

var particles = []

var player = new Player(200, 200, 0.25)

var targetSize = {x: 1500, y: 1000}
var su = 1

var camera = {x: player.x-window.innerWidth/2, y: player.y-window.innerHeight/2, zoom: 1}
var zoomT = 4

var lastTime = 0
var delta = 0

var scene = "menu"

var menuPlayer = new Player(100, 0, 0.25)

var leaderboardRefresh = 0

ui.textShadow.bottom = "auto"

utils.setGlobals()

function update(timestamp) {
    requestAnimationFrame(update)
    input.setGlobals()
    delta = (timestamp - lastTime) / 1000
	lastTime = timestamp
    if (!delta) { delta = 0 }
	if (delta > 0.5) { delta = 0.5 }

    document.body.style.cursor = "default"

    // if (jKeys["KeyE"] && !typing) {
    //     if (scene == "editor") {
    //         scene = "game"
    //     } else {
    //         scene = 'editor'
    //     }
    // }

    ui.resizeCanvas()
    ui.getSu()
    
    // canvas.width = window.innerWidth
    // canvas.height = window.innerHeight
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (wConnect && !document.hidden) {
        wConnect = false
        connectToServer()
    }

    // var w = window.innerWidth
	// var h = window.innerHeight

	// let aspect = w / targetSize.x

	// su = aspect
	// if (su > h / targetSize.y) {
	// 	su = h / targetSize.y
	// }

    leaderboardRefresh -= delta

    camera.zoom = lerp(camera.zoom, zoomT*su, delta*10)

    if (scene != "game" && scene != "editor") {
        zoomT = 4
        camera.zoom = zoomT*su
        menuPlayer.velX = 500
        menuPlayer.vdragRot = Math.PI/8
        menuPlayer.vrot = Math.PI/8
        menuPlayer.vx = menuPlayer.x
        menuPlayer.vy = menuPlayer.y
        menuPlayer.draw()
        camera.x = 0
        camera.y = 0
        ctx.beginPath()
        let mapI = 0
        let map = [
            [
                [175, 500],
                [175, -25],
                [125, -75],
                [-500, -75]
            ]
        ]
        for (let m of map) {
            ctx.moveTo((m[0][0]-camera.x)*camera.zoom+canvas.width/2, (m[0][1]-camera.y)*camera.zoom+canvas.height/2)
            for (let i = 1; i < m.length; i++) {
                ctx.lineTo((m[i][0]-camera.x)*camera.zoom+canvas.width/2, (m[i][1]-camera.y)*camera.zoom+canvas.height/2)
            }
            ctx.lineWidth = 10*camera.zoom
            ctx.strokeStyle = "white"
            ctx.stroke()
        
            mapI++
        }
    }

    if (scene == "game") {
        gameTick()
    } else if (scene == "editor") {
        editorTick()
    } else if (scene == "menu") {
        menuTick()
    } else if (scene == "instructions") {
        instructionsTick()
    } else if (scene == "levelselect") {
        levelSelectTick()
    } else if (scene == "leaderboard") {
        leaderboardTick()
    }

    input.updateInput()
}

update()

input.checkInputs = (event) => {
    input.cistart()

    if (scene == "menu" && accountOpen && (aPage == "signup" || aPage == "login")) {
        usernameT.checkFocus(event)
        passwordT.checkFocus(event)
    }

    if (scene == "menu" && accountOpen && aPage == "changePass") {
        passwordT.checkFocus(event)
    }  

    if (scene == "menu" && accountOpen && aPage == "changeUser") {
        usernameT.checkFocus(event)
    }  

    input.ciend()
}

input.scroll = (x, y) => {
    if (scene == "leaderboard" && leaderboardC.hovered()) {
        leaderboardC.off.x -= x
        leaderboardC.off.y -= y
        leaderboardC.update()
    }
}

function deleteRun(username, map) {
    sendMsg({deleteRun: {username:username, map:map-1}})
}

function deleteAccount(username) {
    sendMsg({deleteAccount: username})
}