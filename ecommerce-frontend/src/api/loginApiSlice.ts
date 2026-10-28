import type { User } from '../query-body/get-user.types';
import { apiSlice } from './apiSlice';

export const LoginApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string }>({
      query: (body) => ({
        url: '/auth',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = LoginApiSlice;
