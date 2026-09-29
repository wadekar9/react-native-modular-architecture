import type { PlatformParamList } from '@core/navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = PlatformParamList & {
    Login: undefined;
    Main: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;
