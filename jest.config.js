// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '.next', 'dist'],
  rootDir: './',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers'],
  transformIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],
  snapshotSerializers: ["enzyme-to-json/serializer"]
};
