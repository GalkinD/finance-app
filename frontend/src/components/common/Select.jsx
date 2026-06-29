import React from 'react';
import './BaseComponents.scss';

/**
 * Базовый селект
 * @param {string} label
 * @param {{value: string, label: string}[]} options
 * @param {string} placeholder
 * @param {string} error
 */
export default function Select({ label, options = [], placeholder, error, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      <select className={error ? 'input--error' : ''} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
