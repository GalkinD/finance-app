import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categoriesSlice';

export function useCategories() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const addCategory    = (data)     => dispatch(createCategory(data)).unwrap();
  const editCategory   = (id, data) => dispatch(updateCategory({ id, data })).unwrap();
  const removeCategory = (id)       => dispatch(deleteCategory(id)).unwrap();
  const reload         = ()         => dispatch(fetchCategories());

  const incomeCategories  = items.filter((c) => c.type === 'income');
  const expenseCategories = items.filter((c) => c.type === 'expense');

  return {
    categories: items,
    incomeCategories,
    expenseCategories,
    loading,
    error,
    addCategory,
    editCategory,
    removeCategory,
    reload,
  };
}
