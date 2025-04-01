import { createSlice } from "@reduxjs/toolkit";
import supabase from "../../services/supabaseClient";
import { toast } from "react-toastify";

// Action creators
export function fetchOutdoorSports() {
  return async function fetchOutdoorSportsThunk(dispatch) {
    dispatch(sportsVenueActions.fetchOutdoorStart());
    try {
      const { data, error } = await supabase
        .from("sports_venues")
        .select("*")
        .eq("type", "Outdoor");

      if (error) throw error;
      dispatch(sportsVenueActions.fetchOutdoorSuccess(data));
    } catch (error) {
      dispatch(sportsVenueActions.fetchOutdoorFailure(error.message));
      toast.error("Error fetching outdoor sports");
    }
  };
}

export function fetchIndoorSports() {
  return async function fetchIndoorSportsThunk(dispatch) {
    dispatch(sportsVenueActions.fetchIndoorStart());
    try {
      const { data, error } = await supabase
        .from("sports_venues")
        .select("*")
        .eq("type", "Indoor");

      if (error) throw error;
      dispatch(sportsVenueActions.fetchIndoorSuccess(data));
    } catch (error) {
      dispatch(sportsVenueActions.fetchIndoorFailure(error.message));
      toast.error("Error fetching indoor sports");
    }
  };
}


export function fetchPlaystationSports() {
  return async function fetchPlaystationSportsThunk(dispatch) {
    dispatch(sportsVenueActions.fetchPlaystationStart());
    try {
      const { data, error } = await supabase
        .from("sports_venues")
        .select("*")
        .eq("type", "PlayStation");

      if (error) throw error;
      dispatch(sportsVenueActions.fetchPlaystationSuccess(data));
    } catch (error) {
      dispatch(sportsVenueActions.fetchPlaystationFailure(error.message));
      toast.error("Error fetching PlayStation games");
    }
  };
}

export function fetchSingleSport(id) {
  return async function fetchSingleSportThunk(dispatch) {
    dispatch(sportsVenueActions.fetchSingleStart());
    try {
      const { data, error } = await supabase
        .from("sports_venues")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      dispatch(sportsVenueActions.fetchSingleSuccess(data));
    } catch (error) {
      dispatch(sportsVenueActions.fetchSingleFailure(error.message));
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