import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '../types/Article';
import { fetchAllArticles } from '../api/fetchArticles';

export interface ArticleListRef {
  fetchArticles: (params?: any) => void;
}

const ArticleList = forwardRef<ArticleListRef>((props, ref) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (searchParams?: any) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await fetchAllArticles(searchParams || {});
      setArticles(fetchedArticles);
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchArticles,
  }));

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <main style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📰</div>
          <div>Loading articles...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      <main style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
          <div>No articles found. Try adjusting your search criteria.</div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, padding: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </main>
  );
});

ArticleList.displayName = 'ArticleList';

export default ArticleList;