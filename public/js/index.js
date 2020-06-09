import render from "./render.js"
import createClient from "./client.js"
import createKeyboardListener from "./keyboardListener.js"

const socket = io()
const game = createClient()
const keyboardListener = createKeyboardListener()
var subscribed = false
var playerId = undefined

document.getElementById("nicknameSubmit").onclick = () => {
    const nick = document.getElementById("nickname").value
    socket.emit("set-nickname", {
        nickname: nick,
        playerId: socket.id
    })
}

socket.on("setup", (state) => {
    playerId = socket.id;
    game.setState(state);
    keyboardListener.setTeam(game.state.players[playerId].team)
    if (!subscribed) {
        subscribed = true
        keyboardListener.subscribe((command) => {
        socket.emit('keyboard-keydown', command)
    })
        }   
    render(game, playerId)
})

socket.on("add-player", (command) => {
    console.log(`adding player ${command.playerId}`)
    game.addPlayer(command)
})

socket.on("remove-player", (command) => {
    game.removePlayer(command.playerId)
})

socket.on("update-score", (command) => {
    game.setScore(command)
})

socket.on("keyboard-keydown", (command) => {
    const playerId = socket.id

    if (playerId !== command.playerId) {
        game.movePlayer(command)
    }
})

socket.on("update-ball", (command) => {
    game.updateBall(command)
})

socket.on("set-nickname", (command) => {
    console.log(`Player: ${command.playerId} now is ${command.nickname}`)
    game.setNickname(command)
})

socket.on("connect", () => {
    const playerId = socket.id
})

socket.on("add-score", (command) => {
    console.log(command)
    game.addScore(command.playerId)
    console.log(game)
})

socket.on ("update-team", (command) => {
    game.updateTeam(command)
    if (command.playerId === playerId) {
        keyboardListener.setTeam(command.team)
    }
})
