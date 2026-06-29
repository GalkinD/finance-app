import React from 'react';
import './BaseComponents.scss';

/**
 * Базовый textarea
 * @param {string} label
 * @param {string} error
 * @param {number} rows
 */
export default function Textarea({ label, error, rows = 3, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      <textarea rows={rows} className={error ? 'input--error' : ''} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
