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
        getAllLeaves: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 10, status = 'All', sortBy = 'createdAt', order = 'desc' } = params;
                let url = `/api/leaves?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`;
                if (status && status !== 'All') {
                    url += `&status=${status}`;
                }
                return url;
            },
            providesTags: ['Leaves'],
            transformResponse: (response) => ({
                leaves: response.data || [],
                pagination: response.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }
            }),
        }),
        applyLeave: builder.mutation({
            query: ({ userId, payload }) => ({
                url: `/api/leaves/user/${userId}`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Leaves'],
        }),
        updateLeaveStatus: builder.mutation({
            query: ({ leaveId, status }) => ({
                url: `/api/leaves/${leaveId}`,
                method: 'PATCH',
                body: { status },
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
    useGetAllLeavesQuery,
    useApplyLeaveMutation,
    useUpdateLeaveStatusMutation,
} = leaveApi;
