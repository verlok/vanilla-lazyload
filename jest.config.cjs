/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.js'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
  ]
};
