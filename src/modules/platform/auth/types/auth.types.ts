export type { IAuthUser } from '@shared/types/user.types';

export interface ILoginResponse {
    user: import('@shared/types/user.types').IAuthUser;
    token: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}
