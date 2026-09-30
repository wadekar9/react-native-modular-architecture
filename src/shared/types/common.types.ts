import { IBaseTheme, ITheme } from "./theme.types";

export type { ITheme, IBaseTheme };

export interface AppThemeContextProps {
  theme: ITheme;
  selectedTheme: IBaseTheme;
  changeTheme: (theme: IBaseTheme) => void;
}


export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}