import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import './SettingsPage.scss';

const CURRENCY_OPTIONS = [
  { value: 'RUB', label: '₽ Рубль (RUB)' },
  { value: 'USD', label: '$ Доллар (USD)' },
  { value: 'EUR', label: '€ Евро (EUR)' },
];

export default function SettingsPage() {
  const { user, update, loading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    currency: user?.currency || 'RUB', password: '', confirmPassword: '',
  });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password && form.password !== form.confirmPassword) return setError('Пароли не совпадают');
    if (form.password && form.password.length < 6) return setError('Пароль должен быть не менее 6 символов');
    try {
      const payload = { name: form.name, email: form.email, currency: form.currency };
      if (form.password) payload.password = form.password;
      await update(payload);
      setSuccess('Данные успешно обновлены');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка обновления');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Настройки</h1>
        <p>Управление данными аккаунта</p>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card__header"><h3>Профиль пользователя</h3></div>

          <div className="settings-avatar">
            <div className="settings-avatar__circle">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="settings-avatar__name">{user?.name}</div>
              <div className="settings-avatar__email">{user?.email}</div>
            </div>
          </div>

          {error   && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <Input label="Имя" type="text" value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input label="Email" type="email" value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
            <Select label="Валюта" value={form.currency} options={CURRENCY_OPTIONS}
              onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))} />

            <div className="settings-divider"><span>Смена пароля (необязательно)</span></div>

            <Input label="Новый пароль" type="password"
              placeholder="Оставьте пустым, если не хотите менять"
              value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} />
            <Input label="Подтвердите пароль" type="password"
              placeholder="Повторите новый пароль"
              value={form.confirmPassword} onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />

            <Button type="submit" loading={loading}>Сохранить изменения</Button>
          </form>
        </div>

        <div className="card settings-info-card">
          <div className="card__header"><h3>Информация</h3></div>
          <div className="info-block">
            <div className="info-block__icon">🔒</div>
            <div>
              <div className="info-block__title">Безопасность</div>
              <div className="info-block__text">Используйте надёжный пароль не менее 6 символов.</div>
            </div>
          </div>
          <div className="info-block">
            <div className="info-block__icon">💱</div>
            <div>
              <div className="info-block__title">Валюта</div>
              <div className="info-block__text">Выбранная валюта используется для отображения сумм во всём приложении.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
