import { createSlice } from '@reduxjs/toolkit';
import { signInCall, getHuddleBoardConfig, contactSupport } from '../actions/auth';

export type AuthState = {
  loggedInUser: { token: ''; user: null; permissions: null };
  huddleBoardConfig: { user_full_name: string; past_calendar_days_count: number | null; future_calender_days_count: number | null; hide_logout_option: number | null };
};

const initialState: AuthState = {
  loggedInUser: { token: '', user: null, permissions: null },
  huddleBoardConfig: { user_full_name: '', past_calendar_days_count: null, future_calender_days_count: null, hide_logout_option: null },
};

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInCall.pending, (state, action) => {
      console.log(state, action, 'pending');
    });
    builder.addCase(signInCall.rejected, (state, action) => {
      console.log(state, action, 'rejected');
    });
    builder.addCase(signInCall.fulfilled, (state, action) => {
      console.log(state, action, 'fulfilled');
    });

    builder.addCase(getHuddleBoardConfig.fulfilled, (state, { payload }) => {
      state.huddleBoardConfig = payload;
    });

    builder.addCase(contactSupport.pending, (state, action) => {
      console.log(state, action, 'pending');
    });
    builder.addCase(contactSupport.fulfilled, (state, action) => {
      console.log('Contact support fulfilled:', action.payload);
    });
    builder.addCase(contactSupport.rejected, (state, action) => {
      console.error('Contact support rejected:', action.error);
    });

  },
});

export const { setLoggedInUser } = auth.actions;
export default auth.reducer;
