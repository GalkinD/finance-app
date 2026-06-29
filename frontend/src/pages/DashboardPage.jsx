import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import { useAccounts }    from '../hooks/useAccounts';
import { useCategories }  from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import Loader    from '../components/common/Loader';
import Button    from '../components/common/Button';
import AccountModal  from '../components/common/AccountModal';
import CategoryModal from '../components/common/CategoryModal';
import { formatMoney, COLORS } from '../utils/format';
import './DashboardPage.scss';

const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

const ACCOUNT_TYPE_LABELS = {
  debit: 'Дебетовая', credit: 'Кредитная',
  deposit: 'Вклад', cash: 'Наличные', other: 'Другое',
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const { accounts, loading: accLoading, totalBalance, reload: reloadAccounts } = useAccounts();
  const { incomeCategories, expenseCategories, loading: catLoading, reload: reloadCategories } = useCategories();
  const { analytics, analyticsLoading, loadAnalytics } = useTransactions();

  const [analyticsTab, setAnalyticsTab] = useState('expense');
  const [accountModal,  setAccountModal]  = useState({ open: false, data: null });
  const [categoryModal, setCategoryModal] = useState({ open: false, data: null });

  useEffect(() => { loadAnalytics(); }, []); // eslint-disable-line

  const onModalSaved = () => {
    reloadAccounts();
    reloadCategories();
    loadAnalytics();
  };

  // Аналитика
  const totalIncome  = analytics?.totals?.find(t => t._id === 'income')?.total  || 0;
  const totalExpense = analytics?.totals?.find(t => t._id === 'expense')?.total || 0;

  const pieData = (analytics?.byCategory || [])
    .filter(c => c.type === analyticsTab)
    .map((c, i) => ({ name: `${c.icon} ${c.name}`, value: c.total, color: c.color || COLORS[i % COLORS.length] }));

  const barData = (() => {
    const map = {};
    (analytics?.byMonth || []).forEach(({ _id, total }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
      if (!map[key]) map[key] = { name: MONTHS[_id.month - 1], income: 0, expense: 0 };
      map[key][_id.type] = total;
    });
    return Object.values(map).slice(-6);
  })();

  return (
    <div className="dashboard">

      {/* ── Summary cards ─────────────────────────────────── */}
      <div className="summary-cards">
        <div className="summary-card summary-card--balance">
          <div className="summary-card__label">Общий баланс</div>
          <div className="summary-card__value">{formatMoney(totalBalance)}</div>
          <div className="summary-card__icon">💰</div>
        </div>
        <div className="summary-card summary-card--income">
          <div className="summary-card__label">Доходы</div>
          <div className="summary-card__value income-color">{formatMoney(totalIncome)}</div>
          <div className="summary-card__icon">📈</div>
        </div>
        <div className="summary-card summary-card--expense">
          <div className="summary-card__label">Расходы</div>
          <div className="summary-card__value expense-color">{formatMoney(totalExpense)}</div>
          <div className="summary-card__icon">📉</div>
        </div>
      </div>

      {/* ── Panels ────────────────────────────────────────── */}
      <div className="panels-row">

        {/* Accounts */}
        <div className="card">
          <div className="card__header">
            <h3>Счета</h3>
            <Button size="sm" onClick={() => setAccountModal({ open: true, data: null })}>
              + Добавить
            </Button>
          </div>
          {accLoading ? (
            <Loader variant="inline" />
          ) : accounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🏦</div>
              <p>Нет счетов</p>
            </div>
          ) : (
            <div className="item-list">
              {accounts.map(acc => (
                <div key={acc._id} className="item-row"
                  onClick={() => setAccountModal({ open: true, data: acc })}>
                  <div className="item-row__left">
                    <span className="item-row__icon" style={{ background: acc.color + '22' }}>
                      {acc.icon}
                    </span>
                    <div>
                      <div className="item-row__name">{acc.name}</div>
                      <div className="item-row__sub">{ACCOUNT_TYPE_LABELS[acc.type] || 'Другое'}</div>
                    </div>
                  </div>
                  <div className="item-row__amount"
                    style={{ color: acc.balance >= 0 ? '#34d399' : '#f87171' }}>
                    {formatMoney(acc.balance)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income categories */}
        <div className="card">
          <div className="card__header">
            <h3>Доходы</h3>
            <Button size="sm" onClick={() => setCategoryModal({ open: true, data: { type: 'income' } })}>
              + Добавить
            </Button>
          </div>
          {catLoading ? (
            <Loader variant="inline" />
          ) : (
            <CategoryList
              items={incomeCategories}
              onEdit={(c) => setCategoryModal({ open: true, data: c })}
            />
          )}
        </div>

        {/* Expense categories */}
        <div className="card">
          <div className="card__header">
            <h3>Расходы</h3>
            <Button size="sm" onClick={() => setCategoryModal({ open: true, data: { type: 'expense' } })}>
              + Добавить
            </Button>
          </div>
          {catLoading ? (
            <Loader variant="inline" />
          ) : (
            <CategoryList
              items={expenseCategories}
              onEdit={(c) => setCategoryModal({ open: true, data: c })}
            />
          )}
        </div>
      </div>

      {/* ── Quick actions ─────────────────────────────────── */}
      <div className="dashboard__actions">
        <Button onClick={() => navigate('/transactions/new')}>
          + Добавить операцию
        </Button>
        <Button variant="ghost" onClick={() => navigate('/transactions')}>
          История операций →
        </Button>
      </div>

      {/* ── Analytics ─────────────────────────────────────── */}
      <div className="card analytics-card">
        <div className="card__header">
          <h3>Аналитика</h3>
          <div className="tabs">
            <button
              className={`tab-btn ${analyticsTab === 'expense' ? 'active' : ''}`}
              onClick={() => setAnalyticsTab('expense')}>
              Расходы
            </button>
            <button
              className={`tab-btn ${analyticsTab === 'income' ? 'active' : ''}`}
              onClick={() => setAnalyticsTab('income')}>
              Доходы
            </button>
          </div>
        </div>

        {analyticsLoading ? (
          <Loader text="Загрузка аналитики..." />
        ) : pieData.length === 0 && barData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📊</div>
            <p>Добавьте операции для отображения аналитики</p>
          </div>
        ) : (
          <div className="charts-row">
            {/* Pie */}
            <div className="chart-wrap">
              <div className="chart-label">По категориям</div>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%"
                        innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                        {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip
                        formatter={(v) => formatMoney(v)}
                        contentStyle={{ background: '#1a1d27', border: '1px solid #2e3350', borderRadius: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {pieData.slice(0, 5).map((item, i) => (
                      <div key={i} className="pie-legend__item">
                        <span className="pie-legend__dot" style={{ background: item.color }} />
                        <span className="pie-legend__name">{item.name}</span>
                        <span className="pie-legend__value">{formatMoney(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state"><p>Нет данных</p></div>
              )}
            </div>

            {/* Bar */}
            <div className="chart-wrap">
              <div className="chart-label">По месяцам</div>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e3350" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#7b82a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#7b82a8', fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}к` : v} />
                    <Tooltip
                      formatter={(v) => formatMoney(v)}
                      contentStyle={{ background: '#1a1d27', border: '1px solid #2e3350', borderRadius: 8 }}
                    />
                    <Legend formatter={(v) => v === 'income' ? 'Доходы' : 'Расходы'} />
                    <Bar dataKey="income"  fill="#34d399" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state"><p>Нет данных</p></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      {accountModal.open && (
        <AccountModal
          data={accountModal.data}
          onClose={() => setAccountModal({ open: false, data: null })}
          onSaved={onModalSaved}
        />
      )}
      {categoryModal.open && (
        <CategoryModal
          data={categoryModal.data}
          onClose={() => setCategoryModal({ open: false, data: null })}
          onSaved={onModalSaved}
        />
      )}
    </div>
  );
}

function CategoryList({ items, onEdit }) {
  if (items.length === 0) return (
    <div className="empty-state">
      <div className="empty-state__icon">📂</div>
      <p>Нет категорий</p>
    </div>
  );
  return (
    <div className="item-list">
      {items.map(cat => (
        <div key={cat._id} className="item-row" onClick={() => onEdit(cat)}>
          <div className="item-row__left">
            <span className="item-row__icon" style={{ background: cat.color + '22' }}>{cat.icon}</span>
            <div className="item-row__name">{cat.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
