import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '../types/Article';
import { NewsService, SearchParams } from '../services/NewsService';
import { FilterService } from '../services/FilterService';
import { usePreferences } from '../context/PreferencesContext';
import { ERROR_MESSAGES } from '../constants/appConstants';

export interface ArticleListRef {
  fetchArticles: (params?: SearchParams) => void;
}

const ArticleList = forwardRef<ArticleListRef>((props, ref) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { preferences, updateAvailableOptions, availableOptions: contextAvailableOptions } = usePreferences();

  const newsService = useMemo(() => new NewsService({
    newsApiKey: process.env.REACT_APP_NEWSAPI_KEY,
    worldNewsKey: process.env.REACT_APP_WORLDNEWS_KEY,
    gnewsKey: process.env.REACT_APP_GNEWS_KEY
  }), []);

  const fetchArticles = useCallback(async (searchParams: SearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedArticles = await newsService.fetchAllArticles(searchParams);
      
      const newAvailableOptions = FilterService.extractAvailableOptions(fetchedArticles);
      
      if (JSON.stringify(newAvailableOptions) !== JSON.stringify(contextAvailableOptions)) {
        updateAvailableOptions(newAvailableOptions);
      }
      
      const filteredArticles = FilterService.filterArticlesByPreferences(fetchedArticles, preferences);
      const limitedArticles = FilterService.limitArticles(filteredArticles, preferences.maxArticles);
      
      setArticles(limitedArticles);
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_FAILED);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, [newsService, preferences, updateAvailableOptions, contextAvailableOptions]);

  useImperativeHandle(ref, () => ({
    fetchArticles,
  }), [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  if (loading) {
    return (
      <main className="article-list" style={{ 
        flex: 1, 
        padding: '1rem', 
        display: 'grid', 
        gap: '1rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        maxWidth: '100%',
        minHeight: '100vh',
        alignContent: 'start',
        justifyItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📰</div>
          <div>Loading articles...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="article-list" style={{ 
        flex: 1, 
        padding: '1rem', 
        display: 'grid', 
        gap: '1rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        maxWidth: '100%',
        minHeight: '100vh',
        alignContent: 'start',
        justifyItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div>{error}</div>
          <button 
            onClick={() => fetchArticles()}
            style={{ 
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (articles.length === 0) {
    return (
      <main className="article-list" style={{ 
        flex: 1, 
        padding: '1rem', 
        display: 'grid', 
        gap: '1rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        maxWidth: '100%',
        minHeight: '100vh',
        alignContent: 'start',
        justifyItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
          <div>
            {FilterService.hasActiveFilters(preferences)
              ? ERROR_MESSAGES.NO_PREFERENCES_MATCH
              : ERROR_MESSAGES.NO_ARTICLES
            }
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="article-list" style={{ 
      flex: 1, 
      padding: '1rem', 
      display: 'grid', 
      gap: '1rem', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      maxWidth: '100%',
      minHeight: '100vh',
      alignContent: 'start',
      justifyItems: 'center'
    }}>
      {preferences.autoRefresh && (
        <div style={{
          gridColumn: '1 / -1',
          padding: '0.8rem 1rem',
          background: 'var(--color-primary)',
          color: 'white',
          borderRadius: '12px',
          fontSize: '0.9rem',
          textAlign: 'center',
          marginBottom: '0.5rem',
          boxShadow: '0 2px 8px rgba(127,90,240,0.2)',
          width: '100%',
          maxWidth: '100%'
        }}>
          <span role="img" aria-label="auto-refresh">🔄</span>
        </div>
      )}
      
      {articles.length === 1 ? (
        <div style={{ 
          gridColumn: '1 / -1',
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <ArticleCard article={articles[0]} />
          </div>
        </div>
      ) : (
        articles.map((article) => (
          <div key={article.id} style={{ 
            width: '100%', 
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <ArticleCard article={article} />
          </div>
        ))
      )}
    </main>
  );
});

ArticleList.displayName = 'ArticleList';

export default ArticleList;