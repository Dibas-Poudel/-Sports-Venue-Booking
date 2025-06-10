import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://sportvenuebackend.onrender.com/api/v1";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchWishlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWishlistSuccess(state, action) {
      state.loading = false;
      state.wishlist = action.payload;
    },
    fetchWishlistFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addToWishlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    addToWishlistSuccess(state, action) {
      state.loading = false;
      state.wishlist.push(action.payload);
    },
    addToWishlistFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    removeFromWishlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    removeFromWishlistSuccess(state, action) {
      state.loading = false;
      state.wishlist = state.wishlist.filter(
        (item) => item.sportVenueId.toString() !== action.payload.toString()
      );
    },
    removeFromWishlistFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchWishlistStart,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  addToWishlistStart,
  addToWishlistSuccess,
  addToWishlistFailure,
  removeFromWishlistStart,
  removeFromWishlistSuccess,
  removeFromWishlistFailure,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Async Thunks (manual)

export const fetchWishlist = () => async (dispatch) => {
  dispatch(fetchWishlistStart());
  try {
    const res = await axios.get(`${API_BASE}/wishlist`, { withCredentials: true });
    dispatch(fetchWishlistSuccess(res.data.data));
  } catch (error) {
    dispatch(fetchWishlistFailure(error?.response?.data?.message || error.message));
  }
};

export const addToWishlist = (venueId) => async (dispatch) => {
  dispatch(addToWishlistStart());
  try {
    const res = await axios.post(`${API_BASE}/wishlist/${venueId}`, null, {
      withCredentials: true,
    });
    dispatch(addToWishlistSuccess(res.data.data));
  } catch (error) {
    dispatch(addToWishlistFailure(error?.response?.data?.message || error.message));
  }
};

export const removeFromWishlist = (venueId) => async (dispatch) => {
  dispatch(removeFromWishlistStart());
  try {
    await axios.delete(`${API_BASE}/wishlist/${venueId}`, {
      withCredentials: true,
    });
    dispatch(removeFromWishlistSuccess(venueId));
  } catch (error) {
    dispatch(removeFromWishlistFailure(error?.response?.data?.message || error.message));
  }
};
