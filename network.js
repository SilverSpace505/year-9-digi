
ui.setFont("font", "font.ttf")

var ws = {}

var connected = false

var username = null
var account = {bestTimes: [], bestReplays: []}

var accountLoading = false

var queue = []

var leaderboard = []

var cKeys = ["KeyW", "KeyS", "KeyA", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
	}
    if (ws.readyState != WebSocket.OPEN) {
        queue.push(sendData)
    }
}

let loadedAccount = localStorage.getItem("account")
if (loadedAccount) {
    let data = JSON.parse(loadedAccount)
    username = data.username
    account = data.account
    if (username != null) {
        account.bestTimes = []
        account.bestReplays = []
    }
    if (!("bestTimes" in account)) {
        account.bestTimes = []
    }
    if (!("bestReplays" in account)) {
        account.bestReplays = []
    }
    uncompressReplays()
    saveData()
}

var msgA = 0
var msgShow = 0
var msgText = ""

var serverLoggedIn = false

var oldAccount = {}

var id = ""
var idLoaded = localStorage.getItem("id")
var letters = "abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRS0123456789"
if (idLoaded) {
	id = idLoaded
} else {
	for (let i = 0; i < 8; i++) {
		id += letters[Math.round(Math.random()*(letters.length-1))]
	}
	localStorage.setItem("id", id)
}

function saveData() {
    
    let compressedReplays = []
    for (let replay of account.bestReplays) {
        compressedReplays.push([])
        for (let key of replay) {
            compressedReplays[compressedReplays.length-1].push([key[0] ? 1 : 0, cKeys.indexOf(key[1]) % 4, key[2]*1000].join(","))
        }
        compressedReplays[compressedReplays.length-1] = compressedReplays[compressedReplays.length-1].join("a")
    }
    let cAccount = JSON.parse(JSON.stringify(account))
    cAccount.bestReplays = compressedReplays
    if (JSON.stringify(cAccount).length > 10000) {
        accountFull = true
        account = JSON.parse(JSON.stringify(oldAccount))
        return
    }
    localStorage.setItem("account", JSON.stringify({username: username, account: cAccount}))
    if (username != null && serverLoggedIn) {
        sendMsg({update: cAccount})
    }
    oldAccount = JSON.parse(JSON.stringify(account))
}

function uncompressReplays() {
    let uncReplays = []
    for (let replay of account.bestReplays) {
        if (!Array.isArray(replay)) {
            replay = replay.split("a")
            uncReplays.push([])
            for (let key of replay) {
                if (Array.isArray(key)) {
                    uncReplays.push(key)
                } else {
                    let sp = key.split(","); sp[0] = parseInt(sp[0]); sp[1] = parseInt(sp[1]); sp[2] = parseFloat(sp[2])
                    uncReplays[uncReplays.length-1].push([sp[0] == 1, cKeys[sp[1]], sp[2]/1000])
                }
            }
        } else {
            uncReplays.push(replay)
        }
    }
    account.bestReplays = uncReplays

    oldAccount = JSON.parse(JSON.stringify(account))
}

function showMsg(msg, time=2) {
    msgText = msg
    msgShow = time
}

function getViews() {
	ws.send(JSON.stringify({getViews: true}))
}

