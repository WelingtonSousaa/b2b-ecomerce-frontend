'use client';

import React, { createContext, useContext, useCallback, useMemo, useEffect, useSyncExternalStore } from 'react';
import { StorefrontConfig, defaultStorefrontConfig } from '@/types/storefront';
import { storefrontService } from '@/services/storefront.service';

interface StorefrontContextType {
  config: StorefrontConfig;
  updateConfig: (newConfig: Partial<StorefrontConfig>) => void;
  resetConfig: () => void;
  isCustomized: boolean;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

const STORAGE_KEY = 'shopcart_storefront_config';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('storefront_update', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('storefront_update', callback);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) || '';
}

function getServerSnapshot(): string {
  return '';
}

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const storeSnapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync config from backend on initial mount
  useEffect(() => {
    let isMounted = true;
    storefrontService
      .getConfig()
      .then((res) => {
        if (isMounted && res.data && typeof window !== 'undefined') {
          const currentLocal = localStorage.getItem(STORAGE_KEY);
          if (!currentLocal) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
            window.dispatchEvent(new Event('storefront_update'));
          }
        }
      })
      .catch(() => {
        // Backend offline or standalone fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const config: StorefrontConfig = useMemo(() => {
    if (!storeSnapshot) return defaultStorefrontConfig;
    try {
      const parsed = JSON.parse(storeSnapshot);
      return {
        ...defaultStorefrontConfig,
        ...parsed,
        theme: { ...defaultStorefrontConfig.theme, ...(parsed.theme || {}) },
        hero: { ...defaultStorefrontConfig.hero, ...(parsed.hero || {}) },
        announcement: { ...defaultStorefrontConfig.announcement, ...(parsed.announcement || {}) },
      };
    } catch {
      return defaultStorefrontConfig;
    }
  }, [storeSnapshot]);

  const isCustomized = Boolean(storeSnapshot);

  const updateConfig = useCallback((newConfig: Partial<StorefrontConfig>) => {
    if (typeof window !== 'undefined') {
      const current = getSnapshot();
      let prev = defaultStorefrontConfig;
      if (current) {
        try {
          prev = { ...defaultStorefrontConfig, ...JSON.parse(current) };
        } catch {
          // fallback
        }
      }
      const updated = {
        ...prev,
        ...newConfig,
        theme: { ...prev.theme, ...(newConfig.theme || {}) },
        hero: { ...prev.hero, ...(newConfig.hero || {}) },
        announcement: { ...prev.announcement, ...(newConfig.announcement || {}) },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storefront_update'));

      // Asynchronously sync with backend
      storefrontService.updateConfig(updated).catch(() => {});
    }
  }, []);

  const resetConfig = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('storefront_update'));
      storefrontService.updateConfig(defaultStorefrontConfig).catch(() => {});
    }
  }, []);

  return (
    <StorefrontContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        isCustomized,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront deve ser usado dentro de um StorefrontProvider');
  }
  return context;
}
