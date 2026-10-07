import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import FlashMessage from 'react-native-flash-message';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@app/navigation/root-navigator.navigation';
import { AppThemeProvider, QueryProvider } from '@app/providers';
import '@core/i18n';
import store from '@core/store/redux.store';
import { container } from '@shared/styles/flexbox';

const App = () => (
  <SafeAreaProvider>
    <AppThemeProvider>
      <StoreProvider store={store}>
        <QueryProvider>
          <KeyboardProvider>
            <GestureHandlerRootView style={container}>
              <RootNavigator />
            </GestureHandlerRootView>
          </KeyboardProvider>
        </QueryProvider>
      </StoreProvider>
      <FlashMessage position="top" />
    </AppThemeProvider>
  </SafeAreaProvider>
);

export default App;
