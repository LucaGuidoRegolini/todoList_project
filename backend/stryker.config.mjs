// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'yarn',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  jest: {
    configFile: './jest.config.js',
  },
  mutate: ['src/**/services/*.ts', 'src/shared/**/*.ts', 'src/**/domain/*.ts'],
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.',
  coverageAnalysis: 'perTest',
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
};
export default config;
