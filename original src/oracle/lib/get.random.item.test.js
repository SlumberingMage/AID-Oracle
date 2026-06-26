const getRandomItem = require('./get.random.item')

describe('getRandomItem', () => {
  test('returns an empty string if the array is empty', () => {
    expect(getRandomItem([])).toBe('')
  })

  test('returns a predictable item from the array', () => {
    const testArray = ['apple', 'banana', 'cherry']
    // Mock Math.random to always return a specific index
    jest.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(getRandomItem(testArray)).toBe('banana')
    Math.random.mockRestore()
  })

  test('returns all possible items over multiple calls', () => {
    const testArray = ['apple', 'banana', 'cherry']
    const results = new Set()
    // Call the function 100 times to test randomness more effectively
    for (let i = 0; i < 100; i++) {
      results.add(getRandomItem(testArray))
    }
    expect(results.has('apple')).toBe(true)
    expect(results.has('banana')).toBe(true)
    expect(results.has('cherry')).toBe(true)
  })
})
