import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wfhApi = createApi({
    reducerPath: 'wfhApi',
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
    tagTypes: ['WorkFromHome'],
    endpoints: (builder) => ({
        getWfhRequests: builder.query({
            query: (userId) => `/api/wfh/user/${userId}`,
            providesTags: ['WorkFromHome'],
            transformResponse: (response) => {
                // Normalize response: if response.data exists, use it, otherwise use response
                if (!response) return [];
                if (response.data !== undefined) return response.data;
                return response;
            },
        }),
        applyWorkFromHome: builder.mutation({
            query: (payload) => ({
                url: '/api/wfh',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['WorkFromHome'],
        }),
    }),
});

export const {
    useGetWfhRequestsQuery,
    useApplyWorkFromHomeMutation,
} = wfhApi;
