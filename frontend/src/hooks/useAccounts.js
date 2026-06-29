import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from '../store/slices/accountsSlice';

export function useAccounts() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const addAccount    = (data)       => dispatch(createAccount(data)).unwrap();
  const editAccount   = (id, data)   => dispatch(updateAccount({ id, data })).unwrap();
  const removeAccount = (id)         => dispatch(deleteAccount(id)).unwrap();
  const reload        = ()           => dispatch(fetchAccounts());

  const totalBalance = items.reduce((s, a) => s + a.balance, 0);

  return { accounts: items, loading, error, totalBalance, addAccount, editAccount, removeAccount, reload };
}
