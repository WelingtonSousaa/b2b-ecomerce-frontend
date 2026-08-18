'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/types/b2b';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  isProductInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (product: Product) => {
    setCompareItems(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      if (prev.length >= 4) {
        alert('Você pode comparar no máximo 4 produtos simultaneamente.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isProductInCompare = (productId: string) => {
    return compareItems.some(p => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        openCompareModal: () => setIsCompareOpen(true),
        closeCompareModal: () => setIsCompareOpen(false),
        isProductInCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
