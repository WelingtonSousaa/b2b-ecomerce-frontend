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

const defaultCatalogShowcase: Product[] = [
  {
    id: 'prod-1',
    sku: 'DELL-R750-XS',
    ean: '7891234560011',
    ncm: '8471.49.00',
    name: 'Servidor Dell PowerEdge R750xs Dual Xeon Silver',
    description: 'Servidor corporativo 2U para rack com 2 processadores Intel Xeon Silver 4314, 64GB RAM DDR4 ECC e 2x SSD 960GB SAS Enterprise.',
    categorySlug: 'servidores-e-datacenter',
    brand: 'Dell Enterprise',
    images: ['/media/server_rack_nas.jpg', '/media/img1.jpeg'],
    basePrice: 28499.00,
    moq: 1,
    uom: 'UN',
    itemsPerUom: 1,
    hasVariants: true,
    batchNumber: 'LOTE-DELL-2026-A',
    expirationDate: '2029-12-31',
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 42 },
      { cdId: 'cd-sc', cdName: 'CD Santa Catarina', cdStateUF: 'SC', availableQuantity: 18 },
      { cdId: 'cd-ba', cdName: 'CD Bahia', cdStateUF: 'BA', availableQuantity: 12 },
    ],
    volumeDiscounts: [
      { minQuantity: 1, maxQuantity: 4, unitPrice: 28499.00, discountPercentage: 0 },
      { minQuantity: 5, maxQuantity: 9, unitPrice: 26990.00, discountPercentage: 5.29 },
      { minQuantity: 10, unitPrice: 25200.00, discountPercentage: 11.58 },
    ],
  },
  {
    id: 'prod-2',
    sku: 'MBP-M3-MAX-64',
    ean: '7891234560028',
    ncm: '8471.30.12',
    name: 'Workstation Portátil MacBook Pro 16" M3 Max 64GB 1TB',
    description: 'Workstation corporativa de alta potência para desenvolvimento e engenharia. Chip M3 Max com CPU de 16 núcleos.',
    categorySlug: 'notebooks-corporativos',
    brand: 'Apple Enterprise',
    images: ['/media/laptop_enterprise.jpg'],
    basePrice: 23999.00,
    moq: 2,
    uom: 'UN',
    itemsPerUom: 1,
    hasVariants: false,
    batchNumber: 'LOTE-AAPL-2026-X',
    expirationDate: '2030-01-01',
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 35 },
      { cdId: 'cd-sc', cdName: 'CD Santa Catarina', cdStateUF: 'SC', availableQuantity: 14 },
      { cdId: 'cd-ba', cdName: 'CD Bahia', cdStateUF: 'BA', availableQuantity: 8 },
    ],
    volumeDiscounts: [
      { minQuantity: 2, maxQuantity: 4, unitPrice: 23999.00, discountPercentage: 0 },
      { minQuantity: 5, maxQuantity: 9, unitPrice: 22500.00, discountPercentage: 6.25 },
      { minQuantity: 10, unitPrice: 20900.00, discountPercentage: 12.91 },
    ],
  },
  {
    id: 'prod-3',
    sku: 'SKU-HEAD-01',
    ean: '7891234560035',
    ncm: '8518.30.00',
    name: 'Fone Bluetooth TWS Pro ANC IPX8',
    description: 'Isolamento acústico ativo híbrido, drivers de alta fidelidade e case com recarga rápida Qi.',
    categorySlug: 'fones-audio',
    brand: 'AudioTech B2B',
    images: ['/media/wireless_earbuds.jpg'],
    basePrice: 489.00,
    moq: 5,
    uom: 'CX',
    itemsPerUom: 10,
    hasVariants: false,
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 120 },
    ],
    volumeDiscounts: [],
  },
  {
    id: 'prod-4',
    sku: 'SKU-HEAD-02',
    ean: '7891234560042',
    ncm: '8518.30.00',
    name: 'AirPods Max Studio High-Fi Edition',
    description: 'O equilíbrio perfeito entre áudio de alta fidelidade, cancelamento ativo de ruído e conforto executivo.',
    categorySlug: 'fones-audio',
    brand: 'Apple Enterprise',
    images: ['/media/airpods_max_pink.jpg'],
    basePrice: 2549.00,
    moq: 1,
    uom: 'UN',
    itemsPerUom: 1,
    hasVariants: false,
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 25 },
    ],
    volumeDiscounts: [],
  },
  {
    id: 'prod-5',
    sku: 'SKU-HEAD-03',
    ean: '7891234560059',
    ncm: '8518.30.00',
    name: 'Headset Wireless Poly Voyager Focus 2 UC',
    description: 'Cancelamento de ruído Acoustic Fence com base dock de recarga rápida e certificação Microsoft Teams.',
    categorySlug: 'fones-audio',
    brand: 'Poly HP Enterprise',
    images: ['/media/corporate_headset.jpg'],
    basePrice: 1289.00,
    moq: 2,
    uom: 'UN',
    itemsPerUom: 1,
    hasVariants: false,
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 45 },
    ],
    volumeDiscounts: [],
  },
  {
    id: 'prod-6',
    sku: 'SKU-HEAD-04',
    ean: '7891234560066',
    ncm: '8518.30.00',
    name: 'Headset Estéreo Call Center USB Anti-Ruído',
    description: 'Headset estéreo ultra leve e resistente para operações 24/7 de televendas e atendimento ao cliente.',
    categorySlug: 'fones-audio',
    brand: 'AudioTech B2B',
    images: ['/media/red_headphones.jpg'],
    basePrice: 189.00,
    moq: 10,
    uom: 'CX',
    itemsPerUom: 20,
    hasVariants: false,
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 200 },
    ],
    volumeDiscounts: [],
  },
  {
    id: 'prod-7',
    sku: 'SKU-MON-01',
    ean: '7891234560073',
    ncm: '8528.52.00',
    name: 'Monitor Profissional 34" 4K Ultrawide Curvo',
    description: 'Painel IPS 4K HDR com dock USB-C 90W integrado e calibração de fábrica 99% sRGB.',
    categorySlug: 'computadores-ti',
    brand: 'Dell Enterprise',
    images: ['/media/smart_monitor_4k.jpg'],
    basePrice: 4290.00,
    moq: 1,
    uom: 'UN',
    itemsPerUom: 1,
    hasVariants: false,
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 30 },
    ],
    volumeDiscounts: [],
  },
  {
    id: 'prod-8',
    sku: 'SKU-CHR-01',
    ean: '7891234560080',
    ncm: '9401.30.00',
    name: 'Cadeira Ergonômica Presidente NR-17',
    description: 'Tela mesh respirável com apoio lombar dinâmico 4D e mecanismo syncron de reclinação.',
    categorySlug: 'moveis-escritorio',
    brand: 'ErgoOffice B2B',
    images: ['/media/ergonomic_chair.jpg'],
    basePrice: 2490.00,
    moq: 2,
    uom: 'UN',
    itemsPerUom: 1,
    hasVariants: false,
    stockByCD: [
      { cdId: 'cd-sp', cdName: 'CD São Paulo (Matriz)', cdStateUF: 'SP', availableQuantity: 50 },
    ],
    volumeDiscounts: [],
  },
];

export default function CatalogPage() {
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
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (id: string) => {
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
            className="self-start sm:self-auto bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
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
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#004e38] transition-colors line-clamp-1">
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
                className={`w-full py-2.5 rounded-full text-xs font-bold transition-all border border-[#004e38] flex items-center justify-center gap-2 cursor-pointer ${
                  addedCart[prod.id]
                    ? 'bg-[#004e38] text-white'
                    : 'text-[#004e38] hover:bg-[#004e38] hover:text-white'
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
