// src/components/layout/Layout/Layout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { setToken } from '../../../api';
import Navbar from '../Navbar/Navbar';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  return (
    <div className="layout">
      <Navbar onLogout={handleLogout} />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}