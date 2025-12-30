import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile } from '../../services/api';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProfile();
            return response.data.user || response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load profile');
        }
    }
);

export const updateProfileAsync = createAsyncThunk(
    'profile/updateProfile',
    async ({ userId, data }, { rejectWithValue }) => {
        try {
            const response = await updateProfile(userId, data);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update profile');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        data: null,
        loading: false,
        saving: false,
        error: null,
        success: false,
    },
    reducers: {
        clearProfileStatus: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfileAsync.pending, (state) => {
                state.saving = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.saving = false;
                state.success = true;
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(updateProfileAsync.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;
