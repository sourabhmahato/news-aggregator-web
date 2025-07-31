import { fetchNewsApiArticles } from './newsapi';
import { fetchGuardianArticles } from './guardian';
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
  const guardianKey = process.env.REACT_APP_GUARDIAN_KEY;
  
  console.log('🔍 Environment variables check:');
  console.log('  NewsAPI key exists:', !!newsApiKey);
  console.log('  NewsAPI key length:', newsApiKey?.length || 0);
  console.log('  NewsAPI key starts with:', newsApiKey?.substring(0, 4) || 'N/A');
  console.log('  Guardian key exists:', !!guardianKey);
  console.log('  Guardian key length:', guardianKey?.length || 0);
  console.log('  Guardian key starts with:', guardianKey?.substring(0, 4) || 'N/A');
  
  const promises = [];
  
  // Only add NewsAPI if key is available
  if (newsApiKey && newsApiKey !== 'your_newsapi_key_here') {
    console.log('✅ NewsAPI key found, adding to promises');
    promises.push(fetchNewsApiArticles(params));
  } else {
    console.log('❌ NewsAPI key missing or not configured');
  }
  
  // Only add Guardian if key is available
  if (guardianKey && guardianKey !== 'your_guardian_key_here') {
    console.log('✅ Guardian key found, adding to promises');
    promises.push(fetchGuardianArticles(params));
  } else {
    console.log('❌ Guardian key missing or not configured');
  }
  
  if (promises.length === 0) {
    console.error('❌ No API keys configured');
    throw new Error('No API keys configured. Please add your API keys to the .env file.');
  }
  
  console.log(`📡 Making ${promises.length} API calls in parallel`);
  
  const results = await Promise.allSettled(promises);
  const all: Article[] = [];
  
  results.forEach((result, index) => {
    const apiName = index === 0 ? 'NewsAPI' : 'Guardian';
    if (result.status === 'fulfilled') {
      console.log(`✅ ${apiName} succeeded with ${result.value.length} articles`);
      all.push(...result.value);
    } else {
      console.error(`❌ ${apiName} failed:`, result.reason);
    }
  });
  
  console.log(`📊 Total articles collected: ${all.length}`);
  
  // Sort by publishedAt descending
  const sorted = all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  console.log('✅ Articles sorted by date');
  
  return sorted;
}