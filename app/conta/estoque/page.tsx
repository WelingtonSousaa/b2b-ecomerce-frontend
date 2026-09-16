'use client';

import { useRouter } from "next/navigation";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Barcode,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Trash2,
  Download,
  X,
  ShieldCheck,
  Layers,
  Save,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  History,
  ChevronDown,
  ChevronUp,
  Boxes,
  ExternalLink,
  Sparkles,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';
import { productsService } from '@/services/products.service';
import { inventoryService } from '@/services/inventory.service';
import { Product, StockMovement, UOM } from '@/types/b2b';
import StockMovementModal from '@/components/modals/StockMovementModal';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function GestaoEstoqueVendedorPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  
  React.useEffect(() => {
    productsService.getProducts().then((res) => {
      if (res.data) setProducts(res.data);
    }).catch(() => {});

    inventoryService.getKardexHistory().then((res) => {
      if (res.data) setMovements(res.data);
    }).catch(() => {});
  }, []);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'inventory' | 'kardex'>('inventory');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('TODOS');
  const [movementTypeFilter, setMovementTypeFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProductForMovement, setSelectedProductForMovement] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Barcode Print Modal State
  const [barcodeModalItem, setBarcodeModalItem] = useState<{ sku: string; ean: string; name: string; brand: string } | null>(null);

  // Accordion for viewing variants
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({
    'prod-7': true // default expand the first variant product
  });

  // Form States para Novo Cadastro Rápido (Item Simples) / Edição
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('headphones');
  const [formSku, setFormSku] = useState('');
  const [formEan, setFormEan] = useState('');
  const [formNcm, setFormNcm] = useState('');
  const [formBatchNumber, setFormBatchNumber] = useState('');
  const [formExpirationDate, setFormExpirationDate] = useState('');
  const [formBasePrice, setFormBasePrice] = useState<number>(489.00);
  const [formMoq, setFormMoq] = useState<number>(5);
  const [formUom, setFormUom] = useState<UOM>('CX');
  const [formItemsPerUom, setFormItemsPerUom] = useState<number>(10);
  const [formStockSP, setFormStockSP] = useState<number>(240);
  const [formStockSC, setFormStockSC] = useState<number>(120);
  const [formStockBA, setFormStockBA] = useState<number>(50);
  const [formDescription, setFormDescription] = useState('');
  const [formSuccessAlert, setFormSuccessAlert] = useState(false);

  // Real-time Duplicity Check in the Quick Modal
  const quickModalDuplicity = useMemo(() => {
    if (!formSku.trim() && !formEan.trim()) return null;

    const existing = products.find(p => {
      if (editingProduct && p.id === editingProduct.id) return false;
      const matchBaseSku = p.sku.toLowerCase() === formSku.trim().toLowerCase();
      const matchBaseEan = p.ean.trim() === formEan.trim();
      const matchVariantSku = p.variants?.some(v => v.sku.toLowerCase() === formSku.trim().toLowerCase());
      const matchVariantEan = p.variants?.some(v => v.ean.trim() === formEan.trim());
      return matchBaseSku || matchBaseEan || matchVariantSku || matchVariantEan;
    });

    if (existing) {
      return {
        matchedProduct: existing,
        reason: existing.sku.toLowerCase() === formSku.trim().toLowerCase()
          ? `SKU "${formSku}" já cadastrado`
          : `Código de Barras EAN-13 "${formEan}" já cadastrado`
      };
    }
    return null;
  }, [formSku, formEan, products, editingProduct]);

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'TODOS' && p.categorySlug !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchVariants = p.variants?.some(v =>
        v.sku.toLowerCase().includes(q) ||
        v.ean.includes(q) ||
        Object.values(v.combination).some(val => val.toLowerCase().includes(q))
      );
      return p.name.toLowerCase().includes(q) ||
             p.sku.toLowerCase().includes(q) ||
             p.ean.toLowerCase().includes(q) ||
             matchVariants;
    }
    return true;
  });

  // Filtered movements list
  const filteredMovements = movements.filter(m => {
    if (movementTypeFilter !== 'ALL' && m.type !== movementTypeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.productName.toLowerCase().includes(q) ||
             m.sku.toLowerCase().includes(q) ||
             (m.fiscalDoc && m.fiscalDoc.toLowerCase().includes(q)) ||
             m.reasonLabel.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleExpandProduct = (id: string) => {
    setExpandedProductIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenRegisterModal = (productToEdit?: Product) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setFormName(productToEdit.name);
      setFormBrand(productToEdit.brand);
      setFormCategory(productToEdit.categorySlug);
      setFormSku(productToEdit.sku);
      setFormEan(productToEdit.ean);
      setFormNcm(productToEdit.ncm);
      setFormBasePrice(productToEdit.basePrice);
      setFormMoq(productToEdit.moq);
      setFormUom(productToEdit.uom);
      setFormItemsPerUom(productToEdit.itemsPerUom);
      setFormDescription(productToEdit.description);
      setFormStockSP(productToEdit.stockByCD.find(c => c.cdId === 'cd-sp')?.availableQuantity || 0);
      setFormStockSC(productToEdit.stockByCD.find(c => c.cdId === 'cd-sc')?.availableQuantity || 0);
      setFormStockBA(productToEdit.stockByCD.find(c => c.cdId === 'cd-ba')?.availableQuantity || 0);
    } else {
      setEditingProduct(null);
      const randomId = Math.floor(100 + Math.random() * 900);
      setFormName('');
      setFormBrand('OneSync Pro');
      setFormCategory('headphones');
      setFormSku(`SKU-VEND-${randomId}`);
      setFormEan(`78912345${randomId}001`);
      setFormNcm('8518.30.00');
      setFormBatchNumber(`LOT-2026-${randomId}`);
      setFormExpirationDate('2028-12-31');
      setFormBasePrice(499.00);
      setFormMoq(5);
      setFormUom('CX');
      setFormItemsPerUom(10);
      setFormStockSP(150);
      setFormStockSC(80);
      setFormStockBA(30);
      setFormDescription('Descrição rápida do produto cadastrado pelo vendedor para distribuição B2B.');
    }
    setIsRegisterModalOpen(true);
  };

  const handleOpenMovementModal = (product?: Product) => {
    setSelectedProductForMovement(product || null);
    setIsMovementModalOpen(true);
  };

  const handleConfirmMovement = (newMovement: StockMovement) => {
    // 1. Add movement to history log
    setMovements(prev => [newMovement, ...prev]);

    // 2. Persist movement in backend
    inventoryService.recordMovement({
      productId: newMovement.productId,
      sku: newMovement.sku,
      variantInfo: newMovement.variantInfo,
      cdId: newMovement.cdId,
      type: newMovement.type,
      reason: newMovement.reason,
      quantity: newMovement.quantity,
      fiscalDoc: newMovement.fiscalDoc,
      batchNumber: newMovement.batchNumber,
      operatorName: newMovement.operator || 'Operador Logístico',
      notes: newMovement.notes
    }).catch(() => {});

    // 3. Update product stock in memory
    setProducts(prev => prev.map(p => {
      if (p.id !== newMovement.productId) return p;

      // If product has variants, update the specific variant and master sum
      if (p.hasVariants && p.variants) {
        const updatedVariants = p.variants.map(v => {
          if (v.sku !== newMovement.sku) return v;
          const updatedStockByCD = v.stockByCD.map(cd => {
            if (cd.cdId !== newMovement.cdId) return cd;
            return { ...cd, availableQuantity: newMovement.resultingStock };
          });
          return { ...v, stockByCD: updatedStockByCD };
        });

        // Recalculate consolidated stock
        const updatedMasterStockByCD = p.stockByCD.map(cd => {
          const totalInCD = updatedVariants.reduce((sum, v) => {
            const cdEntry = v.stockByCD.find(c => c.cdId === cd.cdId);
            return sum + (cdEntry ? cdEntry.availableQuantity : 0);
          }, 0);
          return { ...cd, availableQuantity: totalInCD };
        });

        return { ...p, variants: updatedVariants, stockByCD: updatedMasterStockByCD };
      }

      // Simple product update
      const updatedStockByCD = p.stockByCD.map(cd => {
        if (cd.cdId !== newMovement.cdId) return cd;
        return { ...cd, availableQuantity: newMovement.resultingStock };
      });

      return { ...p, stockByCD: updatedStockByCD };
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-vend-${Date.now()}`,
      sku: formSku,
      ean: formEan,
      ncm: formNcm,
      name: formName,
      description: formDescription,
      categorySlug: formCategory,
      brand: formBrand,
      images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'],
      basePrice: Number(formBasePrice),
      moq: Number(formMoq),
      uom: formUom,
      itemsPerUom: Number(formItemsPerUom),
      stockByCD: [
        { cdId: 'cd-sp', cdName: 'CD Sudeste - SP', cdStateUF: 'SP', availableQuantity: Number(formStockSP) },
        { cdId: 'cd-sc', cdName: 'CD Sul - SC', cdStateUF: 'SC', availableQuantity: Number(formStockSC) },
        { cdId: 'cd-ba', cdName: 'CD Nordeste - BA', cdStateUF: 'BA', availableQuantity: Number(formStockBA) },
      ],
      volumeDiscounts: [
        { minQuantity: 1, maxQuantity: 10, unitPrice: Number(formBasePrice), discountPercentage: 0 },
        { minQuantity: 11, maxQuantity: 50, unitPrice: Number(formBasePrice) * 0.9, discountPercentage: 10 },
        { minQuantity: 51, unitPrice: Number(formBasePrice) * 0.8, discountPercentage: 20 },
      ]
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProd : p));
      productsService.updateProduct(editingProduct.id, newProd).catch(() => {});
    } else {
      setProducts(prev => [newProd, ...prev]);
      productsService.createProduct(newProd).catch(() => {});
    }

    setFormSuccessAlert(true);
    showToast(editingProduct ? 'Produto atualizado com sucesso!' : 'Novo produto cadastrado com sucesso!', 'success');
    setTimeout(() => {
      setFormSuccessAlert(false);
      setIsRegisterModalOpen(false);
    }, 1000);
  };

  const handleDeleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (confirm(`Tem certeza que deseja remover o produto "${prod?.name || id}" do catálogo de vendas?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Produto removido do estoque.`, 'info');
      productsService.deleteProduct(id).catch(() => {});
    }
  };

  const handlePrintBarcodes = (sku: string, ean: string, name?: string, brand?: string) => {
    setBarcodeModalItem({
      sku,
      ean,
      name: name || 'Produto Corporativo',
      brand: brand || 'OneSync Pro'
    });
  };

  const handleExportKardex = () => {
    const headers = ['Data_Hora', 'Tipo', 'Motivo', 'Produto', 'SKU', 'Centro_Distribuicao', 'Qtd_Movimentada', 'Saldo_Anterior', 'Saldo_Resultante', 'Doc_Fiscal', 'Operador'];
    const rows = movements.map(m => [
      `"${m.timestamp}"`,
      `"${m.type === 'IN' ? 'ENTRADA' : 'SAIDA'}"`,
      `"${m.reasonLabel}"`,
      `"${m.productName}"`,
      `"${m.sku}"`,
      `"${m.cdName}"`,
      m.quantity,
      m.previousStock,
      m.resultingStock,
      `"${m.fiscalDoc || 'S/N'}"`,
      `"${m.operator}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kardex_auditoria_estoque_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Relatório Kardex exportado com sucesso em CSV!', 'success');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Portal do Vendedor & Gestão de Estoque Multi-CD"
        subtitle="Cadastro de itens simples ou com grade avançada, rastreabilidade EAN-13, controle de lotes e movimentações de entrada e saída."
        activeBadge={`${products.length} SKUs • Multi-CD (SP, SC, BA)`}
        actions={
          <>
            <button
              onClick={() => handleOpenMovementModal()}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
              <span>Ajuste / Movimentação (+ / -)</span>
            </button>

            <button
              onClick={() => router.push("/conta/estoque/novo")}
              className="bg-white hover:bg-blue-50 text-[#2563eb] border-2 border-[#2563eb] text-xs font-black px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastro Rápido (Item Simples)</span>
            </button>

            <Link
              href="/conta/estoque/novo"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Novo Produto com Grade</span>
            </Link>
          </>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">

        {/* Stock Metrics Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 uppercase">Total de SKUs em Linha</span>
            <div className="text-2xl font-black text-gray-900">{products.length} Produtos</div>
            <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              {products.filter(p => p.hasVariants).length} Produtos possuem grade com variações
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 uppercase">Estoque Físico Consolidado</span>
            <div className="text-2xl font-black text-[#2563eb]">
              {products.reduce((acc, p) => acc + (p.stockByCD || []).reduce((cAcc, cd) => cAcc + (cd.availableQuantity || 0), 0), 0)} Unidades
            </div>
            <span className="text-[10px] text-gray-500">Distribuídos nos CDs de SP, SC e BA</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-amber-200 bg-amber-50/40 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-amber-900 uppercase">Alerta de Reposição</span>
            <div className="text-2xl font-black text-amber-950">2 SKUs</div>
            <span className="text-[10px] text-amber-800 font-medium">Estoque abaixo do limite mínimo</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-blue-200 bg-blue-50/40 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-blue-900 uppercase">Histórico Kardex</span>
            <div className="text-2xl font-black text-blue-950">{movements.length} Movimentações</div>
            <span className="text-[10px] text-blue-800 font-medium">Auditoria contínua de entradas/saídas</span>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-2.5 px-4 font-black text-sm transition-all relative cursor-pointer ${
              activeTab === 'inventory'
                ? 'text-[#2563eb] border-b-2 border-[#2563eb]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              <span>📦 Catálogo & Estoque Físico Multi-CD ({filteredProducts.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kardex')}
            className={`pb-2.5 px-4 font-black text-sm transition-all relative cursor-pointer ${
              activeTab === 'kardex'
                ? 'text-[#2563eb] border-b-2 border-[#2563eb]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>📜 Histórico de Movimentações / Kardex ({filteredMovements.length})</span>
            </span>
          </button>
        </div>

        {/* TAB 1: INVENTORY CATALOG & STOCK TABLE */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Filter Controls Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative flex-1 max-w-md w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por Nome, SKU, Variação, EAN-13 ou NCM..."
                  className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>

              <div className="flex items-center gap-2 font-bold shrink-0">
                <Filter className="w-4 h-4 text-[#2563eb]" />
                <span>Categoria:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-[#f5f6f6] rounded-full px-4 py-2 font-bold text-gray-900 focus:outline-none"
                >
                  <option value="TODOS">Todas as Categorias</option>
                  <option value="headphones">Fones & Áudio</option>
                  <option value="laptops">Smartphones & Informática</option>
                  <option value="acessorios">Acessórios & Mala</option>
                </select>
              </div>
            </div>

            {/* Registered Products Management Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Mercadorias em Linha & Lotes Físicos</h2>
                  <p className="text-xs text-gray-400">Clique em produtos com grade para visualizar o estoque individual de cada variante.</p>
                </div>
                <span className="text-xs text-gray-400 font-semibold">Exibindo {filteredProducts.length} itens</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2563eb] text-white font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">SKU / EAN-13</th>
                      <th className="p-4">Produto, Marca & Grade</th>
                      <th className="p-4">NCM & Lote/Validade</th>
                      <th className="p-4 text-center">Lote Mín. (MOQ)</th>
                      <th className="p-4 text-right">Preço Base</th>
                      <th className="p-4 text-center">Estoque Físico (CDs)</th>
                      <th className="p-4 text-center">Ações Vendedor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredProducts.map((prod) => {
                      const totalStock = prod.stockByCD.reduce((acc, cd) => acc + cd.availableQuantity, 0);
                      const isExpanded = !!expandedProductIds[prod.id];

                      return (
                        <React.Fragment key={prod.id}>
                          <tr className="hover:bg-[#f5f6f6]/60 transition-colors">
                            
                            {/* SKU / EAN */}
                            <td className="p-4 space-y-1">
                              <span className="font-mono font-bold text-gray-900 block">{prod.sku}</span>
                              <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1">
                                <Barcode className="w-3.5 h-3.5 text-[#2563eb]" /> {prod.ean}
                              </span>
                            </td>

                            {/* Produto, Marca & Grade */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#f5f6f6] p-1 flex items-center justify-center shrink-0">
                                  <Image src={prod.images[0] || '/media/img1.jpeg'} alt={prod.name} width={32} height={32} className="object-contain" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-gray-900 block line-clamp-1">{prod.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 font-semibold">{prod.brand}</span>
                                    {prod.hasVariants && prod.variants && (
                                      <button
                                        onClick={() => toggleExpandProduct(prod.id)}
                                        className="bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <Layers className="w-3 h-3 text-amber-500" />
                                        <span>{prod.variants.length} Variantes</span>
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* NCM & Validade */}
                            <td className="p-4 space-y-0.5">
                              <span className="bg-gray-100 text-gray-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                                NCM: {prod.ncm}
                              </span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1 pt-0.5">
                                <Calendar className="w-3 h-3 text-blue-600" /> Validade: 12/2028
                              </span>
                            </td>

                            {/* MOQ */}
                            <td className="p-4 text-center">
                              <span className="bg-blue-50 text-[#2563eb] font-bold text-[11px] px-2.5 py-1 rounded-full border border-blue-200">
                                {prod.moq} {prod.uom}s ({prod.itemsPerUom} un/cx)
                              </span>
                            </td>

                            {/* Preço Base */}
                            <td className="p-4 text-right font-black text-[#2563eb] text-sm">
                              R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>

                            {/* Estoque Total */}
                            <td className="p-4 text-center">
                              <div className="space-y-0.5">
                                <span className={`font-black text-xs ${totalStock < 50 ? 'text-amber-600' : 'text-gray-900'}`}>
                                  {totalStock} Unidades
                                </span>
                                <div className="text-[9px] text-gray-400 space-x-1">
                                  <span>SP: {prod.stockByCD.find(c => c.cdId === 'cd-sp')?.availableQuantity || 0}</span>
                                  <span>SC: {prod.stockByCD.find(c => c.cdId === 'cd-sc')?.availableQuantity || 0}</span>
                                </div>
                              </div>
                            </td>

                            {/* Ações */}
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                
                                {/* Botão de Ajuste Rápido de Estoque (+ / -) */}
                                <button
                                  onClick={() => handleOpenMovementModal(prod)}
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#2563eb] text-[#2563eb] hover:text-white transition-colors cursor-pointer"
                                  title="Ajuste Manual de Estoque (+ / -)"
                                >
                                  <ArrowUpRight className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handlePrintBarcodes(prod.sku, prod.ean, prod.name, prod.brand)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#2563eb] transition-colors cursor-pointer"
                                  title="Imprimir Etiquetas EAN-13"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => router.push("/conta/estoque/novo?edit=" + prod.id)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#2563eb] transition-colors cursor-pointer"
                                  title="Editar Produto"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Excluir Produto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* ACCORDION EXPANDIDO: GRADE DE VARIANTES DO PRODUTO */}
                          {prod.hasVariants && prod.variants && isExpanded && (
                            <tr className="bg-[#f8fafc]">
                              <td colSpan={7} className="p-4 pl-12">
                                <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Layers className="w-4 h-4 text-[#2563eb]" />
                                      <span className="font-extrabold text-xs text-gray-900">
                                        Grade de Variações ({prod.variants.length} combinações disponíveis):
                                      </span>
                                    </div>
                                    <Link
                                      href="/conta/estoque/novo"
                                      className="text-[10px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                                    >
                                      <span>Gerenciar Grade no Cadastro Avançado</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-[11px]">
                                      <thead className="bg-[#f5f6f6] text-gray-600 font-bold uppercase text-[9px]">
                                        <tr>
                                          <th className="p-2">Variação / Atributos</th>
                                          <th className="p-2">SKU Específico</th>
                                          <th className="p-2">Código EAN-13</th>
                                          <th className="p-2 text-right">Preço B2B</th>
                                          <th className="p-2 text-center">CD SP</th>
                                          <th className="p-2 text-center">CD SC</th>
                                          <th className="p-2 text-center">CD BA</th>
                                          <th className="p-2 text-center">Total</th>
                                          <th className="p-2 text-center">Ajustar</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {prod.variants.map((v) => {
                                          const sp = v.stockByCD.find(c => c.cdId === 'cd-sp')?.availableQuantity || 0;
                                          const sc = v.stockByCD.find(c => c.cdId === 'cd-sc')?.availableQuantity || 0;
                                          const ba = v.stockByCD.find(c => c.cdId === 'cd-ba')?.availableQuantity || 0;
                                          const vTotal = sp + sc + ba;

                                          return (
                                            <tr key={v.id} className="hover:bg-blue-50/30">
                                              <td className="p-2 font-bold text-gray-800">
                                                {Object.entries(v.combination).map(([k, val]) => (
                                                  <span key={k} className="bg-blue-50 text-[#2563eb] px-1.5 py-0.5 rounded border border-blue-200 mr-1 text-[10px]">
                                                    {val}
                                                  </span>
                                                ))}
                                              </td>
                                              <td className="p-2 font-mono font-bold text-gray-700">{v.sku}</td>
                                              <td className="p-2 font-mono text-gray-500">{v.ean}</td>
                                              <td className="p-2 text-right font-black text-[#2563eb]">
                                                R$ {v.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                              </td>
                                              <td className="p-2 text-center font-bold text-gray-700">{sp}</td>
                                              <td className="p-2 text-center font-bold text-gray-700">{sc}</td>
                                              <td className="p-2 text-center font-bold text-gray-700">{ba}</td>
                                              <td className="p-2 text-center font-black text-gray-900">{vTotal} un</td>
                                              <td className="p-2 text-center">
                                                <button
                                                  onClick={() => handleOpenMovementModal(prod)}
                                                  className="p-1 rounded bg-blue-100 hover:bg-[#2563eb] text-[#2563eb] hover:text-white transition-colors cursor-pointer"
                                                  title="Ajustar Estoque Desta Variante"
                                                >
                                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: KARDEX / HISTÓRICO DE MOVIMENTAÇÕES MANUAIS & AUDITORIA */}
        {activeTab === 'kardex' && (
          <div className="space-y-6">
            
            {/* Filter Controls Bar for Kardex */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative flex-1 max-w-md w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por Produto, SKU, NF-e ou Motivo..."
                  className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>

              <div className="flex items-center gap-2 font-bold shrink-0">
                <Filter className="w-4 h-4 text-[#2563eb]" />
                <span>Tipo de Operação:</span>
                <div className="flex bg-[#f5f6f6] p-1 rounded-full text-xs">
                  <button
                    onClick={() => setMovementTypeFilter('ALL')}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      movementTypeFilter === 'ALL' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-gray-600'
                    }`}
                  >
                    Todas ({movements.length})
                  </button>
                  <button
                    onClick={() => setMovementTypeFilter('IN')}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      movementTypeFilter === 'IN' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-600'
                    }`}
                  >
                    🟢 Entradas (+)
                  </button>
                  <button
                    onClick={() => setMovementTypeFilter('OUT')}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      movementTypeFilter === 'OUT' ? 'bg-red-600 text-white shadow-2xs' : 'text-gray-600'
                    }`}
                  >
                    🔴 Saídas (-)
                  </button>
                </div>
              </div>
            </div>

            {/* Kardex Log Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Livro Registro Kardex & Auditoria de Estoque</h2>
                  <p className="text-xs text-gray-400">Rastreabilidade completa de todas as entradas, compras, baixas manuais e avarias.</p>
                </div>
                <button
                  onClick={handleExportKardex}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Kardex (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2563eb] text-white font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Data / Hora</th>
                      <th className="p-4">Tipo & Motivo</th>
                      <th className="p-4">Produto / SKU</th>
                      <th className="p-4">Centro Distribuição</th>
                      <th className="p-4 text-center">Qtd Movimentada</th>
                      <th className="p-4 text-center">Saldo Resultante</th>
                      <th className="p-4">Doc Fiscal / Operador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredMovements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-[#f5f6f6]/60 transition-colors">
                        <td className="p-4 font-mono text-[11px] text-gray-600">
                          {mov.timestamp}
                        </td>

                        <td className="p-4 space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                            mov.type === 'IN'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-red-100 text-red-900'
                          }`}>
                            {mov.type === 'IN' ? (
                              <ArrowUpRight className="w-3 h-3 text-blue-700" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-700" />
                            )}
                            {mov.type === 'IN' ? 'Entrada (+)' : 'Saída / Baixa (-)'}
                          </span>
                          <span className="text-[11px] font-bold text-gray-800 block">
                            {mov.reasonLabel}
                          </span>
                        </td>

                        <td className="p-4 space-y-0.5">
                          <span className="font-extrabold text-gray-900 block">{mov.productName}</span>
                          <span className="font-mono text-[10px] text-gray-500 font-bold">
                            SKU: {mov.sku} {mov.variantInfo && `(${mov.variantInfo})`}
                          </span>
                        </td>

                        <td className="p-4 font-semibold text-gray-700">
                          {mov.cdName}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`font-black text-sm ${
                            mov.type === 'IN' ? 'text-blue-700' : 'text-red-600'
                          }`}>
                            {mov.type === 'IN' ? `+${mov.quantity}` : `-${mov.quantity}`} un
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <div className="text-[10px] text-gray-400">
                            <span>De {mov.previousStock} un → </span>
                            <strong className="text-gray-900 text-xs">{mov.resultingStock} un</strong>
                          </div>
                        </td>

                        <td className="p-4 space-y-0.5">
                          <span className="font-mono font-bold text-gray-900 text-[11px] block">
                            {mov.fiscalDoc || 'Sem Documento'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Por: {mov.operator}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL DE AJUSTE MANUAL DE ESTOQUE (ENTRADA / SAÍDA / BAIXA) */}
      <StockMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        products={products}
        selectedProduct={selectedProductForMovement}
        onConfirmMovement={handleConfirmMovement}
      />

      {/* MODAL DE IMPRESSÃO DE ETIQUETAS EAN-13 */}
      {barcodeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden relative p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
                  <Barcode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">Etiqueta de Código de Barras EAN-13</h3>
                  <p className="text-[10px] text-gray-400">Padrão GS1 Brasil homologado para logística Multi-CD</p>
                </div>
              </div>
              <button
                onClick={() => setBarcodeModalItem(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Label Card Preview */}
            <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-2xl space-y-4 text-center shadow-inner">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {barcodeModalItem.brand}
                </span>
                <h4 className="font-black text-sm text-gray-900">{barcodeModalItem.name}</h4>
                <p className="font-mono text-xs font-bold text-[#2563eb]">SKU: {barcodeModalItem.sku}</p>
              </div>

              {/* Simulated EAN-13 Barcode Lines */}
              <div className="py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-1.5">
                <div className="flex items-end justify-center gap-0.5 h-16 w-full max-w-[240px]">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 2, 1].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-900 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm font-black tracking-[0.25em] text-gray-900">
                  {barcodeModalItem.ean}
                </span>
              </div>

              <div className="flex justify-between text-[9px] text-gray-400 font-mono border-t border-gray-100 pt-2">
                <span>LOTE: LOT-2026-08A</span>
                <span>ORIGEM: BRASIL</span>
                <span>CD: SP / SC / BA</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBarcodeModalItem(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Fechar
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('Comando de impressão enviado para a impressora de etiquetas térmica (Zebra/Argox)!', 'success');
                  setBarcodeModalItem(null);
                }}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Imprimir Etiqueta Térmica</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

