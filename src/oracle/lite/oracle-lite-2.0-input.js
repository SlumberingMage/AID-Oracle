// Every script needs a modifier function
const modifier = (text) => {
    // Change the values below to fractions of a whole number to affect the script.

    // Chance of success, .5 is like roll an 11 or better on a 20 sided dice.
    const DEFAULT_CHANCE_FOR_SUCCESS = 0.5
    // Chance of failure, .05 is like a roll a 1 on a 20 sided dice.
    const DEFAULT_CRITICAL_FAILURE = 0.05
    // Chance of critical success, .95 is like rolling a 20 on a 20 sided dice.
    const DEFAULT_CRITICAL_SUCCESS = 0.95

    // The following are the messages you receive and are send to the AI to signify success or failure.
    // The critical success message
    const ADJECTIVES_CRITICAL_SUCCESS = ['flawlessly']
    // The failure success message
    const ADJECTIVES_CRITICAL_FAILURE = ['horrifically']
    // The success message
    const MESSAGE_SUCCESS = 'succeed'
    // The failure message
    const MESSAGE_FAILURE = 'fail'

    // > You /try @0.5 -to "open the door"
    // Fail: `${who} ${outcome} ${to}.`
    // Success: `${who} ${to} ${outcome}.`
    // > You open the door successfully.
    // > You fail to open the door.
    // To parse the above command, the script will look for the word "try" or "tries" or "attempt" or "attempts" and then the action.
    // If you want to specify a chance of success, you can use the @ symbol followed by a fraction of a whole number.
    // The script will then use that number as the chance of success.

    // DO NOT MODIFY BELOW THIS LINE.
    // HERE THERE BE DRAGONS O_o.

    /**
       * Gets a random item from an array.
       * @param {array} arr Array of items.
       * @returns Random item from the array or an empty string if array is empty.
       */
    const getRandomItem = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : ''

    const getMessage = (isSuccess, who, command, to, outcome) => {
        return isSuccess ?
            `${who} ${to}, and ${outcome}.` :
            `${who} ${command} but ${outcome} to ${to}.`;
    }

    /**
       * Decides the fate of the action.
       * @param {number} chance A fraction representing the total probability of success.
       * @returns The message for success or failure.
       */
    const determineOutcome = (chance, who, command, value, to) => {
        const isSuccess = value > chance
        const isCritical = value < DEFAULT_CRITICAL_FAILURE || value > DEFAULT_CRITICAL_SUCCESS
        const adjective = getRandomItem(isSuccess
            ? ADJECTIVES_CRITICAL_SUCCESS
            : ADJECTIVES_CRITICAL_FAILURE)
        return getMessage(isSuccess, who, command, to, (isSuccess ? MESSAGE_SUCCESS : MESSAGE_FAILURE) + (isCritical ? ` ${adjective}` : ''))
    }

    /**
      * The main application logic to match commands.
      */
    const main = (input, chance) => {
        log('input', input)
        let names = ['You', ...info.characters]
        const tries = ['try', 'tries', 'attempt', 'attempts']
        const who = names.find(n => tries.some(t => input.startsWith(`\n> ${n} /${t}`))) ?? null
        if (!who)
            return null
        const commandTrigger = tries.find(t => input.startsWith(`\n> ${who} /${t}`))
        const arguments = input.replace(`\n> ${who} /${commandTrigger} `, '')
        const matchAtChance = arguments.match(/@(\d+(\.\d+)?)/)
        const to = arguments.match(/-to "(.+)"/)
        if (matchAtChance && matchAtChance[1]) {
            chance = parseFloat(matchAtChance[1])
        }
        return determineOutcome(chance, who, commandTrigger, Math.random(), to[1])
    }

    const outcome = main(text, DEFAULT_CHANCE_FOR_SUCCESS)
    if (outcome) {
        return { text: outcome }
    }
    return { text }
}

// Don't modify this part
modifier(text)
