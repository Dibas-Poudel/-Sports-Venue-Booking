import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://sportvenuebackend.onrender.com/api/v1";

// Fetch wishlist items
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/wishlist`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (venueId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/wishlist/${venueId}`,
        {},
        { withCredentials: true }
      );
      // Refetch updated wishlist
      dispatch(fetchWishlist());
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (venueId, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/wishlist/${venueId}`, {
        withCredentials: true,
      });
      // Refetch updated wishlist
      dispatch(fetchWishlist());
      return venueId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    addStatus: "idle", // idle | loading | succeeded | failed
    removeStatus: "idle",
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.wishlist = [];
      state.loading = false;
      state.addStatus = "idle";
      state.removeStatus = "idle";
      state.error = null;
    },
    resetAddStatus(state) {
      state.addStatus = "idle";
    },
    resetRemoveStatus(state) {
      state.removeStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.addStatus = "loading";
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.addStatus = "succeeded";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.payload;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.removeStatus = "loading";
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state) => {
        state.removeStatus = "succeeded";
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removeStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearWishlist, resetAddStatus, resetRemoveStatus } =
  wishlistSlice.actions;
  export const wishlistActions = wishlistSlice.actions;


export default wishlistSlice.reducer;
