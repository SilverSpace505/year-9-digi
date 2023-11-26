
var backButton = new ui.Button(0, 0, 0, 0, "rect", "Back")
backButton.bgColour = [255, 0, 0, 0.5]

function instructionsTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Instructions", {align: "center"})

    ui.text(canvas.width/2-300*su, 200*su, 70*su, "Controls", {align: "center"})
    ui.text(canvas.width/2-300*su, 270*su, 40*su, "WASD - Move", {align: "center"})

    ui.text(canvas.width/2+300*su, 200*su, 70*su, "Guide", {align: "center"})
    ui.text(canvas.width/2+300*su, 270*su, 40*su, "This is a game made for year 9 digi, it's about speedrunning. In order to go faster you need to slide along the walls to gain large amounts of speed.", {align: "center", wrap: 600*su})

    backButton.set(canvas.width/2, canvas.height-100*su, 300*su, 75*su)
    backButton.textSize = 55*su

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick) {
        backButton.click()
        scene = "menu"
    }
}