import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.scss';

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { if (error) setLocalError(error); }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (form.password.length < 6) return setLocalError('Пароль должен быть не менее 6 символов');
    try {
      await register(form.name, form.email, form.password);
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
        <h1 className="auth-title">Создать аккаунт</h1>
        <p className="auth-subtitle">Начните контролировать финансы</p>

        {localError && <div className="error-message">{localError}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Имя"
            type="text"
            placeholder="Ваше имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
            placeholder="Минимум 6 символов"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button type="submit" fullWidth loading={loading}>
            Зарегистрироваться
          </Button>
        </form>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
