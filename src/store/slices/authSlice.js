import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('token', action.payload.token || '');
            if (action.payload.refreshToken) {
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('userId', action.payload.user?.id || '');
            if (action.payload.user?.name) {
                localStorage.setItem('name', action.payload.user.name);
            }
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('name');
        },
        updateToken: (state, action) => {
            state.token = action.payload.token;
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            }
            localStorage.setItem('token', action.payload.token);
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, updateToken } = authSlice.actions;
export default authSlice.reducer;
