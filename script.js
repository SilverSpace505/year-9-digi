var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
ctx.off = {x: 0, y: 0}

var particles = []

var player = new Player(200, 200, 0.25)

var targetSize = {x: 1500, y: 1000}
var su = 1

loadMap(0)

var camera = {x: player.x-window.innerWidth/2, y: player.y-window.innerHeight/2, zoom: 1}

var lastTime = 0
var delta = 0

var scene = "menu"

ui.textShadow.bottom = "auto"

function update(timestamp) {
    requestAnimationFrame(update)
    input.setGlobals()
    delta = (timestamp - lastTime) / 1000
	lastTime = timestamp
    if (!delta) { delta = 0 }
	if (delta > 0.5) { delta = 0.5 }

    document.body.style.cursor = "default"

    if (jKeys["KeyE"]) {
        if (scene == "editor") {
            scene = "menu"
        } else {
            scene = 'editor'
        }
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    var w = window.innerWidth
	var h = window.innerHeight

	let aspect = w / targetSize.x

	su = aspect
	if (su > h / targetSize.y) {
		su = h / targetSize.y
	}

    camera.zoom = su

    if (scene == "game") {
        gameTick()
    } else if (scene == "editor") {
        editorTick()
    } else if (scene == "menu") {
        menuTick()
    } else if (scene == "instructions") {
        instructionsTick()
    }

    input.updateInput()
}

update()