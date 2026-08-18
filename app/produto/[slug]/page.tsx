'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Star,
  Plus,
  Minus,
  Heart,
  Check,
  Lock,
  Scale,
  FileCheck2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';
import { useToast } from '@/context/ToastContext';
import ShippingTaxCalculator from '@/components/common/ShippingTaxCalculator';
import FormalQuotePdfModal from '@/components/modals/FormalQuotePdfModal';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';

export default function ProductDetailPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addToCompare, isProductInCompare } = useCompare();
  const { showToast } = useToast();
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Padrão / Original');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    productsService.getProductBySku(slug)
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
          setQuantity(res.data.moq || 1);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500">Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Produto não encontrado</h2>
        <p className="text-xs text-gray-500">O SKU solicitado não existe no catálogo corporativo.</p>
        <Link href="/produtos" className="inline-block bg-[#004e38] text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    '/media/airpods_max_pink.jpg',
    '/media/img3.jpeg',
    '/media/wireless_earbuds.jpg',
    '/media/red_headphones.jpg'
  ];

  const colors = [
    { name: 'Padrão / Original', hex: '#383838', imgIndex: 0 },
    { name: 'Cinza Espacial', hex: '#52525b', imgIndex: Math.min(1, images.length - 1) },
    { name: 'Prateado Fosco', hex: '#e4e4e7', imgIndex: Math.min(2, images.length - 1) },
    { name: 'Azul Corporativo', hex: '#004e38', imgIndex: Math.min(3, images.length - 1) },
  ];

  const totalAvailableStock = product.stockByCD ? product.stockByCD.reduce((acc, cd) => acc + cd.availableQuantity, 0) : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openAuthModal('Para adicionar produtos ao carrinho e realizar compras na plataforma B2B, por favor acesse sua conta.');
      return;
    }
    setIsAdded(true);
    showToast(`${product.name} (${quantity} un.) adicionado ao carrinho com sucesso!`, 'success');
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal('Para realizar o fechamento do pedido e faturar via CNPJ, acesse sua conta ou cadastre sua empresa.');
    }
  };

  const handleCompareClick = () => {
    addToCompare(product);
    showToast(`${product.name} adicionado ao Comparador Técnico!`, 'info');
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-6 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-8">
        
        {/* 1. Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-[#004e38]">Produtos Corporativos</Link>
          <span>/</span>
          <Link href={`/produtos?categoria=${product.categorySlug || 'fones-audio'}`} className="hover:text-[#004e38]">
            {product.brand}
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-900 truncate max-w-xs">{product.name}</span>
        </div>

        {/* 2. Main Product Details Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Product Container */}
            <div className="relative aspect-square w-full bg-[#f5f6f6] rounded-3xl p-8 flex items-center justify-center">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('Para salvar produtos em seus favoritos, por favor acesse sua conta.');
                  } else {
                    showToast('Produto adicionado aos Favoritos!', 'success');
                  }
                }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-xs cursor-pointer"
              >
                <Heart className="w-5 h-5" />
              </button>

              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-contain p-8"
              />
            </div>

            {/* Thumbnail Selector Row */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square w-full bg-[#f5f6f6] rounded-2xl p-2 transition-all cursor-pointer ${
                    selectedImage === idx ? 'ring-2 ring-[#004e38]' : 'hover:opacity-80'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-2" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & SKU */}
            <div className="space-y-2 border-b border-gray-100 pb-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                  SKU: {product.sku}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {totalAvailableStock} un. em estoque
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {product.brand} Oficial
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs text-gray-500 leading-relaxed">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-gray-700">(121 avaliações corporativas)</span>
              </div>
            </div>

            {/* Price & B2B Gating */}
            <div className="bg-[#f5f6f6] p-5 rounded-2xl space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-700 block">Preço Corporativo / Unidade:</span>
                  {isAuthenticated ? (
                    <span className="text-2xl sm:text-3xl font-black text-[#004e38]">
                      R$ {product.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mt-1">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold">Preço Oculto (Acesso exclusivo por CNPJ)</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-700 block">Lote Mínimo (MOQ):</span>
                  <span className="text-sm font-black text-gray-900">{product.moq} unidades</span>
                </div>
              </div>

              {/* Volume Discount Tier Table */}
              {product.volumeDiscounts && product.volumeDiscounts.length > 0 && (
                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                    Tabela de Desconto Progressivo por Volume
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {product.volumeDiscounts.map((tier, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-xl border border-gray-200">
                        <span className="block text-[10px] text-gray-600">A partir de {tier.minQuantity} un.</span>
                        <strong className="text-emerald-800 font-black">
                          R$ {tier.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color/Variant Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-900 block">
                Escolha a Cor / Variação: <span className="text-gray-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color.name);
                      setSelectedImage(color.imgIndex);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === color.name ? 'ring-2 ring-offset-2 ring-[#004e38]' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Quantity Control */}
                <div className="flex items-center justify-between bg-[#f5f6f6] rounded-full p-1.5 w-full sm:w-40 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(product.moq, prev - 1))}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-xs text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Buy Now / Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-6 rounded-full font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#004e38] hover:bg-[#003c2b] text-white hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado ao Carrinho!</span>
                    </>
                  ) : (
                    <span>Adicionar ao Carrinho Corporativo</span>
                  )}
                </button>

              </div>

              {/* Secondary Actions: Quick Checkout, Compare & Formal PDF Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/checkout"
                  onClick={handleBuyNowClick}
                  className="py-3 px-4 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 text-center transition-colors block"
                >
                  Faturamento Direto (Checkout)
                </Link>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="py-3 px-4 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#004e38] text-xs font-black transition-colors flex items-center justify-center gap-2 cursor-pointer border border-emerald-200"
                >
                  <FileCheck2 className="w-4 h-4 text-[#004e38]" />
                  <span>Gerar Proposta Comercial (PDF)</span>
                </button>
              </div>

              {/* Add to Compare button */}
              <button
                type="button"
                onClick={handleCompareClick}
                className="w-full py-2.5 text-center text-xs font-bold text-gray-500 hover:text-[#004e38] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>
                  {isProductInCompare(product.id) ? 'Item no Comparador' : 'Adicionar ao Comparador Técnico'}
                </span>
              </button>
            </div>

            {/* 3. Real-time Multi-CD Stock & Tax Simulator */}
            <div className="pt-4 border-t border-gray-100">
              <ShippingTaxCalculator productPrice={product.basePrice} />
            </div>

          </div>

        </div>

      </div>

      {/* Formal Quote PDF Modal */}
      {isQuoteModalOpen && (
        <FormalQuotePdfModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          items={[{ product, quantity }]}
        />
      )}

    </div>
  );
}
