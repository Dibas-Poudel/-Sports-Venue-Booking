import {configureStore}from "@reduxjs/toolkit"
import { bookingSlice } from "./slice/booking"
import { userSlice } from "./slice/profile"

export const store=configureStore({
    reducer:{
        booking:bookingSlice.reducer,
        user:userSlice.reducer
    }
})