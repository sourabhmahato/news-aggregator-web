import { fetchNewsApiArticles } from './newsapi';
import { fetchWorldNewsArticles } from './worldnews';
import { Article } from '../types/Article';

export async function fetchAllArticles(params: {
  q?: string;
  from?: string;
  to?: string;
  sources?: string;
  category?: string;
  section?: string;
}): Promise<Article[]> {
  console.log('🚀 Starting fetchAllArticles with params:', params);
  
  // Debug: Check environment variables
  const newsApiKey = process.env.REACT_APP_NEWSAPI_KEY;
  const worldNewsKey = process.env.REACT_APP_WORLDNEWS_KEY;
  
  console.log('🔍 Environment variables check:');
  console.log('  NewsAPI key exists:', !!newsApiKey);
  console.log('  NewsAPI key length:', newsApiKey?.length || 0);
  console.log('  NewsAPI key starts with:', newsApiKey?.substring(0, 4) || 'N/A');
  console.log('  World News key exists:', !!worldNewsKey);
  console.log('  World News key length:', worldNewsKey?.length || 0);
  console.log('  World News key starts with:', worldNewsKey?.substring(0, 4) || 'N/A');
  
  const promises = [];
  
  // Only add NewsAPI if key is available
  if (newsApiKey && newsApiKey !== 'your_newsapi_key_here') {
    console.log('✅ NewsAPI key found, adding to promises');
    // For NewsAPI, we'll fetch all articles and filter client-side since /everything doesn't support categories
    promises.push(fetchNewsApiArticles(params));
  } else {
    console.log('❌ NewsAPI key missing or not configured');
  }
  
  // Only add World News API if key is available
  if (worldNewsKey && worldNewsKey !== 'your_worldnews_key_here') {
    console.log('✅ World News API key found, adding to promises');
    promises.push(fetchWorldNewsArticles(params));
  } else {
    console.log('❌ World News API key missing or not configured');
  }
  
  if (promises.length === 0) {
    console.error('❌ No API keys configured');
    throw new Error('No API keys configured. Please add your API keys to the .env file.');
  }
  
  console.log(`📡 Making ${promises.length} API calls in parallel`);
  
  const results = await Promise.allSettled(promises);
  const all: Article[] = [];
  
  results.forEach((result, index) => {
    const apiName = index === 0 ? 'NewsAPI' : 'World News API';
    if (result.status === 'fulfilled') {
      console.log(`✅ ${apiName} succeeded with ${result.value.length} articles`);
      all.push(...result.value);
    } else {
      console.error(`❌ ${apiName} failed:`, result.reason);
    }
  });
  
  console.log(`📊 Total articles collected: ${all.length}`);
  
  // Client-side filtering for NewsAPI articles when category is specified
  let filteredArticles = all;
  if (params.category && params.category !== '') {
    console.log(`🔍 Filtering articles by category: ${params.category}`);
    filteredArticles = all.filter(article => {
      // For NewsAPI articles, check if the category matches or if it's a general article
      if (article.source !== 'World News') {
        // For NewsAPI, we'll check if the search query contains the category
        // or if the article title/description contains category-related keywords
        const categoryKeywords: { [key: string]: string[] } = {
          'sports': ['sport', 'football', 'basketball', 'tennis', 'soccer', 'baseball', 'hockey', 'olympics', 'championship', 'league', 'team', 'player', 'coach', 'game', 'match', 'tournament'],
          'technology': ['tech', 'technology', 'software', 'hardware', 'ai', 'artificial intelligence', 'machine learning', 'cybersecurity', 'startup', 'app', 'digital', 'innovation'],
          'business': ['business', 'economy', 'finance', 'market', 'stock', 'investment', 'company', 'corporate', 'trade', 'economic', 'financial'],
          'politics': ['politics', 'political', 'government', 'election', 'congress', 'senate', 'president', 'policy', 'democrat', 'republican', 'vote'],
          'entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood', 'actor', 'actress', 'director', 'album', 'concert', 'award'],
          'science': ['science', 'scientific', 'research', 'study', 'discovery', 'experiment', 'laboratory', 'scientist', 'medical', 'health', 'medicine']
        };
        
        const keywords = categoryKeywords[params.category!] || [];
        const searchText = `${article.title} ${article.description}`.toLowerCase();
        return keywords.some((keyword: string) => searchText.includes(keyword.toLowerCase()));
      }
      // For World News API articles, the category filtering should already be done by the API
      return true;
    });
    console.log(`✅ Filtered to ${filteredArticles.length} articles`);
  }
  
  // Sort by publishedAt descending
  const sorted = filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  console.log('✅ Articles sorted by date');
  
  return sorted;
}