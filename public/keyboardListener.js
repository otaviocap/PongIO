import createObserver from "./observer.js"

export default function createKeyboardListener() {
    const observer = createObserver()

    document.addEventListener("keydown", handleKeydown)
    function handleKeydown(event) {
        console.log(`Notifying key down ${event.key}`)
        observer.notifyAll({
            type: "keyboard-keydown",
            keyPressed: event.key
        })
    }

    return {
        subscribe: observer.subscribe,
        unsubscribe: observer.unsubscribe,
        notifyAll: observer.notifyAll,
        unsubscribeAll: observer.unsubscribeAll
    }

}