
let lvlButtons = []

function levelSelectTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Levels", {align: "center"})

    while (lvlButtons.length < maps.length) {
        lvlButtons.push(new ui.Button(0, 0, 0, 0, "rect", "1"))
    }
    while (lvlButtons.length > maps.length) {
        lvlButtons.splice(maps.length-1, 1)
    }

    for (let i in maps) {
        lvlButtons[i].set(((i%5)+0.5)*110*su + canvas.width/2 - 5*110/2*su, Math.floor(i/5)*110*su + canvas.height/2 - Math.floor(maps.length/5)*110/2*su, 100*su, 100*su)
        lvlButtons[i].bgColour = [127, 127, 127, 0.5]
        lvlButtons[i].text = (parseInt(i)+1).toString()
        lvlButtons[i].textSize = 50*su
        lvlButtons[i].basic()
        lvlButtons[i].draw()

        if (lvlButtons[i].hovered() && mouse.lclick) {
            lvlButtons[i].click()
            loadMap(parseInt(i))
            camera.zoom = su*1.5
            scene = "game"
        }
    }

    backButton.set(canvas.width/2, canvas.height-100*su, 300*su, 75*su)
    backButton.textSize = 69*su

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick) {
        backButton.click()
        scene = "menu"
    }
}