import { Article } from '../types/Article';

const API_KEY = process.env.REACT_APP_GNEWS_KEY;
const BASE_URL = 'https://gnews.io/api/v4/top-headlines';

export async function fetchGNewsArticles({
  q = '',
  from = '',
  to = '',
  category = 'general',
}: {
  q?: string;
  from?: string;
  to?: string;
  category?: string;
}): Promise<Article[]> {
  console.log('🔍 GNews - Starting fetch with params:', { q, from, to, category });
  console.log('🔑 GNews - API Key available:', !!API_KEY);

  const validCategories = ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
  const apiParams: { [key: string]: string } = {
    apikey: API_KEY || '',
    lang: 'en',
  };

  const lowerCaseSearchTerm = q.toLowerCase();

  if (q && validCategories.includes(lowerCaseSearchTerm)) {
    apiParams.category = lowerCaseSearchTerm;
  } else if (q) {
    apiParams.q = q;
  } else if (category) {
    apiParams.category = category;
  }

  if (from) {
    apiParams.from = new Date(from).toISOString();
  }
  if (to) {
    apiParams.to = new Date(to).toISOString();
  }

  const params = new URLSearchParams(apiParams);

  const url = `${BASE_URL}?${params.toString()}`;
  console.log('🌐 GNews - Request URL:', url);

  try {
    const res = await fetch(url);
    console.log('📡 GNews - Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ GNews - HTTP Error:', res.status, errorText);
      throw new Error(`GNews HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log('📊 GNews - Response data:', data);

    if (!data.articles) {
      console.warn('⚠️ GNews - No articles in response');
      return [];
    }

    const articles = data.articles.map((a: any, idx: number) => ({
      id: a.url || idx.toString(),
      title: a.title,
      description: a.description,
      url: a.url,
      imageUrl: a.image,
      source: a.source?.name || 'GNews',
      author: a.author,
      publishedAt: a.publishedAt,
      category: category || '',
    }));

    console.log('✅ GNews - Processed articles:', articles.length);
    return articles;
  } catch (error) {
    console.error('❌ GNews - Fetch error:', error);
    throw error;
  }
}
