import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Layout.scss';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar__left">
          <div className="navbar__logo">
            <span className="navbar__logo-icon">₽</span>
            <span className="navbar__logo-text">ФинансыПро</span>
          </div>
          <nav className="navbar__nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Главная
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              История
            </NavLink>
          </nav>
        </div>
        <div className="navbar__right">
          <NavLink to="/settings" className="navbar__user">
            <span className="navbar__user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
            <span className="navbar__user-name">{user?.name}</span>
          </NavLink>
          <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
