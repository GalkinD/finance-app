import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── Thunks ────────────────────────────────────────────────────

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка входа');
  }
});

export const registerUser = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка регистрации');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/user/profile', payload);
    // Обновляем токен в localStorage
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...stored, ...data }));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ошибка обновления');
  }
});

// ── Slice ─────────────────────────────────────────────────────

const initialUser = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: initialUser, loading: false, error: null },
  reducers: {
    logoutUser(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, { payload }) => { state.loading = false; state.user = payload; })
      .addCase(loginUser.rejected, rejected)

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, { payload }) => { state.loading = false; state.user = payload; })
      .addCase(registerUser.rejected, rejected)

      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = { ...state.user, ...payload };
      })
      .addCase(updateProfile.rejected, rejected);
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
