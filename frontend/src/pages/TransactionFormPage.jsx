import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import { formatDateInput } from '../utils/format';
import './TransactionFormPage.scss';

export default function TransactionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { transactions, addTransaction, editTransaction, loading: txLoading } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    type: 'expense', amount: '', account: '', category: '', comment: '',
    date: formatDateInput(new Date()),
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  // Пункт 4: получение данных по URL-параметру :id
  useEffect(() => {
    if (!isEdit) return;
    const existing = transactions.find(t => t._id === id);
    if (existing) {
      setForm({
        type: existing.type,
        amount: existing.amount,
        account: existing.account._id,
        category: existing.category._id,
        comment: existing.comment || '',
        date: formatDateInput(existing.date),
      });
      setFetchLoading(false);
    } else if (!txLoading) {
      setFetchLoading(false);
    }
  }, [id, isEdit, transactions, txLoading]);

  const filteredCategories = categories
    .filter(c => c.type === form.type)
    .map(c => ({ value: c._id, label: `${c.icon} ${c.name}` }));

  const accountOptions = accounts.map(a => ({ value: a._id, label: `${a.icon} ${a.name} — ${a.balance} ₽` }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.account)             return setError('Выберите счёт');
    if (!form.category)            return setError('Выберите категорию');
    if (!form.amount || form.amount <= 0) return setError('Введите корректную сумму');
    setError(''); setSaving(true);
    try {
      if (isEdit) { await editTransaction(id, form); }
      else        { await addTransaction(form); }
      navigate('/transactions');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (fetchLoading) return <Loader text="Загрузка операции..." />;

  return (
    <div className="transaction-form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Редактировать операцию' : 'Новая операция'}</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>← Назад</Button>
      </div>

      <div className="form-card card">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Тип операции</label>
          <div className="type-toggle">
            <button type="button"
              className={`type-btn type-btn--expense ${form.type === 'expense' ? 'active' : ''}`}
              onClick={() => setForm(f => ({ ...f, type: 'expense', category: '' }))}>
              📉 Расход
            </button>
            <button type="button"
              className={`type-btn type-btn--income ${form.type === 'income' ? 'active' : ''}`}
              onClick={() => setForm(f => ({ ...f, type: 'income', category: '' }))}>
              📈 Доход
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <Input label="Сумма" type="number" min="0" step="0.01" placeholder="0.00"
              value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} required />
            <Input label="Дата" type="date"
              value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>

          <Select label="Счёт" value={form.account}
            onChange={(e) => setForm(f => ({ ...f, account: e.target.value }))}
            options={accountOptions} placeholder="Выберите счёт..." required />

          <Select label="Категория" value={form.category}
            onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
            options={filteredCategories} placeholder="Выберите категорию..." required />

          <Textarea label="Комментарий" placeholder="Необязательный комментарий..."
            value={form.comment} onChange={(e) => setForm(f => ({ ...f, comment: e.target.value }))} rows={3} />

          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Отмена</Button>
            <Button type="submit" loading={saving}>
              {isEdit ? 'Сохранить изменения' : 'Добавить операцию'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
