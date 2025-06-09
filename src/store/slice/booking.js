import {  createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/bookings";

// Thunks
export function fetchBookings(userId) {
  return async function (dispatch) {
    dispatch(bookingActions.fetchStart());
    try {
      const response = await axios.get(`${BASE_URL}/${userId}`);
      dispatch(bookingActions.fetchSuccess(response.data.data));
    } catch (error) {
      dispatch(bookingActions.fetchFailure(error.message));
      toast.error('Failed to fetch bookings');
    }
  };
}

export function createBooking({ venueName, date, time, name, sportVenueId }) {
  return async function (dispatch) {
    dispatch(bookingActions.createStart());
    try {
      const response = await axios.post(BASE_URL, {
        venueName,
        date,
        time,
        name,
        sportVenueId,
      });
      dispatch(bookingActions.createSuccess(response.data.data));
      toast.success('Booking created successfully!');
    } catch (error) {
      dispatch(bookingActions.createFailure(error.message));
      toast.error('Failed to create booking');
    }
  };
}

export function updateBooking({ bookingId, name, date, time }) {
  return async function (dispatch) {
    dispatch(bookingActions.updateStart());
    try {
      const response = await axios.patch(`${BASE_URL}/edit/${bookingId}`, {
        name,
        date,
        time,
      });
      dispatch(bookingActions.updateSuccess(response.data.data));
      toast.success('Booking updated successfully!');
    } catch (error) {
      dispatch(bookingActions.updateFailure(error.message));
      toast.error('Failed to update booking');
    }
  };
}

export function deleteBooking(bookingId) {
  return async function (dispatch) {
    dispatch(bookingActions.deleteStart());
    try {
      await axios.delete(`${BASE_URL}/${bookingId}`);
      dispatch(bookingActions.deleteSuccess(bookingId));
      toast.success('Booking deleted successfully!');
    } catch (error) {
      dispatch(bookingActions.deleteFailure(error.message));
      toast.error('Failed to delete booking');
    }
  };
}

export function checkAvailability({ venueName, date, time }) {
  return async function (dispatch) {
    if (!venueName || !date || !time) {
      toast.error('Invalid availability check parameters');
      return false;
    }

    dispatch(bookingActions.checkAvailabilityStart());
    try {
      const response = await axios.post(`${BASE_URL}/check-availability`, {
        venueName,
        date,
        time,
      });

      const isAvailable = response.data.isAvailable;
      dispatch(bookingActions.checkAvailabilitySuccess(isAvailable));
      return isAvailable;
    } catch (error) {
      dispatch(bookingActions.checkAvailabilityFailure(error.message));
      toast.error("Failed to check availability");
      return false;
    }
  };
};
export function fetchVenueName(venueId) {
  return async function (dispatch) {
    dispatch(bookingActions.fetchStart());
    try {
      const response = await axios.get(`${BASE_URL}/${venueId}`);
      const venueName = response.data.data.name; 
      dispatch(bookingActions.fetchNameSuccess(venueName)); 
    } catch (error) {
      dispatch(bookingActions.fetchFailure(error.message));
      toast.error("Failed to fetch venue details");
    }
  };
}





const initialState = {
  bookings: [],
  loading: false,
  error: null,
  currentBooking: null,
  isAvailable: true,
  status: {
    fetch: 'idle',
    create: 'idle',
    update: 'idle',
    delete: 'idle',
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

    fetchStart: (state) => {
      state.loading = true;
      state.status.fetch = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
      state.status.fetch = 'succeeded';
    },
    fetchNameSuccess: (state, action) => {
      state.loading = false;
      state.venueName = action.payload; 
      state.status.fetchVenueName = "succeeded";
    },

    
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.fetch = 'failed';
    },

    createStart: (state) => {
      state.loading = true;
      state.status.create = 'loading';
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

    updateStart: (state) => {
      state.loading = true;
      state.status.update = 'loading';
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.map(b =>
        b._id === action.payload._id ? action.payload : b
      );
      state.status.update = 'succeeded';
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.update = 'failed';
    },

    deleteStart: (state) => {
      state.loading = true;
      state.status.delete = 'loading';
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.filter(b => b._id !== action.payload);
      state.status.delete = 'succeeded';
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.delete = 'failed';
    },

    checkAvailabilityStart: (state) => {
      state.loading = true;
      state.status.checkAvailability = 'loading';
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

    resetStatus: (state, action) => {
      state.status[action.payload] = 'idle';
    },
  },
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
