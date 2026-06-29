import React from 'react';
import './BaseComponents.scss';

/**
 * variant:
 *   'page'   — центрирован на всю область (дефолт)
 *   'inline' — маленький спиннер внутри карточки
 *   'button' — крошечный спиннер внутри кнопки
 */
export default function Loader({ variant = 'page', text = 'Загрузка...' }) {
  if (variant === 'button') {
    return <span className="spinner" />;
  }

  if (variant === 'inline') {
    return (
      <div className="loader-inline">
        <div className="loader-inline__spinner" />
      </div>
    );
  }

  return (
    <div className="loader-page">
      <div className="loader-page__spinner" />
      {text && <p className="loader-page__text">{text}</p>}
    </div>
  );
}
