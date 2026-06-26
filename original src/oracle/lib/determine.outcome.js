const getRandomItem = require('./get.random.item')
const { setUserMessage } = require('./set.user.message')
const ENABLED_USER_MESSAGES = false
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

/**
 * Decides the fate of the action.
 * @param {number} chance A fraction representing the total probability of success.
 * @returns The message for success or failure.
 */
const determineOutcome = (chance, who, value) => {
  const isSuccess = value > chance
  const isCritical = value < DEFAULT_CRITICAL_FAILURE || value > DEFAULT_CRITICAL_SUCCESS
  const adjective = getRandomItem(isSuccess
    ? ADJECTIVES_CRITICAL_SUCCESS
    : ADJECTIVES_CRITICAL_FAILURE)
  const message = who + ' ' + (isSuccess ? MESSAGE_SUCCESS : MESSAGE_FAILURE) + ((who === 'You' || who === 'I') ? '' : 's') +
        (isCritical ? ` ${adjective}` : '') +
        (isSuccess ? '.' : '!')

  if (ENABLED_USER_MESSAGES) {
    setUserMessage(message)
  }
  return (isSuccess ? ' And ' : ' But ') + message
}
module.exports = determineOutcome
