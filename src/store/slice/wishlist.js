import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://sportvenuebackend.onrender.com/api/v1';

const initialState = {
  items: [],
  loading: false,
  error: null,
  fetchStatus: 'idle',
  addStatus: 'idle',
  removeStatus: 'idle',
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    fetchWishlistStart(state) {
      state.loading = true;
      state.fetchStatus = 'loading';
      state.error = null;
    },
    fetchWishlistSuccess(state, action) {
      state.loading = false;
      state.fetchStatus = 'succeeded';
      state.items = action.payload;
    },
    fetchWishlistFailure(state, action) {
      state.loading = false;
      state.fetchStatus = 'failed';
      state.error = action.payload;
    },

    addToWishlistStart(state) {
      state.addStatus = 'loading';
      state.error = null;
    },
    addToWishlistSuccess(state, action) {
      state.addStatus = 'succeeded';
      state.items.push(action.payload);
    },
    addToWishlistFailure(state, action) {
      state.addStatus = 'failed';
      state.error = action.payload;
    },

    removeFromWishlistStart(state) {
      state.removeStatus = 'loading';
      state.error = null;
    },
    removeFromWishlistSuccess(state, action) {
      state.removeStatus = 'succeeded';
      state.items = state.items.filter(item => item.venue_id !== action.payload);
    },
    removeFromWishlistFailure(state, action) {
      state.removeStatus = 'failed';
      state.error = action.payload;
    },

    resetAddStatus(state) {
      state.addStatus = 'idle';
    },
    resetRemoveStatus(state) {
      state.removeStatus = 'idle';
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
  resetAddStatus,
  resetRemoveStatus,
} = wishlistSlice.actions;

export const wishlistActions = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Fetch Wishlist
export const fetchWishlist = () => async (dispatch) => {
  dispatch(fetchWishlistStart());
  try {
    const res = await axios.get(`${API_BASE}/wishlist`, {
      withCredentials: true,
    });
    dispatch(fetchWishlistSuccess(res.data.data));
  } catch (error) {
    dispatch(fetchWishlistFailure(error?.response?.data?.message || error.message));
  }
};

// Add to Wishlist
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

// Remove from Wishlist
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
