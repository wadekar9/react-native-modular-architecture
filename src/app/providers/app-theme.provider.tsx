import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { EStorageKeys } from '@core/storage/storage.constants';
import { AppThemeContext } from '@shared/theme/app-theme.context';
import type { IBaseTheme, ITheme } from '@shared/types/theme.types';
import { Storage } from '@core/storage/storage';

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ITheme>(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
  const [systemTheme, setSystemTheme] = useState<ITheme>(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
  const [selectedTheme, setSelectedTheme] = useState<IBaseTheme>('default');

  const applyTheme = useCallback((newTheme: IBaseTheme) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme === 'default' ? systemTheme : newTheme);
    Storage.set(EStorageKeys.APP_THEME, newTheme);
  }, [systemTheme]);

  useEffect(() => {
    const savedTheme = Storage.getString(EStorageKeys.APP_THEME);
    applyTheme((savedTheme as IBaseTheme) || 'default');
  }, [applyTheme]);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme as ITheme);
      if (selectedTheme === 'default') {
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });
    return () => listener.remove();
  }, [selectedTheme]);

  const contextValue = useMemo(() => ({
    theme,
    selectedTheme,
    changeTheme: applyTheme,
  }), [selectedTheme, theme, applyTheme]);

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
};

export default AppThemeProvider;