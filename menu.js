
var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
var instructionsButton = new ui.Button(0, 0, 0, 0, "rect", "Instructions")
// var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")
// var playButton = new ui.Button(0, 0, 0, 0, "rect", "Play")

function menuTick() {
    ui.text(canvas.width/2, 100, 100, "Speedwing", {align: "center"})

    playButton.set(canvas.width/2, canvas.height/2, 200, 100)
    playButton.textSize = 50
    playButton.bgColour = [50, 50, 50, 0.5]

    playButton.draw()
    playButton.basic()

    if (playButton.hovered() && mouse.lclick) {
        playButton.click()
        scene = "game"
    }

    instructionsButton.set(canvas.width/2, canvas.height/2+85, 200, 50)
    instructionsButton.textSize = 35
    instructionsButton.bgColour = [50, 50, 50, 0.5]

    instructionsButton.draw()
    instructionsButton.basic()

    if (instructionsButton.hovered() && mouse.lclick) {
        instructionsButton.click()
        scene = "instructions"
    }
}