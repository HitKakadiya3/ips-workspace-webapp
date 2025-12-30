import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import profileReducer from './slices/profileSlice';
import leaveReducer from './slices/leaveSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        profile: profileReducer,
        leave: leaveReducer,
    },
});

export default store;
