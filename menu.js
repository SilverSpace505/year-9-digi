
var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
var instructionsButton = new ui.Button(0, 0, 0, 0, "rect", "Instructions")
var leaderboardButton = new ui.Button(0, 0, 0, 0, "rect", "Leaderboard")
// var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
// var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")

var accountButtonMul = 1
var accountButtonDown = 0
var accountOpen = false
var accountA = 0

var closeButton = new ui.Button(0, 0, 0, 0, "rect", "Close")
closeButton.bgColour = [255, 0, 0, 0.5]

var loginButton = new ui.Button(0, 0, 0, 0, "rect", "Login")
loginButton.bgColour = [0, 0, 0, 0.5]
var signupButton = new ui.Button(0, 0, 0, 0, "rect", "Sign Up")
signupButton.bgColour = [0, 0, 0, 0.5]

var logoutButton = new ui.Button(0, 0, 0, 0, "rect", "Logout")
logoutButton.bgColour = [255, 0, 0, 0.5]
var usernameT = new ui.TextBox(0, 0, 0, 0, "Username")
var passwordT = new ui.TextBox(0, 0, 0, 0, "Password")
passwordT.hide = true
var deleteAccountButton = new ui.Button(0, 0, 0, 0, "rect", "Delete Account")
deleteAccountButton.bgColour = [255, 0, 0, 0.5]

var changePasswordButton = new ui.Button(0, 0, 0, 0, "rect", "Change Password")
var changeUsernameButton = new ui.Button(0, 0, 0, 0, "rect", "Change Username")
changePasswordButton.bgColour = [0, 0, 0, 0.5]
changeUsernameButton.bgColour = [0, 0, 0, 0.5]

var changeButton = new ui.Button(0, 0, 0, 0, "rect", "Update")
changeButton.bgColour = [0, 0, 0, 0.5]

var showButton = new ui.Button(0, 0, 0, 0, "rect", "Show")
showButton.bgColour = [0, 0, 0, 0.5]

var showPass = false

var aPage = "select"

function menuTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Speedwing", {align: "center"})

    playButton.set(canvas.width/2, canvas.height/2, 400*su, 150*su)
    playButton.textSize = 90*su
    playButton.bgColour = [50, 50, 50, 0.5]

    playButton.draw()
    if (!accountOpen) playButton.basic()

    if (playButton.hovered() && !accountOpen && mouse.lclick) {
        playButton.click()
        scene = "levelselect"
    }

    instructionsButton.set(canvas.width/2, canvas.height/2+(75+50+10)*su, 400*su, 100*su)
    instructionsButton.textSize = 50*su
    instructionsButton.bgColour = [50, 50, 50, 0.5]

    instructionsButton.draw()
    if (!accountOpen) instructionsButton.basic()

    if (instructionsButton.hovered() && !accountOpen && mouse.lclick) {
        instructionsButton.click()
        scene = "instructions"
    }

    leaderboardButton.set(canvas.width/2, canvas.height/2+(75+50-2.5)*2*su, 400*su, 100*su)
    leaderboardButton.textSize = 50*su
    leaderboardButton.bgColour = [50, 50, 50, 0.5]

    leaderboardButton.draw()
    if (!accountOpen) leaderboardButton.basic()

    if (leaderboardButton.hovered() && !accountOpen && mouse.lclick) {
        leaderboardButton.click()
        scene = "leaderboard"
    }

    if (!connected) {
        return
    }

    if (username == null) {
        ui.text(canvas.width - 70*su - 60*su, 70*su, 27.5*su, "Sign Up to compete!", {align: "right"})
        ctx.beginPath()
        ctx.arc(canvas.width - 140*su, 100*su, 50*su, Math.PI*0.3, Math.PI)
        ctx.moveTo(canvas.width - 110*su, 140*su)
        ctx.lineTo(canvas.width - 115*su, 160*su)
        ctx.moveTo(canvas.width - 110*su, 140*su)
        ctx.lineTo(canvas.width - 130*su, 135*su)
        ctx.lineWidth = 5*su
        ctx.strokeStyle = "white"
        ctx.stroke()
    } else {
        ui.text(canvas.width - 70*su - 60*su, 70*su, 27.5*su, username, {align: "right"})
    }

    let hovered = ui.hovered(canvas.width - 70*su, 70*su, 100*su, 100*su)

    accountButtonDown -= delta
    if (accountButtonDown <= 0) {
        if (hovered) {
            accountButtonMul = lerp(accountButtonMul, 0.9, delta*10)
            if (mouse.lclick) {
                accountButtonDown = 0.1
                accountOpen = !accountOpen
            }
        } else {
            accountButtonMul = lerp(accountButtonMul, 1, delta*10)
        }
    } else {
        accountButtonMul = lerp(accountButtonMul, 0.7, delta*10)
    }
    
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.arc(canvas.width - 70*su, 70*su, 50*su*accountButtonMul, 0, Math.PI*2)
    ctx.fill()

    ctx.save()
    ctx.clip()
    ctx.beginPath()
    ctx.fillStyle = "black"
    ctx.arc(canvas.width - 70*su, 125*su, 50*su, 0, Math.PI*2)
    ctx.arc(canvas.width - 70*su, 55*su, 30*su, 0, Math.PI*2)
    ctx.fill()

    ctx.restore()

    ctx.beginPath()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 5*su*accountButtonMul
    ctx.arc(canvas.width - 70*su, 70*su, 50*su*accountButtonMul, 0, Math.PI*2)
    ctx.stroke()

    msgShow -= delta

    if (msgShow > 0) {
        msgA = lerp(msgA, 1, delta*10)
    } else {
        msgA = lerp(msgA, 0, delta*5)
    }

    if (accountOpen) {
        accountA = lerp(accountA, 1, delta*10)
    } else {
        accountA = lerp(accountA, 0, delta*10)
    }

    ctx.globalAlpha = accountA

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, 0.5])
    ui.rect(canvas.width/2, canvas.height/2, 450*su, 600*su, [127, 127, 127, 0.75], 10*su, [255, 255, 255, 1])

    ctx.globalAlpha = msgA
    ui.text(canvas.width/2, canvas.height-125*su, 35*su, msgText, {align: "center"})
    ctx.globalAlpha = accountA

    if (aPage != "signup" && aPage != "login" && aPage != "changePass" && aPage != "changeUser") {
        passwordT.text = ""
        usernameT.text = ""
    }

    usernameT.placeholder = "Username"
    passwordT.placeholder = "Password"

    if (aPage == "select") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Account", {align: "center"})

        signupButton.set(canvas.width/2, canvas.height/2-30*su, 300*su, 50*su)
        signupButton.textSize = 35*su
        
        if (accountOpen) signupButton.basic()
        signupButton.draw()

        if (accountOpen && !accountLoading && signupButton.hovered() && mouse.lclick) {
            aPage = "signup"
        }

        loginButton.set(canvas.width/2, canvas.height/2+30*su, 300*su, 50*su)
        loginButton.textSize = 35*su
        
        if (accountOpen) loginButton.basic()
        loginButton.draw()

        if (accountOpen && !accountLoading && loginButton.hovered() && mouse.lclick) {
            aPage = "login"
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Close"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            accountOpen = false
        }


    } else if (aPage == "signup") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Sign Up", {align: "center"})

        usernameT.text = usernameT.text.substring(0, 15)
        passwordT.text = passwordT.text.substring(0, 15)

        usernameT.set(canvas.width/2, canvas.height/2-(30+65)*su, 300*su, 50*su)
        usernameT.outlineSize = 10*su
        usernameT.hover()
        usernameT.draw()

        passwordT.set(canvas.width/2, canvas.height/2-(30)*su, 300*su, 50*su)
        passwordT.outlineSize = 10*su
        passwordT.hover()
        passwordT.draw()

        signupButton.set(canvas.width/2, canvas.height/2+30*su, 300*su, 50*su)
        signupButton.textSize = 35*su
        
        if (accountOpen) signupButton.basic()
        signupButton.draw()

        if (accountOpen && !accountLoading && signupButton.hovered() && mouse.lclick && usernameT.text.length > 0 && passwordT.text.length > 0) {
            sendMsg({"signup": {username: usernameT.text, password: passwordT.text}})
            accountloading = true
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Back"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            aPage = "select"
        }


    } else if (aPage == "login") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Login", {align: "center"})

        usernameT.text = usernameT.text.substring(0, 15)
        passwordT.text = passwordT.text.substring(0, 15)

        usernameT.set(canvas.width/2, canvas.height/2-(30+65)*su, 300*su, 50*su)
        usernameT.outlineSize = 10*su
        usernameT.hover()
        usernameT.draw()

        passwordT.set(canvas.width/2, canvas.height/2-(30)*su, 300*su, 50*su)
        passwordT.outlineSize = 10*su
        passwordT.hover()
        passwordT.draw()

        loginButton.set(canvas.width/2, canvas.height/2+30*su, 300*su, 50*su)
        loginButton.textSize = 35*su
        
        if (accountOpen) loginButton.basic()
        loginButton.draw()

        if (accountOpen && !accountLoading && loginButton.hovered() && mouse.lclick) {
            sendMsg({"login": {username: usernameT.text, password: passwordT.text}})
            accountloading = true
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Back"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            aPage = "select"
        }
    } else if (aPage == "account") {
        let width = ui.measureText(35*su, username).width
        let usernameSize = 35*su * (400*su / width)
        if (usernameSize > 35*su) {
            usernameSize = 35*su
        }
        let passText = account.password
        if (!showPass) {
            passText = ""
            for (let i = 0; i < account.password.length; i++) {
                passText += "*"
            }
        }
        let passWidth = ui.measureText(25*su, passText).width
        let passwordSize = 25*su * (300*su / passWidth)
        if (passwordSize > 25*su) {
            passwordSize = 25*su
        }
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Account", {align: "center"})
        ui.text(canvas.width/2, canvas.height/2-230*su+usernameSize, usernameSize, username, {align: "center"})
        
        let realPassSize = ui.text(canvas.width/2, canvas.height/2-230*su+usernameSize*2, passwordSize, passText, {align: "center"}).width

        showButton.set(canvas.width/2 + realPassSize/2 + 45*su, canvas.height/2-230*su+usernameSize*2, 80*su, 25*su)
        showButton.textSize = 20*su
        if (showPass) {
            showButton.text = "Hide"
        } else {
            showButton.text = "Show"
        }
        if (accountOpen) showButton.basic()
        showButton.draw()

        if (showButton.hovered() && accountOpen && !accountLoading && mouse.lclick) {
            showButton.click()
            showPass = !showPass
        }

        logoutButton.set(canvas.width/2, canvas.height/2 + 130*su, 300*su, 50*su)
        logoutButton.textSize = 35*su
        logoutButton.text = "Logout"
        
        if (accountOpen) logoutButton.basic()
        logoutButton.draw()

        if (logoutButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            sendMsg({"logout": true})
            accountLoading = true
        }

        deleteAccountButton.set(canvas.width/2, canvas.height/2 + 190*su, 300*su, 50*su)
        deleteAccountButton.textSize = 30*su
        deleteAccountButton.text = "Delete Account"
        
        if (accountOpen) deleteAccountButton.basic()
        deleteAccountButton.draw()

        if (deleteAccountButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            sendMsg({"delete": true})
            accountLoading = true
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 50*su)
        closeButton.textSize = 35*su
        closeButton.text = "Close"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            accountOpen = false
        }

        changeUsernameButton.set(canvas.width/2, canvas.height/2 - 30*su, 300*su, 50*su)
        changeUsernameButton.textSize = 25*su
        
        if (accountOpen) changeUsernameButton.basic()
        changeUsernameButton.draw()

        if (changeUsernameButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            aPage = "changeUser"
        }

        changePasswordButton.set(canvas.width/2, canvas.height/2 + 30*su, 300*su, 50*su)
        changePasswordButton.textSize = 25*su
        
        if (accountOpen) changePasswordButton.basic()
        changePasswordButton.draw()

        if (changePasswordButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            aPage = "changePass"
        }
    } else if (aPage == "changePass") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 40*su, "Change Password", {align: "center"})

        passwordT.set(canvas.width/2, canvas.height/2 - 30*su, 350*su, 50*su)
        passwordT.placeholder = "New password"
        passwordT.outlineSize = 10*su
        if (accountOpen) passwordT.hover()
        passwordT.draw()

        changeButton.set(canvas.width/2, canvas.height/2 + 30*su, 350*su, 50*su)
        changeButton.textSize = 35*su
        if (accountOpen) changeButton.basic()
        changeButton.draw()

        if (accountOpen && mouse.lclick && !accountLoading && changeButton.hovered() && passwordT.text.length > 0) {
            changeButton.click()
            account.password = passwordT.text
            accountLoading = true
            sendMsg({updateA: account})
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 50*su)
        closeButton.textSize = 35*su
        closeButton.text = "Back"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            aPage = "account"
        }
    } else if (aPage == "changeUser") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 40*su, "Change Username", {align: "center"})

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 50*su)
        closeButton.textSize = 35*su
        closeButton.text = "Back"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && !accountLoading && mouse.lclick && accountOpen) {
            aPage = "account"
        }
    }

    ctx.globalAlpha = 1
}