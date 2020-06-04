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
            left: {x:5, y:10},
            right: {x:SCREENSIZE.width-15, y:5}

        },
        points: [0, 0]  
    }

    function loop() {
        moveBall()
        setTimeout(loop, 1000/60)
    }


    function addPlayer(name) {
        state.players[name] = 0;
    }

    function removePlayer(name) {
        delete state.players[name];
    }

    function moveBall() {
        state.ball.position.x += state.ball.accelaration.x
        state.ball.position.y += state.ball.accelaration.y

        if (state.ball.position.y > SCREENSIZE.height -5 || state.ball.position.y < 5) {
            state.ball.accelaration.y *= -1
        }
        var ball = state.ball.position
        var ballAcc = state.ball.accelaration
        
        if (state.ball.position.x > SCREENSIZE.width/2) {
            var padR = state.playerPositions.right
            if (checkCollision(padR.x+5, padR.y, ball.x, ball.y)) {
                var angle = Math.PI / randirange(1, 5)
                ballAcc.y = BALLSPEED * Math.cos(angle)
                ballAcc.x = -BALLSPEED * Math.sin(angle)
            }
        } else {
            var padL = state.playerPositions.left
            if (checkCollision(padL.x+5, padL.y, ball.x, ball.y)) {
                var angle = Math.PI / randirange(1, 5)
                ballAcc.y = BALLSPEED * Math.cos(angle)
                ballAcc.x = BALLSPEED * Math.sin(angle)
            }
        }

        if (state.ball.position.x > SCREENSIZE.width -5) {
            state.points[0]++
            ball.x = SCREENSIZE.width/2
            ball.y = SCREENSIZE.height/2
            ballAcc.x = -(Math.random() * (2.0 - 1.0) + 1.0)
            ballAcc.y = -(Math.random() * (2.0 - 1.0) + 1.0)
        } else if (state.ball.position.x < 5) {
            state.points[1]++
            ball.x = SCREENSIZE.width/2
            ball.y = SCREENSIZE.height/2
            ballAcc.x = -(Math.random() * (2.0 - 1.0) + 1.0)
            ballAcc.y = -(Math.random() * (2.0 - 1.0) + 1.0)
        }
    }

    function movePlayer(commandPackage) {
        const key = commandPackage.keyPressed
        if (key) {
            if (key === "ArrowUp") {
                state.playerPositions.left.y = Math.max(state.playerPositions.left.y - 10, 5)
            }
            if (key === "ArrowDown") {
                state.playerPositions.left.y = Math.min(state.playerPositions.left.y + 10, SCREENSIZE.height-PADSIZE.height-5)
            }
            if (key === "w") {
                state.playerPositions.right.y = Math.max(state.playerPositions.right.y - 10, 5)
            }
            if (key === "s") {
                state.playerPositions.right.y = Math.min(state.playerPositions.right.y + 10, SCREENSIZE.height-PADSIZE.height-5)
            }
        }
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
        removePlayer
    }
    function randirange(min, max) {
        var a = Math.random() * (max - min) + min
        return a
    }
}