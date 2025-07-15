import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/bookings";

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  currentBooking: null,
  isAvailable: true,
  venueName: '',
  status: {
    fetch: 'idle',
    create: 'idle',
    update: 'idle',
    delete: 'idle',
    fetchVenueName: 'idle',
    checkAvailability: 'idle',
  },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setUpdatedBooking: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload,
      };
    },

    resetStatus: (state, action) => {
      state.status[action.payload] = 'idle';
      state.error = null;
    },

    // fetch bookings
    fetchStart: (state) => {
      state.loading = true;
      state.status.fetch = 'loading';
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
      state.status.fetch = 'succeeded';
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.fetch = 'failed';
    },

    // create booking
    createStart: (state) => {
      state.loading = true;
      state.status.create = 'loading';
      state.error = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      state.bookings.push(action.payload);
      state.status.create = 'succeeded';
    },
    createFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.create = 'failed';
    },

    // update booking
    updateStart: (state) => {
      state.loading = true;
      state.status.update = 'loading';
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.map((b) =>
        b._id === action.payload._id ? action.payload : b
      );
      state.status.update = 'succeeded';
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.update = 'failed';
    },

    // delete booking
    deleteStart: (state) => {
      state.loading = true;
      state.status.delete = 'loading';
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      state.status.delete = 'succeeded';
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.delete = 'failed';
    },

    // check availability
    checkAvailabilityStart: (state) => {
      state.loading = true;
      state.status.checkAvailability = 'loading';
      state.error = null;
    },
    checkAvailabilitySuccess: (state, action) => {
      state.loading = false;
      state.isAvailable = action.payload;
      state.status.checkAvailability = 'succeeded';
    },
    checkAvailabilityFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.checkAvailability = 'failed';
    },

    // fetch venue name
    fetchNameStart: (state) => {
      state.loading = true;
      state.status.fetchVenueName = 'loading';
      state.error = null;
    },
    fetchNameSuccess: (state, action) => {
      state.loading = false;
      state.venueName = action.payload;
      state.status.fetchVenueName = 'succeeded';
    },
    fetchNameFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.fetchVenueName = 'failed';
    },
  },
});

export const fetchBookings = () => async (dispatch) => {
  dispatch(bookingSlice.actions.fetchStart());
  try {
    const res = await axios.get(`${BASE_URL}/fetch`, { withCredentials: true });
    dispatch(bookingSlice.actions.fetchSuccess(res.data.data));
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(bookingSlice.actions.fetchFailure(msg));
    toast.error(msg);
  }
};

export function createBooking({ venueName, date, time, name }) {
  return async function (dispatch) {
    dispatch(bookingActions.createStart());
    try {
      const response = await axios.post(`${BASE_URL}/`, { venueName, date, time, name }, { withCredentials: true });
      dispatch(bookingActions.createSuccess(response.data.data));
      toast.success('Booking created successfully!');
      return response.data.data; // Return success data explicitly
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      dispatch(bookingActions.createFailure(errorMsg));
      toast.error(errorMsg);
      throw error;  // **Throw here to reject `.unwrap()`**
    }
  };
}


export const updateBooking = ({ bookingId, name, date, time }) => async (dispatch) => {
  dispatch(bookingSlice.actions.updateStart());
  try {
    const res = await axios.patch(
      `${BASE_URL}/edit/${bookingId}`,
      { name, date, time },
      { withCredentials: true }
    );
    dispatch(bookingSlice.actions.updateSuccess(res.data.data));
    toast.success('Booking updated successfully!');
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(bookingSlice.actions.updateFailure(msg));
    toast.error(msg);
  }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  dispatch(bookingSlice.actions.deleteStart());
  try {
    await axios.delete(`${BASE_URL}/delete/${bookingId}`, { withCredentials: true });
    dispatch(bookingSlice.actions.deleteSuccess(bookingId));
    toast.success('Booking deleted successfully!');
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(bookingSlice.actions.deleteFailure(msg));
    toast.error(msg);
  }
};

export const checkAvailability = ({ venueName, date, time }) => async (dispatch) => {
  if (!venueName || !date || !time) {
    toast.error('Invalid availability check parameters');
    return false;
  }

  dispatch(bookingSlice.actions.checkAvailabilityStart());
  try {
    const res = await axios.post(`${BASE_URL}/check-availability`, { venueName, date, time });
    const isAvailable = res.data.isAvailable;
    dispatch(bookingSlice.actions.checkAvailabilitySuccess(isAvailable));
    return isAvailable;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(bookingSlice.actions.checkAvailabilityFailure(msg));
    toast.error("Failed to check availability");
    return false;
  }
};

export const fetchVenueName = (venueId) => async (dispatch) => {
  dispatch(bookingSlice.actions.fetchNameStart());
  try {
    const res = await axios.get(`${BASE_URL}/${venueId}`);
    const venueName = res.data.data.name;
    dispatch(bookingSlice.actions.fetchNameSuccess(venueName));
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(bookingSlice.actions.fetchNameFailure(msg));
    toast.error("Failed to fetch venue details");
  }
};

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
