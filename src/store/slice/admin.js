import { createSlice } from '@reduxjs/toolkit';
import supabase from '../../services/supabaseClient';
import { toast } from 'react-toastify';
import { fetchIndoorSports, fetchOutdoorSports, fetchPlaystationSports } from './sportsvenue';

const initialState = {
  games: [],
  bookings: [],
  analytics: [],
  selectedGame: null,
  newGame: {
    name: '',
    description: '',
    price: '',
    image_url: '',
    type: ''
  },
  loading: false,
  error: null,
  status: {
    fetch: 'idle',
    add: 'idle',
    update: 'idle',
    delete: 'idle',
    bookingDelete: 'idle',
    verify: 'idle',
    analytics: 'idle'
  }
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedGame: (state, action) => {
      state.selectedGame = action.payload;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },
    updateNewGame: (state, action) => {
      state.newGame = {
        ...state.newGame,
        ...action.payload
      };
    },
    resetNewGame: (state) => {
      state.newGame = initialState.newGame;
    },
    // Fetch actions
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.fetch = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.games = action.payload.games;
      state.bookings = action.payload.bookings;
      state.status.fetch = 'succeeded';
      // Update analytics after fetching the data
      state.analytics = calculateAnalytics(state.bookings);
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.fetch = 'failed';
    },
    // Add actions
    addStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.add = 'loading';
    },
    addSuccess: (state, action) => {
      state.loading = false;
      state.games.push(action.payload);
      state.newGame = initialState.newGame;
      state.status.add = 'succeeded';
    },
    addFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.add = 'failed';
    },
    // Update actions
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.update = 'loading';
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.games = state.games.map(game => 
        game.id === action.payload.id ? action.payload : game
      );
      state.selectedGame = null;
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
      state.games = state.games.filter(game => game.id !== action.payload);
      state.status.delete = 'succeeded';
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.delete = 'failed';
    },
    // Booking Delete actions
    bookingDeleteStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.bookingDelete = 'loading';
    },
     bookingDeleteSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.filter(
        booking => booking.booking_id !== action.payload
      );
      state.status.bookingDelete = 'succeeded';
      // Update analytics immediately after deleting a booking
      state.analytics = calculateAnalytics(state.bookings);
      toast.success('Booking deleted successfully!'); 
      state.status.bookingDelete = 'succeeded';
    },
    updateAnalytics: (state) => {
      state.analytics = calculateAnalytics(state.bookings);
    },

    bookingDeleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.bookingDelete = 'failed';
    },
    // Verify actions
    verifyStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.verify = 'loading';
    },
    verifySuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.map(booking =>
        booking.booking_id === action.payload.booking_id ? action.payload : booking
      );
      state.status.verify = 'succeeded';
    },
    verifyFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.verify = 'failed';
    },
    // Analytics actions
    analyticsStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.analytics = 'loading';
    },
    analyticsSuccess: (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
      state.status.analytics = 'succeeded';
    },
    analyticsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.analytics = 'failed';
    },
    // Reset actions
    resetStatus: (state, action) => {
      state.status[action.payload] = 'idle';
    }
  }
});

export const fetchAdminData = () => async (dispatch) => {
  dispatch(adminActions.fetchStart());
  try {
    const [gamesResult, bookingsResult] = await Promise.all([
      supabase.from('sports_venues').select('*'),
      supabase.from('bookings').select('*'),
    ]);

    if (gamesResult.error) throw gamesResult.error;
    if (bookingsResult.error) throw bookingsResult.error;

    dispatch(adminActions.fetchSuccess({
      games: gamesResult.data,
      bookings: bookingsResult.data,
    }));
  } catch (error) {
    dispatch(adminActions.fetchFailure(error.message));
    toast.error('Failed to fetch admin data');
  }
};

