'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  ncm?: string;
  taxST?: number;
  ipi?: number;
  moq?: number;
  multiploVenda?: number;
  reviewCount?: number;
  rating?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { id: string; name: string; price: number }, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, deltaOrAbsolute: number, isAbsolute?: boolean) => void;
  fillPallet: (quantityToAdd: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  totalTaxST: number;
  totalIPI: number;
  grandTotal: number;
}

const DEFAULT_INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    sku: 'NTB-DELL-LAT7420',
    name: 'Notebook Dell Latitude 7420 14" i7 16GB 512GB SSD',
    price: 7500.0,
    quantity: 2,
    image: '/dellNotenook.jpg',
    ncm: '8471.30.12',
    taxST: 320.0,
    ipi: 375.0,
    moq: 5,
    multiploVenda: 5,
    rating: 5,
    reviewCount: 48,
  },
  {
    id: '2',
    sku: 'MON-DELL-P2422H',
    name: 'Monitor Dell 24" P2422H IPS Full HD',
    price: 1200.0,
    quantity: 5,
    image: '/monitorDell.jpg',
    ncm: '8528.52.00',
    taxST: 85.0,
    ipi: 24.0,
    moq: 10,
    multiploVenda: 2,
    rating: 5,
    reviewCount: 92,
  },
];

const STORAGE_KEY = 'onesync_b2b_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(DEFAULT_INITIAL_ITEMS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore storage errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on changes after initialization
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage quota errors
    }
  }, [items, isInitialized]);

  const addItem = useCallback(
    (product: Partial<CartItem> & { id: string; name: string; price: number }, quantity: number = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id || item.sku === product.sku);
        if (existingIndex > -1) {
          const updated = [...prev];
          const current = updated[existingIndex];
          updated[existingIndex] = {
            ...current,
            quantity: current.quantity + quantity,
          };
          return updated;
        }

        const newItem: CartItem = {
          id: product.id,
          sku: product.sku || `SKU-${product.id}`,
          name: product.name,
          price: product.price,
          quantity: Math.max(1, quantity),
          image: product.image || '/placeholder.jpg',
          ncm: product.ncm || '8471.30.00',
          taxST: product.taxST ?? Number((product.price * 0.04).toFixed(2)),
          ipi: product.ipi ?? Number((product.price * 0.05).toFixed(2)),
          moq: product.moq || 1,
          multiploVenda: product.multiploVenda || 1,
          rating: product.rating || 5,
          reviewCount: product.reviewCount || 12,
        };
        return [newItem, ...prev];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, deltaOrAbsolute: number, isAbsolute: boolean = false) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = isAbsolute
            ? Math.max(1, deltaOrAbsolute)
            : Math.max(1, item.quantity + deltaOrAbsolute);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  }, []);

  const fillPallet = useCallback((quantityToAdd: number) => {
    if (quantityToAdd <= 0) return;
    setItems((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((item, idx) => {
        if (idx === 0) {
          return { ...item, quantity: item.quantity + quantityToAdd };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const totalItemsCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const totalTaxST = useMemo(
    () => items.reduce((acc, item) => acc + (item.taxST || 0) * item.quantity, 0),
    [items]
  );

  const totalIPI = useMemo(
    () => items.reduce((acc, item) => acc + (item.ipi || 0) * item.quantity, 0),
    [items]
  );

  const grandTotal = useMemo(
    () => subtotal + totalTaxST + totalIPI,
    [subtotal, totalTaxST, totalIPI]
  );

  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      fillPallet,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      totalItemsCount,
      subtotal,
      totalTaxST,
      totalIPI,
      grandTotal,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      fillPallet,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      totalItemsCount,
      subtotal,
      totalTaxST,
      totalIPI,
      grandTotal,
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
