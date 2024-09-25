// Draft area for V2 of getModuleCommands
// Test regex for input from player- /     (\/)oracle(.*)   [(try)(attack)(inventory)]   captures everything post "/oOracle", still needs capture group for TRY, INVENTORY, ATTACK etc modules and arguments after      



// @param input {string} input from player
// @param TRY/ATTACK/INVENTORY placeholder trio of known "Oracle Commands", format from player should match: /Oracle [ATTACK] [TARGET] [ADDITIONAL MODIFIERS]
// Future to-do: cut string before "/Oracle" input and feed to AID
const commandParser(text){

            if(text.match(/(\/)oracle/)){

                // flavorInput to be fed to AID, "I do XYZ yadda yadda, /Oracle..." becomes flavor + oracle inputs
                        
                        // flavorInput is adventure actions from the player to be given to the AID, eg "I walk into the cave. /Oracle how do I check my inventory" -> flavorInput = "I walk into the cave."
                flavorInput = text.match(/(.*)(?:\/oracle)/)
                        
                     
                // oracleInput is commands for Oracle from player, needs to be fed to MPAI/routed back to player if invalid
                oracleInput = text.match(/(?:\/oracle)(.*)/)
                        
                        // breaks post-/Oracle string into array of words broken up by space, checks first word in string for predetermined Oracle Commands, eg TRY/ATTACK/INVENTORY
                        commandInput = oracleInput.split(' ')
                        switch(commandInput[0]){
                                    case TRY:
                                                console.log ("TRY command entered.")
                                    break;
                                    case ATTACK:
                                                console.log ("ATTACK command entered.")
                                    break;
                                    case INVENTORY: 
                                                console.log ("ATTACK command entered.")
                                    break;
                                    default: 
                                                console.log ("No or unknown command entered, or format invalid.")
                                    break;
                                    // commandInput[1] = Target/Conditional? eg ATTACK DRAGON or TRY DODGING 

            }

               // send flavorInput to AID, todo prepend AID response to MPAI response to Oracle Command
                       return { text: flavorInput }
                        console.log("Flavor text sent to AID")

}









// Module contains functions to get the module commands from the input string.
// It has a requirement for an object in the final script.
// Do not test the object, only the functions.
// The following objects are required:
const info = {
    characters: ['John', 'Jane'],
}

// The command start is the string that starts a command.
// The input structure is: `\n> ${who} /oracle /${module} /${args} ${values}.\n`
// The args and values are optional, and can be multiple.
// Example: '\n> You /oracle /try /to jump over the fence /pov-try tried /roll 20 /rolled 12 /threshold 11.\n'
const commandStart = (who, module) => `\n> ${who} /oracle\s+/${module} /`

/**
 * Get the arguments part of the input.
 * @param {string} input The input string.
 * @param {string} who The name of the character.
 * @returns The arguments string or null if not found.
 */
const getArguments = (input, module, who) => {

                                         /
    return input.startsWith(commandStart(who, module)) ? input.substring(commandStart(who, module).length - 1, input.length - 2) : null
}

/**
 * Get the name of the character from the input.
 * @param {string} input The input string.
 * @param {string[]} characters The characters to check for.
 * @param {string[]} defaultCharacters The default characters to check for.
 * @returns An object of the character found in the input and the players POV as an number 1, 2, 3, or null if not found.
 */
const getWho = (input, module, names = []) => {
    // Add the default names to the array.
    if (input.startsWith(commandStart('You', module)))
        return { name: 'You', pov: 1 }
    if (input.startsWith(commandStart('I', module)))
        return { name: 'I', pov: 2 }
    // Check if the input starts with any of the names, if so, return the name
    for (let name of names) {
        if (input.startsWith(commandStart(name, module))) {
            return { name, pov: 3 }
        }
    }
    return null
}

/**
 * Parses the command string into its components.
 * @param {string} command The command string.
 * @param {string[]} names The names of the commands to check for.
 * @returns An object with the parsed components, or null signalling no command.
 */
const parseCommands = (command, names) => {
    // Get all the commands in the command string.
    const matches = command.match(/\/\w+-\w+ |\/\w+ /gm)
    // Check if the command is valid, if not, return null.
    if (!matches || matches.length <= 1) {
        return null
    }
    // Create an object to store the commands.
    let commands = {
        module: matches[0].slice(1, -1),
        args: []
    }
    // Remove the rootCommand from the command string.
    command = command.replace(matches[0], '')
    // Check if the command is only a "to" command, if so, add it to the commands and return.
    if (matches.length === 2) {
        const regex = new RegExp(`(?<=\/to ).*`)
        commands.args.push({ key: 'to', value: command.match(regex)[0].trim() })
        return commands
    }
    // Shift and reverse the commands, this is to ensure the last command is always the target.
    matches.shift().reverse().forEach(match => {
        // Get the name of the command, and form the regex to match the command.
        const regex = new RegExp(`(?<=${match} ).*`)
        // Check if the command is in the names array, if so, add it to the commands
        if (names.includes(match)) {
            // Add the command to the commands object, trim the command to remove any leading or trailing spaces.
            commands.args.push({ key: match, value: command.match(regex)[0].trim() })
            // Create a regex to remove the command from the command string.
            const regexReplace = new RegExp(`/${match} ${commands[match]}`)
            // Remove the command from the command string.
            command = command.replace(regexReplace, '')
        }
    })
    // Not enough commands, input was invalid, return null for safe handling.
    if (commands.args.length < 1) {
        return null
    }
    // Return the commands object, they SHOULD contain the base, to, and other commands as needed.
    return commands
}

/**
 * Get the module commands from the input.
 * @param {string} input The input string.
 * @returns The module commands or null if not found.
 */
const getModuleCommands = (input, module, commandNames = []) => {
    // Get the who from the input.
    const who = getWho(input, module, info.characters)
    // If no valid who is found, return null.
    if (!who) return null
    // Get the command string from the input.
    const commandStr = getArguments(input, module, who)
    // If no valid command is found, return null.
    if (!commandStr) return null
    const args = parseCommands(commandStr, commandNames)
    // Check if the commands are valid.
    // If no valid commands are found, return null.
    if (!args) return null
    // The parsed commands SHOULD be valid.
    return { who, module, args }
}

module.exports = { commandStart, getCommand: getArguments, getWho, parseCommands, getModuleCommands }
