import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SearchFilterBar from './components/SearchFilterBar';
import PersonalizationPanel from './components/PersonalizationPanel';
import ArticleList, { ArticleListRef } from './components/ArticleList';
import { PreferencesProvider } from './context/PreferencesContext';
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

  const handlePreferencesChange = () => {
    // Trigger a refresh of articles when preferences change
    if (articleListRef.current) {
      articleListRef.current.fetchArticles();
    }
  };

  return (
    <PreferencesProvider>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}>
        <Header onToggleTheme={toggleTheme} theme={theme} />
        <SearchFilterBar onSearch={handleSearch} />
        <div className="main-container" style={{ 
          display: 'flex', 
          flex: 1, 
          flexDirection: 'row', 
          alignItems: 'flex-start', 
          maxWidth: 1400, 
          margin: '0 auto',
          padding: '0 1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <PersonalizationPanel onPreferencesChange={handlePreferencesChange} />
          <div className="article-list" style={{ flex: 1, minWidth: 0 }}>
            <ArticleList ref={articleListRef} />
          </div>
        </div>
      </div>
    </PreferencesProvider>
  );
}

export default App;
