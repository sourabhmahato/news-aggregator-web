import { Article } from '../types/Article';

const API_KEY = process.env.REACT_APP_WORLDNEWS_KEY;
const BASE_URL = 'https://api.worldnewsapi.com/search-news';

export async function fetchWorldNewsArticles({
  q = '',
  from = '',
  to = '',
  category = '',
}: {
  q?: string;
  from?: string;
  to?: string;
  category?: string;
}): Promise<Article[]> {
  console.log('🔍 World News API - Starting fetch with params:', { q, from, to, category });
  console.log('🔑 World News API - API Key available:', !!API_KEY);
  
  // Build search query - include category in search if specified
  let searchQuery = q || 'news';
  if (category && category !== '') {
    searchQuery = `${searchQuery} ${category}`;
  }
  
  const params = new URLSearchParams({
    'api-key': API_KEY || '',
    text: searchQuery, // World News API uses 'text' parameter
  });
  
  // Add date filters if provided
  if (from) {
    params.append('earliest-publish-date', from);
  }
  if (to) {
    params.append('latest-publish-date', to);
  }
  
  const url = `${BASE_URL}?${params.toString()}`;
  console.log('🌐 World News API - Request URL:', url);
  
  try {
    const res = await fetch(url);
    console.log('📡 World News API - Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ World News API - HTTP Error:', res.status, errorText);
      throw new Error(`World News API HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('📊 World News API - Response data:', data);
    
    if (!data.news) {
      console.warn('⚠️ World News API - No news in response');
      return [];
    }
    
    const articles = data.news.map((a: any, idx: number) => ({
      id: a.url || `worldnews-${idx}`,
      title: a.title,
      description: a.text || '',
      url: a.url,
      imageUrl: a.image,
      source: a.source_country || 'World News',
      author: a.author,
      publishedAt: a.publish_date,
      category: category || '',
    }));
    
    console.log('✅ World News API - Processed articles:', articles.length);
    return articles;
  } catch (error) {
    console.error('❌ World News API - Fetch error:', error);
    throw error;
  }
} 