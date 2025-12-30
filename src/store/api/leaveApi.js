import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leaveApi = createApi({
    reducerPath: 'leaveApi',
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
    tagTypes: ['Leaves'],
    endpoints: (builder) => ({
        getLeaveCounts: builder.query({
            query: ({ userId, year }) => `/api/leaves/user/${userId}/count?year=${year}`,
            providesTags: ['Leaves'],
            transformResponse: (response) => response.data,
        }),
        getLeaveHistory: builder.query({
            query: ({ userId, year }) => `/api/leaves/user/${userId}?year=${year}`,
            providesTags: ['Leaves'],
            transformResponse: (response) => response.data || [],
        }),
        getLeaveDetail: builder.query({
            query: (id) => `/api/leaves/${id}`,
            transformResponse: (response) => response.data,
        }),
        applyLeave: builder.mutation({
            query: ({ userId, payload }) => ({
                url: `/api/leaves/user/${userId}`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Leaves'],
        }),
    }),
});

export const {
    useGetLeaveCountsQuery,
    useGetLeaveHistoryQuery,
    useGetLeaveDetailQuery,
    useLazyGetLeaveDetailQuery,
    useApplyLeaveMutation,
} = leaveApi;
