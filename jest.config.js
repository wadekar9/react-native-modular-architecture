module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  moduleNameMapper: {
    '^react-native-flash-message$': '<rootDir>/__mocks__/react-native-flash-message.js',
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js',
    '^react-native-keyboard-controller$': '<rootDir>/__mocks__/react-native-keyboard-controller.js',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
    '^react-redux$': '<rootDir>/__mocks__/react-redux.js',
    '^\\$navigation/app-stack-navigator\\.navigation$': '<rootDir>/__mocks__/app-stack-navigator.js',
    '^\\$store/redux\\.store$': '<rootDir>/__mocks__/redux.store.ts',
  },
};
