import { Article } from '../types/Article';

const API_KEY = process.env.REACT_APP_GUARDIAN_KEY;
const BASE_URL = 'https://content.guardianapis.com/search';

export async function fetchGuardianArticles({
  q = '',
  from = '',
  to = '',
  section = '',
}: {
  q?: string;
  from?: string;
  to?: string;
  section?: string;
}): Promise<Article[]> {
  console.log('🔍 Guardian - Starting fetch with params:', { q, from, to, section });
  console.log('🔑 Guardian - API Key available:', !!API_KEY);
  
  const params = new URLSearchParams({
    'api-key': API_KEY || '',
    q: q || 'news', // Default query if empty
    'from-date': from,
    'to-date': to,
    section,
    'show-fields': 'headline,trailText,thumbnail,byline',
  });
  
  const url = `${BASE_URL}?${params.toString()}`;
  console.log('🌐 Guardian - Request URL:', url);
  
  try {
    const res = await fetch(url);
    console.log('📡 Guardian - Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Guardian - HTTP Error:', res.status, errorText);
      throw new Error(`Guardian HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('📊 Guardian - Response data:', data);
    
    if (data.response?.status === 'error') {
      console.error('❌ Guardian - API Error:', data.response.message);
      throw new Error(`Guardian Error: ${data.response.message}`);
    }
    
    if (!data.response?.results) {
      console.warn('⚠️ Guardian - No results in response');
      return [];
    }
    
    const articles = data.response.results.map((a: any) => ({
      id: a.id,
      title: a.webTitle,
      description: a.fields?.trailText || '',
      url: a.webUrl,
      imageUrl: a.fields?.thumbnail,
      source: 'The Guardian',
      author: a.fields?.byline,
      publishedAt: a.webPublicationDate,
      category: a.sectionName,
    }));
    
    console.log('✅ Guardian - Processed articles:', articles.length);
    return articles;
  } catch (error) {
    console.error('❌ Guardian - Fetch error:', error);
    throw error;
  }
}