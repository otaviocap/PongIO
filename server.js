import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import createGame from './backend/game.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => {
    if (command.type !== "update-ball") {
        console.log(`Emiting ${command.type}`)
        console.log(command)
    }
    sockets.emit(command.type, command)
})

sockets.on("connection", (socket) => {
    const playerId = socket.id;
    console.log(`Player Connected ${playerId}`)
    game.addPlayer(playerId)

    socket.emit("setup", game.state)

    socket.on("disconnect", () => {
        game.removePlayer(playerId)
        console.log(`Player ${playerId} exited`)
        socket.emit("remove-player", {playerId})
    })

    socket.on("keyboard-keydown", (command) => {
        command.playerId = playerId
        game.movePlayer(command)
    })

    socket.on("set-nickname", (command) => {
        if (command.nickname) {
            command.nickname = command.nickname.slice(0,15)
            game.setNickname(command)
        }
    })
})


server.listen(3000, () => {console.log("Listening on the port 3000")});