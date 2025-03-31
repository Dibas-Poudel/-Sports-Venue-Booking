import { createSlice } from "@reduxjs/toolkit";
import supabase from "../../services/supabaseClient";
import { toast } from "react-toastify";

// User login action
export function login({ email, password }) {
  return async function loginThunk(dispatch) {
    dispatch(userActions.loginStart());
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        dispatch(userActions.loginFailure(error.message));
        return;
      }

      // Fetch user profile after successful login
      const { data: profile, error: profileError } = await supabase
        .from("user")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        toast.error("Failed to fetch user profile");
        dispatch(userActions.loginFailure("Failed to fetch user profile"));
        return;
      }

      dispatch(userActions.loginSuccess({
        
        user: data.user,
        role: profile.role,
      }));
    } catch (error) {
      toast.error("An error occurred during login");
      dispatch(userActions.loginFailure(error.message));
    }
  };
}

// User registration action
export function register({ email, password }) {
  return async function registerThunk(dispatch) {
    dispatch(userActions.registerStart());
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        dispatch(userActions.registerFailure(error.message));
        return;
      }

      // Create user profile after registration
      const { error: insertError } = await supabase.from("user").insert({
        id: data.user.id,
        email,
        role: "user",
      });

      if (insertError) {
        toast.warning("Registered but failed to create profile");
        dispatch(userActions.registerFailure(insertError.message));
        return;
      }

      toast.success("Registration successful!");
      dispatch(userActions.registerSuccess({
        user: data.user,
        role: "user",
      }));
    } catch (error) {
      toast.error("An error occurred during registration");
      dispatch(userActions.registerFailure(error.message));
    }
  };
}

// Fetch user profile action
export function fetchProfile(userId) {
  return async function fetchProfileThunk(dispatch) {
    dispatch(userActions.fetchProfileStart());
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        dispatch(userActions.fetchProfileFailure(error.message));
        return;
      }

      dispatch(userActions.fetchProfileSuccess(data));
    } catch (error) {
      dispatch(userActions.fetchProfileFailure(error.message));
    }
  };
}

// User logout action
export function logout() {
  return async function logoutThunk(dispatch) {
    dispatch(userActions.logoutStart());  
    try {
      const { error } = await supabase.auth.signOut(); 
      if (error) {
        dispatch(userActions.logoutFailure(error.message)); 
        return;
      }
      dispatch(userActions.logoutSuccess());  
    } catch (error) {
      dispatch(userActions.logoutFailure(error.message)); 
    }
  };
}

const initialState = {
  profile: null,
  role: null,
  loading: false,
  error: null,
  loginStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  registerStatus: 'idle',
  profileStatus: 'idle',
  logoutStatus: 'idle',
  resetLogoutStatus: 'idle',
  resetLoginStatus: 'idle',
  resetRegisterStatus: 'idle',
  resetProfileStatus: 'idle',
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login actions
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
    
    // Registration actions
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
    
    // Profile actions
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
      state.profileStatus = 'loading';
    },
    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.role = action.payload.role;
      state.profileStatus = 'succeeded';
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.profileStatus = 'failed';
    },
    
    // Logout actions
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
  resetLogoutStatus 
} = userSlice.actions;
export const userActions = userSlice.actions;
export default userSlice.reducer;