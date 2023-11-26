
function leaderboardTick() {
    ui.text(canvas.width/2, 100*su, 100*su, "Leaderboard", {align: "center"})

    backButton.set(canvas.width/2, canvas.height-100*su, 300*su, 75*su)
    backButton.textSize = 55*su

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick) {
        backButton.click()
        scene = "menu"
    }
}
