import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startingCall: null,
};

const slice = createSlice({
  name: "NotificationSlice",
  initialState,
  reducers: {
    StartCall: (state, action) => {
      state.startingCall = action.payload;
    },
  },
});

export const { StartCall } = slice.actions;

export default slice.reducer;
