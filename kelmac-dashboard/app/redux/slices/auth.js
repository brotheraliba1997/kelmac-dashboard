import { createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../services/authApi";
import { userAPI } from "../services/userApi";

const user =
  typeof window !== "undefined"
    ? localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
    : null;

const tokens =
  typeof window !== "undefined"
    ? localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : null
    : null;

const initialState = {
  user,
  tokens,

  isAdmin: user?.role == "admin" ? true : false,
  isClient: user?.role == "client" ? true : false,
  isInterpreter: user?.role == "interpreter" ? true : false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      // localStorage.removeItem("userName");
    },
    setLoading: (state, action) => {
      state.isLoadingUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authAPI.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAdmin = payload.user.role == "admin";
          state.isClient = payload.user.role == "client";
          state.isInterpreter = payload.user.role == "interpreter";
          state.tokens = payload.tokens;
          localStorage.setItem("user", JSON.stringify(payload.user));
          localStorage.setItem("tokens", JSON.stringify(payload.tokens)); // Corrected from 'tokens'
        }
      )

      .addMatcher(
        userAPI.endpoints.updateProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = { ...state.user, ...payload };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      )
      .addMatcher(authAPI.endpoints.loginUser.matchRejected, (state) => {
        state.auth = null;
      })

      .addMatcher(
        userAPI.endpoints.checkUserAuth.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.isAdmin = payload.role == "admin";
          state.isClient = payload.role == "client";
          state.isInterpreter = payload.role == "interpreter";
          localStorage.setItem("user", JSON.stringify(payload));
        }
      )
      .addMatcher(userAPI.endpoints.checkUserAuth.matchRejected, (state) => {
        state.user = null;
        state.tokens = null;
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        // localStorage.removeItem("userName");
      });
  },
});

export const { logout, setLoading } = slice.actions;

export default slice.reducer;
