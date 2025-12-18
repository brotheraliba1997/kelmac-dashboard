import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getUserRole } from "@/app/utils/permissionChecker";
import { UserRole } from "@/app/utils/permissions";

type StoredUser = {
  role?: string;
  [key: string]: unknown;
} | null;

// Type declarations for APIs (will be resolved at runtime)
let authAPI: any;
let userAPI: any;

// Resolve circular dependencies by lazy loading
const initializeAPIs = () => {
  if (!authAPI) {
    authAPI = require("../services/authApi").authAPI;
  }
  if (!userAPI) {
    userAPI = require("../services/userApi").userAPI;
  }
};

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
  isInstructor: boolean;
  isLoadingUser?: boolean;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user,
  token,
  isAdmin: user?.role === "admin",
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
      state.isInstructor = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Initialize APIs to resolve circular dependencies
    initializeAPIs();

    builder
      .addMatcher(
        authAPI.endpoints.loginUser.matchFulfilled,
        (state, action: any) => {
          const { payload } = action;
          const data = payload as { user: any; token?: string };
          // console.log("data in authApi", data);
          const roleId = getUserRole(data.user);
          const allowedRoles = [
            UserRole.ADMIN,
            UserRole.INSTRUCTOR,
            UserRole.CORPORATE,
            UserRole.FINANCE,
            UserRole.OPERATOR,
          ];

          if (!roleId || !allowedRoles.includes(roleId)) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.isInstructor = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return;
          }

          // Ensure we have both user and token
          if (!data.user || !data.token) {
            console.error("Missing user or token in response:", {
              user: !!data.user,
              token: !!data.token,
            });
            return;
          }

          // Save to localStorage only in browser environment
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("user", JSON.stringify(data.user));
              localStorage.setItem("token", JSON.stringify(data.token));
              state.user = data.user;
              state.isAdmin = roleId === UserRole.ADMIN;
              state.isInstructor = roleId === UserRole.INSTRUCTOR;
              state.token = data.token;
              state.isAuthenticated = !!(data.token && data.user);
            } catch (error) {
              console.error("Error saving to localStorage:", error);
            }
          }
        }
      )
      .addMatcher(
        userAPI.endpoints.updateProfile.matchFulfilled,
        (state, action: any) => {
          const { payload } = action;
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
        state.isInstructor = false;
      });
  },
});

export const { logout, setLoading } = slice.actions;

export default slice.reducer;
