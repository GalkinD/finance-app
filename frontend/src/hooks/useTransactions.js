import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransactions,
  fetchAnalytics,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  setPage,
  clearFilters,
} from '../store/slices/transactionsSlice';

export function useTransactions() {
  const dispatch = useDispatch();
  const {
    items, total, pages, currentPage,
    filters, analytics, loading, analyticsLoading, error,
  } = useSelector((state) => state.transactions);

  const load = useCallback(() => {
    dispatch(fetchTransactions({ page: currentPage, filters }));
  }, [dispatch, currentPage, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const addTransaction    = (data)     => dispatch(createTransaction(data)).unwrap();
  const editTransaction   = (id, data) => dispatch(updateTransaction({ id, data })).unwrap();
  const removeTransaction = (id)       => dispatch(deleteTransaction(id)).unwrap();

  const applyFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
    dispatch(setPage(1));
  };

  const goToPage = (page) => dispatch(setPage(page));

  const loadAnalytics = useCallback(
    (params = {}) => dispatch(fetchAnalytics(params)),
    [dispatch]
  );

  return {
    transactions: items,
    total, pages, currentPage,
    filters, analytics,
    loading, analyticsLoading, error,
    addTransaction, editTransaction, removeTransaction,
    applyFilters, resetFilters, goToPage,
    loadAnalytics, reload: load,
  };
}
