import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAccounts } from '../../store/slices/accountsSlice';
import { createAccount, updateAccount, deleteAccount } from '../../store/slices/accountsSlice';
import Button from './Button';
import Input  from './Input';
import Select from './Select';
import { ACCOUNT_TYPES, ACCOUNT_ICONS, COLORS } from '../../utils/format';
import './Modal.scss';

export default function AccountModal({ data, onClose, onSaved }) {
  const isEdit = Boolean(data?._id);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name:    data?.name    || '',
    type:    data?.type    || 'debit',
    icon:    data?.icon    || '💳',
    color:   data?.color   || '#7c6ef7',
    balance: data?.balance ?? 0,
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Введите название счёта');
    setError(''); setLoading(true);
    try {
      if (isEdit) await dispatch(updateAccount({ id: data._id, data: form })).unwrap();
      else        await dispatch(createAccount(form)).unwrap();
      await dispatch(fetchAccounts());
      onSaved();
      onClose();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка сохранения');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить счёт? Это не удалит операции по нему.')) return;
    setLoading(true);
    try {
      await dispatch(deleteAccount(data._id)).unwrap();
      await dispatch(fetchAccounts());
      onSaved();
      onClose();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка удаления');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2>{isEdit ? 'Редактировать счёт' : 'Новый счёт'}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Название" type="text" placeholder="Например: Основная карта"
            value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />

          <Select label="Тип счёта" value={form.type} options={ACCOUNT_TYPES}
            onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} />

          {!isEdit && (
            <Input label="Начальный баланс" type="number" step="0.01" placeholder="0"
              value={form.balance}
              onChange={(e) => setForm(f => ({ ...f, balance: parseFloat(e.target.value) || 0 }))} />
          )}

          <div className="form-group">
            <label>Иконка</label>
            <div className="icon-picker">
              {ACCOUNT_ICONS.map(icon => (
                <button type="button" key={icon}
                  className={`icon-option ${form.icon === icon ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, icon }))}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Цвет</label>
            <div className="color-picker">
              {COLORS.map(color => (
                <button type="button" key={color}
                  className={`color-option ${form.color === color ? 'selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => setForm(f => ({ ...f, color }))} />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            {isEdit && (
              <Button type="button" variant="danger" loading={loading} onClick={handleDelete}>
                Удалить
              </Button>
            )}
            <div className="modal-actions__right">
              <Button type="button" variant="ghost" onClick={onClose}>Отмена</Button>
              <Button type="submit" loading={loading}>
                {isEdit ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
