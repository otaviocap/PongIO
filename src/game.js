export default function createGame() {

    var state = {
        room: {
            id: {
                players: {
                    nome: 0,
                    nome1: 0,
                    nome2: 0,
                },
                ball: {
                    x: 0,
                    y: 0
                },
                playingPositions: [
                    [0,0],
                    [0,0]
                ],
                points: [0,0]
            }
        },
        size: {
            height: 300,
            width: 500,
        }
    }

    var observers = []

    function subscribe(func) {
        observers.push(func)
    }

    function unsubscribe(func) {
        delete observers[func];
    }

    function applyAll(command) {
        for (const func in observers) {
            func(command)
        }
    }

    return {
        state
    }

}