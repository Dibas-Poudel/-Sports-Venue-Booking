import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// API base URL
const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1";

// Thunk: User login
export function login({ email, password }) {
  return async function loginThunk(dispatch) {
    dispatch(userActions.loginStart());

    try {
      const res = await axios.post(`${BASE_URL}/users/login`, { email, password });
      const { user } = res.data.message;

      if (!user || !user._id) {
        throw new Error("Invalid user data");
      }

      dispatch(userActions.loginSuccess({ user, role: user.role }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      dispatch(userActions.loginFailure(err.message));
    }
  };
}

// Thunk: User registration
export function register({ email, password }) {
  return async function registerThunk(dispatch) {
    dispatch(userActions.registerStart());

    try {
      const res = await axios.post(`${BASE_URL}/users/register`, {
        email,
        password
      });

      const { user } = res.data.message; 

      if (!user || !user._id) {
        throw new Error("Invalid registration data");
      }

      dispatch(userActions.registerSuccess({ user, role: user.role }));
      toast.success("Registration successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      dispatch(userActions.registerFailure(err.message));
    }
  };
}



// Thunk: Fetch profile by userId
export function fetchProfile(userId) {
  return async function fetchProfileThunk(dispatch) {
    dispatch(userActions.fetchProfileStart());

    try {
      const res = await axios.get(`${BASE_URL}/users/getuser/${userId}`);
      const user = res.data.message;

      dispatch(userActions.fetchProfileSuccess(user));
    } catch (err) {
      dispatch(userActions.fetchProfileFailure(err.message));
    }
  };
}

// Thunk: Logout
export function logout() {
  return async function logoutThunk(dispatch) {
    dispatch(userActions.logoutStart());

    try {
      // If your API needs to be called to invalidate tokens
      await axios.post(`${BASE_URL}/logout`);

      dispatch(userActions.logoutSuccess());
    } catch (err) {
      dispatch(userActions.logoutFailure(err.message));
    }
  };
}

const initialState = {
  profile: null,
  role: null,
  loading: false,
  error: null,
  loginStatus: 'idle',
  registerStatus: 'idle',
  profileStatus: 'idle',
  logoutStatus: 'idle',
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.loginStatus = 'loading';
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload.user;
      state.role = action.payload.role;
      state.loginStatus = 'succeeded';
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.loginStatus = 'failed';
    },

    // Register
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
      state.registerStatus = 'loading';
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload.user;
      state.role = action.payload.role;
      state.registerStatus = 'succeeded';
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.registerStatus = 'failed';
    },

    // Profile
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
      state.profileStatus = 'loading';
    },
    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.role = action.payload.role;
      state.profileStatus = 'succeeded';
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.profileStatus = 'failed';
    },

    // Logout
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
      state.logoutStatus = 'loading';
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.profile = null;
      state.role = null;
      state.logoutStatus = 'succeeded';
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.logoutStatus = 'failed';
    },

    // Reset actions
    resetLoginStatus: (state) => {
      state.loginStatus = 'idle';
    },
    resetRegisterStatus: (state) => {
      state.registerStatus = 'idle';
    },
    resetProfileStatus: (state) => {
      state.profileStatus = 'idle';
    },
    resetLogoutStatus: (state) => {
      state.logoutStatus = 'idle';
    },
  },
});

export const {
  resetLoginStatus,
  resetRegisterStatus,
  resetProfileStatus,
  resetLogoutStatus,
} = userSlice.actions;

export const userActions = userSlice.actions;
export default userSlice.reducer;
