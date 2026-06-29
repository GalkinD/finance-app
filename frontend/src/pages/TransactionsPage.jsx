import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import { formatMoney, formatDate } from '../utils/format';
import './TransactionsPage.scss';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const { transactions, total, pages, currentPage, filters, loading, applyFilters, resetFilters, goToPage, removeTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (e) => applyFilters({ [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить операцию?')) return;
    await removeTransaction(id);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  const typeOptions = [
    { value: 'income', label: 'Доходы' },
    { value: 'expense', label: 'Расходы' },
  ];
  const accountOptions = accounts.map(a => ({ value: a._id, label: `${a.icon} ${a.name}` }));
  const categoryOptions = categories.map(c => ({ value: c._id, label: `${c.icon} ${c.name}` }));

  const renderPages = () => {
    const result = [];
    if (pages <= 7) { for (let i = 1; i <= pages; i++) result.push(i); }
    else {
      result.push(1);
      if (currentPage > 3) result.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(pages - 1, currentPage + 1); i++) result.push(i);
      if (currentPage < pages - 2) result.push('...');
      result.push(pages);
    }
    return result;
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>История операций</h1>
          <p>Всего: {total} операций</p>
        </div>
        <div className="transactions-page__header-actions">
          <Button
            variant="ghost"
            className={showFilters ? 'active' : ''}
            onClick={() => setShowFilters(s => !s)}
          >
            ⚙ Фильтры {hasFilters && <span className="filter-badge">{Object.values(filters).filter(Boolean).length}</span>}
          </Button>
          <Button onClick={() => navigate('/transactions/new')}>+ Добавить операцию</Button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <Select label="Тип" name="type" value={filters.type} onChange={handleFilterChange}
              options={typeOptions} placeholder="Все" />
            <Select label="Счёт" name="account" value={filters.account} onChange={handleFilterChange}
              options={accountOptions} placeholder="Все счета" />
            <Select label="Категория" name="category" value={filters.category} onChange={handleFilterChange}
              options={categoryOptions} placeholder="Все категории" />
            <Input label="Дата от" type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
            <Input label="Дата до" type="date" name="dateTo"   value={filters.dateTo}   onChange={handleFilterChange} />
          </div>
          {hasFilters && <Button variant="ghost" size="sm" onClick={resetFilters}>✕ Сбросить фильтры</Button>}
        </div>
      )}

      {loading
        ? <Loader text="Загрузка операций..." />
        : transactions.length === 0
          ? <div className="empty-state card">
              <div className="empty-state__icon">📋</div>
              <p>{hasFilters ? 'По заданным фильтрам ничего не найдено' : 'Операций пока нет. Добавьте первую!'}</p>
            </div>
          : <>
              <div className="transactions-list">
                {transactions.map(tx => (
                  <div key={tx._id} className="transaction-card">
                    <div className="transaction-card__icon" style={{ background: (tx.category?.color || '#7c6ef7') + '22' }}>
                      {tx.category?.icon || '💸'}
                    </div>
                    <div className="transaction-card__info">
                      <div className="transaction-card__name">{tx.category?.name || 'Без категории'}</div>
                      <div className="transaction-card__meta">
                        <span>{tx.account?.icon} {tx.account?.name}</span>
                        <span>•</span>
                        <span>{formatDate(tx.date)}</span>
                        {tx.comment && <><span>•</span><span className="transaction-card__comment">{tx.comment}</span></>}
                      </div>
                    </div>
                    <div className={`transaction-card__amount ${tx.type === 'income' ? 'income-color' : 'expense-color'}`}>
                      {tx.type === 'income' ? '+' : '−'}{formatMoney(tx.amount)}
                    </div>
                    <div className="transaction-card__actions">
                      <Button variant="icon" title="Редактировать" onClick={() => navigate(`/transactions/edit/${tx._id}`)}>✏️</Button>
                      <Button variant="icon" className="danger" title="Удалить" onClick={() => handleDelete(tx._id)}>🗑️</Button>
                    </div>
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                  {renderPages().map((p, i) =>
                    p === '...'
                      ? <span key={`d${i}`} className="pagination__dots">...</span>
                      : <button key={p} className={currentPage === p ? 'active' : ''} onClick={() => goToPage(p)}>{p}</button>
                  )}
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pages}>›</button>
                </div>
              )}
            </>
      }
    </div>
  );
}
