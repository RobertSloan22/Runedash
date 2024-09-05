// auth0Api.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth0Reducer from './auth0Slice';
export const auth0Api = createApi({
  reducerPath: 'auth0Api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    loginWithAuth0: builder.mutation({
      query: () => auth0Client.loginWithRedirect(),
    }),
    logoutFromAuth0: builder.mutation({
      query: () => auth0Client.logout({ returnTo: window.location.origin }), 
    }),
    getAuth0User: builder.query({
      query: () => auth0Client.getUser() 
    })
  })
})

export const { useLoginWithAuth0Mutation, useLogoutFromAuth0Mutation, useGetAuth0UserQuery } = auth0Api;
