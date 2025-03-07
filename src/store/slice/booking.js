import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookings: [],
    loading: false,
    error: null,

}

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookings: (state, action) => {
            state.bookings = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
})
export default bookingSlice.reducer;

export const { setBookings, setLoading, setError } = bookingSlice.actions;