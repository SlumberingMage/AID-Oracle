const determineOutcome = require('./determine.outcome')

describe('determineOutcome', () => {
  it('should return a success message when value is greater than chance', () => {
    const result = determineOutcome(0.7, 'You', 0.8)
    expect(result).toContain('succeed')
  })

  it('should return a failure message when value is less than chance', () => {
    const result = determineOutcome(0.7, 'I', 0.6)
    expect(result).toContain('fail')
  })

  it('should return a critical success message when value is within the critical success range', () => {
    const result = determineOutcome(0.7, 'You', 0.9)
    expect(result).toContain(' And You succeed.')
  })

  it('should return a critical failure message when value is within the critical failure range', () => {
    const result = determineOutcome(0.7, 'I', 0.01)
    expect(result).toContain('horrifically!')
  })

  it('should return a user-specific message', () => {
    const result = determineOutcome(0.7, 'Magnus', 0.8)
    expect(result).toContain('Magnus')
  })
})
