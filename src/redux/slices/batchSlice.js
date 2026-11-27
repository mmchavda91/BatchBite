import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBatches as apiGetBatches } from '../../services/api';

export const fetchBatchesAsync = createAsyncThunk(
  'batches/fetchBatches',
  async (params, { rejectWithValue }) => {
    try {
      const res = await apiGetBatches(params || { status: 'active' });
      const list = res.data.data?.batches || res.data.batches || [];
      return list;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load batches');
    }
  }
);

const initialState = {
  batches: [],
  selectedCategory: 'All',
  searchTerm: '',
  loading: false,
  error: null,
};

const batchSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatchesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategory, setSearchTerm } = batchSlice.actions;

export const selectBatches = (state) => state.batches.batches;
export const selectBatchesLoading = (state) => state.batches.loading;
export const selectSelectedCategory = (state) => state.batches.selectedCategory;
export const selectSearchTerm = (state) => state.batches.searchTerm;

export default batchSlice.reducer;
