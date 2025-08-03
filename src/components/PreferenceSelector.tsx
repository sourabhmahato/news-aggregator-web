import React from 'react';

interface PreferenceSelectorProps {
  title: string;
  icon: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
}

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({
  title,
  icon,
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = 'No options available'
}) => {
  const handleToggle = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    onSelectionChange(options);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleOptionClick = (option: string) => {
    console.log('🖱️ Clicked option:', option);
    console.log('📋 Current selected options:', selectedOptions);
    console.log('✅ Is currently selected:', selectedOptions.includes(option));
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      handleToggle(option);
    }, 50);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '0.8rem' 
      }}>
        <label style={{ 
          fontWeight: 600, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.95rem',
          color: 'var(--color-text)'
        }}>
          <span style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem'
          }}>
            {icon}
          </span>
          {title}
        </label>
        {options.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleSelectAll}
              style={{
                fontSize: '0.7rem',
                padding: '0.3rem 0.6rem',
                background: selectedOptions.length === options.length 
                  ? 'var(--color-primary)' 
                  : 'var(--color-bg)',
                color: selectedOptions.length === options.length ? 'white' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                if (selectedOptions.length !== options.length) {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOptions.length !== options.length) {
                  e.currentTarget.style.background = 'var(--color-bg)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
            >
              All
            </button>
            <button
              onClick={handleClearAll}
              style={{
                fontSize: '0.7rem',
                padding: '0.3rem 0.6rem',
                background: selectedOptions.length === 0 
                  ? 'var(--color-secondary)' 
                  : 'var(--color-bg)',
                color: selectedOptions.length === 0 ? 'white' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                if (selectedOptions.length !== 0) {
                  e.currentTarget.style.background = 'var(--color-secondary)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOptions.length !== 0) {
                  e.currentTarget.style.background = 'var(--color-bg)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
      
      <div style={{
        maxHeight: '180px',
        overflowY: 'auto',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        background: 'var(--color-card)',
        padding: '0.5rem',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {options.length === 0 ? (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: 'var(--color-text)',
            opacity: 0.6,
            fontSize: '0.9rem'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📭</div>
            {placeholder}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {options.map((option) => (
              <label
                key={option}
                onClick={() => handleOptionClick(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  border: selectedOptions.includes(option) 
                    ? '1px solid var(--color-primary)' 
                    : '1px solid transparent',
                  background: selectedOptions.includes(option) 
                    ? 'rgba(127,90,240,0.1)' 
                    : 'transparent',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!selectedOptions.includes(option)) {
                    e.currentTarget.style.background = 'var(--color-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedOptions.includes(option)) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: '2px solid var(--color-border)',
                  background: selectedOptions.includes(option) ? 'var(--color-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}>
                  {selectedOptions.includes(option) && (
                    <span style={{ 
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ 
                  flex: 1,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  fontWeight: selectedOptions.includes(option) ? 500 : 400
                }}>
                  {option}
                </span>
                {selectedOptions.includes(option) && (
                  <span style={{ 
                    fontSize: '0.7rem',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    background: 'rgba(127,90,240,0.1)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '4px'
                  }}>
                    Selected
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>
      
      {selectedOptions.length > 0 && (
        <div style={{
          marginTop: '0.6rem',
          fontSize: '0.8rem',
          color: 'var(--color-text)',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span role="img" aria-label="selected">✅</span>
          {selectedOptions.length} of {options.length} selected
        </div>
      )}
    </div>
  );
};

export default PreferenceSelector; 