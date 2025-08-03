export interface UserPreferences {
  sources: string[];
  categories: string[];
  authors: string[];
  autoRefresh: boolean;
  maxArticles: number;
}

export interface AvailableOptions {
  sources: string[];
  categories: string[];
  authors: string[];
} 