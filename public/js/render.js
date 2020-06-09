export default function render(game, playerId) {
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

    //Draw Players
    const playerTeam = game.state.players[playerId].team
    for (const side in game.state.playerPositions) {
        if (playerTeam === side.toUpperCase()) {
            ctx.fillStyle = 'goldenrod'
            ctx.fillRect(game.state.playerPositions[side].x,game.state.playerPositions[side].y,game.padSize.width,game.padSize.height)
        } else {
            ctx.fillStyle = 'white'
            ctx.fillRect(game.state.playerPositions[side].x,game.state.playerPositions[side].y,game.padSize.width,game.padSize.height)
        }
    }
    ctx.fillStyle = 'white'

    // //Draw Points
    ctx.font = "100% 'Press Start 2P'"
    ctx.fillText(game.state.points[0], game.size.width/2-30, 30)
    ctx.fillText(game.state.points[1], game.size.width/2+15, 30)

    updateScoreboard(game, playerId)
    requestAnimationFrame(() => render(game, playerId))
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
    const team = document.createElement("th")
    name.innerHTML = "Players"
    points.innerHTML = "Score"
    team.innerHTML = "Team"
    name.className = "scoreboard-title"
    points.className = "scoreboard-title"
    team.className = "scoreboard-title"
    line.appendChild(name)
    line.appendChild(team)
    line.appendChild(points)
    table.appendChild(line)
}

function updateScoreboard(game, playerId) {
    var table = document.getElementById("scoreboard")
    var newTable = document.createElement("table")
    var playersToRender = []
    createTableHeader(newTable)    
    for (const playerName in game.state.players) {
        if (game.state.players[playerName]) {
            playersToRender.push({
                nickname: game.state.players[playerName].nickname,
                score: game.state.players[playerName].score,
                team: game.state.players[playerName].team,
                isPlayer: playerName === playerId
            })
        }   
    }
    playersToRender.sort((a,b) => a.score < b.score ? 1 : -1)
    for (const player of playersToRender) {
        const line = document.createElement("tr")
        const points = document.createElement("th")
        const name = document.createElement("th")
        const team = document.createElement("th")
        if (player.isPlayer) {
            name.style = "color: goldenrod;"
            points.style = "color: goldenrod;"
            team.style = "color: goldenrod;"
        }
        name.className = "scoreboard-items"
        points.className = "scoreboard-items"
        name.textContent = String(player.nickname)
        points.textContent = player.score
        team.textContent = player.team
        line.appendChild(name)
        line.appendChild(team)
        line.appendChild(points)
        newTable.appendChild(line)
        if (player.team === "LEFT") {
            document.getElementById("playerLeft").innerHTML = player.nickname.slice(0,15)
        } else if (player.team === "RIGHT") {
            document.getElementById("playerRight").innerHTML = player.nickname.slice(0,15)
        }
    }
    if (newTable.innerHTML !== table.innerHTML.slice(7,-8)) {
        table.innerHTML = newTable.innerHTML
    }
}