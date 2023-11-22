
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
var usernameT = new ui.TextBox(0, 0, 0, 0, "Username")
var passwordT = new ui.TextBox(0, 0, 0, 0, "Password")

var aPage = "select"
var loggedIn = false

function menuTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Speedwing", {align: "center"})

    playButton.set(canvas.width/2, canvas.height/2, 400*su, 150*su)
    playButton.textSize = 100*su
    playButton.bgColour = [50, 50, 50, 0.5]

    playButton.draw()
    if (!accountOpen) playButton.basic()

    if (playButton.hovered() && !accountOpen && mouse.lclick) {
        playButton.click()
        scene = "levelselect"
    }

    instructionsButton.set(canvas.width/2, canvas.height/2+(75+50+10)*su, 400*su, 100*su)
    instructionsButton.textSize = 70*su
    instructionsButton.bgColour = [50, 50, 50, 0.5]

    instructionsButton.draw()
    if (!accountOpen) instructionsButton.basic()

    if (instructionsButton.hovered() && !accountOpen && mouse.lclick) {
        instructionsButton.click()
        scene = "instructions"
    }

    leaderboardButton.set(canvas.width/2, canvas.height/2+(75+50-2.5)*2*su, 400*su, 100*su)
    leaderboardButton.textSize = 60*su
    leaderboardButton.bgColour = [50, 50, 50, 0.5]

    leaderboardButton.draw()
    if (!accountOpen) leaderboardButton.basic()

    if (leaderboardButton.hovered() && !accountOpen && mouse.lclick) {
        leaderboardButton.click()
        scene = "leaderboard"
    }

    ui.text(canvas.width - 70*su - 60*su, 70*su, 40*su, "Sign Up to compete!", {align: "right"})
    ctx.beginPath()
    ctx.arc(canvas.width - 140*su, 100*su, 50*su, Math.PI*0.3, Math.PI)
    ctx.moveTo(canvas.width - 110*su, 140*su)
    ctx.lineTo(canvas.width - 115*su, 160*su)
    ctx.moveTo(canvas.width - 110*su, 140*su)
    ctx.lineTo(canvas.width - 130*su, 135*su)
    ctx.lineWidth = 5*su
    ctx.strokeStyle = "white"
    ctx.stroke()

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


    if (accountOpen) {
        accountA = lerp(accountA, 1, delta*10)
    } else {
        accountA = lerp(accountA, 0, delta*10)
    }

    ctx.globalAlpha = accountA

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, 0.5])
    ui.rect(canvas.width/2, canvas.height/2, 450*su, 600*su, [127, 127, 127, 0.75], 10*su, [255, 255, 255, 1])

    if (!accountOpen) {
        if (loggedIn) {
            aPage = "account"
            passwordT.text = ""
            usernameT.text = ""
        } else {
            aPage = "select"
        }
    }

    if (aPage == "select") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Account", {align: "center"})

        signupButton.set(canvas.width/2, canvas.height/2-30*su, 300*su, 50*su)
        signupButton.textSize = 35*su
        
        if (accountOpen) signupButton.basic()
        signupButton.draw()

        if (accountOpen && signupButton.hovered() && mouse.lclick) {
            aPage = "signup"
        }

        loginButton.set(canvas.width/2, canvas.height/2+30*su, 300*su, 50*su)
        loginButton.textSize = 35*su
        
        if (accountOpen) loginButton.basic()
        loginButton.draw()

        if (accountOpen && loginButton.hovered() && mouse.lclick) {
            aPage = "login"
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Close"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && mouse.lclick && accountOpen) {
            accountOpen = false
        }


    } else if (aPage == "signup") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Sign Up", {align: "center"})

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

        if (accountOpen && signupButton.hovered() && mouse.lclick && usernameT.text.length > 0 && passwordT.text.length >= 8) {
            aPage = "account"
            loggedIn = true
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Back"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && mouse.lclick && accountOpen) {
            aPage = "select"
        }


    } else if (aPage == "login") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Login", {align: "center"})

        loginButton.set(canvas.width/2, canvas.height/2+30*su, 300*su, 50*su)
        loginButton.textSize = 35*su
        
        if (accountOpen) loginButton.basic()
        loginButton.draw()

        if (accountOpen && loginButton.hovered() && mouse.lclick) {
            aPage = "account"
            loggedIn = true
        }

        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Back"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && mouse.lclick && accountOpen) {
            aPage = "select"
        }
    } else if (aPage == "account") {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Account", {align: "center"})


        closeButton.set(canvas.width/2, canvas.height/2 + 250*su, 300*su, 75*su)
        closeButton.textSize = 50*su
        closeButton.text = "Close"
        
        if (accountOpen) closeButton.basic()
        closeButton.draw()

        if (closeButton.hovered() && mouse.lclick && accountOpen) {
            accountOpen = false
        }
    }
    

    ctx.globalAlpha = 1
}