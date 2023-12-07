
let lvlButtons = []

function levelSelectTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Levels", {align: "center"})

    while (lvlButtons.length < maps.length) {
        lvlButtons.push(new ui.Button("rect", "1"))
    }
    while (lvlButtons.length > maps.length) {
        lvlButtons.splice(maps.length-1, 1)
    }

    for (let i in maps) {
        let unlocked = i <= account.bestTimes.length
        let x = ((i%5)+0.5)*110*su + canvas.width/2 - 5*110/2*su
        let y = Math.floor(i/5)*110*su + canvas.height/2 - Math.floor(maps.length/5)*110/2*su
        // if (i > account.bestReplays.length) { continue }
        lvlButtons[i].set(x, y, 100*su, 100*su)
        if (unlocked) {
            lvlButtons[i].bgColour = [127, 127, 127, 0.5]
            lvlButtons[i].colour = [255, 255, 255, 1]
        } else {
            lvlButtons[i].bgColour = [60, 60, 60, 0.5]
            lvlButtons[i].colour = [100, 100, 100, 1]
        }
        lvlButtons[i].text = (parseInt(i)+1).toString()
        lvlButtons[i].textSize = 50*su
        if (unlocked) {
            lvlButtons[i].basic()
        } else {
            lvlButtons[i].visWidth = lvlButtons[i].width
            lvlButtons[i].visHeight = lvlButtons[i].height
        }
        lvlButtons[i].draw()

        if (lvlButtons[i].hovered() && mouse.lclick && unlocked) {
            lvlButtons[i].click()
            replay = false
            loadMap(parseInt(i))
            camera.zoom = su*1.5
            leaderboardReplay = false
            scene = "game"
            popupAlpha = 0
        }

        // if (!unlocked) {
        //     ctx.lineWidth = 10*su
        //     ctx.strokeStyle = "rgba(127, 127, 127, 0.5)"

        //     ctx.beginPath()
        //     ctx.moveTo(x - 25*su, y - 25*su)
        //     ctx.lineTo(x + 25*su, y + 25*su)
        //     ctx.stroke()

        //     ctx.beginPath()
        //     ctx.moveTo(x + 25*su, y - 25*su)
        //     ctx.lineTo(x - 25*su, y + 25*su)
        //     ctx.stroke()
        // }
    }

    backButton.set(canvas.width/2, canvas.height-100*su, 300*su, 75*su)
    backButton.textSize = 55*su

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick) {
        backButton.click()
        scene = "menu"
    }
}