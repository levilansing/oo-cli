const {defaults} = require('jest-config');

process.env.ZAIUS_ENV = 'test';

module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "\\.test\\.tsx?$",
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "ts"
  ],
  setupFilesAfterEnv: ['./src/test/setup.ts'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/test/**/*', '!src/**/index.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'node'
};
