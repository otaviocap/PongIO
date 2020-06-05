import createObserver from "./observer.js"

export default function createGame() {

    const observer = createObserver()

    const SCREENSIZE = {
        height: 300,
        width: 500,
    }
    const PADSIZE = {
        height:100,
        width:10
    }
    const BALLRADIUS = 5
    const MAXBOUNCEANGLE = Math.PI/2
    const BALLSPEED = 2

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

    function setState(newState) {
        Object.assign(state, newState)
    }

    function setScore(command) {
        state.points = command.newScore
    }

    function setNickname(command) {
        state.players[command.playerId].nickname = command.nickname
        observer.notifyAll({
            type: "set-nickname",
            playerId: command.playerId,
            nickname: command.nickname
        })
    }

    function getRandomKey(object) {
        const keys = Object.keys(object)
        const random = randirange(0, keys.length)
        return keys[random]

    }

    function tryToStartNewMatch() {
        if (state.winner) {
            var nextPlayer = getRandomKey(state.players)
            while (state.winner === getRandomKey) {
                var nextPlayer = getRandomKey(state.players)
            }
            if (state.players[state.winner].team === "LEFT") {
                state.players[nextPlayer].team = "RIGHT"
                start()
            } else {
                state.players[nextPlayer].team = "LEFT"
                start()
            }
        }
    }

    function loop() {
        moveBall()
        if (!state.killGame) {
            setTimeout(loop, 1000/60)
        } else {
            resetPoints()
            resetBall(state.ball)
        }
    }

    function addScore(playerId) {
        state.players[playerId].score++
        state.winner = playerId
        observer.notifyAll({
            type: "add-score",
            playerId: playerId
        })
    }

    function addPlayer(playerId) {
        console.log(`> From game ${playerId}`)
        var playerTeam = ""
        if (state.leftIsAvailable) {
            state.leftIsAvailable = false
            state.playerIdOnLeft = playerId
            playerTeam = "LEFT"
        } else if (state.rightIsAvailable) {
            state.rightIsAvailable = false
            state.playerIdOnRight = playerId
            playerTeam = "RIGHT"
        } else {
            playerTeam = "SPEC"
        }
        if (!state.players[playerId]) {
            state.players[playerId] = {
                nickname: playerId,
                score: 0,
                team: playerTeam
            }
            console.log(`> From game ${Object.entries(state.players)}`)
            observer.notifyAll({
                type: "add-player",
                playerId: playerId
            })
        }
        start()
    }

    function removePlayer(playerId) {
        if (state.players[playerId].team === "RIGHT") {
            state.rightIsAvailable = true
            state.killGame = true
            state.started = false
        } else if (state.players[playerId].team === "LEFT") {
            state.leftIsAvailable = true
            state.killGame = true
            state.started = false
        }
        if (playerId === state.winner) {
            state.winner = undefined
        }
        delete state.players[playerId];
        observer.notifyAll({
            type: "remove-player",
            playerId: playerId
        })
    }

    function moveBall() {
        state.ball.position.x += state.ball.accelaration.x
        state.ball.position.y += state.ball.accelaration.y

        if (state.ball.position.y > SCREENSIZE.height -5 || state.ball.position.y < 5) {
            state.ball.accelaration.y *= -1
        }

        var ball = state.ball

        if (ball.position.x > SCREENSIZE.width/2) {
            var padR = state.playerPositions.right
            if (checkCollision(padR.x+5, padR.y, ball.position.x, ball.position.y)) {
                var angle = Math.PI / randirange(1, 5)
                ball.accelaration.y = BALLSPEED * Math.cos(angle)
                ball.accelaration.x = -BALLSPEED * Math.sin(angle)
            }
        } else {
            var padL = state.playerPositions.left
            if (checkCollision(padL.x+5, padL.y, ball.position.x, ball.position.y)) {
                var angle = Math.PI / randirange(1, 5)
                ball.accelaration.y = BALLSPEED * Math.cos(angle)
                ball.accelaration.x = BALLSPEED * Math.sin(angle)
            }
        }

        if (ball.position.x > SCREENSIZE.width -5) {
            addPoints("RIGHT")
            resetBall(ball)
        } else if (ball.position.x < 5) {
            addPoints("LEFT")
            resetBall(ball)
        }


        observer.notifyAll({
            type: "update-ball",
            position: state.ball.position,
            accelaration: state.ball.accelaration
        })
    }

    function resetBall(ball) {
        ball.position.x = SCREENSIZE.width / 2
        ball.position.y = SCREENSIZE.height / 2
        ball.accelaration.x = -(Math.random() * (2.0 - 1.0) + 1.0)
        ball.accelaration.y = -(Math.random() * (2.0 - 1.0) + 1.0)
    }

    function movePlayer(commandPackage) {
        const key = commandPackage.key
        if (key) {
            if (commandPackage.playerTeam == "LEFT") {
                if (key === "ArrowUp" || key === "w") {
                    state.playerPositions.left.y = Math.max(state.playerPositions.left.y - 10, 5)
                }
                if (key === "ArrowDown" || key === "s") {
                    state.playerPositions.left.y = Math.min(state.playerPositions.left.y + 10, SCREENSIZE.height-PADSIZE.height-5)
                }
            }
            if (commandPackage.playerTeam == "RIGHT") {
                if (key === "ArrowUp" || key === "w") {
                    state.playerPositions.right.y = Math.max(state.playerPositions.right.y - 10, 5)
                }
                if (key === "ArrowDown" || key === "s") {
                    state.playerPositions.right.y = Math.min(state.playerPositions.right.y + 10, SCREENSIZE.height-PADSIZE.height-5)
                }
            }
        }
        observer.notifyAll({
            type: "keyboard-keydown",
            key: key,
            playerTeam: commandPackage.playerTeam
        })
    }

    function resetPoints() {
        observer.notifyAll({
            type: "update-score",
            newScore: [0,0]
        })
    }

    function addPoints(side) {
        if (side === "LEFT") {
            state.points[1]++
        } else if (side === "RIGHT") {
            state.points[0]++
        }
        if (state.points[0] > 0) {
            addScore(state.playerIdOnRight)
            state.killGame = true
        } else if (state.points[1] > 0) {
            addScore(state.playerIdOnLeft)
            state.killGame = true
        }
        observer.notifyAll({
            type: "update-score",
            newScore: state.points
        })
    }

    function checkCollision(padX, padY, ballX, ballY) {
        const ballSize = BALLRADIUS * 2
        if (padX < ballX + ballSize && padX + PADSIZE.width > ballX) {
            if (padY < ballY + ballSize && padY + PADSIZE.height > ballY) {
                return true
            }
        }
        return false
    }   

    function start() {
        if (!state.leftIsAvailable && !state.rightIsAvailable && !state.started) {
            state.started = true
            state.killGame = false
            loop()
        }
        setTimeout(() => {tryToStartNewMatch()}, 1000)
    }

    return {
        state,
        subscribe: observer.subscribe,
        unsubscribe: observer.unsubscribe,
        notifyAll: observer.notifyAll,
        unsubscribeAll: observer.unsubscribeAll,
        movePlayer,
        size: SCREENSIZE,
        loop,
        padSize: PADSIZE,
        ballRadius: BALLRADIUS,
        addPlayer,
        removePlayer,
        setState,
        updateBall,
        setScore,
        setNickname,
        addScore
    }
    function randirange(min, max) {
        var a = Math.random() * (max - min) + min
        return a
    }
}