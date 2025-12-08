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
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user,
  token,
  isAdmin: user?.role === "admin",
  isStudent: user?.role === "student",
  isInstructor: user?.role === "instructor",
  isLoadingUser: false,
  isAuthenticated: !!token && !!user,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isStudent = false;
      state.isInstructor = false;
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
          const data = payload as { user: any; token?: string };
          state.user = data.user;
          state.isAdmin = data.user.role === "admin";
          state.isStudent = data.user.role === "student";
          state.isInstructor = data.user.role === "instructor";
          state.token = data.token ?? null;
          state.isAuthenticated = !!(data.token && data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", JSON.stringify(data.token));
        }
      )
      .addMatcher(
        userAPI.endpoints.updateProfile.matchFulfilled,
        (state, { payload }) => {
          const data = payload as unknown as { user: any };
          state.user = { ...(state.user ?? {}), ...data };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addMatcher(authAPI.endpoints.loginUser.matchRejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.isStudent = false;
        state.isInstructor = false;
      });
  },
});

export const { logout, setLoading } = slice.actions;

export default slice.reducer;
