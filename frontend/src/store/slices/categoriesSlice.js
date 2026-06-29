import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/categories');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки категорий');
  }
});

export const createCategory = createAsyncThunk('categories/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/categories', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка создания категории');
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data: payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка обновления категории');
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка удаления категории');
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchCategories.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createCategory.fulfilled, (state, { payload }) => { state.items.push(payload); })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex((c) => c._id === payload._id);
        if (idx !== -1) state.items[idx] = payload;
      })
      .addCase(deleteCategory.fulfilled, (state, { payload: id }) => {
        state.items = state.items.filter((c) => c._id !== id);
      });
  },
});

export default categoriesSlice.reducer;
