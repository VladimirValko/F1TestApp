import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/ergastApi';
import { RootState } from '../store';

interface RaceResult {
  season: string;
  round: string;
  raceName: string;
  date: string;
  Results: {
    position: string;
    Driver: {
      driverId: string;
      givenName: string;
      familyName: string;
    };
    Constructor: {
      constructorId: string;
      name: string;
    };
    laps: string;
    grid: string;
    status: string;
  }[];
}

interface RacesState {
  races: RaceResult[];
  loading: boolean;
  error: string | null;
}

const initialState: RacesState = {
  races: [],
  loading: false,
  error: null,
};

export const fetchRacesByDriver = createAsyncThunk<
  RaceResult[],
  { driverId: string; limit?: number; offset?: number },
  { rejectValue: string }
>(
  'races/fetchRacesByDriver',
  async ({ driverId, limit = 30, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/drivers/${driverId}/results.json?limit=${limit}&offset=${offset}`,
      );
      const data = response.data.MRData.RaceTable.Races;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const racesSlice = createSlice({
  name: 'races',
  initialState,
  reducers: {
    clearRaces(state) {
      state.races = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRacesByDriver.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRacesByDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.races = action.payload;
      })
      .addCase(fetchRacesByDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load races';
      });
  },
});

export const selectRaces = (state: RootState) => state.races.races;
export const selectRacesLoading = (state: RootState) => state.races.loading;
export const selectRacesError = (state: RootState) => state.races.error;

export const { clearRaces } = racesSlice.actions;
export default racesSlice.reducer;
