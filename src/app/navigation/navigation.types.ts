import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackScreens } from '@shared/constants/screens.constants';

export type RootStackParamList = {
    [StackScreens.PROFILE]: undefined;
    [StackScreens.ACCOUNT_DETAILS]: undefined;
    [StackScreens.NOTIFICATIONS]: undefined;
    [StackScreens.SETTINGS]: undefined;
    [StackScreens.PAYMENT]: undefined;
    [StackScreens.LOGIN]: undefined;
    [StackScreens.MAIN]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;
