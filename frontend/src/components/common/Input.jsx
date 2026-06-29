import React from 'react';
import './BaseComponents.scss';

/**
 * Базовое поле ввода
 * @param {string} label
 * @param {string} error
 * @param {string} hint
 */
export default function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      <input className={error ? 'input--error' : ''} {...props} />
      {error && <span className="field-error">{error}</span>}
      {hint && !error && <span className="field-hint">{hint}</span>}
    </div>
  );
}
