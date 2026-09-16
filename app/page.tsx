'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Star,
  Check,
  Armchair,
  Headphones,
  Shirt,
  ShoppingBag,
  Laptop,
  BookOpen,
  Lock,
  Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProductFilterBar, { FilterState } from '@/components/catalog/ProductFilterBar';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';

const defaultCatalogShowcase: Product[] = [];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [products, setProducts] = useState<Product[]>(defaultCatalogShowcase);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedCart, setAddedCart] = useState<Record<string, boolean>>({});

  // Unified Filter State
  const initialFilters: FilterState = {
    type: 'Todos',
    minPrice: 0,
    maxPrice: 30000,
    minRating: 0,
    color: 'Todos',
    material: 'Todos',
    onlyDeals: false,
    sortBy: 'featured'
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    productsService.getProducts()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = (id: string) => {
    if (!isAuthenticated) {
      openAuthModal('Para salvar produtos em seus favoritos, acesse sua conta ou cadastre sua empresa.');
      return;
    }
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (id: string) => {
    if (!isAuthenticated) {
      openAuthModal('Para adicionar itens ao carrinho e realizar compras por CNPJ, acesse sua conta ou cadastre sua empresa.');
      return;
    }
    setAddedCart(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedCart(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal('Para visualizar a página completa de detalhes do produto e especificações fiscais, acesse sua conta.');
    }
  };

  // Popular Categories
  const popularCategories: any[] = [];

  // Filter products based on selected options
  const filteredProducts = products.filter(p => {
    if (filters.type !== 'Todos' && p.categorySlug !== filters.type) return false;
    if (p.basePrice < filters.minPrice || p.basePrice > filters.maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (filters.sortBy === 'price-high') return b.basePrice - a.basePrice;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen pb-20 space-y-12 font-sans">
      
      {/* Guest Mode Parachute Visitor Banner */}
      {!isAuthenticated && (
        <div className="bg-[#f5f6f6] border-b border-blue-100 py-3 px-4 text-center text-xs font-semibold text-gray-700">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2">
            <Building2 className="w-4 h-4 text-[#2563eb]" />
            <span>Você está no <strong>Modo Visitante</strong>. Para visualizar preços por CNPJ, faturamento a prazo e limite de crédito,</span>
            <button
              onClick={() => openAuthModal()}
              className="font-extrabold text-[#2563eb] underline hover:text-[#1d4ed8] cursor-pointer"
            >
              acesse sua conta ou cadastre sua empresa.
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO BANNER SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-6">
        <div
          className="p-8 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden transition-colors rounded-3xl bg-[#f0fdf4]"
        >
          {/* Left Hero Text Content */}
          <div className="max-w-xl space-y-4 z-10">
            <span
              className="inline-block text-xs font-black uppercase px-3 py-1 rounded-full text-white shadow-xs bg-[#2563eb]"
            >
              Novo Lançamento
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#2563eb]"
            >
              O Futuro da Tecnologia Corporativa
            </h1>

            <p className="text-sm text-gray-700 leading-relaxed max-w-lg">
              Equipe seus colaboradores com o que há de melhor em produtividade.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('Para realizar pedidos e conferir ofertas exclusivas para CNPJ, acesse sua conta.');
                  } else {
                    router.push('/produtos');
                  }
                }}
                className="inline-block text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-sm hover:scale-105 cursor-pointer bg-[#2563eb]"
              >
                Comprar Agora
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative w-full md:w-1/2 aspect-[4/3] max-w-md shrink-0">
            <Image
              src="/media/hero_woman.jpg"
              alt="Hero Banner"
              fill
              className="object-cover rounded-2xl shadow-md"
              priority
            />
          </div>

        </div>
      </section>

      {/* 2. FILTER PILLS BAR WITH SLIDER AND ALL FUNCTIONAL FILTERS */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <ProductFilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(initialFilters)}
          availableTypes={['Todos', 'fones-audio', 'computadores-ti', 'servidores-e-datacenter', 'moveis-escritorio']}
          totalResultsCount={filteredProducts.length}
          maxCatalogPrice={30000}
        />
      </section>

      {/* 3. MAIN PRODUCTS GRID */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Fones de Ouvido & Equipamentos Para Você!
          </h2>
          <Link
            href="/produtos"
            className="text-xs font-bold text-[#2563eb] hover:underline"
          >
            Ver Todo o Catálogo ({products.length} itens) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="flex flex-col group">
              
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-[#f5f6f6] rounded-2xl p-6 flex items-center justify-center mb-3 transition-transform group-hover:scale-[1.02]">
                <button
                  onClick={() => toggleFavorite(prod.id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-xs z-10 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${favorites[prod.id] ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <Link
                  href={`/produto/${prod.sku}`}
                  onClick={handleProductClick}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={prod.images && prod.images[0] ? prod.images[0] : '/media/img1.jpeg'}
                    alt={prod.name}
                    fill
                    className="object-contain p-4"
                  />
                </Link>
              </div>

              {/* Product Details Header: Title & Price */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <Link href={`/produto/${prod.sku}`} onClick={handleProductClick}>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                </Link>

                {isAuthenticated ? (
                  <span className="text-sm font-black text-gray-900 shrink-0">
                    R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal('Para visualizar o preço exclusivo deste produto, entre com seu CNPJ.')}
                    className="text-[11px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" /> Preço CNPJ
                  </button>
                )}
              </div>

              {/* Subtitle / Description */}
              <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                {prod.description}
              </p>

              {/* Rating Row */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#16a34a] text-[#16a34a]" />
                ))}
                <span className="text-xs font-semibold text-gray-500 ml-1">SKU: {prod.sku}</span>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-auto">
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
                  ) : !isAuthenticated ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Entrar para Comprar</span>
                    </>
                  ) : (
                    <span>Adicionar ao Carrinho</span>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR CATEGORIES SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Categorias Populares
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produtos?categoria=${cat.slug}`}
              className="bg-[#f5f6f6] hover:bg-gray-200/80 p-4 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                <Image src={cat.img} alt={cat.name} width={36} height={36} className="object-contain max-h-9" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors">{cat.name}</span>
                <span className="text-[10px] text-gray-400 font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SIMILAR ITEMS */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Produtos Semelhantes Que Você Pode Gostar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((prod) => (
            <div key={`sim-${prod.id}`} className="flex flex-col group">
              <div className="relative aspect-square w-full bg-[#f5f6f6] rounded-2xl p-6 flex items-center justify-center mb-3">
                <button
                  onClick={() => toggleFavorite(prod.id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-xs z-10 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${favorites[prod.id] ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <Link
                  href={`/produto/${prod.sku}`}
                  onClick={handleProductClick}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image src={prod.images && prod.images[0] ? prod.images[0] : '/media/img1.jpeg'} alt={prod.name} fill className="object-contain p-4" />
                </Link>
              </div>

              <div className="flex items-start justify-between gap-2 mb-1">
                <Link href={`/produto/${prod.sku}`}>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                </Link>
                {isAuthenticated ? (
                  <span className="text-sm font-black text-gray-900 shrink-0">
                    R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                    🔒 Sob Consulta
                  </span>
                )}
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
                className="w-full py-2.5 rounded-full text-xs font-bold transition-all border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white cursor-pointer"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
