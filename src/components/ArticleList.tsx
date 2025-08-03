import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '../types/Article';
import { NewsService, SearchParams } from '../services/NewsService';
import { FilterService } from '../services/FilterService';
import { usePreferences } from '../context/PreferencesContext';
import { APP_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/appConstants';

export interface ArticleListRef {
  fetchArticles: (params?: SearchParams) => void;
}

const ArticleList = forwardRef<ArticleListRef>((props, ref) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { preferences, updateAvailableOptions } = usePreferences();
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize NewsService with API keys
  const newsService = new NewsService({
    newsApiKey: process.env.REACT_APP_NEWSAPI_KEY,
    worldNewsKey: process.env.REACT_APP_WORLDNEWS_KEY
  });

  const fetchArticles = useCallback(async (searchParams?: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedArticles = await newsService.fetchAllArticles(searchParams || {});
      
      // Extract available options from all fetched articles
      const availableOptions = FilterService.extractAvailableOptions(fetchedArticles);
      updateAvailableOptions(availableOptions);
      
      // Apply user preferences filtering
      const filteredArticles = FilterService.filterArticlesByPreferences(fetchedArticles, preferences);
      
      // Limit articles based on user preference
      const limitedArticles = FilterService.limitArticles(filteredArticles, preferences.maxArticles);
      
      setArticles(limitedArticles);
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_FAILED);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, [preferences.maxArticles, newsService, updateAvailableOptions]);

  useImperativeHandle(ref, () => ({
    fetchArticles,
  }), [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Auto-refresh functionality
  useEffect(() => {
    if (preferences.autoRefresh) {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
      
      autoRefreshIntervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refreshing articles...');
        fetchArticles();
      }, APP_CONSTANTS.AUTO_REFRESH.INTERVAL_MS);
    } else {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
    }

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [preferences.autoRefresh, fetchArticles]);

  // Refetch articles when preferences change
  useEffect(() => {
    if (articles.length > 0) {
      const filteredArticles = FilterService.filterArticlesByPreferences(articles, preferences);
      const limitedArticles = FilterService.limitArticles(filteredArticles, preferences.maxArticles);
      setArticles(limitedArticles);
    }
  }, [preferences, articles.length]);

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
          {preferences.autoRefresh && (
            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Auto-refresh enabled
            </div>
          )}
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
          <span role="img" aria-label="auto-refresh">🔄</span> {SUCCESS_MESSAGES.AUTO_REFRESH_ENABLED}
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