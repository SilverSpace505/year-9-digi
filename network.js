
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
            console.log("Account created", msg.accountCreated[0], msg.accountCreated[1])
            username = msg.accountCreated[0]
            account = msg.accountCreated[1]
            accountLoading = false
            aPage = "account"
            localStorage.setItem("account", JSON.stringify({username: username, account: account}))
        }
        if ("accountExists" in msg) {
            console.log("Account already exists", msg.accountExists)
            username = null
            account = {}
            accountLoading = false
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
        }
        if ("loggedIn" in msg) {
            console.log("Logged In", msg.loggedIn[0], msg.loggedIn[1])
            username = msg.loggedIn[0]
            account = msg.loggedIn[1]
            accountLoading = false
            aPage = "account"
            localStorage.setItem("account", JSON.stringify({username: username, account: account}))
        }
        if ("accountDoesNotExist" in msg) {
            console.log("Account does not exist", msg.accountDoesNotExist)
            accountLoading = false
            username = null
            account = {}
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
        }
        if ("wrongPassword" in msg) {
            console.log("Wrong password", msg.wrongPassword)
            accountLoading = false
            username = null
            account = {}
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
        }
        if ("loggedOut" in msg) {
            console.log("Logged out")
            username = null
            account = {}
            accountLoading = false
            aPage = "select"
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
        }
        if ("notLoggedIn" in msg) {
            console.log("Not logged in")
            username = null
            account = {}
            accountLoading = false
            aPage = "select"
            localStorage.setItem("account", JSON.stringify({username: null, account: {}}))
        }
    })

    ws.addEventListener("close", (event) => {
		console.log("Disconnected from server")
        connectToServer()
	})
}

connectToServer()
