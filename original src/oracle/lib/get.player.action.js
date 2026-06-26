class PlayerActionInput {
  constructor(playerIndex, name, type, turn) {
    playerIndex,
    name,
    type,
    turn
  }
}

/**
 * Get the active player name from the input text. Use like `getPlayerAction(text, info.characterNames) during the onInput lifecycle hook.`
 * @param {string} input The input text to check for the active player name.
 * @param {string[]} names The info object containing the character names, assumed to be `info.characterNames`.
 * @returns An object with the playerIndex, name, action type of ('say','do','do-multi'), and turn actions of the active player.
 * ```JSON
 * {
 *  playerIndex: 1,
 *  name: 'John',
 *  type: 'say',
 *  turn: 'Hello World!'
 * }
 * ```
 */
function getPlayerAction (input, names) {
  const n = [...names, 'You']
  const phrase = name => `> ${name} `
  const playerIndex = n.findIndex(name => input.startsWith(phrase(name)))
  if (playerIndex > -1) {
    const name = n[playerIndex]
    const action = input.substring(0, phrase(name).length).slice(0, -1)
    // check for say turn.
    const sayRegex = /^(say|said|says)\s"/i
    if (action.match(sayRegex)) {
      return new PlayerActionInput(
        playerIndex,
        name,
        'say',
        action.replace(sayRegex, '').slice(0, -1))
    }
    // check for multiple actions for the turn
    const actionMatch = /(?<=[^A-Z].[.?]) +(?=[A-Z])/g
    if (action.match(actionMatch)) {
      return new PlayerActionInput(
        playerIndex,
        name,
        'do-array',
        action.split(actionMatch))
    }
    // return the action for the turn
    return new PlayerActionInput(
      playerIndex,
      name,
      'do',
      action)
  }
  // no match return null
  return null
}
module.exports = { getPlayerAction, PlayerActionInput }
