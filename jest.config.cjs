/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
  ]
};
