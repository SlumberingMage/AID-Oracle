const processItems = require('./process.items')

describe('processItems', () => {
  test('filters by severity and counts types correctly', () => {
    const items = [
      { type: 'mean', severity: 10 },
      { type: 'kind', severity: 6 },
      { type: 'mean', severity: 6 },
      { type: 'other', severity: 3 }
    ]
    const severityThreshold = 5
    const expectedResult = [
      { type: 'mean', count: 2 },
      { type: 'kind', count: 1 }
    ]
    const result = processItems(items, severityThreshold)
    expect(result).toEqual(expect.arrayContaining(expectedResult))
  })

  test('handles empty arrays correctly', () => {
    const items = []
    const severityThreshold = 5
    const expectedResult = []
    const result = processItems(items, severityThreshold)
    expect(result).toEqual(expectedResult)
  })

  test('filters all items out if none meet the threshold', () => {
    const items = [
      { type: 'mean', severity: 4 },
      { type: 'kind', severity: 3 }
    ]
    const severityThreshold = 5
    const expectedResult = []
    const result = processItems(items, severityThreshold)
    expect(result).toEqual(expectedResult)
  })
})