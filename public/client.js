export default function createClient() {    
    const SCREENSIZE = {
        height: 300,
        width: 500,
    }
    const PADSIZE = {
        height:100,
        width:10
    }
    const BALLRADIUS = 5


    const state = {
        //LEFT, SPEC, RIGHT
        players: {},
        ball: {
            position: {
                x: SCREENSIZE.width/2,
                y: SCREENSIZE.height/2
            },
            accelaration: {
                x: 2,
                y: 2
            }
        },
        playerPositions: {
            left: {x:5, y:5},
            right: {x:SCREENSIZE.width-15, y:5}

        },
        points: [0, 0],
        leftIsAvailable: true,
        rightIsAvailable: true,
        started: false,
        killGame: false,
        playerIdOnRight: "",
        playerIdOnLeft: "",
        winner: undefined
    }
    function updateBall(command) {
        state.ball.position = command.position
        state.ball.accelaration = command.accelaration
    }

    function setNickname(command) {
        state.players[command.playerId].nickname = command.nickname
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function setPoints(command) {
        state.points = command.newScore
    }

    function setNickname(command) {
        state.players[command.playerId].nickname = command.nickname
    }

    function addScore(playerId) {
        state.players[playerId].score++
        state.winner = playerId
    }

    function addPlayer(command) {
        state.players[command.playerId] = {
            nickname: command.playerId,
            score: 0,
            team: command.playerTeam
        }
    }

    function removePlayer(playerId) {
        delete state.players[playerId];
    }

    function movePlayer(command) {
        const key = command.key
        if (key) {
            if (command.playerTeam == "LEFT") {
                if (key === "ArrowUp" || key === "w") {
                    state.playerPositions.left.y = Math.max(state.playerPositions.left.y - 10, 5)
                }
                if (key === "ArrowDown" || key === "s") {
                    state.playerPositions.left.y = Math.min(state.playerPositions.left.y + 10, SCREENSIZE.height-PADSIZE.height-5)
                }
            }
            if (command.playerTeam == "RIGHT") {
                if (key === "ArrowUp" || key === "w") {
                    state.playerPositions.right.y = Math.max(state.playerPositions.right.y - 10, 5)
                }
                if (key === "ArrowDown" || key === "s") {
                    state.playerPositions.right.y = Math.min(state.playerPositions.right.y + 10, SCREENSIZE.height-PADSIZE.height-5)
                }
            }
        }
    }

    return {
        state,
        movePlayer,
        size: SCREENSIZE,
        padSize: PADSIZE,
        ballRadius: BALLRADIUS,
        addPlayer,
        removePlayer,
        setState,
        updateBall,
        setScore: setPoints,
        setNickname,
        addScore
    }
}