import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://sportvenuebackend.onrender.com/api/v1";

const initialState = {
  wishlist: [],
  loading: false,
  fetchStatus: "idle",
  addStatus: "idle",
  removeStatus: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Fetch wishlist
    fetchWishlistStart(state) {
      state.fetchStatus = "loading";
      state.loading = true;
      state.error = null;
    },
    fetchWishlistSuccess(state, action) {
      state.fetchStatus = "succeeded";
      state.loading = false;
      state.wishlist = action.payload;
    },
    fetchWishlistFailure(state, action) {
      state.fetchStatus = "failed";
      state.loading = false;
      state.error = action.payload;
    },

    // Add item to wishlist
    addWishlistStart(state) {
      state.addStatus = "loading";
      state.error = null;
    },
    addWishlistSuccess(state, action) {
      state.addStatus = "succeeded";
      state.wishlist.push(action.payload);
    },
    addWishlistFailure(state, action) {
      state.addStatus = "failed";
      state.error = action.payload;
    },

    // Remove item from wishlist
    removeWishlistStart(state) {
      state.removeStatus = "loading";
      state.error = null;
    },
    removeWishlistSuccess(state, action) {
      state.removeStatus = "succeeded";
      state.wishlist = state.wishlist.filter(
        (item) => item.sportVenueId._id !== action.payload
      );
    },
    removeWishlistFailure(state, action) {
      state.removeStatus = "failed";
      state.error = action.payload;
    },

    // Reset add/remove statuses
    resetAddStatus(state) {
      state.addStatus = "idle";
    },
    resetRemoveStatus(state) {
      state.removeStatus = "idle";
    },
  },
});

export const wishlistActions = wishlistSlice.actions;

export const {
  fetchWishlistStart,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  addWishlistStart,
  addWishlistSuccess,
  addWishlistFailure,
  removeWishlistStart,
  removeWishlistSuccess,
  removeWishlistFailure,
  resetAddStatus,
  resetRemoveStatus,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Thunk async actions

export const fetchWishlist = () => async (dispatch) => {
  dispatch(fetchWishlistStart());
  try {
    const response = await axios.get(`${API_BASE}/wishlist`, { withCredentials: true });
    dispatch(fetchWishlistSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchWishlistFailure(error.response?.data?.message || error.message));
  }
};

export const addToWishlist = (venueId) => async (dispatch) => {
  dispatch(addWishlistStart());
  try {
    const response = await axios.post(`${API_BASE}/wishlist/${venueId}`, {}, {
      withCredentials: true,
    });
    dispatch(addWishlistSuccess(response.data.data));
  } catch (error) {
    dispatch(addWishlistFailure(error.response?.data?.message || error.message));
  }
};

export const removeFromWishlist = (venueId) => async (dispatch) => {
  dispatch(removeWishlistStart());
  try {
    await axios.delete(`${API_BASE}/wishlist/${venueId}`, { withCredentials: true });
    dispatch(removeWishlistSuccess(venueId));
  } catch (error) {
    dispatch(removeWishlistFailure(error.response?.data?.message || error.message));
  }
};
