import { createSlice } from '@reduxjs/toolkit';
import supabase from '../../services/supabaseClient';
import { toast } from 'react-toastify';

// Action creators
export function fetchReviews(venueId) {
  return async function fetchReviewsThunk(dispatch) {
    dispatch(reviewActions.fetchStart());
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      dispatch(reviewActions.fetchSuccess(data));
    } catch (error) {
      dispatch(reviewActions.fetchFailure(error.message));
      toast.error('Failed to fetch reviews');
    }
  };
}

export function addReview({ venueId, userId, email, rating, comment }) {
  return async function addReviewThunk(dispatch) {
    dispatch(reviewActions.addStart());
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          venue_id: venueId,
          user_id: userId,
          email,
          rating,
          comment,
        },
      ]);

      if (error) throw error;
      dispatch(fetchReviews(venueId));
      dispatch(reviewActions.addSuccess());
      toast.success('Review added successfully');
    } catch (error) {
      dispatch(reviewActions.addFailure(error.message));
      toast.error('Failed to add review');
    }
  };
}

export function updateReview({ reviewId, venueId, rating, comment }) {
  return async function updateReviewThunk(dispatch) {
    dispatch(reviewActions.updateStart());
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', reviewId);

      if (error) throw error;
      dispatch(fetchReviews(venueId));
      dispatch(reviewActions.updateSuccess());
      toast.success('Review updated successfully');
    } catch (error) {
      dispatch(reviewActions.updateFailure(error.message));
      toast.error('Failed to update review');
    }
  };
}

export function deleteReview({ reviewId, venueId }) {
  return async function deleteReviewThunk(dispatch) {
    dispatch(reviewActions.deleteStart());
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      dispatch(fetchReviews(venueId));
      dispatch(reviewActions.deleteSuccess());
      toast.success('Review deleted successfully');
    } catch (error) {
      dispatch(reviewActions.deleteFailure(error.message));
      toast.error('Failed to delete review');
    }
  };
}

const initialState = {
  items: [],
  loading: false,
  error: null,
  currentReview: null,
  fetchStatus: 'idle',
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle'
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
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
    // Update actions
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
      state.updateStatus = 'loading';
    },
    updateSuccess: (state) => {
      state.loading = false;
      state.updateStatus = 'succeeded';
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.updateStatus = 'failed';
    },
    // Delete actions
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
      state.deleteStatus = 'loading';
    },
    deleteSuccess: (state) => {
      state.loading = false;
      state.deleteStatus = 'succeeded';
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.deleteStatus = 'failed';
    },
    // Reset actions
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
  }
});

export const reviewActions = reviewSlice.actions;
export default reviewSlice.reducer;