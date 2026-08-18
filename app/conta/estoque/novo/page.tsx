'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Layers,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Barcode,
  Save,
  Tag,
  Sparkles,
  Calendar,
  DollarSign
} from 'lucide-react';
import { productsService } from '@/services/products.service';
import { Product, ProductVariant, UOM, DEFAULT_DISTRIBUTION_CENTERS } from '@/types/b2b';
import { useToast } from '@/context/ToastContext';

interface AttributeInput {
  name: string;
  valuesStr: string;
}

export default function NovoProdutoGradePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Basic Info
  const [name, setName] = useState('Smartphone Galaxy Enterprise 5G');
  const [brand, setBrand] = useState('Samsung');
  const [categorySlug, setCategorySlug] = useState('laptops');
  const [description, setDescription] = useState('Smartphone corporativo homologado com recursos de segurança e durabilidade industrial.');
  const [ncm, setNcm] = useState('8517.13.00');
  const [uom, setUom] = useState<UOM>('CX');
  const [itemsPerUom, setItemsPerUom] = useState<number>(5);
  const [moq, setMoq] = useState<number>(2);
  const [basePrice, setBasePrice] = useState<number>(3499.00);
  const [batchNumber, setBatchNumber] = useState('LOT-SMR-2026A');
  const [expirationDate, setExpirationDate] = useState('2029-12-31');

  // Variation Attributes
  const [attributes, setAttributes] = useState<AttributeInput[]>([
    { name: 'Cor', valuesStr: 'Preto Titânio, Prata Polar, Azul Safira' },
    { name: 'Armazenamento', valuesStr: '128GB, 256GB' },
  ]);

  // Generated Variants List
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: 'var-1',
      sku: 'SKU-GAL-TIT-128',
      ean: '7891234570011',
      combination: { 'Cor': 'Preto Titânio', 'Armazenamento': '128GB' },
      basePrice: 3499.00,
      stockByCD: [
        { cdId: 'cd-sp', cdName: 'CD Sudeste - SP', cdStateUF: 'SP', availableQuantity: 120 },
        { cdId: 'cd-sc', cdName: 'CD Sul - SC', cdStateUF: 'SC', availableQuantity: 60 },
        { cdId: 'cd-ba', cdName: 'CD Nordeste - BA', cdStateUF: 'BA', availableQuantity: 20 },
      ],
      minStockThreshold: 20,
      batchNumber: 'LOT-SMR-2026A',
      expirationDate: '2029-12-31',
    },
    {
      id: 'var-2',
      sku: 'SKU-GAL-TIT-256',
      ean: '7891234570028',
      combination: { 'Cor': 'Preto Titânio', 'Armazenamento': '256GB' },
      basePrice: 3899.00,
      stockByCD: [
        { cdId: 'cd-sp', cdName: 'CD Sudeste - SP', cdStateUF: 'SP', availableQuantity: 90 },
        { cdId: 'cd-sc', cdName: 'CD Sul - SC', cdStateUF: 'SC', availableQuantity: 40 },
        { cdId: 'cd-ba', cdName: 'CD Nordeste - BA', cdStateUF: 'BA', availableQuantity: 15 },
      ],
      minStockThreshold: 15,
      batchNumber: 'LOT-SMR-2026B',
      expirationDate: '2029-12-31',
    },
    {
      id: 'var-3',
      sku: 'SKU-GAL-SLV-128',
      ean: '7891234570035',
      combination: { 'Cor': 'Prata Polar', 'Armazenamento': '128GB' },
      basePrice: 3499.00,
      stockByCD: [
        { cdId: 'cd-sp', cdName: 'CD Sudeste - SP', cdStateUF: 'SP', availableQuantity: 80 },
        { cdId: 'cd-sc', cdName: 'CD Sul - SC', cdStateUF: 'SC', availableQuantity: 30 },
        { cdId: 'cd-ba', cdName: 'CD Nordeste - BA', cdStateUF: 'BA', availableQuantity: 10 },
      ],
      minStockThreshold: 15,
      batchNumber: 'LOT-SMR-2026C',
      expirationDate: '2029-12-31',
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    productsService.getProducts().then((res) => {
      if (res.data) setCatalogProducts(res.data);
    }).catch(() => {});
  }, []);

  // Duplicity Checker across all variants and existing catalog
  const duplicityAlerts = useMemo(() => {
    const alerts: { sku: string; ean: string; conflictWith: string }[] = [];

    variants.forEach(variant => {
      // Check SKU
      const existingBySku = catalogProducts.find(
        p => p.sku.toLowerCase() === variant.sku.toLowerCase() ||
        (p.variants && p.variants.some(v => v.sku.toLowerCase() === variant.sku.toLowerCase()))
      );
      // Check EAN
      const existingByEan = catalogProducts.find(
        p => p.ean === variant.ean ||
        (p.variants && p.variants.some(v => v.ean === variant.ean))
      );

      if (existingBySku) {
        alerts.push({
          sku: variant.sku,
          ean: variant.ean,
          conflictWith: `SKU já registrado no produto "${existingBySku.name}"`
        });
      } else if (existingByEan) {
        alerts.push({
          sku: variant.sku,
          ean: variant.ean,
          conflictWith: `Código de Barras EAN-13 já cadastrado no produto "${existingByEan.name}"`
        });
      }
    });

    return alerts;
  }, [variants, catalogProducts]);

  // Add new attribute row
  const handleAddAttribute = () => {
    setAttributes(prev => [...prev, { name: 'Novo Atributo', valuesStr: 'Opção 1, Opção 2' }]);
  };

  const handleRemoveAttribute = (idx: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAttributeChange = (idx: number, field: 'name' | 'valuesStr', val: string) => {
    setAttributes(prev => prev.map((attr, i) => i === idx ? { ...attr, [field]: val } : attr));
  };

  // Generate Cartesian Product of Attributes
  const handleGenerateMatrix = () => {
    const validAttrs = attributes.filter(
      a => a.name.trim() && a.valuesStr.trim()
    ).map(a => ({
      name: a.name.trim(),
      values: a.valuesStr.split(',').map(v => v.trim()).filter(Boolean)
    }));

    if (validAttrs.length === 0) return;

    // Helper for Cartesian product
    const cartesian = (arr: { name: string; values: string[] }[]): Record<string, string>[] => {
      return arr.reduce<Record<string, string>[]>((acc, curr) => {
        if (acc.length === 0) {
          return curr.values.map(val => ({ [curr.name]: val }));
        }
        const res: Record<string, string>[] = [];
        acc.forEach(prevComb => {
          curr.values.forEach(val => {
            res.push({ ...prevComb, [curr.name]: val });
          });
        });
        return res;
      }, []);
    };

    const combinations = cartesian(validAttrs);
    const brandPrefix = brand.substring(0, 3).toUpperCase() || 'PRD';
    const randomBaseEan = Math.floor(789123400000 + Math.random() * 900000);

    const generated: ProductVariant[] = combinations.map((comb, index) => {
      const combSuffix = Object.values(comb)
        .map(v => v.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase())
        .join('-');

      return {
        id: `var-${Date.now()}-${index}`,
        sku: `SKU-${brandPrefix}-${combSuffix}-${index + 1}`,
        ean: `${randomBaseEan}${index + 1}0`.substring(0, 13),
        combination: comb,
        basePrice: Number(basePrice) || 100,
        stockByCD: [
          { cdId: 'cd-sp', cdName: 'CD Sudeste - SP', cdStateUF: 'SP', availableQuantity: 50 },
          { cdId: 'cd-sc', cdName: 'CD Sul - SC', cdStateUF: 'SC', availableQuantity: 25 },
          { cdId: 'cd-ba', cdName: 'CD Nordeste - BA', cdStateUF: 'BA', availableQuantity: 10 },
        ],
        minStockThreshold: 10,
        batchNumber: batchNumber || 'LOT-2026',
        expirationDate: expirationDate || '2029-12-31'
      };
    });

    setVariants(generated);
  };

  const handleUpdateVariantField = (
    index: number,
    field: 'sku' | 'ean' | 'basePrice' | 'minStockThreshold',
    value: string | number
  ) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleUpdateVariantStock = (index: number, cdId: string, qty: number) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== index) return v;
      const updatedStockByCD = v.stockByCD.map(cd =>
        cd.cdId === cdId ? { ...cd, availableQuantity: Number(qty) || 0 } : cd
      );
      return { ...v, stockByCD: updatedStockByCD };
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (variants.length === 0) {
      showToast('Gere pelo menos uma variante na grade antes de salvar!', 'warning');
      return;
    }

    const totalStockByCD = DEFAULT_DISTRIBUTION_CENTERS.map(cd => {
      const sum = variants.reduce((acc, v) => {
        const cdEntry = v.stockByCD.find(c => c.cdId === cd.id);
        return acc + (cdEntry ? cdEntry.availableQuantity : 0);
      }, 0);
      return {
        cdId: cd.id,
        cdName: cd.name,
        cdStateUF: cd.uf,
        availableQuantity: sum
      };
    });

    const newProduct: Product = {
      id: `prod-grade-${Date.now()}`,
      sku: variants[0]?.sku || `SKU-MASTER-${Date.now()}`,
      ean: variants[0]?.ean || `789${Date.now().toString().slice(-10)}`,
      ncm,
      name,
      description,
      categorySlug,
      brand,
      images: ['/media/img2.jpeg', '/media/img3.jpeg'],
      basePrice: Number(basePrice),
      moq: Number(moq),
      uom,
      itemsPerUom: Number(itemsPerUom),
      hasVariants: true,
      attributes: attributes.map(a => ({
        name: a.name.trim(),
        values: a.valuesStr.split(',').map(v => v.trim()).filter(Boolean)
      })),
      variants,
      stockByCD: totalStockByCD,
      volumeDiscounts: [
        { minQuantity: 1, maxQuantity: 10, unitPrice: Number(basePrice), discountPercentage: 0 },
        { minQuantity: 11, maxQuantity: 50, unitPrice: Number(basePrice) * 0.9, discountPercentage: 10 },
        { minQuantity: 51, unitPrice: Number(basePrice) * 0.8, discountPercentage: 20 },
      ]
    };

    productsService.createProduct(newProduct).catch(() => {});
    setSavedSuccess(true);
    showToast('Produto com grade e variações cadastrado com sucesso!', 'success');

    setTimeout(() => {
      router.push('/conta/estoque');
    }, 1200);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
          <div>
            <Link
              href="/conta/estoque"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004e38] mb-2 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para Gestão de Estoque
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#004e38]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Cadastro de Produto com Grade & Variações
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Estrutura avançada para itens multivariantes (celulares, periféricos, roupas, hardware com cores, memórias e voltagens).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/conta/estoque"
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-5 py-2.5 rounded-full transition-all"
            >
              Cancelar
            </Link>
            <button
              onClick={handleSaveProduct}
              className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Produto & Grade</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-100 border border-emerald-300 text-[#004e38] p-4 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-black">Produto com Grade e Variantes salvo com sucesso!</p>
              <p className="text-xs font-medium text-emerald-800">Redirecionando para a tabela consolidada de estoque...</p>
            </div>
          </div>
        )}

        {/* Duplicity Warning Banner */}
        {duplicityAlerts.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-4 rounded-3xl space-y-2 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Aviso de Duplicidade Detectada no Catálogo de Estoque!</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Alguns SKUs ou Códigos EAN-13 gerados já existem em seu estoque ativo. Ajuste os códigos abaixo ou use a opção de gerar novos códigos exclusivos para evitar conflitos no PDV/ERP:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 font-semibold text-amber-950 pl-2">
              {duplicityAlerts.map((alert, idx) => (
                <li key={idx}>
                  <span className="font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded mr-1">SKU: {alert.sku}</span> - {alert.conflictWith}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSaveProduct} className="space-y-8">
          
          {/* SECTION 1: Informações Gerais do Produto Pai */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package className="w-5 h-5 text-[#004e38]" />
              <h2 className="text-base font-extrabold text-gray-900">1. Informações Básicas do Produto Principal (Pai)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-gray-700">Nome do Produto Base *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Smartphone Galaxy Enterprise 5G"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Marca / Fabricante *</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: Samsung, Sony, Apple"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Categoria do Produto</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                >
                  <option value="laptops">Smartphones, Computadores & Laptops</option>
                  <option value="headphones">Fones, Áudio & Controles</option>
                  <option value="acessorios">Acessórios, Periféricos & Malas</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Classificação Fiscal NCM *</label>
                <input
                  type="text"
                  required
                  value={ncm}
                  onChange={(e) => setNcm(e.target.value)}
                  placeholder="Ex: 8517.13.00"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Preço Base Sugerido (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-black text-[#004e38] text-sm focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Unidade de Medida (UOM)</label>
                <select
                  value={uom}
                  onChange={(e) => setUom(e.target.value as UOM)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none"
                >
                  <option value="CX">Caixa (CX)</option>
                  <option value="UN">Unidade Individual (UN)</option>
                  <option value="FARDO">Fardo Industrial (FARDO)</option>
                  <option value="PALLETE">Pallete Logístico (PALLETE)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Itens por Embalagem</label>
                <input
                  type="number"
                  min="1"
                  value={itemsPerUom}
                  onChange={(e) => setItemsPerUom(Number(e.target.value))}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Lote Mínimo de Venda (MOQ)</label>
                <input
                  type="number"
                  min="1"
                  value={moq}
                  onChange={(e) => setMoq(Number(e.target.value))}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="font-bold text-gray-700">Descrição Técnica Geral</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Configurador de Atributos & Matriz de Variações */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#004e38]" />
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">2. Atributos da Grade & Variações</h2>
                  <p className="text-[11px] text-gray-500">Defina os atributos como Cor, Armazenamento, Voltagem ou Tamanho e separe os valores por vírgula.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Atributo</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateMatrix}
                  className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gerar Matriz de Variantes</span>
                </button>
              </div>
            </div>

            {/* Atributos inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attributes.map((attr, idx) => (
                <div key={idx} className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-2 text-xs relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remover Atributo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1 pr-6">
                    <label className="font-bold text-gray-700 text-[11px]">Nome do Atributo</label>
                    <input
                      type="text"
                      value={attr.name}
                      onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)}
                      placeholder="Ex: Cor, Armazenamento, Voltagem"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#004e38]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 text-[11px]">Valores / Opções (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={attr.valuesStr}
                      onChange={(e) => handleAttributeChange(idx, 'valuesStr', e.target.value)}
                      placeholder="Ex: Preto, Branco, Titânio"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#004e38]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Matriz de Variações Gerada */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <span>Matriz de Combinações ({variants.length} Variantes Ativas)</span>
                  <span className="bg-emerald-50 text-[#004e38] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto-SKU & EAN-13
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-2xs">
                <table className="w-full text-left text-xs bg-white">
                  <thead className="bg-[#004e38] text-white font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Combinação / Variação</th>
                      <th className="p-3">SKU & Código EAN-13</th>
                      <th className="p-3 text-right">Preço B2B (R$)</th>
                      <th className="p-3 text-center">CD SP</th>
                      <th className="p-3 text-center">CD SC</th>
                      <th className="p-3 text-center">CD BA</th>
                      <th className="p-3 text-center">Estoque Mín.</th>
                      <th className="p-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {variants.map((v, idx) => {
                      const spQty = v.stockByCD.find(c => c.cdId === 'cd-sp')?.availableQuantity || 0;
                      const scQty = v.stockByCD.find(c => c.cdId === 'cd-sc')?.availableQuantity || 0;
                      const baQty = v.stockByCD.find(c => c.cdId === 'cd-ba')?.availableQuantity || 0;
                      const totalVariantStock = spQty + scQty + baQty;

                      const isDuplicate = duplicityAlerts.some(a => a.sku === v.sku || a.ean === v.ean);

                      return (
                        <tr key={v.id} className={`hover:bg-[#f8fafc] transition-colors ${isDuplicate ? 'bg-amber-50/70' : ''}`}>
                          <td className="p-3 space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(v.combination).map(([k, val]) => (
                                <span key={k} className="bg-emerald-50 text-[#004e38] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {k}: {val}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-semibold block">
                              Estoque Total: <strong className="text-gray-800">{totalVariantStock} un</strong>
                            </span>
                          </td>

                          <td className="p-3 space-y-1.5">
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) => handleUpdateVariantField(idx, 'sku', e.target.value)}
                                className={`w-36 bg-[#f5f6f6] border rounded-lg px-2 py-1 font-mono font-bold text-xs ${
                                  isDuplicate ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
                                }`}
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Barcode className="w-3 h-3 text-[#004e38]" />
                              <input
                                type="text"
                                value={v.ean}
                                onChange={(e) => handleUpdateVariantField(idx, 'ean', e.target.value)}
                                className="w-36 bg-[#f5f6f6] border border-gray-200 rounded-lg px-2 py-1 font-mono text-[11px]"
                              />
                            </div>
                          </td>

                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              value={v.basePrice}
                              onChange={(e) => handleUpdateVariantField(idx, 'basePrice', Number(e.target.value))}
                              className="w-24 bg-[#f5f6f6] border border-gray-200 rounded-lg px-2 py-1 font-black text-right text-xs text-[#004e38]"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={spQty}
                              onChange={(e) => handleUpdateVariantStock(idx, 'cd-sp', Number(e.target.value))}
                              className="w-16 bg-[#f5f6f6] border border-gray-200 rounded-lg px-2 py-1 font-bold text-center text-xs"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={scQty}
                              onChange={(e) => handleUpdateVariantStock(idx, 'cd-sc', Number(e.target.value))}
                              className="w-16 bg-[#f5f6f6] border border-gray-200 rounded-lg px-2 py-1 font-bold text-center text-xs"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={baQty}
                              onChange={(e) => handleUpdateVariantStock(idx, 'cd-ba', Number(e.target.value))}
                              className="w-16 bg-[#f5f6f6] border border-gray-200 rounded-lg px-2 py-1 font-bold text-center text-xs"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={v.minStockThreshold || 10}
                              onChange={(e) => handleUpdateVariantField(idx, 'minStockThreshold', Number(e.target.value))}
                              className="w-16 bg-[#f5f6f6] border border-gray-200 rounded-lg px-2 py-1 font-bold text-center text-xs"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remover Variante"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* SECTION 3: Lote, Validade & Escala de Descontos B2B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Lote & Validade */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs text-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Calendar className="w-5 h-5 text-[#004e38]" />
                <h3 className="font-extrabold text-gray-900">3. Rastreabilidade & Validade de Fabricação</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Lote Padrão</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 font-mono font-bold text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Data de Validade</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 font-medium text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Escala de Volume B2B */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs text-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <DollarSign className="w-5 h-5 text-[#004e38]" />
                <h3 className="font-extrabold text-gray-900">4. Escala Automática de Desconto por Volume</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700">Faixa 1 (1 a 10 {uom}s):</span>
                  <span className="font-black text-[#004e38]">Preço Base Integral (0% Off)</span>
                </div>
                <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700">Faixa 2 (11 a 50 {uom}s):</span>
                  <span className="font-black text-emerald-700">10% de Desconto Comercial</span>
                </div>
                <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700">Faixa 3 (51+ {uom}s):</span>
                  <span className="font-black text-emerald-800">20% de Desconto Atacadista</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/conta/estoque"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full text-xs transition-colors"
            >
              Voltar ao Estoque
            </Link>

            <button
              type="submit"
              className="bg-[#004e38] hover:bg-[#033627] text-white font-black px-8 py-3 rounded-full text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Concluir Cadastro do Produto com Grade</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
