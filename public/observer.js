export default function createObserver() {

    var observers = []

    function subscribe(func) {
        observers.push(func)
    }

    function unsubscribe(func) {
        delete observers[func]
    }

    function notifyAll(command) {
        for (const func of observers) {
            func(command)
        }
    }

    function unsubscribeAll() {
        observers = []
    }

    return {
        observers,
        subscribe,
        unsubscribeAll,
        unsubscribe,
        notifyAll,
    }
}
