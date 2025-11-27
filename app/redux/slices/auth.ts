import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { authAPI } from "../services/authApi";
import { userAPI } from "../services/userApi";

type StoredUser = {
  role?: string;
  [key: string]: unknown;
} | null;

const getStoredItem = <T>(key: string): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const user = getStoredItem<StoredUser>("user");
const token = getStoredItem<string>("token");

export type AuthState = {
  user: StoredUser;
  token: string | null;
  isAdmin: boolean;
  isStudent: boolean;
  isInstructor: boolean;
  isLoadingUser?: boolean;
};

const initialState: AuthState = {
  user,
  token,
  isAdmin: user?.role === "admin",
  isStudent: user?.role === "student",
  isInstructor: user?.role === "instructor",
  isLoadingUser: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authAPI.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAdmin = payload.user.role === "admin";
          state.isStudent = payload.user.role === "student";
          state.isInstructor = payload.user.role === "instructor";
          state.token = payload.token;
          localStorage.setItem("user", JSON.stringify(payload.user));
          localStorage.setItem("token", JSON.stringify(payload.token));
        }
      )
      .addMatcher(
        userAPI.endpoints.updateProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = { ...(state.user ?? {}), ...payload };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addMatcher(authAPI.endpoints.loginUser.matchRejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, setLoading } = slice.actions;

export default slice.reducer;
