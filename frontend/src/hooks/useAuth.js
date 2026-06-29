import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser, updateProfile } from '../store/slices/authSlice';

/**
 * Хук для работы с авторизацией.
 * Оборачивает Redux actions для удобного использования в компонентах.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const login = (email, password) => dispatch(loginUser({ email, password })).unwrap();
  const register = (name, email, password) => dispatch(registerUser({ name, email, password })).unwrap();
  const logout = () => dispatch(logoutUser());
  const update = (data) => dispatch(updateProfile(data)).unwrap();

  return { user, loading, error, login, register, logout, update };
}
