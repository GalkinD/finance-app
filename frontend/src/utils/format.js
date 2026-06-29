export const formatMoney = (amount, currency = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const ACCOUNT_TYPES = [
  { value: 'debit', label: 'Дебетовая карта' },
  { value: 'credit', label: 'Кредитная карта' },
  { value: 'deposit', label: 'Вклад' },
  { value: 'cash', label: 'Наличные' },
  { value: 'other', label: 'Другое' },
];

export const ACCOUNT_ICONS = ['💳', '🏦', '💰', '💵', '🏧', '💎', '🪙', '📱', '🔐', '🏠'];
export const CATEGORY_ICONS_EXPENSE = ['🛒', '🍔', '🚗', '🏠', '💊', '👗', '🎮', '✈️', '📚', '⚡', '🎬', '🐾', '🏋️', '💇', '🎁', '📱'];
export const CATEGORY_ICONS_INCOME = ['💼', '💰', '📈', '🎯', '🏆', '🌟', '💡', '🤝', '🎨', '🖥️', '📊', '🏅'];

export const COLORS = [
  '#7c6ef7', '#34d399', '#f87171', '#fbbf24', '#60a5fa',
  '#a78bfa', '#fb923c', '#4ade80', '#f472b6', '#38bdf8',
];
