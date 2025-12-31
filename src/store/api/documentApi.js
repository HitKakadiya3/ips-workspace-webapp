import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const documentApi = createApi({
    reducerPath: 'documentApi',
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
    tagTypes: ['Documents'],
    endpoints: (builder) => ({
        getDocuments: builder.query({
            query: (params) => ({
                url: '/api/documents',
                params,
            }),
            providesTags: ['Documents'],
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (response && Array.isArray(response.data)) return response.data;
                return [];
            },
        }),
        addDocument: builder.mutation({
            query: (formData) => ({
                url: '/api/documents',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Documents'],
        }),
        deleteDocument: builder.mutation({
            query: (id) => ({
                url: `/api/documents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Documents'],
        }),
    }),
});

export const {
    useGetDocumentsQuery,
    useAddDocumentMutation,
    useDeleteDocumentMutation,
} = documentApi;
