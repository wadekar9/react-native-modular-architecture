import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import FlashMessage from 'react-native-flash-message';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppThemeProvider from '@app/providers/app-theme.provider';
import RootNavigator from '@app/navigation/root-navigator.navigation';
import store from '@core/store/redux.store';
import { container } from '@shared/styles/flexbox';

const App = () => (
  <AppThemeProvider>
    <StoreProvider store={store}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={container}>
            <RootNavigator />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </KeyboardProvider>
    </StoreProvider>
    <FlashMessage position="top" />
  </AppThemeProvider>
);

export default App;
