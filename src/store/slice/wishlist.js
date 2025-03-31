import { createSlice } from "@reduxjs/toolkit";
import supabase from "../../services/supabaseClient";
import { toast } from "react-toastify";

// Action creators
export function fetchWishlist(userId) {
  return async function fetchWishlistThunk(dispatch) {
    dispatch(wishlistActions.fetchStart());
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, sports_venues(*)")
        .eq("user_id", userId);

      if (error) throw error;
      dispatch(wishlistActions.fetchSuccess(data));
    } catch (error) {
      dispatch(wishlistActions.fetchFailure(error.message));
      toast.error("Failed to fetch wishlist");
    }
  };
}

export function addToWishlist({ userId, venueId }) {
  return async function addToWishlistThunk(dispatch) {
    dispatch(wishlistActions.addStart());
    try {
      // Optimistic update
      dispatch(wishlistActions.addItemOptimistic(venueId));

      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: userId, venue_id: venueId }]);

      if (error) {
        // Revert optimistic update if failed
        dispatch(wishlistActions.removeItemOptimistic(venueId));
        throw error;
      }

      // Refresh the list after successful addition
      dispatch(fetchWishlist(userId));
      toast.success("Added to wishlist");
    } catch (error) {
      dispatch(wishlistActions.addFailure(error.message));
      toast.error("Failed to add to wishlist");
    }
  };
}

export function removeFromWishlist({ userId, venueId }) {
  return async function removeFromWishlistThunk(dispatch) {
    dispatch(wishlistActions.removeStart());
    try {
      // Optimistic update
      dispatch(wishlistActions.removeItemOptimistic(venueId));

      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("venue_id", venueId);

      if (error) {
        // Revert optimistic update if failed
        dispatch(wishlistActions.addItemOptimistic(venueId));
        throw error;
      }

      // Refresh the list after successful removal
      dispatch(fetchWishlist(userId));
      toast.success("Removed from wishlist");
    } catch (error) {
      dispatch(wishlistActions.removeFailure(error.message));
      toast.error("Failed to remove from wishlist");
    }
  };
}

const initialState = {
  items: [],
  loading: false,
  error: null,
  fetchStatus: 'idle',
  addStatus: 'idle',
  removeStatus: 'idle'
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Fetch actions
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.fetchStatus = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.fetchStatus = 'succeeded';
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.fetchStatus = 'failed';
    },
    
    // Add actions
    addStart: (state) => {
      state.loading = true;
      state.error = null;
      state.addStatus = 'loading';
    },
    addSuccess: (state) => {
      state.loading = false;
      state.addStatus = 'succeeded';
    },
    addFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.addStatus = 'failed';
    },
    
    // Remove actions
    removeStart: (state) => {
      state.loading = true;
      state.error = null;
      state.removeStatus = 'loading';
    },
    removeSuccess: (state) => {
      state.loading = false;
      state.removeStatus = 'succeeded';
    },
    removeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.removeStatus = 'failed';
    },
    
    // Optimistic updates
    addItemOptimistic: (state, action) => {
      state.items.push({ venue_id: action.payload, sports_venues: {} });
    },
    removeItemOptimistic: (state, action) => {
      state.items = state.items.filter(item => item.venue_id !== action.payload);
    },
    
    // Reset actions
    resetFetchStatus: (state) => {
      state.fetchStatus = 'idle';
    },
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
    },
    resetRemoveStatus: (state) => {
      state.removeStatus = 'idle';
    }
  }
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;