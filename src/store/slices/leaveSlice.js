import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchLeaveCounts = createAsyncThunk(
    'leave/fetchCounts',
    async ({ userId, year }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/leaves/user/${userId}/count?year=${year}`);
            if (res?.data?.success && res.data.data) {
                return res.data.data;
            }
            return rejectWithValue('Failed to fetch leave counts');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch leave counts');
        }
    }
);

export const fetchLeaveHistory = createAsyncThunk(
    'leave/fetchHistory',
    async ({ userId, year }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/leaves/user/${userId}?year=${year}`);
            if (res?.data?.success && Array.isArray(res.data.data)) {
                return res.data.data;
            }
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch leave history');
        }
    }
);

const leaveSlice = createSlice({
    name: 'leave',
    initialState: {
        counts: null,
        history: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaveCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaveCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.counts = action.payload;
            })
            .addCase(fetchLeaveCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLeaveHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeaveHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchLeaveHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default leaveSlice.reducer;
