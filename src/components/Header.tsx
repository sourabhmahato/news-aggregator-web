import React from 'react';

type HeaderProps = {
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
};

const Header: React.FC<HeaderProps> = ({ onToggleTheme, theme }) => (
  <header className="glass" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
    <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', letterSpacing: '0.02em' }}>📰 News Aggregator</h1>
    <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  </header>
);

export default Header;