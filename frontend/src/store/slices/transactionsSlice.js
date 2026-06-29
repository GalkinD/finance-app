import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async ({ page = 1, filters = {} }, { rejectWithValue }) => {
    try {
      const params = { page, limit: 10, ...filters };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/transactions', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки операций');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'transactions/fetchAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions/analytics', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка аналитики');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/transactions', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка создания операции');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data: payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/transactions/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка обновления операции');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления операции');
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    filters: { type: '', account: '', category: '', dateFrom: '', dateTo: '' },
    analytics: null,
    loading: false,
    analyticsLoading: false,
    error: null,
  },
  reducers: {
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload };
    },
    setPage(state, { payload }) {
      state.currentPage = payload;
    },
    clearFilters(state) {
      state.filters = { type: '', account: '', category: '', dateFrom: '', dateTo: '' };
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload.transactions;
        state.total = payload.total;
        state.pages = payload.pages;
        state.currentPage = payload.page;
      })
      .addCase(fetchTransactions.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchAnalytics.pending, (state) => { state.analyticsLoading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, { payload }) => { state.analyticsLoading = false; state.analytics = payload; })
      .addCase(fetchAnalytics.rejected, (state) => { state.analyticsLoading = false; });
  },
});

export const { setFilters, setPage, clearFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;
