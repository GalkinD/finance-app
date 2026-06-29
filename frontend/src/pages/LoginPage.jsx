import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.scss';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { if (error) setLocalError(error); }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setLocalError(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo__icon">₽</div>
          <div className="auth-logo__text">ФинансыПро</div>
        </div>
        <h1 className="auth-title">Добро пожаловать</h1>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>

        {localError && <div className="error-message">{localError}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button type="submit" fullWidth loading={loading}>
            Войти
          </Button>
        </form>

        <p className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
