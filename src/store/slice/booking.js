import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/bookings"
// Action creators
export function fetchBookings(userId) {
  return async function fetchBookingsThunk(dispatch) {
    dispatch(bookingActions.fetchStart());
    try {
      const response = await axios.get(`${BASE_URL}/${userId}`);
      dispatch(bookingActions.fetchSuccess(response.data.data)); // adjust if your backend response shape differs
    } catch (error) {
      dispatch(bookingActions.fetchFailure(error.message));
      toast.error('Failed to fetch bookings');
    }
  };
}


export function createBooking({ userId, venueName, date, time, name }) {
  return async function createBookingThunk(dispatch) {
    dispatch(bookingActions.createStart());
    try {
      const response = await axios.post(BASE_URL, {
        userId,
        venue_name: venueName,
        date,
        time,
        name,
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
  return async function updateBookingThunk(dispatch) {
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
  return async function deleteBookingThunk(dispatch) {
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
  return async function checkAvailabilityThunk(dispatch) {
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

      const isAvailable = response.data.isAvailable; // boolean returned from backend
      dispatch(bookingActions.checkAvailabilitySuccess(isAvailable));
      return isAvailable;
    } catch (error) {
      console.error("Availability check failed:", error.message);
      dispatch(bookingActions.checkAvailabilityFailure(error.message));
      toast.error("Failed to check availability");
      return false;
    }
  };
}
export function fetchVenueName(venueId) {
  return async function fetchVenueNameThunk(dispatch) {
    if (!venueId) {
      toast.error("Venue ID is missing");
      return null;
    }

    dispatch(bookingActions.fetchVenueNameStart());

    try {
      const response = await axios.get(`https://sportvenuebackend.onrender.com/api/v1/venues/${venueId}`);
      const venueName = response.data?.data?.name;

      dispatch(bookingActions.fetchVenueNameSuccess(venueName));
      return venueName;
    } catch (error) {
      console.error("Fetch venue name failed:", error.message);
      dispatch(bookingActions.fetchVenueNameFailure(error.message));
      toast.error("Failed to fetch venue name");
      return null;
    }
  };
}


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
    checkAvailability: 'idle',
    fetchVenueName: 'idle'
  }
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Current booking management
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setUpdatedBooking: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload
      };
    },

    // Fetch actions
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.fetch = 'loading';
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

    // Create actions
    createStart: (state) => {
      state.loading = true;
      state.error = null;
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

    // Update actions
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.update = 'loading';
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.map(booking =>
        booking.booking_id === action.payload.booking_id ? action.payload : booking
      );
      state.currentBooking = null;
      state.status.update = 'succeeded';
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.update = 'failed';
    },

    // Delete actions
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.delete = 'loading';
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.filter(
        booking => booking.booking_id !== action.payload
      );
      state.status.delete = 'succeeded';
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.delete = 'failed';
    },

    // Check availability actions
    checkAvailabilityStart: (state) => {
      state.loading = true;
      state.error = null;
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

    // Fetch venue name actions
    fetchVenueNameStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.fetchVenueName = 'loading';
    },
    fetchVenueNameSuccess: (state, action) => {
      state.loading = false;
      state.venueName = action.payload;
      state.status.fetchVenueName = 'succeeded';
    },
    fetchVenueNameFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.fetchVenueName = 'failed';
    },

    // Reset status
    resetStatus: (state, action) => {
      state.status[action.payload] = 'idle';
    }
  }
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;