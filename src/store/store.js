import {configureStore}from "@reduxjs/toolkit"

import userReducer from "./slice/user";
import venueReducer from "./slice/sportsvenue";
import wishlistReducer from "./slice/wishlist";
import reviewReducer from "./slice/review";
import bookingReducer from "./slice/booking";
import adminReducer from "./slice/admin";

export const store=configureStore({
    reducer:{
        user: userReducer, 
        sportsVenue: venueReducer,
        wishlist: wishlistReducer,
        reviews: reviewReducer,
        booking:bookingReducer,
        admin:adminReducer

    }
})




