import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDepositMutation, useWithdrawMutation, useGetUserBalanceQuery } from '../auth/userApi';

const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null;

    export const depositMoney = createAsyncThunk(
        'user/deposit',
        async (amount, { getState, rejectWithValue }) => {
          try {
            const token = getState().auth?.userToken;
            if (!token) {
              throw new Error('User not logged in');
            }
      
            const config = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
      
            const { data } = await axios.post(
              `${backendURL}/api/user/deposit`,
              { amount },
              config
            )
      
            return data
          } catch (error) {
            if (error.response && error.response.data.message) {
              return rejectWithValue(error.response.data.message)
            } else {
              return rejectWithValue(error.message)
            }
          }
        }
      )
      
      export const withdrawMoney = createAsyncThunk(
        'user/withdraw',
        async (amount, { getState, rejectWithValue }) => {
          try {
            const token = getState().auth?.userToken;
            if (!token) {
              throw new Error('User not logged in');
            }
      
            const config = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
      
            const { data } = await axios.post(
              `${backendURL}/api/user/withdraw`,
              { amount },
              config
            )
      
            return data
          } catch (error) {
            if (error.response && error.response.data.message) {
              return rejectWithValue(error.response.data.message)
            } else {
              return rejectWithValue(error.message)
            }
          }
        }
      )

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        users: [],
        transactionHistory: [],
        balance: 0,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(depositMoney.pending, (state) => {
                state.loading = true;
            })
            .addCase(depositMoney.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.balance;
            })
            .addCase(depositMoney.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(withdrawMoney.pending, (state) => {
                state.loading = true;
            })
            .addCase(withdrawMoney.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.balance;
            })
            .addCase(withdrawMoney.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const getUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer;