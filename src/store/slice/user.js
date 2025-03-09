import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null, // User profile data
  loading: false,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setUser: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.profile = null;
      state.loading = false;
      state.message = null;
    },
  },
});

export const { setLoading, setMessage, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
