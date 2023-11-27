
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

        if (prevButton.hovered() && mouse.lclick) {
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

        if (nextButton.hovered() && mouse.lclick) {
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

    ui.setC(leaderboardC)

    for (let i = 0; i < leaderboard.length; i++) {
        ui.rect(450*su, i*35*su + 30*su, 850*su, 30*su, [0, 0, 0, 0.5])
        ui.text(35*su, i*35*su + 30*su, 30*su, (i+1).toString())
        ui.text(450*su, i*35*su + 30*su, 30*su, leaderboard[i][0], {align: "center"})
        ui.text(900*su-35*su, i*35*su + 30*su, 30*su, leaderboard[i][1].toString(), {align: "right"})
    }

    leaderboardC.drawBorder(10*su, [255, 255, 255, 1])
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
