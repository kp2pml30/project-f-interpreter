/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/test/*.ts"
  ],
  cache: false,
  moduleNameMapper: {
    '^project-f/(.*)$': '<rootDir>/src/$1'
  }
};
