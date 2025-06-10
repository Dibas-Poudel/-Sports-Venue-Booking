import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'https://sportvenuebackend.onrender.com/api/v1/reviews';

export const fetchReviews = (venueId) => async (dispatch) => {
  dispatch(reviewActions.fetchStart());
  try {
    const response = await axios.get(`${API_BASE}/venue/${venueId}`, {
      withCredentials: true,
    });

    console.log("Fetched reviews:", response.data);

    dispatch(reviewActions.fetchSuccess(response.data)); 
  } catch (error) {
    console.error("Fetch Reviews Error:", error.response?.data || error.message);
    dispatch(reviewActions.fetchFailure(error.response?.data?.message || error.message));
    toast.error("Failed to fetch reviews");
  }
};

export const addReview = ({ venueId, rating, comment }) => async (dispatch) => {
  dispatch(reviewActions.addStart());
  try {
    await axios.post(`${API_BASE}/create/${venueId}`, { rating, comment }, { withCredentials: true });
    dispatch(fetchReviews(venueId));
    dispatch(reviewActions.addSuccess());
    toast.success('Review added successfully');
  } catch (error) {
    console.error("Add Review Error:", error.response?.data || error.message);
    dispatch(reviewActions.addFailure(error.response?.data?.message || error.message));
    toast.error('Failed to add review');
  }
};

export const updateReview = ({ reviewId, venueId, rating, comment }) => async (dispatch) => {
  dispatch(reviewActions.updateStart());
  try {
    await axios.patch(`${API_BASE}/edit/${reviewId}`, { rating, comment }, { withCredentials: true });
    dispatch(fetchReviews(venueId));
    dispatch(reviewActions.updateSuccess());
    toast.success('Review updated successfully');
  } catch (error) {
    console.error("Update Review Error:", error.response?.data || error.message);
    dispatch(reviewActions.updateFailure(error.response?.data?.message || error.message));
    toast.error('Failed to update review');
  }
};

export const deleteReview = ({ reviewId, venueId }) => async (dispatch) => {
  dispatch(reviewActions.deleteStart());
  try {
    await axios.delete(`${API_BASE}/delete/${reviewId}`, { withCredentials: true });
    dispatch(fetchReviews(venueId));
    dispatch(reviewActions.deleteSuccess());
    toast.success('Review deleted successfully');
  } catch (error) {
    console.error("Delete Review Error:", error.response?.data || error.message);
    dispatch(reviewActions.deleteFailure(error.response?.data?.message || error.message));
    toast.error('Failed to delete review');
  }
};

const initialState = {
  items: [], 
  loading: false,
  error: null,
  currentReview: null,
  fetchStatus: 'idle',
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
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
    fetchStart: (state) => { state.loading = true; state.fetchStatus = 'loading'; },
    fetchSuccess: (state, action) => { state.loading = false; state.items = action.payload || []; state.fetchStatus = 'succeeded'; },
    fetchFailure: (state, action) => { state.loading = false; state.error = action.payload; state.fetchStatus = 'failed'; },
    addStart: (state) => { state.loading = true; state.addStatus = 'loading'; },
    addSuccess: (state) => { state.loading = false; state.addStatus = 'succeeded'; },
    addFailure: (state, action) => { state.loading = false; state.error = action.payload; state.addStatus = 'failed'; },
    updateStart: (state) => { state.loading = true; state.updateStatus = 'loading'; },
    updateSuccess: (state) => { state.loading = false; state.updateStatus = 'succeeded'; },
    updateFailure: (state, action) => { state.loading = false; state.error = action.payload; state.updateStatus = 'failed'; },
    deleteStart: (state) => { state.loading = true; state.deleteStatus = 'loading'; },
    deleteSuccess: (state) => { state.loading = false; state.deleteStatus = 'succeeded'; },
    deleteFailure: (state, action) => { state.loading = false; state.error = action.payload; state.deleteStatus = 'failed'; },
    resetAddStatus: (state) => { state.addStatus = 'idle'; },
    resetUpdateStatus: (state) => { state.updateStatus = 'idle'; },
    resetDeleteStatus: (state) => { state.deleteStatus = 'idle'; },
  },
});

export const reviewActions = reviewSlice.actions;
export default reviewSlice.reducer;