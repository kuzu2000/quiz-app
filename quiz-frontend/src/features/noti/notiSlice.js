import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
  };

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  getNotifications: (state, action) => {
    state.notifications = action.payload;
  },
});

export const { getNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
