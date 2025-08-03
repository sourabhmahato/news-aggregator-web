import React, { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import PreferenceSelector from './PreferenceSelector';

interface PersonalizationPanelProps {
  onPreferencesChange?: () => void;
}

const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({ onPreferencesChange }) => {
  const { preferences, availableOptions, updatePreferences, resetPreferences } = usePreferences();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSourceChange = (sources: string[]) => {
    console.log('📰 Sources changed:', sources);
    updatePreferences({ sources });
    onPreferencesChange?.();
  };

  const handleCategoryChange = (categories: string[]) => {
    console.log('🏷️ Categories changed:', categories);
    updatePreferences({ categories });
    onPreferencesChange?.();
  };

  const handleAuthorChange = (authors: string[]) => {
    console.log('✍️ Authors changed:', authors);
    updatePreferences({ authors });
    onPreferencesChange?.();
  };

  const handleAutoRefreshChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({ autoRefresh: e.target.checked });
    onPreferencesChange?.();
  };

  const handleMaxArticlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updatePreferences({ maxArticles: value });
      onPreferencesChange?.();
    }
  };

  const handleReset = () => {
    resetPreferences();
    onPreferencesChange?.();
  };

  const hasPreferences = preferences.sources.length > 0 || 
                        preferences.categories.length > 0 || 
                        preferences.authors.length > 0;

  const totalFilters = preferences.sources.length + preferences.categories.length + preferences.authors.length;

  return (
    <aside className="personalization-panel glass" style={{ 
      padding: '0', 
      minWidth: 300, 
      maxWidth: 340, 
      marginRight: '2rem', 
      borderRadius: '20px', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      height: 'fit-content',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      background: 'rgba(255,255,255,0.05)',
      flexShrink: 0,
      position: 'sticky',
      top: '1rem'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem 1.5rem 1rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        borderRadius: '20px 20px 0 0',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer'
        }} onClick={() => setIsExpanded(!isExpanded)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              ⚙️
            </div>
            <div>
              <h2 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 700, 
                margin: 0,
                letterSpacing: '0.02em'
              }}>
                Personalize Feed
              </h2>
              <p style={{ 
                fontSize: '0.8rem', 
                margin: '0.2rem 0 0 0',
                opacity: 0.9
              }}>
                {hasPreferences ? `${totalFilters} active filters` : 'Customize your news experience'}
              </p>
            </div>
          </div>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▼
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '1.5rem' }}>
          {/* Sources */}
          <PreferenceSelector
            title="News Sources"
            icon="📰"
            options={availableOptions.sources}
            selectedOptions={preferences.sources}
            onSelectionChange={handleSourceChange}
            placeholder="Loading sources..."
          />

          {/* Categories */}
          <PreferenceSelector
            title="Categories"
            icon="🏷️"
            options={availableOptions.categories}
            selectedOptions={preferences.categories}
            onSelectionChange={handleCategoryChange}
            placeholder="Loading categories..."
          />

          {/* Authors */}
          <PreferenceSelector
            title="Authors"
            icon="✍️"
            options={availableOptions.authors}
            selectedOptions={preferences.authors}
            onSelectionChange={handleAuthorChange}
            placeholder="Loading authors..."
          />

          {/* Settings Section */}
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--color-bg)',
            borderRadius: '16px',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              margin: '0 0 1rem 0',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: 'var(--color-text)'
            }}>
              <span role="img" aria-label="settings">⚡</span>
              Feed Settings
            </h3>
            
            {/* Auto Refresh */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              padding: '0.8rem',
              background: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.2rem' }}>
                  Auto Refresh
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  Update articles every 5 minutes
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={preferences.autoRefresh}
                  onChange={handleAutoRefreshChange}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: preferences.autoRefresh ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  borderRadius: '24px',
                  transition: '0.3s ease',
                  boxShadow: preferences.autoRefresh ? '0 2px 8px rgba(127,90,240,0.3)' : 'none'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: '0.3s ease',
                    transform: preferences.autoRefresh ? 'translateX(24px)' : 'translateX(0)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </span>
              </label>
            </div>

            {/* Max Articles */}
            <div style={{
              padding: '0.8rem',
              background: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 500, 
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Max Articles</span>
                <span style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {preferences.maxArticles}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={preferences.maxArticles}
                onChange={handleMaxArticlesChange}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-primary)',
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.7rem', 
                opacity: 0.6,
                marginTop: '0.3rem'
              }}>
                <span>5</span>
                <span>50</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '0.8rem', 
            marginTop: '1.5rem'
          }}>
            <button
              onClick={() => onPreferencesChange?.()}
              style={{
                flex: 1,
                padding: '0.9rem',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(127,90,240,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(127,90,240,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(127,90,240,0.3)';
              }}
            >
              <span role="img" aria-label="apply">✅</span> Apply Filters
            </button>
            
            {hasPreferences && (
              <button
                onClick={handleReset}
                style={{
                  padding: '0.9rem',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  border: '2px solid var(--color-border)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <span role="img" aria-label="reset">🔄</span>
              </button>
            )}
          </div>

          {/* Status Indicator */}
          {hasPreferences && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(127,90,240,0.1) 0%, rgba(44,182,125,0.1) 100%)',
              border: '1px solid rgba(127,90,240,0.2)',
              borderRadius: '12px',
              fontSize: '0.85rem',
              textAlign: 'center',
              color: 'var(--color-text)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                marginBottom: '0.3rem'
              }}>
                <span role="img" aria-label="active">🎯</span>
                <span style={{ fontWeight: 600 }}>Personalized Feed Active</span>
              </div>
              <div style={{ opacity: 0.8 }}>
                {totalFilters} filter{totalFilters !== 1 ? 's' : ''} applied • {preferences.maxArticles} max articles
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default PersonalizationPanel;