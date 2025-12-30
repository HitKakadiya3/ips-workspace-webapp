import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import profileReducer from './slices/profileSlice';
import { leaveApi } from './api/leaveApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        profile: profileReducer,
        [leaveApi.reducerPath]: leaveApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(leaveApi.middleware),
});

export default store;
