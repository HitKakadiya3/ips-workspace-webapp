import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardData } from '../../services/api';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getDashboardData(userId);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load dashboard data');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
