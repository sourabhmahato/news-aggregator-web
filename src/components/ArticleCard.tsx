import React from 'react';
import { Article } from '../types/Article';

type ArticleCardProps = {
  article: Article;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleClick = () => {
    window.open(article.url, '_blank');
  };

  return (
    <article className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
            borderRadius: '12px',
            marginBottom: '1rem'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 600 }}>
        {article.title}
      </h3>
      <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', opacity: 0.8, lineHeight: 1.5 }}>
        {article.description}
      </p>
      <div style={{ 
        fontSize: '0.9em', 
        color: 'var(--color-text)', 
        opacity: 0.6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 500 }}>{article.source}</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
      {article.author && (
        <div style={{ 
          fontSize: '0.8em', 
          color: 'var(--color-text)', 
          opacity: 0.6,
          marginTop: '0.5rem'
        }}>
          By {article.author}
        </div>
      )}
    </article>
  );
};

export default ArticleCard;