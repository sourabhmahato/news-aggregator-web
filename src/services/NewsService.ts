import { Article } from '../types/Article';
import { fetchNewsApiArticles } from '../api/newsapi';
import { fetchWorldNewsArticles } from '../api/worldnews';
import { fetchGNewsArticles } from '../api/gnews';

export interface NewsServiceConfig {
  newsApiKey?: string;
  worldNewsKey?: string;
  gnewsKey?: string;
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

    if (this.isGNewsApiAvailable()) {
      console.log('✅ GNews API key found, adding to promises');
      promises.push(fetchGNewsArticles(params));
    } else {
      console.log('❌ GNews API key missing or not configured');
    }
    
    let allArticles: Article[] = [];

    if (promises.length === 0) {
      throw new Error('No API keys configured. Please add your API keys to the .env file.');
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      const apiName = index === 0 ? 'NewsAPI' : (index === 1 ? 'World News API' : 'GNews');
      if (result.status === 'fulfilled') {
        console.log(`✅ ${apiName} succeeded with ${result.value.length} articles`);
        allArticles.push(...result.value);
      } else {
        console.error(`❌ ${apiName} failed:`, result.reason);
      }
    });
    
    if (allArticles.length === 0) {
      throw new Error('No API keys configured or all APIs failed. Please add your API keys to the .env file.');
    }
    
    return this.sortArticlesByDate(allArticles);
  }

  private isNewsApiAvailable(): boolean {
    return !!(this.config.newsApiKey && this.config.newsApiKey !== 'your_newsapi_key_here');
  }

  private isWorldNewsApiAvailable(): boolean {
    return !!(this.config.worldNewsKey && this.config.worldNewsKey !== 'your_worldnews_key_here');
  }

  private isGNewsApiAvailable(): boolean {
    return !!(this.config.gnewsKey && this.config.gnewsKey !== 'your_gnews_key_here');
  }

  private sortArticlesByDate(articles: Article[]): Article[] {
    return articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
} 