import { describe, it } from 'vitest'
import fc from 'fast-check'

describe('fast-check setup verification', () => {
  it('should run property-based tests with fast-check', () => {
    // Simple property: reversing an array twice returns the original array
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const reversed = [...arr].reverse().reverse()
        return JSON.stringify(reversed) === JSON.stringify(arr)
      }),
      { numRuns: 100 }
    )
  })
})
