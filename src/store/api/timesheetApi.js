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
                let url;
                if (userId === 'admin') {
                    // Admin endpoint returns pending/approved grouped data when requested
                    url = '/api/timesheets/admin';
                } else if (userId) {
                    url = `/api/timesheets/user/${userId}`;
                } else {
                    url = '/api/timesheets';
                }
                const qp = status && status !== 'All' ? { status } : undefined;
                return { url, params: qp };
            },
            providesTags: ['Timesheets'],
            transformResponse: (response) => {
                // Normalize response: prefer `response.data` when present (can be an object with pending/approved/rejected),
                // otherwise return the response or an empty object/array.
                if (!response) return {};
                if (response.data !== undefined) return response.data;
                return response;
            },
        }),
        addTimesheet: builder.mutation({
            query: (payload) => ({
                url: '/api/timesheets',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Timesheets'],
        }),
        updateTimesheetStatus: builder.mutation({
            query: ({ timesheetId, status }) => ({
                url: `/api/timesheets/${timesheetId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Timesheets'],
        }),
    }),
});

export const {
    useGetTimesheetsQuery,
    useAddTimesheetMutation,
    useUpdateTimesheetStatusMutation,
} = timesheetApi;
