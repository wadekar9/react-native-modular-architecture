import axios, { AxiosInstance } from 'axios';
import { setupInterceptorsTo } from './api.helper';
import { API_URL } from './api.constants';

export const axiosInstance: AxiosInstance = setupInterceptorsTo(
    axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        timeout: 50000,
    })
);
