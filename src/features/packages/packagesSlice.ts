import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Package {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
}

interface PackagesState {
    packages: Package[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PackagesState = {
    packages: [],
    status: 'idle',
    error: null,
};

export const fetchPackages = createAsyncThunk<Package[], void, { rejectValue: string }>(
    'packages/fetchPackages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/package');
            if (response.status === 204) {
                return [];
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch packages');
        }
    }
);

const packagesSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.packages = action.payload;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch packages';
            });
    },
});

export default packagesSlice.reducer;