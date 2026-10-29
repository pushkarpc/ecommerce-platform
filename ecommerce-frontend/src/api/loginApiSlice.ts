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
    verifyOtp: builder.mutation<User, { email: string; otp: string }>({
      query: (body) => ({
        url: '/auth/otpCode',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useVerifyOtpMutation } = LoginApiSlice;
