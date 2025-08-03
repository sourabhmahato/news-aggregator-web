import { Article } from '../types/Article';

const API_KEY = process.env.REACT_APP_NEWSAPI_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

export async function fetchNewsApiArticles({
  q = '',
  from = '',
  to = '',
  sources = '',
  category = '',
}: {
  q?: string;
  from?: string;
  to?: string;
  sources?: string;
  category?: string;
}): Promise<Article[]> {
  console.log('🔍 NewsAPI - Starting fetch with params:', { q, from, to, sources, category });
  console.log('🔑 NewsAPI - API Key available:', !!API_KEY);
  
  // Build search query - include category in search if specified
  let searchQuery = q || 'news';
  if (category && category !== '') {
    searchQuery = `${searchQuery} ${category}`;
  }
  
  const params = new URLSearchParams({
    apiKey: API_KEY || '',
    q: searchQuery, // Include category in search query
    from,
    to,
    sources,
    // NewsAPI does not support category parameter in /everything endpoint
  });
  
  const url = `${BASE_URL}?${params.toString()}`;
  console.log('🌐 NewsAPI - Request URL:', url);
  
  try {
    const res = await fetch(url);
    console.log('📡 NewsAPI - Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ NewsAPI - HTTP Error:', res.status, errorText);
      throw new Error(`NewsAPI HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('📊 NewsAPI - Response data:', data);
    
    if (data.status === 'error') {
      console.error('❌ NewsAPI - API Error:', data.message);
      throw new Error(`NewsAPI Error: ${data.message}`);
    }
    
    if (!data.articles) {
      console.warn('⚠️ NewsAPI - No articles in response');
      return [];
    }
    
    const articles = data.articles.map((a: any, idx: number) => ({
      id: a.url || idx.toString(),
      title: a.title,
      description: a.description,
      url: a.url,
      imageUrl: a.urlToImage,
      source: a.source?.name || 'NewsAPI',
      author: a.author,
      publishedAt: a.publishedAt,
      category: category || '',
    }));
    
    console.log('✅ NewsAPI - Processed articles:', articles.length);
    return articles;
  } catch (error) {
    console.error('❌ NewsAPI - Fetch error:', error);
    throw error;
  }
}