const state = require('./state')

/**
 * Sends a message to the user if messages are enabled.
 * @param {string} message The message to send.
 */
const setUserMessage = (message) => {
  state.message = message
}
module.exports = { setUserMessage, state }
