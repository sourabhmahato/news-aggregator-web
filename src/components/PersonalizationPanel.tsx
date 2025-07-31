import React from 'react';

const PersonalizationPanel: React.FC = () => (
  <aside className="glass" style={{ padding: '2rem 1.5rem', minWidth: 260, maxWidth: 320, marginRight: '2rem', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.01em' }}>
      <span role="img" aria-label="settings">⚙️</span> Personalize Feed
    </h2>
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 6 }}>
        <span role="img" aria-label="sources">📰</span> Sources
      </label>
      <select multiple style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '1rem', marginBottom: 0 }}>
        <option>Source 1</option>
        <option>Source 2</option>
      </select>
    </div>
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 6 }}>
        <span role="img" aria-label="categories">🏷️</span> Categories
      </label>
      <select multiple style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '1rem', marginBottom: 0 }}>
        <option>Category 1</option>
        <option>Category 2</option>
      </select>
    </div>
    <div style={{ marginBottom: '2rem' }}>
      <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 6 }}>
        <span role="img" aria-label="authors">✍️</span> Authors
      </label>
      <select multiple style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '1rem', marginBottom: 0 }}>
        <option>Author 1</option>
        <option>Author 2</option>
      </select>
    </div>
    <button
      style={{
        width: '100%',
        padding: '0.9rem',
        background: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        fontSize: '1.1rem',
        fontWeight: 700,
        letterSpacing: '0.01em',
        boxShadow: '0 2px 8px rgba(127,90,240,0.08)',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-secondary)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
    >
      <span role="img" aria-label="save">💾</span> Save Preferences
    </button>
  </aside>
);

export default PersonalizationPanel;