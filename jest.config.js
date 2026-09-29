module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^react-native-flash-message$': '<rootDir>/__mocks__/react-native-flash-message.js',
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js',
    '^react-native-keyboard-controller$': '<rootDir>/__mocks__/react-native-keyboard-controller.js',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
    '^react-redux$': '<rootDir>/__mocks__/react-redux.js',
    '^\\$navigation/app-stack-navigator\\.navigation$': '<rootDir>/__mocks__/app-stack-navigator.js',
    '^\\$store/redux\\.store$': '<rootDir>/__mocks__/redux.store.ts',
  },
};
