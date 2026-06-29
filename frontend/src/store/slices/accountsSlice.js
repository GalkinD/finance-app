import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchAccounts = createAsyncThunk('accounts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/accounts');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки счетов');
  }
});

export const createAccount = createAsyncThunk('accounts/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/accounts', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка создания счёта');
  }
});

export const updateAccount = createAsyncThunk('accounts/update', async ({ id, data: payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/accounts/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка обновления счёта');
  }
});

export const deleteAccount = createAsyncThunk('accounts/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/accounts/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка удаления счёта');
  }
});

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    updateAccountBalance(state, { payload: { id, delta } }) {
      const acc = state.items.find((a) => a._id === id);
      if (acc) acc.balance += delta;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAccounts.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchAccounts.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createAccount.fulfilled, (state, { payload }) => { state.items.unshift(payload); })
      .addCase(updateAccount.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex((a) => a._id === payload._id);
        if (idx !== -1) state.items[idx] = payload;
      })
      .addCase(deleteAccount.fulfilled, (state, { payload: id }) => {
        state.items = state.items.filter((a) => a._id !== id);
      });
  },
});

export const { updateAccountBalance } = accountsSlice.actions;
export default accountsSlice.reducer;
