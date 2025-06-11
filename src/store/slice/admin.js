import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/admin";

const initialState = {
  games: [],
  bookings: [],
  loading: false,
  error: null,
  verifying: false,
  deleting: false,
  status: {
    fetch: 'idle',
    add: 'idle',
    update: 'idle',
    delete: 'idle',
    bookingDelete: 'idle',
    verify: 'idle',
  },
  selectedGame: null,
  newGame: {
    name: '',
    type: '',
    description: '',
    price: '',
    image_url: '',
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Status reset action for UI convenience
    resetStatus: (state, action) => {
      const key = action.payload;
      if (state.status[key]) {
        state.status[key] = 'idle';
      }
    },

    updateNewGame: (state, action) => {
      state.newGame = { ...state.newGame, ...action.payload };
    },

    setSelectedGame: (state, action) => {
      state.selectedGame = action.payload;
    },

    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },

    fetchAdminStart: (state) => {
      state.loading = true;
      state.error = null;
      state.status.fetch = 'loading';
    },
    fetchAdminSuccess: (state, action) => {
      state.loading = false;
      state.games = action.payload.games;
      state.bookings = action.payload.bookings;
      state.status.fetch = 'succeeded';
    },
    fetchAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status.fetch = 'failed';
    },

    verifyStart: (state) => {
      state.verifying = true;
      state.error = null;
      state.status.verify = 'loading';
    },
    verifySuccess: (state, action) => {
      state.verifying = false;
      const updatedBooking = action.payload;
      state.bookings = state.bookings.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      );
      state.status.verify = 'succeeded';
    },
    verifyFailure: (state, action) => {
      state.verifying = false;
      state.error = action.payload;
      state.status.verify = 'failed';
    },

    bookingDeleteStart: (state) => {
      state.deleting = true;
      state.error = null;
      state.status.bookingDelete = 'loading';
    },
    bookingDeleteSuccess: (state, action) => {
      state.deleting = false;
      const deletedId = action.payload;
      state.bookings = state.bookings.filter((b) => b._id !== deletedId);
      state.status.bookingDelete = 'succeeded';
    },
    bookingDeleteFailure: (state, action) => {
      state.deleting = false;
      state.error = action.payload;
      state.status.bookingDelete = 'failed';
    },

    addGameStart: (state) => {
      state.status.add = 'loading';
      state.error = null;
    },
    addGameSuccess: (state, action) => {
      state.games.push(action.payload);
      state.status.add = 'succeeded';
      state.newGame = { name: '', type: '', description: '', price: '', image_url: '' };
    },
    addGameFailure: (state, action) => {
      state.error = action.payload;
      state.status.add = 'failed';
    },

    editGameStart: (state) => {
      state.status.update = 'loading';
      state.error = null;
    },
    editGameSuccess: (state, action) => {
      const updated = action.payload;
      state.games = state.games.map((game) =>
        game._id === updated._id ? updated : game
      );
      state.status.update = 'succeeded';
      state.selectedGame = null;
    },
    editGameFailure: (state, action) => {
      state.error = action.payload;
      state.status.update = 'failed';
    },

    deleteGameStart: (state) => {
      state.status.delete = 'loading';
      state.error = null;
    },
    deleteGameSuccess: (state, action) => {
      const deletedId = action.payload;
      state.games = state.games.filter((g) => g._id !== deletedId);
      state.status.delete = 'succeeded';
    },
    deleteGameFailure: (state, action) => {
      state.error = action.payload;
      state.status.delete = 'failed';
    },
  },
});

// Thunks

export const fetchAdminData = () => async (dispatch) => {
  dispatch(adminSlice.actions.fetchAdminStart());
  try {
    const res = await axios.get(`${BASE_URL}/data`, { withCredentials: true });
    dispatch(adminSlice.actions.fetchAdminSuccess(res.data));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(adminSlice.actions.fetchAdminFailure(message));
    toast.error('Failed to fetch admin data');
  }
};

export const verifyBooking = ({ bookingId, verified }) => async (dispatch) => {
  dispatch(adminSlice.actions.verifyStart());
  try {
    const res = await axios.patch(
      `${BASE_URL}/${bookingId}/verify`,
      { verified },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    dispatch(adminSlice.actions.verifySuccess(res.data.data));
    toast.success(`Booking ${verified ? 'verified' : 'rejected'} successfully!`);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(adminSlice.actions.verifyFailure(message));
    toast.error('Failed to update booking');
  }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  dispatch(adminSlice.actions.bookingDeleteStart());
  try {
    await axios.delete(`${BASE_URL}/${bookingId}`, { withCredentials: true });
    dispatch(adminSlice.actions.bookingDeleteSuccess(bookingId));
    toast.success('Booking deleted successfully!');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(adminSlice.actions.bookingDeleteFailure(message));
    toast.error('Failed to delete booking');
  }
};

export const addGame = (gameData) => async (dispatch) => {
  dispatch(adminSlice.actions.addGameStart());
  try {
    const res = await axios.post(`${BASE_URL}/add-game`, gameData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(adminSlice.actions.addGameSuccess(res.data.data));
    toast.success('Game added successfully!');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(adminSlice.actions.addGameFailure(message));
    toast.error('Failed to add game');
  }
};

export const updateGame = ({ gameId, gameData }) => async (dispatch) => {
  dispatch(adminSlice.actions.editGameStart());
  try {
    const res = await axios.patch(
      `${BASE_URL}/edit-game/${gameId}`,
      gameData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    dispatch(adminSlice.actions.editGameSuccess(res.data.data));
    toast.success('Game updated successfully!');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(adminSlice.actions.editGameFailure(message));
    toast.error('Failed to update game');
  }
};

export const deleteGame = (gameId) => async (dispatch) => {
  dispatch(adminSlice.actions.deleteGameStart());
  try {
    await axios.delete(`${BASE_URL}/delete-game/${gameId}`, {
      withCredentials: true,
    });
    dispatch(adminSlice.actions.deleteGameSuccess(gameId));
    toast.success('Game deleted successfully!');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(adminSlice.actions.deleteGameFailure(message));
    toast.error('Failed to delete game');
  }
};

export const {
  resetStatus,
  updateNewGame,
  setSelectedGame,
  clearSelectedGame,
} = adminSlice.actions;

export const adminActions = adminSlice.actions;


export default adminSlice.reducer;
