import createObserver from "./observer.js"

export default function createKeyboardListener() {
    const observer = createObserver()
    var team = "";

    document.addEventListener("keydown", handleKeydown)
    function handleKeydown(event) {
        if (team !== "SPEC") {
            console.log(`Notifying key down ${event.key}`)
            observer.notifyAll({
                type: "keyboard-keydown",
                key: event.key,
                playerTeam: team
            })
        }
    }

    function setTeam(newTeam) {
        team = newTeam
    }

    return {
        subscribe: observer.subscribe,
        unsubscribe: observer.unsubscribe,
        notifyAll: observer.notifyAll,
        unsubscribeAll: observer.unsubscribeAll,
        setTeam
    }

}