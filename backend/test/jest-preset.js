const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig');

module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  maxWorkers: 1,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../',
  }),
  testRegex: '.e2e-spec.ts$',
  // testEnvironment: '../prisma/prisma-test-environment.ts',
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@nestjs/testing',
  testTimeout: 10000,
};
