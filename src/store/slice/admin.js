import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/admin";

const initialState = {
  games: [],
  bookings: [],
  status: {
    fetch: "idle",
    add: "idle",
    update: "idle",
    delete: "idle",
    bookingDelete: "idle",
    verify: "idle",
  },
  error: null,
  selectedGame: null,
  newGame: { name: "", type: "", description: "", price: "", imageUrl: "" },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    /* ----- STATUS RESET ----- */
    resetStatus: (state, { payload }) => {
      state.status[payload] = "idle";
    },

    /* ----- FORM STATE MANAGEMENT ----- */
    updateNewGame: (state, { payload }) => {
      state.newGame = { ...state.newGame, ...payload };
    },
    setSelectedGame: (state, { payload }) => {
      state.selectedGame = payload;
    },

    /* ----- FETCH ADMIN DATA ----- */
    fetchStart: (state) => {
      state.status.fetch = "loading";
    },
    fetchSuccess: (state, { payload }) => {
      state.status.fetch = "succeeded";
      state.games = payload.games;
      state.bookings = payload.bookings;
    },
    fetchFail: (state, { payload }) => {
      state.status.fetch = "failed";
      state.error = payload;
    },

    /* ----- ADD GAME ----- */
    addStart: (state) => {
      state.status.add = "loading";
    },
    addSuccess: (state, { payload }) => {
      state.status.add = "succeeded";
      state.games.push(payload);
      state.newGame = initialState.newGame;
    },
    addFail: (state, { payload }) => {
      state.status.add = "failed";
      state.error = payload;
    },

    /* ----- UPDATE GAME ----- */
    editStart: (state) => {
      state.status.update = "loading";
    },
    editSuccess: (state, { payload }) => {
      state.status.update = "succeeded";
      state.games = state.games.map((g) => (g._id === payload._id ? payload : g));
      state.selectedGame = null;
    },
    editFail: (state, { payload }) => {
      state.status.update = "failed";
      state.error = payload;
    },

    /* ----- DELETE GAME ----- */
    delStart: (state) => {
      state.status.delete = "loading";
    },
    delSuccess: (state, { payload }) => {
      state.status.delete = "succeeded";
      state.games = state.games.filter((g) => g._id !== payload);
    },
    delFail: (state, { payload }) => {
      state.status.delete = "failed";
      state.error = payload;
    },

    /* ----- VERIFY BOOKING ----- */
    verifyStart: (state) => {
      state.status.verify = "loading";
    },
    verifySuccess: (state, { payload }) => {
      state.status.verify = "succeeded";
      state.bookings = state.bookings.map((b) => (b._id === payload._id ? payload : b));
    },
    verifyFail: (state, { payload }) => {
      state.status.verify = "failed";
      state.error = payload;
    },

    /* ----- DELETE BOOKING ----- */
    bDelStart: (state) => {
      state.status.bookingDelete = "loading";
    },
    bDelSuccess: (state, { payload }) => {
      state.status.bookingDelete = "succeeded";
      state.bookings = state.bookings.filter((b) => b._id !== payload);
    },
    bDelFail: (state, { payload }) => {
      state.status.bookingDelete = "failed";
      state.error = payload;
    },
  },
});

export const fetchAdminData = () => async (dispatch) => {
  dispatch(adminSlice.actions.fetchStart());
  try {
    const res = await axios.get(`${BASE_URL}/data`, { withCredentials: true });
    dispatch(adminSlice.actions.fetchSuccess(res.data));
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(adminSlice.actions.fetchFail(msg));
    toast.error(msg);
  }
};

export const addGame = (game) => async (dispatch) => {
  dispatch(adminSlice.actions.addStart());
  try {
    const res = await axios.post(`${BASE_URL}/add-game`, game, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(adminSlice.actions.addSuccess(res.data.data));
    toast.success("Game added successfully!");
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(adminSlice.actions.addFail(msg));
    toast.error(msg);
  }
};

export const updateGame = ({ gameId, gameData }) => async (dispatch) => {
  dispatch(adminSlice.actions.editStart());
  try {
    const res = await axios.patch(`${BASE_URL}/edit-game/${gameId}`, gameData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(adminSlice.actions.editSuccess(res.data.data));
    toast.success("Game updated successfully!");
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(adminSlice.actions.editFail(msg));
    toast.error(msg);
  }
};

export const deleteGame = (gameId) => async (dispatch) => {
  dispatch(adminSlice.actions.delStart());
  try {
    await axios.delete(`${BASE_URL}/delete-game/${gameId}`, { withCredentials: true });
    dispatch(adminSlice.actions.delSuccess(gameId));
    toast.success("Game deleted successfully!");
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(adminSlice.actions.delFail(msg));
    toast.error(msg);
  }
};

export const verifyBooking = ({ bookingId, verified }) => async (dispatch) => {
  dispatch(adminSlice.actions.verifyStart());
  try {
    const res = await axios.patch(`${BASE_URL}/bookings/${bookingId}/verify`, { verified }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(adminSlice.actions.verifySuccess(res.data.data));
    toast.success(verified ? "Booking verified!" : "Booking rejected!");
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(adminSlice.actions.verifyFail(msg));
    toast.error(msg);
  }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  dispatch(adminSlice.actions.bDelStart());
  try {
    await axios.delete(`${BASE_URL}/bookings/${bookingId}`, { withCredentials: true });
    dispatch(adminSlice.actions.bDelSuccess(bookingId));
    toast.success("Booking deleted successfully!");
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(adminSlice.actions.bDelFail(msg));
    toast.error(msg);
  }
};

export const { resetStatus, updateNewGame, setSelectedGame } = adminSlice.actions;
export const adminActions = adminSlice.actions;
export default adminSlice.reducer;