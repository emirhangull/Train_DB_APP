import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Menü</h2>
      <ul>
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Ana Sayfa
          </NavLink>
        </li>
        <li>
          <NavLink to="/seferler" className={({ isActive }) => (isActive ? 'active' : '')}>
            Seferler
          </NavLink>
        </li>
        <li>
          <NavLink to="/rezervasyonlar" className={({ isActive }) => (isActive ? 'active' : '')}>
            Rezervasyonlar
          </NavLink>
        </li>
        <li>
          <NavLink to="/raporlar" className={({ isActive }) => (isActive ? 'active' : '')}>
            Raporlar
          </NavLink>
        </li>
        <li>
          <NavLink to="/profil" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profil
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
