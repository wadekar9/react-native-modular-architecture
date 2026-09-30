import { createContext } from 'react';
import type { IBaseTheme, ITheme } from '@shared/types/theme.types';

export interface AppThemeContextProps {
  theme: ITheme;
  selectedTheme: IBaseTheme;
  changeTheme: (theme: IBaseTheme) => void;
}

export const AppThemeContext = createContext<AppThemeContextProps | undefined>(undefined);
