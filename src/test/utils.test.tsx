import { describe, test, expect } from 'vitest'
import { getStepClass } from '../features/navigation/utils/stepUtils'

describe('stepUtils', () => {
  describe('getStepClass', () => {
    test('returns completed for steps before current', () => {
      expect(getStepClass(1, 3)).toBe('completed')
      expect(getStepClass(2, 3)).toBe('completed')
      expect(getStepClass(1, 5)).toBe('completed')
    })

    test('returns current for current step', () => {
      expect(getStepClass(1, 1)).toBe('current')
      expect(getStepClass(3, 3)).toBe('current')
      expect(getStepClass(7, 7)).toBe('current')
    })

    test('returns upcoming for steps after current', () => {
      expect(getStepClass(3, 1)).toBe('upcoming')
      expect(getStepClass(4, 2)).toBe('upcoming')
      expect(getStepClass(7, 5)).toBe('upcoming')
    })

    test('handles edge cases correctly', () => {
      // When currentStep is 0, all positive steps should be upcoming
      expect(getStepClass(1, 0)).toBe('upcoming')
      expect(getStepClass(5, 0)).toBe('upcoming')
      
      // When currentStep is very high, all regular steps should be completed
      expect(getStepClass(1, 100)).toBe('completed')
      expect(getStepClass(7, 100)).toBe('completed')
      
      // When stepId is 0 (edge case)
      expect(getStepClass(0, 1)).toBe('completed')
      expect(getStepClass(0, 0)).toBe('current')
      expect(getStepClass(0, -1)).toBe('upcoming')
    })

    test('handles negative numbers', () => {
      expect(getStepClass(-1, 0)).toBe('completed')
      expect(getStepClass(-1, -1)).toBe('current')
      expect(getStepClass(-1, -2)).toBe('upcoming')
    })
  })
})