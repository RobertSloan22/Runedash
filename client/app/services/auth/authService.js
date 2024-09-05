import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const baseUrl =
    process.env.NODE_ENV !== 'prodcution'
        ? 'https://localhost:5000'
        : import.meta.env.VITE_SERVER_URL;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.userToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
                return headers;
            }
        },
    }),
  endpoints: (build) => ({
    getUserProfile: build.query({
      query: () => ({
        url: 'api/user',
        method: 'GET',
      }),
    }),
    deposit: build.mutation({
      query: (amount) => ({
        url: 'api/deposit',
        method: 'POST',
        body: { amount },
      }),
    }),
    withdraw: build.mutation({
      query: (amount) => ({
        url: 'api/withdraw',
        method: 'POST',
        body: { amount },
      }),
    }),
  }),
})

// export react hooks
export const { useGetUserProfileQuery, useDepositMutation, useWithdrawMutation } = authApi
