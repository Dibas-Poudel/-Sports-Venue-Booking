import { createSlice } from '@reduxjs/toolkit';
import supabase from '../../services/supabaseClient';
import { toast } from 'react-toastify';

// Action creators
export function fetchBookings(userId) {
  return async function fetchBookingsThunk(dispatch) {
    dispatch(bookingActions.fetchStart());
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error) throw error;
      dispatch(bookingActions.fetchSuccess(data));
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
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ user_id: userId, venue_name: venueName, date, time, name }])
        .select();

      if (error) throw error;
      dispatch(bookingActions.createSuccess(data[0]));
      toast.success('Booking created successfully!');
      return data[0];
    } catch (error) {
      dispatch(bookingActions.createFailure(error.message));
      toast.error('Failed to create booking');
      throw error;
    }
  };
}

export function updateBooking({ bookingId, venueName, date, time }) {
  return async function updateBookingThunk(dispatch) {
    dispatch(bookingActions.updateStart());
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ venue_name: venueName, date, time })
        .eq('booking_id', bookingId)
        .select();

      if (error) throw error;
      dispatch(bookingActions.updateSuccess(data[0]));
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
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('booking_id', bookingId);

      if (error) throw error;
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
    dispatch(bookingActions.checkAvailabilityStart());
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('venue_name', venueName)
        .eq('date', date)
        .eq('time', time);

      if (error) throw error;
      dispatch(bookingActions.checkAvailabilitySuccess(data.length === 0));
    } catch (error) {
      dispatch(bookingActions.checkAvailabilityFailure(error.message));
    }
  };
}

export function fetchVenueName(venueId) {
  return async function fetchVenueNameThunk(dispatch) {
    dispatch(bookingActions.fetchVenueNameStart());
    try {
      const { data, error } = await supabase
        .from('sports_venues')
        .select('name')
        .eq('id', venueId)
        .single();

      if (error) throw error;
      dispatch(bookingActions.fetchVenueNameSuccess(data?.name));
    } catch (error) {
      dispatch(bookingActions.fetchVenueNameFailure(error.message));
    }
  };
}

const initialState = {
  bookings: [],
  venueName: '',
  isAvailable: true,
  loading: false,
  error: null,
  currentBooking: null,
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
    // Reset actions
    resetStatus: (state, action) => {
      state.status[action.payload] = 'idle';
    }
  }
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;