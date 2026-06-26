// Action pattern to match: "> {Name} while, trying to be {attitude} attempts to use {skill} for {outcome}"
const doActionRegex = /^> (\w*) while, trying to be (\w*) attempts to use (\w*) for (\w*) outcome.$/;
// Command pattern to match: "> {Name} {say|says} "{message}"
const sayActionRegex = /^> (\w*) (?:say|says) ("(?:[^"]+)")$/;

function processInput(input) {
    const doAction = input.match(doActionRegex);
    const sayAction = input.match(sayActionRegex);
    if (doAction === null && sayAction === null) {
        return;
    }
    if (doAction !== null) {
        const name = doAction[1];
        const attitude = doAction[2];
        const skill = doAction[3];
        const outcome = doAction[4];
        return processDoAction(name, attitude, skill, outcome);
    }
    if (sayAction !== null) {
        const name = sayAction[1];
        const message = sayAction[2];
        return processSayAction(name, message);
    }
}