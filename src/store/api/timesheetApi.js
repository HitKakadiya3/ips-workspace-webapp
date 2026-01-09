import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const timesheetApi = createApi({
    reducerPath: 'timesheetApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Timesheets'],
    endpoints: (builder) => ({
        getTimesheets: builder.query({
            query: (params = {}) => {
                const { userId, status = 'All' } = params;
                let url = `/api/timesheets`;
                if (userId) url += `/user/${userId}`;
                if (status && status !== 'All') {
                    url += `${url.includes('?') ? '&' : '?'}status=${status}`;
                }
                return url;
            },
            providesTags: ['Timesheets'],
            transformResponse: (response) => response.data || [],
        }),
        addTimesheet: builder.mutation({
            query: (payload) => ({
                url: '/api/timesheets',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Timesheets'],
        }),
    }),
});

export const {
    useGetTimesheetsQuery,
    useAddTimesheetMutation,
} = timesheetApi;
