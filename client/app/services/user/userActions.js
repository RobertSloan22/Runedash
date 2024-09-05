import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL =
  process.env.NODE_ENV !== 'production'
    ? 'https://localhost:5000'
    : import.meta.env.VITE_SERVER_URL



export const depositMoney = createAsyncThunk(
  'user/deposit',
  async (amount, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.userToken
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await axios.post(
        `${backendURL}/api/deposit`,
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
      const token = getState().auth.userToken
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
export const getUserDetails = createAsyncThunk(
    'user/profile',
    async (_, { getState, rejectWithValue }) => {
        try {
  const token = getState().auth.userToken;
  const config
    = {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
    }
    const { data } = await axios.get(`${backendURL}/api/user`, config);
    return data;

        } catch (error) {
            if (error.response && error.response.data.message) {
  return rejectWithValue(error.response.data.message);
}
else {
    return rejectWithValue(error.message);
}
}
})

export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        `${backendURL}/api/user/login`,
        { email, password },
        config
      )

      // store user's token in local storage
      localStorage.setItem('userToken', data.userToken)

      return data
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)

