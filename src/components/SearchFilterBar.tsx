import React, { useState } from 'react';

type SearchFilterBarProps = {
  onSearch: (params: {
    q?: string;
    from?: string;
    to?: string;
    category?: string;
    source?: string;
  }) => void;
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');

  const handleSearch = () => {
    onSearch({
      q: searchTerm,
      from: dateFrom,
      to: dateTo,
      category,
      source,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-search when category or source changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    // Trigger search immediately when category changes
    onSearch({
      q: searchTerm,
      from: dateFrom,
      to: dateTo,
      category: newCategory,
      source,
    });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value;
    setSource(newSource);
    // Trigger search immediately when source changes
    onSearch({
      q: searchTerm,
      from: dateFrom,
      to: dateTo,
      category,
      source: newSource,
    });
  };

  return (
    <section className="glass" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="search articles (example: sports)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: '1 1 200px',
            minWidth: '200px',
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            fontSize: '1rem',
          }}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            fontSize: '1rem',
          }}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            fontSize: '1rem',
          }}
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          style={{
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            fontSize: '1rem',
            minWidth: '120px',
          }}
        >
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="politics">Politics</option>
          <option value="sports">Sports</option>
          <option value="entertainment">Entertainment</option>
          <option value="science">Science</option>
        </select>
        <select
          value={source}
          onChange={handleSourceChange}
          style={{
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            fontSize: '1rem',
            minWidth: '120px',
          }}
        >
          <option value="">All Sources</option>
          <option value="NewsAPI">NewsAPI</option>
          <option value="World News">World News API</option>
        </select>
        <button
          onClick={handleSearch}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default SearchFilterBar;