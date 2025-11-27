import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationState = {
  startingCall: unknown;
};

const initialState: NotificationState = {
  startingCall: null,
};

const slice = createSlice({
  name: "NotificationSlice",
  initialState,
  reducers: {
    StartCall: (state, action: PayloadAction<unknown>) => {
      state.startingCall = action.payload;
    },
  },
});

export const { StartCall } = slice.actions;

export default slice.reducer;
