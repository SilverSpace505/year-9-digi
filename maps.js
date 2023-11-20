
var maps = []
var mapSpawns = []

// from chatgpt, interesting syntax
fetch("maps.txt")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response.text()
  })
  .then(data => {
    let splitMaps = data.split("|")
    maps = JSON.parse(splitMaps[0])
    mapSpawns = JSON.parse(splitMaps[1])
    setTimeout(() => {
        loadMap(0)
    }, 100)
  })
  .catch(error => {
    console.error(error)
  })

var playerSpawn = {x: 50, y: 0, rot: -Math.PI/2}

var map = []
var mapData = []
var mapIndex = 0

function loadMap(index, clearReplay=true) {
    map = maps[index].slice(0, maps[index].length-1)
    mapData = maps[index]
    player.x = mapSpawns[index].x
    player.y = mapSpawns[index].y
    player.velX = 0
    player.velY = 0
    player.rot = mapSpawns[index].rot
    player.vx = player.x
    player.vy = player.y
    player.vrot = player.rot
    finished = false
    timing = false
    selected = -1
    sLayer = 0
    time = 0
    timeInTicks = 0
    inputCooldown = 0
    vtime = 0
    lastKeys = {}
    inputs = {}
    ghostInputs = {}

    ghostReplayInputs = JSON.parse(JSON.stringify(bestReplays[index]))
    ghostReplayT = 0
    ghostPlayer.x = player.x
    ghostPlayer.y = player.y
    ghostPlayer.rot = player.rot
    ghostPlayer.vx = player.vx
    ghostPlayer.vy = player.vy
    ghostPlayer.vrot = player.vrot
    ghostPlayer.velX = 0
    ghostPlayer.velY = 0
    ghostPlayer.finished = false

    if (clearReplay) {
        replayInputs = []
    }
    mapIndex = index
}

function addMap() {
    maps.push([[], [0, 0]])
    mapSpawns.push({x: 50, y: 0, rot: -Math.PI/2})
}

function setSpawn(x, y, rot) {
    mapSpawns[mapIndex] = {x:x, y:y, rot:rot}
    player.x = mapSpawns[mapIndex].x
    player.y = mapSpawns[mapIndex].y
    player.velX = 0
    player.velY = 0
    player.rot = mapSpawns[mapIndex].rot
}

function copyMap(index) {
    maps[mapIndex] = JSON.parse(JSON.stringify(maps[index]))
    loadMap(mapIndex)
}

function saveMaps() {
    console.log(JSON.stringify(maps) + "|" + JSON.stringify(mapSpawns))
}