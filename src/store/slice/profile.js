import { createSlice } from "@reduxjs/toolkit";

const initialState={
    profile:{},
    loading:false,
    error:null
}

export const userSlice = createSlice({
         name: 'user',
         initialState,
         reducers: {
             setProfile: (state, action) => {
                 state.profile = action.payload;
                 state.loading = false;
             },
             setError: (state, action) => {
                 state.error = action.payload;
                 state.loading = false;
             },
             setLoading: (state, action) => {
                 state.loading = action.payload;
                 state.error = null;
             }
         }
})
export default userSlice.reducer;

export const { setProfile, setError, setLoading } = userSlice.actions;