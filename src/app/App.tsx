import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import FlashMessage from 'react-native-flash-message';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppThemeProvider from '@app/providers/app-theme.provider';
import AppStackNavigator from '$navigation/app-stack-navigator.navigation';
import store from '$store/redux.store';
import { container } from '$styles/flexbox';

const App = () => (
  <AppThemeProvider>
    <StoreProvider store={store}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={container}>
            <AppStackNavigator />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </KeyboardProvider>
    </StoreProvider>
    <FlashMessage position="top" />
  </AppThemeProvider>
);

export default App;
