import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl =
    process.env.NODE_ENV !== 'production'
        ? 'https://localhost:5000'
        : import.meta.env.VITE_SERVER_URL;

export const userApi = createApi({
    reducerPath: 'userApi',
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
        register: build.mutation({
            query: (data) => ({
                url: 'api/user/register',
                method: 'POST',
                body: data,
            }),
        }),
        login: build.mutation({
            query: (data) => ({
                url: 'api/user/login',
                method: 'POST',
                body: data,
            }),
        }),

        withdraw: build.mutation({
            query: (data) => ({
                url: 'api/user/withdraw',
                method: 'POST',
                body: data,
            }),
        }),
        getAllUsers: build.query({
            query: () => ({
                url: 'api/users',
                method: 'GET',
            }),
        }),

        getUserBalance: build.query({
            query: (userId) => ({
                url: `api/user/balance/${userId}`,
                method: 'GET',
            }),
        }),
        getUserById: build.query({
            query: (userId) => ({
                url: `api/user/${userId}`,
                method: 'GET',
            }),
        }),

        deposit: build.mutation({
            query: (data) => ({
                url: 'api/user/deposit',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

// Export React hooks
export const {
    useLoginMutation,
    useWithdrawMutation,
    useGetAllUsersQuery,
    useGetUserBalanceQuery,
    useGetUserByIdQuery,
    useDepositMutation,

} = userApi;
export default userApi.reducer;


