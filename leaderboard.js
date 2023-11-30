
var sLeaderboard = 0

var leaderboardC = new ui.Canvas(0, 0, 0, 0, [64, 64, 64, 0.5])

var nextButton = new ui.Button(0, 0, 0, 0, "rect", "")
var prevButton = new ui.Button(0, 0, 0, 0, "rect", "")
nextButton.bgColour = [127, 127, 127, 0.5]
prevButton.bgColour = [127, 127, 127, 0.5]

function leaderboardTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Leaderboard", {align: "center"})

    if (sLeaderboard > 0) {
        prevButton.set(canvas.width/2 - 200*su, canvas.height/2-250*su, 75*su, 75*su)
        prevButton.basic()
        prevButton.draw()

        ctx.beginPath()
        ctx.moveTo(canvas.width/2 - 200*su + 15*su, canvas.height/2-250*su - 20*su)
        ctx.lineTo(canvas.width/2 - 200*su - 15*su, canvas.height/2-250*su)
        ctx.lineTo(canvas.width/2 - 200*su + 15*su, canvas.height/2-250*su + 20*su)
        ctx.lineWidth = 10*su
        ctx.strokeStyle = "white"
        ctx.stroke()

        if (prevButton.hovered() && mouse.lclick && !accountLoading) {
            prevButton.click()
            sLeaderboard -= 1
            leaderboardRefresh = 0
            leaderboard = []
        }
    }

    if (sLeaderboard < maps.length-1) {
        nextButton.set(canvas.width/2 + 200*su, canvas.height/2-250*su, 75*su, 75*su)
        nextButton.basic()
        nextButton.draw()

        ctx.beginPath()
        ctx.moveTo(canvas.width/2 + 200*su - 15*su, canvas.height/2-250*su - 20*su)
        ctx.lineTo(canvas.width/2 + 200*su + 15*su, canvas.height/2-250*su)
        ctx.lineTo(canvas.width/2 + 200*su - 15*su, canvas.height/2-250*su + 20*su)
        ctx.lineWidth = 10*su
        ctx.strokeStyle = "white"
        ctx.stroke()

        if (nextButton.hovered() && mouse.lclick && !accountLoading) {
            nextButton.click()
            sLeaderboard += 1
            leaderboardRefresh = 0
            leaderboard = []
        }
    }
    

    ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Level " + (sLeaderboard+1), {align: "center"})

    if (leaderboardRefresh < 0) {
        sendMsg({leaderboard: sLeaderboard})
        leaderboardRefresh = 3
    }

    leaderboardC.set(canvas.width/2, canvas.height/2+50*su, 900*su, 500*su)
    leaderboardC.draw()

    leaderboardC.bounds.minY = -leaderboard.length*35*su-25*su + 500*su

    ui.setC(leaderboardC)

    // lol i had to replace this
    let place = 0
    let lastScore = -1
    let placeColour = [0, 0, 0, 0.5]
    let group = 0
    for (let i = 0; i < leaderboard.length; i++) {
        
        if (Math.round(leaderboard[i][1]*100)/100 > lastScore || lastScore == -1) {
            place = i+1
            group += 1
        } else if (i > 0) {
            ui.rect(450*su, i*35*su + 30*su - 17.5*su, 850*su, 5*su, placeColour)
        }
        if (group == 1) {
            placeColour = [219, 172, 52, 0.5]
        } else if (group == 2) {
            placeColour = [150, 150, 150, 0.5]
        } else if (group == 3) {
            placeColour = [205, 127, 50, 0.5]
        } else {
            placeColour = [0, 0, 0, 0.5]
        }
        lastScore = Math.round(leaderboard[i][1]*100)/100
        ui.rect(450*su, i*35*su + 30*su, 850*su, 30*su, placeColour)
        ui.text(35*su, i*35*su + 30*su, 30*su, place.toString())
        ui.text(450*su, i*35*su + 30*su, 30*su, leaderboard[i][0], {align: "center"})
        ui.text(900*su-35*su-25*su, i*35*su + 30*su, 30*su, (Math.round(leaderboard[i][1]*100)/100).toString(), {align: "right"})

        let hovered = ui.hovered(900*su-41.25*su + leaderboardC.x-leaderboardC.width/2, i*35*su + 30*su + leaderboardC.y-leaderboardC.height/2+leaderboardC.off.y, 27.5*su, 27.5*su)

        let iconSize = 1
        if (hovered && leaderboardC.hovered()) {
            iconSize = 0.9
            if (mouse.ldown) {
                iconSize = 0.7
            }
            if (mouse.lclick && !accountLoading) {
                accountLoading = true
                expected = leaderboard[i][1]
                sendMsg({replay: {username: leaderboard[i][0], map: sLeaderboard}})
            }
        } else {
            iconSize = 1
        }
        ctx.beginPath()
        ctx.ellipse(900*su-41.25*su + leaderboardC.x-leaderboardC.width/2, i*35*su + 30*su + leaderboardC.y-leaderboardC.height/2 + leaderboardC.off.y, 12.5*su*iconSize, 7.5*su*iconSize, 0, 0, Math.PI*2)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5*su*iconSize
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(900*su-41.25*su + leaderboardC.x-leaderboardC.width/2, i*35*su + 30*su + leaderboardC.y-leaderboardC.height/2 + leaderboardC.off.y, 5*su*iconSize, 0, Math.PI*2)
        ctx.fillStyle = "white"
        ctx.fill()
    }

    leaderboardC.drawBorder(10*su, [255, 255, 255, 1])
    leaderboardC.drawScroll({x: 10*su, y: 10*su}, 10*su)
    ui.setC()
    
    backButton.set(canvas.width/2, canvas.height-100*su, 300*su, 75*su)
    backButton.textSize = 55*su

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick) {
        backButton.click()
        scene = "menu"
    }
}
