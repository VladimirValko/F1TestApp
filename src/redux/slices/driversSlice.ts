import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/ergastApi';
import { RootState } from '../store';

interface Driver {
  driverId: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  url: string;
}

interface DriversState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  limit: number;
  offset: number;
  total: number;
}

const initialState: DriversState = {
  drivers: [],
  loading: false,
  error: null,
  limit: 30,
  offset: 0,
  total: 0,
};

export const fetchDrivers = createAsyncThunk<
  { drivers: Driver[]; total: number; offset: number },
  { limit?: number; offset?: number },
  { rejectValue: string }
>(
  'drivers/fetchDrivers',
  async ({ limit = 30, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/drivers.json?limit=${limit}&offset=${offset}`,
      );
      const data = response.data.MRData;
      const total = parseInt(data.total, 10);
      const drivers = data.DriverTable.Drivers;
      return { drivers, total, offset };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDrivers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.drivers;
        state.total = action.payload.total;
        state.offset = action.payload.offset;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load drivers';
      });
  },
});

export const selectDrivers = (state: RootState) => state.drivers.drivers;
export const selectDriversLoading = (state: RootState) => state.drivers.loading;
export const selectDriversError = (state: RootState) => state.drivers.error;
export const selectDriversOffset = (state: RootState) => state.drivers.offset;
export const selectDriversLimit = (state: RootState) => state.drivers.limit;
export const selectDriversTotal = (state: RootState) => state.drivers.total;

export const { setOffset } = driversSlice.actions;
export default driversSlice.reducer;
