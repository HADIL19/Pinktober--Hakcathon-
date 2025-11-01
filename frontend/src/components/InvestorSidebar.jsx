import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InvestorSidebar.css';

const InvestorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { path: '/ProjectsMarketplace', icon: '🔍', label: 'Projets' },
    { path: '/contacts', icon: '💼', label: 'Mes Contacts' },
    { path: '/Investisseur', icon: '👤', label: 'Profil' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bouton mobile */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        ☰
      </button>

      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar compact */}
      <nav 
        className={`investor-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header avec logo et avatar */}
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="logo-icon">🌸</span>
            <span className="logo-text">PinkHope</span>
          </div>
          <div className="user-info">
            <div className="investor-avatar">MD</div>
            <div className="investor-name">Marie D.</div>
          </div>
        </div>

        {/* Navigation en dessous */}
        <div className="sidebar-nav">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Déconnexion en bas */}
        <div className="sidebar-footer">
          <button 
            className="nav-item logout"
            onClick={() => navigate('/')}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Déconnexion</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default InvestorSidebar;