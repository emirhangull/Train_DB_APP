import React from 'react';
import { NavLink } from 'react-router-dom';
import TrainIcon from '@mui/icons-material/Train';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <TrainIcon className="sidebar-icon" />
        <h2 className="sidebar-title">Tren Rezervasyon</h2>
      </div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Ana Sayfa
          </NavLink>
        </li>
        <li>
          <NavLink to="/seferler" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Seferler
          </NavLink>
        </li>
        {!isAdmin && (
          <li>
            <NavLink to="/rezervasyonlar" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              Rezervasyonlar
            </NavLink>
          </li>
        )}
        {isAdmin && (
          <li>
            <NavLink to="/raporlar" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              Raporlar
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/profil" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Profil
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
