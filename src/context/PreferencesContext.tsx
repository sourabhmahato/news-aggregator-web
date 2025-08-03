import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, AvailableOptions } from '../types/UserPreferences';
import { StorageService } from '../services/StorageService';
import { APP_CONSTANTS } from '../constants/appConstants';

interface PreferencesContextType {
  preferences: UserPreferences;
  availableOptions: AvailableOptions;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  updateAvailableOptions: (options: Partial<AvailableOptions>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  sources: [],
  categories: [],
  authors: [],
  autoRefresh: false,
  maxArticles: APP_CONSTANTS.ARTICLES.DEFAULT_COUNT,
};

const defaultAvailableOptions: AvailableOptions = {
  sources: [],
  categories: [],
  authors: [],
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const storageService = StorageService.getInstance();
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return storageService.getItem<UserPreferences>(
      APP_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES, 
      defaultPreferences
    );
  });

  const [availableOptions, setAvailableOptions] = useState<AvailableOptions>(defaultAvailableOptions);

  useEffect(() => {
    storageService.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }, [preferences, storageService]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const updateAvailableOptions = (options: Partial<AvailableOptions>) => {
    setAvailableOptions(prev => ({ ...prev, ...options }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        availableOptions,
        updatePreferences,
        updateAvailableOptions,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}; 