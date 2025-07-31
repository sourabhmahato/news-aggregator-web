import { Article } from '../types/Article';

const API_KEY = process.env.REACT_APP_NYTIMES_KEY;
const BASE_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

export async function fetchNYTimesArticles({
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
  const params = new URLSearchParams({
    'api-key': API_KEY || '',
    q,
    fq: section ? `section_name:("${section}")` : '',
    begin_date: from ? from.replace(/-/g, '') : '',
    end_date: to ? to.replace(/-/g, '') : '',
  });
  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.response?.docs) return [];
  return data.response.docs.map((a: any) => ({
    id: a._id,
    title: a.headline?.main,
    description: a.abstract || '',
    url: a.web_url,
    imageUrl: a.multimedia?.length ? `https://www.nytimes.com/${a.multimedia[0].url}` : undefined,
    source: 'NYTimes',
    author: a.byline?.original,
    publishedAt: a.pub_date,
    category: a.section_name,
  }));
}