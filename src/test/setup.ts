import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock all CSS modules to return simple class names for testing
Object.defineProperty(window, 'CSS', {
  value: {
    supports: () => false
  }
})

// Mock CSS modules
const mockCSSModules = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop === 'string') {
      return prop 
    }
    return prop
  }
})

// Auto-mock all .module.scss files
vi.mock('**/**.module.scss', () => ({
  default: mockCSSModules
}))