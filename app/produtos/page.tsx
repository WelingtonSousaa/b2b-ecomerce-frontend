'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  Check,
  Plus
} from 'lucide-react';

import ProductFilterBar, { FilterState } from '@/components/catalog/ProductFilterBar';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/mocks/mockProducts';

const defaultCatalogShowcase: Product[] = [];

export default function CatalogPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>(defaultCatalogShowcase);

  // Unified Filter State
  const initialFilters: FilterState = {
    type: 'Todos',
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    color: 'Todos',
    material: 'Todos',
    onlyDeals: false,
    sortBy: 'featured'
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedCart, setAddedCart] = useState<Record<string, boolean>>({});

  useEffect(() => {
    productsService.getProducts()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(mockProducts.map((p) => ({
            id: p.id,
            sku: p.sku,
            name: p.nome,
            basePrice: p.precos.padrao,
            description: `MOQ: ${p.moq} | Múltiplo: ${p.multiploVenda} cx`,
            categorySlug: p.categoria,
            images: [p.imagem]
          })) as any);
        }
      })
      .catch(() => {
        setProducts(mockProducts.map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.nome,
          basePrice: p.precos.padrao,
          description: `MOQ: ${p.moq} | Múltiplo: ${p.multiploVenda} cx`,
          categorySlug: p.categoria,
          images: [p.imagem]
        })) as any);
      });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    if (targetProduct) {
      addItem({
        id: targetProduct.id,
        sku: targetProduct.sku,
        name: targetProduct.name,
        price: targetProduct.basePrice,
        image: targetProduct.images && targetProduct.images[0] ? targetProduct.images[0] : '/placeholder.jpg',
        moq: targetProduct.moq || 1,
      });
    }
    setAddedCart(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedCart(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const filtered = products.filter(p => {
    if (filters.type !== 'Todos' && p.categorySlug !== filters.type) return false;
    if (p.basePrice < filters.minPrice || p.basePrice > filters.maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (filters.sortBy === 'price-high') return b.basePrice - a.basePrice;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen pb-20 pt-6 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/">Home</Link>
              <span>/</span>
              <span className="font-bold text-gray-900">Produtos</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Catálogo Corporativo de Produtos B2B
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Encontre produtos cadastrados com faturamento direto por CNPJ e cálculo automático de ICMS-ST.
            </p>
          </div>

          <Link
            href="/conta/estoque/novo"
            className="self-start sm:self-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Cadastrar Novo Produto</span>
          </Link>
        </div>

        {/* Filter Bar with Price Range Slider & All Filters */}
        <ProductFilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(initialFilters)}
          availableTypes={['Todos', 'fones-audio', 'computadores-ti', 'servidores-e-datacenter', 'moveis-escritorio']}
          totalResultsCount={filtered.length}
          maxCatalogPrice={50000}
        />

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((prod) => (
            <div key={prod.id} className="flex flex-col group">
              <div className="relative aspect-square w-full bg-[#f5f6f6] rounded-2xl p-6 flex items-center justify-center mb-3">
                <button
                  onClick={() => toggleFavorite(prod.id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-xs z-10 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${favorites[prod.id] ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <Link href={`/produto/${prod.sku}`} className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={prod.images && prod.images[0] ? prod.images[0] : '/media/img1.jpeg'}
                    alt={prod.name}
                    fill
                    className="object-contain p-4"
                  />
                </Link>
              </div>

              <div className="flex items-start justify-between gap-2 mb-1">
                <Link href={`/produto/${prod.sku}`}>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                </Link>
                <span className="text-sm font-black text-gray-900 shrink-0">
                  R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-1 mb-2">{prod.description}</p>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#16a34a] text-[#16a34a]" />
                ))}
                <span className="text-xs font-semibold text-gray-500 ml-1">SKU: {prod.sku}</span>
              </div>

              <button
                onClick={() => handleAddToCart(prod.id)}
                className={`w-full py-2.5 rounded-full text-xs font-bold transition-all border border-[#2563eb] flex items-center justify-center gap-2 cursor-pointer ${
                  addedCart[prod.id]
                    ? 'bg-[#2563eb] text-white'
                    : 'text-[#2563eb] hover:bg-[#2563eb] hover:text-white'
                }`}
              >
                {addedCart[prod.id] ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Adicionado!</span>
                  </>
                ) : (
                  <span>Adicionar ao Carrinho</span>
                )}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
