import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    prepareHeaders: (headers) => {
      headers.set('credentials', 'include');
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'User'], // For automatic cache invalidation later
  endpoints: () => ({}), // Endpoints injected via code splitting later
});
