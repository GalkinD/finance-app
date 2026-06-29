import React from 'react';
import './BaseComponents.scss';

/**
 * Базовая кнопка
 * @param {'primary'|'ghost'|'danger'|'icon'} variant
 * @param {'sm'|'md'} size
 * @param {boolean} fullWidth
 * @param {boolean} loading
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    fullWidth ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}
