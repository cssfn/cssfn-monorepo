export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
