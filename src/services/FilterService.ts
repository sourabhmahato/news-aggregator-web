import { Article } from '../types/Article';
import { UserPreferences } from '../types/UserPreferences';

export class FilterService {
  private static readonly categoryKeywords: { [key: string]: string[] } = {
    'sports': ['sport', 'football', 'basketball', 'tennis', 'soccer', 'baseball', 'hockey', 'olympics', 'championship', 'league', 'team', 'player', 'coach', 'game', 'match', 'tournament'],
    'technology': ['tech', 'technology', 'software', 'hardware', 'ai', 'artificial intelligence', 'machine learning', 'cybersecurity', 'startup', 'app', 'digital', 'innovation'],
    'business': ['business', 'economy', 'finance', 'market', 'stock', 'investment', 'company', 'corporate', 'trade', 'economic', 'financial'],
    'politics': ['politics', 'political', 'government', 'election', 'congress', 'senate', 'president', 'policy', 'democrat', 'republican', 'vote'],
    'entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood', 'actor', 'actress', 'director', 'album', 'concert', 'award'],
    'science': ['science', 'scientific', 'research', 'study', 'discovery', 'experiment', 'laboratory', 'scientist', 'medical', 'health', 'medicine']
  };

  static filterArticlesByPreferences(articles: Article[], preferences: UserPreferences): Article[] {
    if (!this.hasActiveFilters(preferences)) {
      return articles;
    }

    return articles.filter(article => {
      if (!this.matchesSourceFilter(article, preferences)) return false;
      if (!this.matchesCategoryFilter(article, preferences)) return false;
      if (!this.matchesAuthorFilter(article, preferences)) return false;
      return true;
    });
  }

  static filterArticlesByCategory(articles: Article[], category: string): Article[] {
    if (!category || category === '') {
      return articles;
    }

    return articles.filter(article => {
      if (article.source === 'World News') {
        return true; // World News API handles category filtering
      }

      const keywords = this.categoryKeywords[category] || [];
      const searchText = `${article.title} ${article.description}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }

  static extractAvailableOptions(articles: Article[]): {
    sources: string[];
    categories: string[];
    authors: string[];
  } {
    const sources = Array.from(new Set(articles.map(article => article.source))).sort();
    const categories = Array.from(new Set(articles.map(article => article.category).filter(Boolean))).sort() as string[];
    const authors = Array.from(new Set(articles.map(article => article.author).filter(Boolean))).sort() as string[];

    return { sources, categories, authors };
  }

  static limitArticles(articles: Article[], maxArticles: number): Article[] {
    return articles.slice(0, maxArticles);
  }

  static hasActiveFilters(preferences: UserPreferences): boolean {
    return preferences.sources.length > 0 || 
           preferences.categories.length > 0 || 
           preferences.authors.length > 0;
  }

  private static matchesSourceFilter(article: Article, preferences: UserPreferences): boolean {
    if (preferences.sources.length === 0) return true;
    return preferences.sources.includes(article.source);
  }

  private static matchesCategoryFilter(article: Article, preferences: UserPreferences): boolean {
    if (preferences.categories.length === 0) return true;
    if (!article.category) return false;
    return preferences.categories.includes(article.category);
  }

  private static matchesAuthorFilter(article: Article, preferences: UserPreferences): boolean {
    if (preferences.authors.length === 0) return true;
    if (!article.author) return false;
    return preferences.authors.includes(article.author);
  }
} 