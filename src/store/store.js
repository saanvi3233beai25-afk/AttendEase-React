import { configureStore } from '@reduxjs/toolkit';
import attendanceReducer from '../features/attendance/attendanceSlice';

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer
  }
});

// Automatically save Redux attendance data
store.subscribe(() => {
  try {
    const attendanceState = store.getState().attendance;

    localStorage.setItem(
      'ae_attendance',
      JSON.stringify(attendanceState)
    );
  } catch (error) {
    console.error('Unable to save attendance:', error);
  }
});