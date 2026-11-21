import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for hotel API calls
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().hotels;
      const offset = (filters.page - 1) * filters.limit;

      const params = {
        limit: filters.limit,
        offset: offset,
      };

      if (filters.search) params.search = filters.search;
      if (filters.minPrice !== '') params.minPrice = filters.minPrice;
      if (filters.maxPrice !== '') params.maxPrice = filters.maxPrice;

      const response = await axios.get('/api/hotels', { params });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

export const addHotel = createAsyncThunk(
  'hotels/addHotel',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/hotels', formData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/hotels/${id}`, formData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/hotels/${id}`);
      return id;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 6,
  },
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters.search = '';
      state.filters.minPrice = '';
      state.filters.maxPrice = '';
      state.filters.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add hotel
      .addCase(addHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update hotel
      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete hotel
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((hotel) => hotel.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, setPriceRange, setPage, resetFilters, clearError } = hotelsSlice.actions;
export default hotelsSlice.reducer;

