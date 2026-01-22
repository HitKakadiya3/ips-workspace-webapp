import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const noticeAppreciationApi = createApi({
    reducerPath: 'noticeAppreciationApi',
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
    tagTypes: ['NoticeAppreciation'],
    endpoints: (builder) => ({
        getNoticeAppreciations: builder.query({
            query: (params = {}) => {
                const { type, subType, date, page = 1, limit = 10 } = params;
                let url = `/api/notice-appreciations?page=${page}&limit=${limit}`;
                if (type) url += `&type=${type}`;
                if (subType) url += `&subType=${subType}`;
                if (date) url += `&date=${date}`;
                return url;
            },
            providesTags: ['NoticeAppreciation'],
            transformResponse: (response) => ({
                data: response.data || [],
                pagination: response.pagination || { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 }
            }),
        }),
        addNoticeAppreciation: builder.mutation({
            query: (payload) => ({
                url: '/api/notice-appreciations',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['NoticeAppreciation'],
        }),
        deleteNoticeAppreciation: builder.mutation({
            query: (id) => ({
                url: `/api/notice-appreciations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['NoticeAppreciation'],
        }),
    }),
});

export const {
    useGetNoticeAppreciationsQuery,
    useAddNoticeAppreciationMutation,
    useDeleteNoticeAppreciationMutation,
} = noticeAppreciationApi;
