import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://sportvenuebackend.onrender.com/api/v1/sports"; 
// Fetch Outdoor Sports
export function fetchOutdoorSports() {
  return async function (dispatch) {
    dispatch(sportsVenueActions.fetchOutdoorStart());
    try {
      const response = await axios.get(`${BASE_URL}/`);
      const outdoorGames = response.data.data.filter(
        (game) => game.type === "OUTDOOR"
      );
      dispatch(sportsVenueActions.fetchOutdoorSuccess(outdoorGames));
    } catch (error) {
      dispatch(sportsVenueActions.fetchOutdoorFailure(error.message));
      toast.error("Error fetching outdoor sports");
    }
  };
}

// Fetch Indoor Sports
export function fetchIndoorSports() {
  return async function (dispatch) {
    dispatch(sportsVenueActions.fetchIndoorStart());
    try {
      const response = await axios.get(`${BASE_URL}/`);
      const indoorGames = response.data.data.filter(
        (game) => game.type === "INDOOR"
      );
      dispatch(sportsVenueActions.fetchIndoorSuccess(indoorGames));
    } catch (error) {
      dispatch(sportsVenueActions.fetchIndoorFailure(error.message));
      toast.error("Error fetching indoor sports");
    }
  };
}

// Fetch PlayStation Sports
export function fetchPlaystationSports() {
  return async function (dispatch) {
    dispatch(sportsVenueActions.fetchPlaystationStart());
    try {
      const response = await axios.get(`${BASE_URL}/`);
      const playstationGames = response.data.data.filter(
        (game) => game.type === "PLAYSTATION"
      );
      dispatch(sportsVenueActions.fetchPlaystationSuccess(playstationGames));
    } catch (error) {
      dispatch(sportsVenueActions.fetchPlaystationFailure(error.message));
      toast.error("Error fetching PlayStation games");
    }
  };
}

// Fetch Single Sport by ID
export function fetchSingleSport(id) {
  return async function (dispatch) {
    dispatch(sportsVenueActions.fetchSingleStart());
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      dispatch(sportsVenueActions.fetchSingleSuccess(response.data.data));
    } catch (error) {
      dispatch(sportsVenueActions.fetchSingleFailure(error.message));
      toast.error("Error fetching the sport");
    }
  };
}





const initialState = {
  outdoorSports: [],
  indoorSports: [],
  playstationSports: [],
  singleSport: null,
  loading: false,
  error: null,
  outdoorStatus: 'idle',
  indoorStatus: 'idle',
  playstationStatus: 'idle',
  singleStatus: 'idle'
};

const sportsVenueSlice = createSlice({
  name: "sportsVenue",
  initialState,
  reducers: {
    // Outdoor sports actions
    fetchOutdoorStart: (state) => {
      state.loading = true;
      state.error = null;
      state.outdoorStatus = 'loading';
    },
    fetchOutdoorSuccess: (state, action) => {
      state.loading = false;
      state.outdoorSports = action.payload;
      state.outdoorStatus = 'succeeded';
    },
    fetchOutdoorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.outdoorStatus = 'failed';
    },
    // Indoor sports actions
    fetchIndoorStart: (state) => {
      state.loading = true;
      state.error = null;
      state.indoorStatus = 'loading';
    },
    fetchIndoorSuccess: (state, action) => {
      state.loading = false;
      state.indoorSports = action.payload;
      state.indoorStatus = 'succeeded';
    },
    fetchIndoorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.indoorStatus = 'failed';
    },
    // PlayStation sports actions
    fetchPlaystationStart: (state) => {
      state.loading = true;
      state.error = null;
      state.playstationStatus = 'loading';
    },
    fetchPlaystationSuccess: (state, action) => {
      state.loading = false;
      state.playstationSports = action.payload;
      state.playstationStatus = 'succeeded';
    },
    fetchPlaystationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.playstationStatus = 'failed';
    },
    // Single sport actions
    fetchSingleStart: (state) => {
      state.loading = true;
      state.error = null;
      state.singleStatus = 'loading';
    },
    fetchSingleSuccess: (state, action) => {
      state.loading = false;
      state.singleSport = action.payload;
      state.singleStatus = 'succeeded';
    },
    fetchSingleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.singleStatus = 'failed';
    },
    clearSingleSport: (state) => {
      state.singleSport = null;
      state.singleStatus = 'idle';
    },
  }
});

export const sportsVenueActions = sportsVenueSlice.actions;
export default sportsVenueSlice.reducer;