function connectToServer() {
    console.log("Connecting...")
    if (ws) {
        if (ws.readyState == WebSocket.OPEN) {
			ws.close()
		}
    }
    connected = false
	ws = new WebSocket("wss://server.silverspace.online")

    ws.addEventListener("open", (event) => {
        sendMsg({connect: "speedwing"}, true)
    })

    ws.addEventListener("message", (event) => {
        var msg = JSON.parse(event.data)
        if ("connected" in msg) {
            connected = true
            console.log("Connected")
            sendMsg({view: id})
            if (username != null) {
                sendMsg({"login": {username: username, password: account.password}})
            }
        }
        if ("ping" in msg) {
            sendMsg({ping: true})
        }
        if ("views" in msg) {
            console.log(JSON.stringify(msg.views))
        }
        if ("accountCreated" in msg) {
            // console.log("Account created", msg.accountCreated[0], msg.accountCreated[1])
            let last = JSON.parse(JSON.stringify(account))
            username = msg.accountCreated[0]
            account = msg.accountCreated[1]
            if (!("bestTimes" in account)) {
                account.bestTimes = last.bestTimes
            }
            if (!("bestReplays" in account)) {
                account.bestReplays = last.bestReplays
            }
            accountLoading = false
            serverLoggedIn = true
            aPage = "account"
            saveData()
            // showMsg("Account created")
        }
        if ("accountExists" in msg) {
            // console.log("Account already exists", msg.accountExists)
            accountLoading = false
            saveData()
            showMsg("Account already exists")
        }
        if ("loggedIn" in msg) {
            // console.log("Logged In", msg.loggedIn[0], msg.loggedIn[1])
            let last = JSON.parse(JSON.stringify(account))
            username = msg.loggedIn[0]
            account = msg.loggedIn[1]
            if (!("bestTimes" in account)) {
                account.bestTimes = last.bestTimes
            }
            if (!("bestReplays" in account)) {
                account.bestReplays = last.bestReplays
            }
            uncompressReplays()
            accountLoading = false
            serverLoggedIn = true
            aPage = "account"
            saveData()
            // showMsg("Logged in")
        }
        if ("accountDoesNotExist" in msg) {
            // console.log("Account does not exist", msg.accountDoesNotExist)
            accountLoading = false
            if (username != null) {
                username = null
                account = {bestTimes: [], bestReplays: []}
            }
            saveData()
            showMsg("Account does not exist")
        }
        if ("wrongPassword" in msg) {
            // console.log("Wrong password", msg.wrongPassword)
            accountLoading = false
            if (username != null) {
                username = null
                account = {bestTimes: [], bestReplays: []}
            }
            saveData()
            showMsg("Wrong password")
        }
        if ("loggedOut" in msg) {
            // console.log("Logged out")
            if (username != null) {
                username = null
                account = {bestTimes: [], bestReplays: []}
            }
            accountLoading = false
            aPage = "select"
            serverLoggedIn = false
            saveData()
            // showMsg("Logged out")
        }
        if ("notLoggedIn" in msg) {
            // console.log("Not logged in")
            if (username != null) {
                username = null
                account = {bestTimes: [], bestReplays: []}
            }
            accountLoading = false
            serverLoggedIn = false
            aPage = "select"
            saveData()
            showMsg("Not logged in")
        }
        if ("deleted" in msg) {
            if (username != null) {
                username = null
                account = {bestTimes: [], bestReplays: []}
            }
            accountLoading = false
            aPage = "select"
            serverLoggedIn = false
            saveData()
            showMsg("Deleted account")
        }
        if ("update" in msg) {
            showMsg("Updated password")
            account = msg.update
            accountLoading = false
        }
        if ("changed" in msg) {
            username = msg.changed
            accountLoading = false
            saveData()
            showMsg("Updated username")
        }
        if ("invalidUpdate" in msg) {
            accountLoading = false
        }
        if ("leaderboard" in msg) {
            // console.log("Leaderboard: " + msg.leaderboard)
            leaderboard = msg.leaderboard
            // for (let score of msg.leaderboard) {
            //     console.log(score[0], score[1])
            // }
        }
        if ("passwordTooLong" in msg) {
            accountLoading = false
            showMsg("Password too long")
        }
        if ("usernameTooLong" in msg) {
            accountLoading = false
            showMsg("Username too long")
        }
        if ("noReplay" in msg) {
            accountLoading = false
            showMsg("No Replay")
        }
        if ("replay" in msg) {
            replayInputsC = []
            if (!Array.isArray(msg.replay)) {
                msg.replay = msg.replay.split("a")
                for (let key of msg.replay) {
                    if (Array.isArray(key)) {
                        replayInputsC.push(key)
                    } else {
                        let sp = key.split(","); sp[0] = parseInt(sp[0]); sp[1] = parseInt(sp[1]); sp[2] = parseFloat(sp[2])
                        replayInputsC.push([sp[0] == 1, cKeys[sp[1]], sp[2]/1000])
                    }
                }
            } else {
                replayInputsC = msg.replay
            }
            replayInputs = JSON.parse(JSON.stringify(replayInputsC))
            replayT = 0
            inputs = {}
            accountLoading = false
            scene = "game"
            replay = true
            camera.zoom = su*1.5
            popupAlpha = 0
            leaderboardReplay = true
            loadMap(sLeaderboard, false)
        }
    })

    ws.addEventListener("close", (event) => {
		console.log("Disconnected from server")
        connected = false
	})
}

connectToServer()

setInterval(() => {
    if (ws.readyState == WebSocket.OPEN && connected) {
        while (queue.length > 0) {
            sendMsg(queue[0])
            queue.splice(0, 1)
        }
    }
}, 1000)

setInterval(() =>  {
    if (!connected || (ws.readyState != WebSocket.OPEN && ws.readyState != WebSocket.CONNECTING)) {
        connectToServer()
    }
}, 2000)