import React, { useState } from 'react';
import { Home, Bot, Calculator, Compass, Layers, DollarSign, Database, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeProject }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'cost-estimator', label: 'Cost Estimator', icon: Calculator },
    { id: 'cost-summary', label: 'Cost Summary', icon: DollarSign },
    { id: 'plan-my-house', label: 'Plan My House', icon: Compass, badge: 'Main' },
    { id: 'material-prices', label: 'Price Catalog', icon: Database }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (itemId) => {
    return activePage === itemId || 
      (itemId === 'cost-estimator' && activePage.startsWith('calc-')) ||
      (itemId === 'plan-my-house' && (activePage === 'house-plan-result' || activePage === 'exterior-design' || activePage === 'interior-design' || activePage === 'budget-comparison'));
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          {/* Brand */}
          <div className="brand" onClick={() => handleNavClick('home')}>
            <div className="brand-icon">
              <Compass size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="brand-title">SMART BUILD AI</span>
                <span className="brand-badge">Pro v2.5</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                House Planning &amp; Cost Management
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.id);
              
              return (
                <button
                  key={item.id}
                  className={`nav-link ${active ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-link-badge">{item.badge}</span>}
                </button>
              );
            })}
          </nav>

          {/* Active project badge & Mobile Hamburger button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeProject && (
              <div className="project-badge-desktop" style={{ 
                background: 'rgba(255, 255, 255, 0.04)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                <span style={{ color: 'var(--text-dim)' }}>Project:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{activeProject.projectName || 'Active Plan'}</span>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.id);
                return (
                  <button
                    key={item.id}
                    className={`mobile-menu-link ${active ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={20} color={active ? 'var(--primary-light)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
                    </div>
                    {item.badge && <span className="nav-link-badge">{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb friendly for mobile devices) */}
      <nav className="mobile-bottom-nav">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'ai-assistant', label: 'AI Chat', icon: Bot },
          { id: 'cost-estimator', label: 'Estimator', icon: Calculator },
          { id: 'plan-my-house', label: 'Plan House', icon: Compass },
          { id: 'cost-summary', label: 'Summary', icon: DollarSign }
        ].map((mItem) => {
          const MIcon = mItem.icon;
          const active = isItemActive(mItem.id);
          return (
            <button
              key={mItem.id}
              className={`mobile-bottom-item ${active ? 'active' : ''}`}
              onClick={() => handleNavClick(mItem.id)}
            >
              <MIcon size={20} />
              <span>{mItem.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
