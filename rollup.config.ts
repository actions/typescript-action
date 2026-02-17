import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest', // Tell Jest to use ts-jest for TypeScript
  testEnvironment: 'node', // Node environment
  roots: ['<rootDir>/__tests__'], // Only look in __tests__ folder
  transform: {
    '^.+\\.ts$': 'ts-jest' // Transform TypeScript files
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
}

export default config
