import { createContext } from 'react';
import type { AppThemeContextProps } from '@shared/types/common.types';

export const AppThemeContext = createContext<AppThemeContextProps | undefined>(undefined);
