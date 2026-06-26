const { getPlayerAction, PlayerActionInput } = require('./get.player.action')

describe('Testing getPlayerAction', () => {
  const info = {
    CharacterNames: [
      'Mike',
      'John',
      'Tommy'
    ]
  }

  test('Test one action.', () => {
    const input = '> John tied to jump. '
    const expectedOutput = new PlayerActionInput(1, 'John', 'do', 'tied to jump.')
    const result = getPlayerAction(input, info.CharacterNames)
    expect(result.playerIndex).toEqual(expectedOutput.playerIndex)
    expect(result.name).toEqual(expectedOutput.name)
    expect(result.type).toEqual(expectedOutput.type)
    expect(result.turn).toEqual(expectedOutput.turn)
  })

  test('Test multiple actions', () => {
    const input = '> John tied to jump. Then he ducked. '
    const expectedOutput = new PlayerActionInput(1, 'John', 'do-array', ['tied to jump.', 'Then he ducked.'])
    const result = getPlayerAction(input, info.CharacterNames)
    expect(result.playerIndex).toEqual(expectedOutput.playerIndex)
    expect(result.name).toEqual(expectedOutput.name)
    expect(result.type).toEqual(expectedOutput.type)
    expect(result.turn).toEqual(expectedOutput.turn)
  })

  test('Return null if no active player name is found.', () => {
    const input = '> Jimmy tied to jump. '
    const expectedOutput = null
    const result = getPlayerAction(input, info.CharacterNames)
    expect(result).toEqual(expectedOutput)
  })

  test('', () => {
    const input = '> You say "Hello!" '
    const expectedOutput = new PlayerActionInput(4, 'You', 'say', 'Hello!')
    const result = getPlayerAction(input, info.CharacterNames)
    expect(result.playerIndex).toEqual(expectedOutput.playerIndex)
    expect(result.name).toEqual(expectedOutput.name)
    expect(result.type).toEqual(expectedOutput.type)
    expect(result.turn).toEqual(expectedOutput.turn)
  })
})
