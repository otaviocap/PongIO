export default function render(game) {
    var canvas = document.getElementById("main_canvas")
    var ctx = canvas.getContext("2d")
    
    //Clear
    ctx.clearRect(0,0,game.size.width,game.size.height)

    //Configurations
    ctx.setLineDash([0,0])
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4

    drawArena(ctx, game.size.width, game.size.height)

    drawBall(ctx, game.state.ball.position.x, game.state.ball.position.y, game.ballRadius)

    // //Draw Players
    for (const side in game.state.playerPositions) {
        ctx.fillRect(game.state.playerPositions[side].x,game.state.playerPositions[side].y,game.padSize.width,game.padSize.height)
    }

    // //Draw Points
    ctx.font = "25px roboto"
    ctx.fillText(game.state.points[0], game.size.width/2-30, 30)
    ctx.fillText(game.state.points[1], game.size.width/2+17, 30)

    updateScoreboard(game)
    requestAnimationFrame(() => render(game))
}

function drawBall(ctx, x, y, radius) {
    ctx.beginPath()
    ctx.arc(x,y,radius,0,Math.PI * 2, false)
    ctx.fill()
}


function drawArena(ctx, width, height) {

    //Draw bounds
    ctx.strokeRect(0,0,width,height)

    //Draw dotted lines
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.setLineDash([10,10])
    ctx.moveTo(width/2, 5)
    ctx.lineTo(width/2, height)
    ctx.stroke()

}

function createTableHeader(table) {
    const line = document.createElement("tr")
    const name = document.createElement("th")
    const points = document.createElement("th")
    name.innerHTML = "Name"
    points.innerHTML = "Points"
    line.appendChild(name)
    line.appendChild(points)
    table.appendChild(line)
}

function updateScoreboard(game) {
    const table = document.getElementById("scoreboard")
    table.innerHTML = ""
    createTableHeader(table)
    for (const playerName in game.state.players) {
        const line = document.createElement("tr")
        const name = document.createElement("th")
        const points = document.createElement("th")
        name.innerHTML = playerName
        points.innerHTML = game.state.players[playerName]
        line.appendChild(name)
        line.appendChild(points)
        table.appendChild(line)
    }
}