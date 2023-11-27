
ui.setFont("font", "font.ttf")

var ws

var connected = false

var username = null
var account = {}

var accountLoading = false

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
	}
}

let loadedAccount = localStorage.getItem("account")
if (loadedAccount) {
    let data = JSON.parse(loadedAccount)
    username = data.username
    account = data.account
}

var msgA = 0
var msgShow = 0
var msgText = ""

function showMsg(msg, time=2) {
    msgText = msg
    msgShow = time
}

function connectToServer() {
    console.log("Connecting...")
    if (ws) {
        if (ws.readyState == WebSocket.OPEN) {
			ws.close()
		}
    }
    connected = false
	ws = new WebSocket("wss://speedwing.glitch.me")

    ws.addEventListener("open", (event) => {
        connected = true
        if (username != null) {
            sendMsg({"login": {username: username, password: account.password}})
        }
    })

    ws.addEventListener("message", (event) => {
        var msg = JSON.parse(event.data)
        if ("accountCreated" in msg) {
            // console.log("Account created", msg.accountCreated[0], msg.accountCreated[1])
            username = msg.accountCreated[0]
            account = msg.accountCreated[1]
            accountLoading = false
            aPage = "account"
            localStorage.setItem("account", JSON.stringify({username: username, account: account}))
            // showMsg("Account created")
        }
        if ("accountExists" in msg) {
            // console.log("Account already exists", msg.accountExists)
            accountLoading = false
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
            showMsg("Account already exists")
        }
        if ("loggedIn" in msg) {
            // console.log("Logged In", msg.loggedIn[0], msg.loggedIn[1])
            username = msg.loggedIn[0]
            account = msg.loggedIn[1]
            accountLoading = false
            aPage = "account"
            localStorage.setItem("account", JSON.stringify({username: username, account: account}))
            // showMsg("Logged in")
        }
        if ("accountDoesNotExist" in msg) {
            // console.log("Account does not exist", msg.accountDoesNotExist)
            accountLoading = false
            username = null
            account = {}
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
            showMsg("Account does not exist")
        }
        if ("wrongPassword" in msg) {
            // console.log("Wrong password", msg.wrongPassword)
            accountLoading = false
            username = null
            account = {}
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
            showMsg("Wrong password")
        }
        if ("loggedOut" in msg) {
            // console.log("Logged out")
            username = null
            account = {}
            accountLoading = false
            aPage = "select"
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
            // showMsg("Logged out")
        }
        if ("notLoggedIn" in msg) {
            // console.log("Not logged in")
            username = null
            account = {}
            accountLoading = false
            aPage = "select"
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
            showMsg("Not logged in")
        }
        if ("deleted" in msg) {
            username = null
            account = {}
            accountLoading = false
            aPage = "select"
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
            showMsg("Deleted account")
        }
        if ("update" in msg) {
            showMsg("Updated password")
            accountLoading = false
        }
        if ("changed" in msg) {
            username = msg.changed
            accountLoading = false
            localStorage.setItem("account", JSON.stringify({username: username, account: account}))
            showMsg("Updated username")
        }
    })

    ws.addEventListener("close", (event) => {
		console.log("Disconnected from server")
        connectToServer()
	})
}

connectToServer()

setInterval(() =>  {
    if (!connected) {
        connectToServer()
    }
}, 5000)