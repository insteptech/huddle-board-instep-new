import { configureStore } from '@reduxjs/toolkit';
import auth, { AuthState } from './slices/auth';
import appointment from './slices/appointment';
import { AppointmentsState } from './slices/appointment';

export interface AppState {
  auth: AuthState,
	appointment: AppointmentsState

}

export const store = configureStore({
  reducer: {
    auth,
    appointment
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
