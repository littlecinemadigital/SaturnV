// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

module.exports = {
  roots: ['./src'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['src', 'node_modules'],
  testPathIgnorePatterns: ['node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  moduleNameMapper: {
    // Mocks out all these file formats when tests are run
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.tsx',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
