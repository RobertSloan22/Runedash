import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { authApi } from './services/auth/authService'
import  userReducer from './services/user/userSlice'
import auth0Reducer from '../features/auth/auth0Slice'
import { userApi } from './services/auth/userApi'
import { auth0Api } from '../features/auth/auth0Api'


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    auth0: auth0Reducer,

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [auth0Api.reducerPath]: auth0Api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),


  

      

})

export default store
