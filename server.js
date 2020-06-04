import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.loop()

game.subscribe((command) => {
    console.log(`Emiting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on("connection", (socket) => {
    const playerId = socket.id;
    console.log(`Player Connected ${playerId}`)
    game.addPlayer(playerId)

    socket.emit("setup", game.state)

    socket.on("disconnect", () => {
        game.removePlayer(playerId)
        console.log("Player exited")
    })

    socket.on("keyboard-keydown", (command) => {
        command.playerId = playerId
        game.movePlayer(command)
    })
})


server.listen(3000, () => {console.log("Listening on the port 3000")});