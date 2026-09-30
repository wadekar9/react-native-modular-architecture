import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IPWhoisApiResponse } from './ipwhois.dto';
import axios from 'axios';

export const fetchIpWhois = createAsyncThunk<IPWhoisApiResponse, void, { rejectValue: string }>(
    'location/fetchIpWhois',
    async (_, { rejectWithValue }) => {
    try {
            const response = await axios.get<IPWhoisApiResponse>('https://ipwho.is/');
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unable to fetch location data.');
    }
    },
);
