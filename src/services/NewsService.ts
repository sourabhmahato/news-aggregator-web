import { Article } from '../types/Article';
import { fetchNewsApiArticles } from '../api/newsapi';
import { fetchWorldNewsArticles } from '../api/worldnews';

export interface NewsServiceConfig {
  newsApiKey?: string;
  worldNewsKey?: string;
}

export interface SearchParams {
  q?: string;
  from?: string;
  to?: string;
  sources?: string;
  category?: string;
}

export class NewsService {
  private config: NewsServiceConfig;

  constructor(config: NewsServiceConfig) {
    this.config = config;
  }

  async fetchAllArticles(params: SearchParams): Promise<Article[]> {
    console.log('🚀 Starting fetchAllArticles with params:', params);
    
    const promises = [];
    
    if (this.isNewsApiAvailable()) {
      console.log('✅ NewsAPI key found, adding to promises');
      promises.push(fetchNewsApiArticles(params));
    } else {
      console.log('❌ NewsAPI key missing or not configured');
    }
    
    if (this.isWorldNewsApiAvailable()) {
      console.log('✅ World News API key found, adding to promises');
      promises.push(fetchWorldNewsArticles(params));
    } else {
      console.log('❌ World News API key missing or not configured');
    }
    
    if (promises.length === 0) {
      throw new Error('No API keys configured. Please add your API keys to the .env file.');
    }
    
    const results = await Promise.allSettled(promises);
    const allArticles: Article[] = [];
    
    results.forEach((result, index) => {
      const apiName = index === 0 ? 'NewsAPI' : 'World News API';
      if (result.status === 'fulfilled') {
        console.log(`✅ ${apiName} succeeded with ${result.value.length} articles`);
        allArticles.push(...result.value);
      } else {
        console.error(`❌ ${apiName} failed:`, result.reason);
      }
    });
    
    return this.sortArticlesByDate(allArticles);
  }

  private isNewsApiAvailable(): boolean {
    return !!(this.config.newsApiKey && this.config.newsApiKey !== 'your_newsapi_key_here');
  }

  private isWorldNewsApiAvailable(): boolean {
    return !!(this.config.worldNewsKey && this.config.worldNewsKey !== 'your_worldnews_key_here');
  }

  private sortArticlesByDate(articles: Article[]): Article[] {
    return articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
} 