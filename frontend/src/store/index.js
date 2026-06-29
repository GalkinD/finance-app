import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountsReducer from './slices/accountsSlice';
import categoriesReducer from './slices/categoriesSlice';
import transactionsReducer from './slices/transactionsSlice';

/**
 * Redux Store
 *
 * Хранит:
 *  - auth          — текущий пользователь (user, loading, error)
 *  - accounts      — список счетов пользователя
 *  - categories    — список категорий (доходы + расходы)
 *  - transactions  — список операций, фильтры, пагинация, аналитика
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
  },
});

export default store;