export const addGame = (gameData) => async (dispatch) => {
  dispatch(adminActions.addStart());
  try {
    const { data, error } = await supabase
      .from('sports_venues')
      .insert([gameData])
      .select();

    if (error) throw error;
    dispatch(adminActions.addSuccess(data[0]));

    if (gameData.type === 'Indoor') {
      dispatch(fetchIndoorSports());
    } else if (gameData.type === 'Outdoor') {
      dispatch(fetchOutdoorSports());
    } else if (gameData.type === 'PlayStation') {
      dispatch(fetchPlaystationSports());
    }

    toast.success('Game added successfully!');
  } catch (error) {
    dispatch(adminActions.addFailure(error.message));
    toast.error('Failed to add game');
  }
};

export const updateGame = ({ gameId, gameData }) => async (dispatch) => {
  dispatch(adminActions.updateStart());
  try {
    const { data, error } = await supabase
      .from('sports_venues')
      .update(gameData)
      .eq('id', gameId)
      .select();

    if (error) throw error;
    dispatch(adminActions.updateSuccess(data[0]));

    if (gameData.type === 'Indoor') {
      dispatch(fetchIndoorSports());
    } else if (gameData.type === 'Outdoor') {
      dispatch(fetchOutdoorSports());
    } else if (gameData.type === 'PlayStation') {
      dispatch(fetchPlaystationSports());
    }

    toast.success('Game updated successfully!');
  } catch (error) {
    dispatch(adminActions.updateFailure(error.message));
    toast.error('Failed to update game');
  }
};

export const deleteGame = (gameId, gameType) => async (dispatch) => {
  dispatch(adminActions.deleteStart());
  try {
    const { error } = await supabase
      .from('sports_venues')
      .delete()
      .eq('id', gameId);

    if (error) throw error;
    dispatch(adminActions.deleteSuccess(gameId));

    if (gameType === 'Indoor') {
      dispatch(fetchIndoorSports());
    } else if (gameType === 'Outdoor') {
      dispatch(fetchOutdoorSports());
    } else if (gameType === 'PlayStation') {
      dispatch(fetchPlaystationSports());
    }

    toast.success('Game deleted successfully!');
  } catch (error) {
    dispatch(adminActions.deleteFailure(error.message));
    toast.error('Failed to delete game');
  }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  dispatch(adminActions.bookingDeleteStart());
  try {
    dispatch(adminActions.bookingDeleteSuccess(bookingId));
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('booking_id', bookingId);

    if (error) throw error;
    
    toast.success('Booking deleted successfully!');
    return true;
  } catch (error) {
    dispatch(adminActions.bookingDeleteFailure(error.message));
    dispatch(fetchAdminData());
    toast.error('Failed to delete booking');
    return false;
  }
};

export const verifyBooking = ({ bookingId, verified }) => async (dispatch) => {
  dispatch(adminActions.verifyStart());
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ verified })
      .eq('booking_id', bookingId)
      .select();

    if (error) throw error;
    dispatch(adminActions.verifySuccess(data[0]));
    toast.success('Booking status updated!');
  } catch (error) {
    dispatch(adminActions.verifyFailure(error.message));
    toast.error('Failed to update booking');
  }
};

export const calculateAnalytics = (bookings) => {
  const bookingCounts = bookings.reduce((acc, booking) => {
    acc[booking.venue_name] = (acc[booking.venue_name] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(bookingCounts).map((venue) => ({
    venue,
    bookings: bookingCounts[venue],
  }));
}

export const fetchBookingAnalytics = () => (dispatch, getState) => {
  dispatch(adminActions.analyticsStart());
  try {
    const { bookings } = getState().admin;
    const bookingCounts = bookings.reduce((acc, booking) => {
      acc[booking.venue_name] = (acc[booking.venue_name] || 0) + 1;
      return acc;
    }, {});

    const analyticsData = Object.keys(bookingCounts).map((venue) => ({
      venue,
      bookings: bookingCounts[venue],
    }));

    dispatch(adminActions.analyticsSuccess(analyticsData));
  } catch (error) {
    dispatch(adminActions.analyticsFailure(error.message));
  }
};

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;