export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    THEME: 'theme',
    USER_PREFERENCES: 'userPreferences'
  },
  
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  
  AUTO_REFRESH: {
    INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
    ENABLED: true,
    DISABLED: false
  },
  
  ARTICLES: {
    MIN_COUNT: 5,
    MAX_COUNT: 50,
    DEFAULT_COUNT: 20
  },
  
  UI: {
    GRID_MIN_WIDTH: 300,
    CARD_MAX_WIDTH: 600,
    SCROLLBAR_WIDTH: 8,
    BORDER_RADIUS: 12
  },
  
  CATEGORIES: {
    TECHNOLOGY: 'technology',
    BUSINESS: 'business',
    POLITICS: 'politics',
    SPORTS: 'sports',
    ENTERTAINMENT: 'entertainment',
    SCIENCE: 'science'
  },
  
  SOURCES: {
    NEWS_API: 'NewsAPI',
    WORLD_NEWS: 'World News'
  }
} as const;

export const ERROR_MESSAGES = {
  API_KEYS_MISSING: 'No API keys configured. Please add your API keys to the .env file.',
  FETCH_FAILED: 'Failed to fetch articles. Please try again.',
  NO_ARTICLES: 'No articles found. Try adjusting your search criteria.',
  NO_PREFERENCES_MATCH: 'No articles match your current preferences. Try adjusting your filters.',
  INVALID_DATE: 'Invalid Date'
} as const;

export const SUCCESS_MESSAGES = {
  ARTICLES_LOADED: 'Articles loaded successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
  AUTO_REFRESH_ENABLED: 'Auto-refresh enabled - Articles will update every 5 minutes'
} as const; 