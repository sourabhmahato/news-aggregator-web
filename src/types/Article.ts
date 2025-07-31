export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: string;
  author?: string;
  publishedAt: string;
  category?: string;
}