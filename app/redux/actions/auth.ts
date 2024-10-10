import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, axiosWrapper } from '../config/axiosInstance';
import { toast } from 'react-toastify';
import axios from 'axios';

export interface IGetAccessTokenPayload {
  slug: string,
}

export interface ILoginFromEmailAndOtp {
  email: string,
}

export interface IVerifyOtp {
  email: string,
  otp: string
}

export const signInCall = createAsyncThunk('signInCall', async (payload: IGetAccessTokenPayload) => {
  const result = await axiosInstance.post('slug-token', payload);
  return result.data;
});

export const getToken = createAsyncThunk('getToken', async (payload: IGetAccessTokenPayload) => {
  const result = await axiosInstance.post('slug-token/', payload);
  return result.data;
});

export const getHuddleBoardConfig = createAsyncThunk('getHuddleBoardConfig', async () => {
  return await axiosWrapper({ method: "get", url: `huddle-board-config` })
});


export const signInWithOtp = createAsyncThunk('signInWithOtp', (payload: ILoginFromEmailAndOtp, { rejectWithValue }) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}huddle-board-otp-login/`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status !== 200) {
        toast.error(response.data.message, {
          toastId: 'error4',
        });
        throw new Error('Invalid Email');
      }
      toast.success(response.data.message, {

        toastId: 'success2',

      });

      return response.data;
    })
    .catch(error => {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.error, {
          toastId: 'error5'
        });
        return rejectWithValue(error.response.data);
      } else if (error.request) {

        console.error(error.request);
        return rejectWithValue('No response from server');
      } else {
        console.error('Error', error.message);
        return rejectWithValue(error.message);
      }
    });
});


export const verifyOTP = createAsyncThunk('verifyOTP', async (payload: IVerifyOtp, { rejectWithValue }) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}huddle-board-verify-otp/`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status !== 200) {

        toast.error(response.data.message, {

          toastId: 'error6',

        });
        throw new Error(response.data.message);
      }
      toast.success(response.data.message, {

        toastId: 'success3',

      });

      return response.data;
    })
    .catch(error => {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.error, {

          toastId: 'error7',

        });
        return rejectWithValue(error.response.data);
      } else if (error.request) {

        console.error(error.request);
        return rejectWithValue('No response from server');
      } else {
        console.error('Error', error.message);
        return rejectWithValue(error.message);
      }
    });
});


export const contactSupport = createAsyncThunk('contactSupport', async (payload: ILoginFromEmailAndOtp) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}huddle-board-request-notification/`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.status !== 200) {
      toast.error(response.data.message, {

        toastId: 'error8',

      });
      throw new Error(response.data.message);
    }
    toast.success(response.data.message, {

      toastId: 'success5',

    });
    return response.data;
  }).catch(error => {
    console.error('Error', error.message);
  });

});

