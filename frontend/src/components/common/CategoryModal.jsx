import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/slices/categoriesSlice';
import Button from './Button';
import Input  from './Input';
import { CATEGORY_ICONS_EXPENSE, CATEGORY_ICONS_INCOME, COLORS } from '../../utils/format';
import './Modal.scss';

export default function CategoryModal({ data, onClose, onSaved }) {
  const isEdit = Boolean(data?._id);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name:  data?.name  || '',
    type:  data?.type  || 'expense',
    icon:  data?.icon  || '📦',
    color: data?.color || '#7c6ef7',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const icons = form.type === 'income' ? CATEGORY_ICONS_INCOME : CATEGORY_ICONS_EXPENSE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Введите название категории');
    setError(''); setLoading(true);
    try {
      if (isEdit) await dispatch(updateCategory({ id: data._id, data: form })).unwrap();
      else        await dispatch(createCategory(form)).unwrap();
      await dispatch(fetchCategories());
      onSaved();
      onClose();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка сохранения');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить категорию?')) return;
    setLoading(true);
    try {
      await dispatch(deleteCategory(data._id)).unwrap();
      await dispatch(fetchCategories());
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
          <h2>{isEdit ? 'Редактировать категорию' : 'Новая категория'}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Название" type="text" placeholder="Например: Продукты"
            value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />

          {!isEdit && (
            <div className="form-group">
              <label>Тип</label>
              <div className="tabs">
                <button type="button"
                  className={`tab-btn ${form.type === 'expense' ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'expense', icon: '📦' }))}>
                  Расход
                </button>
                <button type="button"
                  className={`tab-btn ${form.type === 'income' ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'income', icon: '💼' }))}>
                  Доход
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Иконка</label>
            <div className="icon-picker">
              {icons.map(icon => (
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
