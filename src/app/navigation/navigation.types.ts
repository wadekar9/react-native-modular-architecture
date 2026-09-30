import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Profile: undefined;
    AccountDetails: undefined;
    Notifications: undefined;
    Settings: undefined;
    Payment: undefined;
    Login: undefined;
    Main: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;
