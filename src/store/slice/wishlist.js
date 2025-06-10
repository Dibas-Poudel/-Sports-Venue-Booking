import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/wishlist";

export function fetchWishlist() {
  return async function fetchWishlistThunk(dispatch) {
    dispatch(wishlistActions.fetchStart());
    try {
      const res = await axios.get(BASE_URL, {
        withCredentials:true,
      });
      dispatch(wishlistActions.fetchSuccess(res.data.wishlist));
    } catch (error) {
      dispatch(wishlistActions.fetchFailure(error.response?.data?.message || error.message));
      toast.error("Failed to fetch wishlist");
    }
  };
}

export function toggleWishlist({ token, venueId }) {
  return async function toggleWishlistThunk(dispatch) {
    dispatch(wishlistActions.addStart());

    try {
      const res = await axios.post(
        `${BASE_URL}/${venueId}`,
        {},
        {
          withCredentials:true,
        }
      );

      const status = res.data.status;

      if (status === "added") {
        dispatch(wishlistActions.addItemOptimistic(venueId));
        toast.success("Added to wishlist");
      } else if (status === "removed") {
        dispatch(wishlistActions.removeItemOptimistic(venueId));
        toast.success("Removed from wishlist");
      }

      dispatch(fetchWishlist(token));
    } catch (error) {
      dispatch(wishlistActions.addFailure(error.response?.data?.message || error.message));
      toast.error("Failed to toggle wishlist");
    }
  };
}

const initialState = {
  items: [],
  loading: false,
  error: null,
  fetchStatus: "idle",
  addStatus: "idle",
  removeStatus: "idle",
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.fetchStatus = "loading";
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.fetchStatus = "succeeded";
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.fetchStatus = "failed";
    },

    addStart: (state) => {
      state.loading = true;
      state.error = null;
      state.addStatus = "loading";
    },
    addFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.addStatus = "failed";
    },

    removeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.removeStatus = "failed";
    },

    addItemOptimistic: (state, action) => {
      state.items.push({ sportVenueId: action.payload });
    },
    removeItemOptimistic: (state, action) => {
      state.items = state.items.filter(item => item.sportVenueId !== action.payload);
    },

    resetFetchStatus: (state) => {
      state.fetchStatus = "idle";
    },
    resetAddStatus: (state) => {
      state.addStatus = "idle";
    },
    resetRemoveStatus: (state) => {
      state.removeStatus = "idle";
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;
