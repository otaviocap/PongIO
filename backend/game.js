import createObserver from "../public/observer.js"

export default function createGame() {
    
    const observer = createObserver()

    const FPS = 60
    
    const SCREENSIZE = {
        height: 300,
        width: 500,
    }
    const PADSIZE = {
        height:100,
        width:10
    }
    
    const BALLRADIUS = 5
    const BALLSPEED = 2
    const POINTSTOWIN = 2
    
    const state = {
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
        winner: undefined,
        loser: undefined
    }

    // ======================================= BALL ==================================================

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
    
    function updateBall(command) {
        state.ball.position = command.position
        state.ball.accelaration = command.accelaration
    }
    
    
    // ========================= POINTS =====================================
    
    function resetPoints() {
        state.points = [0,0]
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

        checkForWinner()

        observer.notifyAll({
            type: "update-score",
            newScore: state.points
        })
    }
    
    function setPoints(command) {
        state.points = command.newScore
    }
    
    // ================== SCORE =======================

    function checkForWinner() {
        if (state.points[0] > POINTSTOWIN) {
            addScore(state.playerIdOnLeft)
            state.killGame = true
        } else if (state.points[1] > POINTSTOWIN) {
            addScore(state.playerIdOnRight)
            state.killGame = true
        }
    }

    function addScore(playerId) {
        state.players[playerId].score++
        if (state.playerIdOnRight || state.playerIdOnLeft) {
            if (playerId === state.playerIdOnLeft) {
                state.winner = state.playerIdOnLeft
                state.loser = state.playerIdOnRight
            } else {
                state.winner = state.playerIdOnRight
                state.loser = state.playerIdOnLeft
            }
        }
        observer.notifyAll({
            type: "add-score",
            playerId: playerId
        })
    }

    // ================= TEAMS =============================

    function updateTeam(command) {
        if (command.team) {
            if (state.players[command.playerId]) {
                state.players[command.playerId].team = command.team
                if (command.team === "RIGHT") {
                    state.rightIsAvailable = false
                    state.playerIdOnRight = command.playerId
                } else {
                    state.leftIsAvailable = false
                    state.playerIdOnLeft = command.playerId
                }
                observer.notifyAll({
                    type: "update-team",
                    playerId: command.playerId,
                    team: command.team
                })
            }
        }
    }


    // ================= PLAYERS ===========================

    function addPlayer(playerId) {
        if (!state.players[playerId]) {
            state.players[playerId] = {
                nickname: playerId,
                score: 0,
                team: "SPEC"
            }
            observer.notifyAll({
                type: "add-player",
                playerId: playerId,
                playerTeam: "SPEC"
            })
        }
    }

    function removePlayer(playerId) {
        var needToRestart = false
        if (state.players[playerId].team === "RIGHT") {
            state.rightIsAvailable = true
        } else if (state.players[playerId].team === "LEFT") {
            state.leftIsAvailable = true
        }
        if (state.players[playerId].team !== "SPEC") {
            needToRestart = true
        }
        if (playerId === state.winner) {
            state.winner = undefined
        } 
        if (playerId === state.loser) {
            state.loser = undefined
        }
        delete state.players[playerId];
        observer.notifyAll({
            type: "remove-player",
            playerId: playerId
        })
        if (needToRestart) {
            state.killGame = true
        }
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
        observer.notifyAll({
            type: "keyboard-keydown",
            key: key,
            playerTeam: command.playerTeam
        })
    }

    // ============ MATCH ==================


    function prepareMatch() {
        if (state.winner) {
            if (Object.entries(state.players).length > 2) {
                updateTeam({
                    playerId: state.loser,
                    team: "SPEC"
                })
                const choosable = filterPlayers((playerId) => {return playerId !== state.winner && playerId !== state.loser})
                const nextPlayer = getRandomKey(choosable)
                if (state.players[state.winner].team === "LEFT") {
                    startMatch({
                        leftPlayer: state.winner,
                        rightPlayer: nextPlayer
                    })
                } else {
                    startMatch({
                        leftPlayer: nextPlayer,
                        rightPlayer: state.winner
                    })
                }

            } else {
                if (Object.entries(state.players).length === 2) {
                    startMatch({
                        leftPlayer: Object.entries(state.players)[0],
                        rightPlayer: Object.entries(state.players)[1]
                    })
                }
            }
        } else {
            if (Object.entries(state.players).length >= 2) {
                const choosable = filterPlayers((_) => {return true})
                const firstPlayer = getRandomKey(choosable)
                delete choosable[firstPlayer]
                const secondPlayer = getRandomKey(choosable)
                startMatch({
                    leftPlayer: firstPlayer,
                    rightPlayer: secondPlayer
                })
            }
        }
    }

    function startMatch(command) {
        updateTeam({
            playerId: command.leftPlayer,
            team: "LEFT"
        })

        updateTeam({
            playerId: command.rightPlayer,
            team: "RIGHT"
        })
        state.started = true
        state.killGame = false

        // Ball part needs to be redone, but for the moment
        // this will work to randomize ball start direction
        var angle = Math.PI / randirange(-5, 5)
        state.ball.accelaration.y = BALLSPEED * Math.cos(angle)
        state.ball.accelaration.x = BALLSPEED * Math.sin(angle)

        gameLoop()    
    }

    function gameLoop() {
        moveBall()
        if (state.killGame) {
            resetPoints()
            resetBall(state.ball)
            state.started = false
        } else { 
            setTimeout(gameLoop, 1000/FPS)
        }
    }

    function matchMaker() {
        if (!state.started) {
            prepareMatch()
        }
    }
    
    

    // ===================== OTHERS =========================

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
        const random = Math.floor(randirange(0, keys.length))
        return keys[random]
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

    function randirange(min, max) {
        var a = Math.random() * (max - min) + min
        return a
    }

    function filterPlayers(filter) {
        const filtered = {}
        for (const playerId in state.players) {
            if (filter(playerId)) {
                filtered[playerId] = state.players[playerId]
            }
        }
        return filtered
    }

    return {
        state,
        subscribe: observer.subscribe,
        unsubscribe: observer.unsubscribe,
        notifyAll: observer.notifyAll,
        unsubscribeAll: observer.unsubscribeAll,
        movePlayer,
        size: SCREENSIZE,
        padSize: PADSIZE,
        ballRadius: BALLRADIUS,
        addPlayer,
        removePlayer,
        updateBall,
        setPoints,
        setNickname,
        addScore,
        matchMaker
    }
}