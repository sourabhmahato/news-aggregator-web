import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SearchFilterBar from './components/SearchFilterBar';
import PersonalizationPanel from './components/PersonalizationPanel';
import ArticleList, { ArticleListRef } from './components/ArticleList';
import './styles/theme.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const articleListRef = useRef<ArticleListRef>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const handleSearch = (params: any) => {
    if (articleListRef.current) {
      articleListRef.current.fetchArticles(params);
    }
  };

  return (
    <div>
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <SearchFilterBar onSearch={handleSearch} />
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'stretch', maxWidth: 1400, margin: '0 auto' }}>
        <PersonalizationPanel />
        <ArticleList ref={articleListRef} />
      </div>
    </div>
  );
}

export default App;
