import { API_URL } from '$core/config/api.constants';
import { setupInterceptorsTo } from '$networking/api.helper';
import axios, { AxiosInstance } from 'axios';

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
