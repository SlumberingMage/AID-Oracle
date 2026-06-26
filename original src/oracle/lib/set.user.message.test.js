const { setUserMessage, state } = require('./set.user.message');

describe('setUserMessage', () => {
  test('sets the user message when ENABLED_USER_MESSAGES is true', () => {
    const message = 'Hello, world!'
    setUserMessage(message)
    expect(state.message).toBe(message)
  })
})