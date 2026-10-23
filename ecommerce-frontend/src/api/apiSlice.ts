import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Product', 'Order', 'User'], // For automatic cache invalidation later
  endpoints: (builder) => ({}), // Endpoints injected via code splitting later
});
