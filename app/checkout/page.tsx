'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Lock,
  FileText,
  Building2,
  Calendar,
  Layers,
  MapPin,
  Tag,
  AlertCircle,
  Truck,
  PackageOpen,
  ArrowRight
} from 'lucide-react';
// importacao do simulador de carga e cubagem
import CargoSimulator from '@/components/cart/CargoSimulator';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import PixPaymentModal from '@/components/modals/PixPaymentModal';
import CommercialProposalModal from '@/components/modals/CommercialProposalModal';
import BoletoModal from '@/components/modals/BoletoModal';
import { priceBooksService } from '@/services/pricebooks.service';
import { ordersService } from '@/services/orders.service';
import { PriceBook } from '@/types/b2b';

interface BranchSplitItem {
  branchId: string;
  branchName: string;
  cnpj: string;
  cityUF: string;
  address: string;
  allocatedQuantity: number;
  icmsRate: number;
  icmsStAmount: number;
  isSuframa: boolean;
  freightCost: number;
  deliveryDays: number;
}

export default function CheckoutPage() {
  const { isAuthenticated, user, company, openAuthModal } = useAuth();
  const { items: cartItems, totalItemsCount, subtotal: cartSubtotal, totalTaxST: cartTaxST, clearCart } = useCart();

  // Mode: Single Address vs Multi-Branch Split
  const [deliveryMode, setDeliveryMode] = useState<'SINGLE' | 'MULTI_BRANCH'>('SINGLE');
  
  // Scheduled Delivery Mode
  const [scheduleMode, setScheduleMode] = useState<'IMMEDIATE' | 'SCHEDULED'>('IMMEDIATE');
  const [scheduleDate1, setScheduleDate1] = useState('2026-08-15');
  const [scheduleDate2, setScheduleDate2] = useState('2026-09-15');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'boleto_faturado' | 'pix' | 'card'>('boleto_faturado');
  const [installments, setInstallments] = useState<'28_days' | '28_56_days' | '28_56_84_days'>('28_56_84_days');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isBoletoModalOpen, setIsBoletoModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [appliedPriceBook, setAppliedPriceBook] = useState<PriceBook | null>(null);

  useEffect(() => {
    priceBooksService.getPriceBooks(company?.cnpj).then((res) => {
      if (res.data && res.data.length > 0) {
        setAppliedPriceBook(res.data[0]);
      }
    }).catch(() => {});
  }, [company?.cnpj]);

  // Delivery Single info
  const name = user?.name || 'Carlos Eduardo';
  const [address, setAddress] = useState(company ? `${company.mainAddress.logradouro}, ${company.mainAddress.numero}` : 'Av. Paulista, 1000 - Conjunto 42');
  const [city, setCity] = useState(company ? `${company.mainAddress.cidade} - ${company.mainAddress.uf}` : 'São Paulo - SP');
  const zipCode = company ? company.mainAddress.cep : '01310-100';
  const mobile = '(11) 98765-4321';
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);

  // Total items in cart dynamically connected
  const totalCartQty = totalItemsCount;
  const unitPrice = totalItemsCount > 0 ? Number((cartSubtotal / totalItemsCount).toFixed(2)) : 0;

  // Branches distribution state
  const [branchSplits, setBranchSplits] = useState<BranchSplitItem[]>([
    {
      branchId: 'matriz-sp',
      branchName: 'Matriz São Paulo (Sede Central)',
      cnpj: company?.cnpj || '12.345.678/0001-90',
      cityUF: 'São Paulo - SP',
      address: 'Av. Paulista, 1000 - Bela Vista',
      allocatedQuantity: 5,
      icmsRate: 18,
      icmsStAmount: 0,
      isSuframa: false,
      freightCost: 0,
      deliveryDays: 2
    },
    {
      branchId: 'branch-rj',
      branchName: 'Filial Rio de Janeiro - RJ',
      cnpj: '12.345.678/0002-71',
      cityUF: 'Rio de Janeiro - RJ',
      address: 'Av. Rio Branco, 156 - Centro',
      allocatedQuantity: 3,
      icmsRate: 12,
      icmsStAmount: 184.20,
      isSuframa: false,
      freightCost: 45.00,
      deliveryDays: 4
    },
    {
      branchId: 'branch-sc',
      branchName: 'Filial Joinville - SC',
      cnpj: '12.345.678/0003-52',
      cityUF: 'Joinville - SC',
      address: 'Rua Dona Francisca, 800 - Dist. Industrial',
      allocatedQuantity: 2,
      icmsRate: 12,
      icmsStAmount: 0,
      isSuframa: false,
      freightCost: 35.00,
      deliveryDays: 3
    }
  ]);

  // Adjust branch splits when cart quantity changes
  useEffect(() => {
    if (totalCartQty > 0) {
      const q1 = Math.max(1, Math.round(totalCartQty * 0.5));
      const q2 = Math.max(0, Math.round(totalCartQty * 0.3));
      const q3 = Math.max(0, totalCartQty - q1 - q2);

      setBranchSplits((prev) => [
        { ...prev[0], allocatedQuantity: q1 },
        { ...prev[1], allocatedQuantity: q2 },
        { ...prev[2], allocatedQuantity: q3 },
      ]);
    }
  }, [totalCartQty]);

  const allocatedSum = branchSplits.reduce((acc, b) => acc + (Number(b.allocatedQuantity) || 0), 0);
  const isAllocationComplete = allocatedSum === totalCartQty;

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('Para finalizar a compra e emitir a Nota Fiscal para sua empresa, acesse sua conta ou cadastre seu CNPJ.');
    }
  }, [isAuthenticated, openAuthModal]);

  const handleUpdateBranchQuantity = (branchId: string, qty: number) => {
    setBranchSplits(prev => prev.map(b => b.branchId === branchId ? { ...b, allocatedQuantity: Math.max(0, qty) } : b));
  };

  // Calculations
  const calculateTotals = () => {
    if (deliveryMode === 'SINGLE') {
      const subtotal = totalCartQty * unitPrice;
      const icms = subtotal * 0.18;
      const freight = 0;
      const total = subtotal + freight;
      return { subtotal, icms, icmsSt: 0, freight, total };
    } else {
      let subtotal = 0;
      let totalIcms = 0;
      let totalIcmsSt = 0;
      let totalFreight = 0;

      branchSplits.forEach(b => {
        const branchSub = b.allocatedQuantity * unitPrice;
        subtotal += branchSub;
        totalIcms += branchSub * (b.icmsRate / 100);
        totalIcmsSt += b.allocatedQuantity > 0 ? b.icmsStAmount : 0;
        totalFreight += b.allocatedQuantity > 0 ? b.freightCost : 0;
      });

      const total = subtotal + totalIcmsSt + totalFreight;
      return { subtotal, icms: totalIcms, icmsSt: totalIcmsSt, freight: totalFreight, total };
    }
  };

  const totals = calculateTotals();

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('Identificação da empresa necessária para faturamento do pedido.');
      return;
    }

    if (deliveryMode === 'MULTI_BRANCH' && !isAllocationComplete) {
      alert(`A soma das quantidades por filial (${allocatedSum} un) deve ser exatamente igual ao total do pedido (${totalCartQty} un)!`);
      return;
    }

    if (paymentMethod === 'pix') {
      setIsPixModalOpen(true);
    } else if (paymentMethod === 'boleto_faturado') {
      setIsBoletoModalOpen(true);
    } else {
      ordersService.createOrder({
        companyId: company?.id,
        buyerUserId: user?.id,
        buyerUserName: user?.name,
        items: cartItems.length > 0 
          ? cartItems.map(i => ({ sku: i.sku, quantity: i.quantity, customUnitPrice: i.price }))
          : [{ sku: 'DELL-R750-XS', quantity: totalCartQty, customUnitPrice: unitPrice }],
        paymentType: 'BOLETO_FATURADO',
      }).catch(() => {});
      clearCart();
      setIsSuccess(true);
    }
  };

  const handleModalSuccess = () => {
    setIsPixModalOpen(false);
    setIsBoletoModalOpen(false);
    ordersService.createOrder({
      companyId: company?.id,
      buyerUserId: user?.id,
      buyerUserName: user?.name,
      items: cartItems.length > 0 
        ? cartItems.map(i => ({ sku: i.sku, quantity: i.quantity, customUnitPrice: i.price }))
        : [{ sku: 'DELL-R750-XS', quantity: totalCartQty, customUnitPrice: unitPrice }],
      paymentType: paymentMethod === 'pix' ? 'PIX' : 'BOLETO_FATURADO',
    }).catch(() => {});
    clearCart();
    setIsSuccess(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen py-16 px-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-[#f5f6f6] p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-[#2563eb] mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Autenticação Necessária</h1>
            <p className="text-xs text-gray-500">
              Para prosseguir com o fechamento do pedido e cálculo de impostos por estado (ICMS/ST), identifique sua empresa.
            </p>
          </div>

          <button
            onClick={() => openAuthModal()}
            className="w-full bg-[#2563eb] text-white text-xs font-bold py-3.5 rounded-full transition-all hover:bg-[#1d4ed8] cursor-pointer"
          >
            Entrar com CNPJ ou Cadastrar Empresa
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="bg-white min-h-screen py-16 px-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-[#f8fafc] p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] mx-auto flex items-center justify-center shadow-xs">
            <PackageOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Seu Carrinho Corporativo está Vazio</h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Adicione produtos a partir do catálogo ou envie uma lista via Quick Order (CSV) para prosseguir com o fechamento do pedido e faturamento por CNPJ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/produtos"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quick-order"
              className="bg-white hover:bg-slate-50 text-gray-700 border border-gray-200 text-xs font-bold px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <span>Quick Order (CSV)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen py-16 px-4 font-sans flex items-center justify-center">
        <div className="max-w-lg w-full text-center space-y-6 bg-[#f5f6f6] p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#2563eb] text-white mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Pedido B2B Faturado com Sucesso!</h1>
            <p className="text-xs text-gray-500">
              Obrigado, <strong className="text-gray-900">{name}</strong>. O pedido da empresa <strong>{company?.razaoSocial}</strong> foi registrado e enviado para o faturamento.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl text-left text-xs space-y-3 border border-gray-100">
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-bold">Tipo de Entrega:</span>
              <span className="font-extrabold text-[#2563eb]">
                {deliveryMode === 'SINGLE' ? 'Endereço Único (Matriz)' : 'Split Multi-Filiais (3 Destinos)'}
              </span>
            </div>

            {deliveryMode === 'MULTI_BRANCH' && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-gray-700 block">Distribuição por CNPJ:</span>
                {branchSplits.filter(b => b.allocatedQuantity > 0).map(b => (
                  <div key={b.branchId} className="flex justify-between text-[11px] bg-gray-50 p-2 rounded-lg">
                    <span>{b.branchName}:</span>
                    <strong className="text-gray-900">{b.allocatedQuantity} unidades</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between border-t border-gray-50 pt-2">
              <span className="text-gray-500 font-bold">Total Faturado:</span>
              <span className="font-black text-base text-[#2563eb]">
                R$ {totals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/conta/pedidos"
              className="bg-[#2563eb] text-white text-xs font-bold px-6 py-3 rounded-full transition-all hover:bg-[#1d4ed8]"
            >
              Ver no Painel de Pedidos
            </Link>
            <Link
              href="/"
              className="bg-white border border-gray-200 text-gray-800 text-xs font-bold px-6 py-3 rounded-full transition-all hover:bg-gray-100"
            >
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#2563eb] mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Voltar para a Loja
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finalizar Compra B2B (Checkout Corporativo)</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Suporte a entrega única ou distribuição fracionada para múltiplas filiais CNPJ com cálculo fiscal regional.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="bg-white hover:bg-blue-50 text-[#2563eb] border border-blue-300 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar Proposta PDF</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
              <span>DANFE / NF-e Garantida</span>
            </div>
          </div>
        </div>

        {/* Applied Price Book Banner */}
        <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center">
              <Tag className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-black text-[#2563eb] block">
                {appliedPriceBook?.name || 'Tabela de Preços Corporativa Ouro VIP'} (Ativa para seu CNPJ)
              </span>
              <span className="text-[11px] text-blue-900">
                Preço de contrato aplicado: <strong>R$ {unitPrice.toFixed(2)} / un</strong> (14.1% de desconto sobre a tabela padrão).
              </span>
            </div>
          </div>
          <Link
            href="/conta/tabelas-de-precos"
            className="text-xs font-bold text-[#2563eb] hover:underline shrink-0"
          >
            Ver Todas as Tabelas Contratuais →
          </Link>
        </div>

        {/* 2-Column Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SELEÇÃO DO MODELO DE ENTREGA (ENDEREÇO ÚNICO VS MULTI-FILIAIS) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2563eb]" />
                  <span>1. Modelo de Destino & Entrega</span>
                </h2>
                <span className="text-xs font-semibold text-gray-400">Total: {totalCartQty} unidades</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('SINGLE')}
                  className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                    deliveryMode === 'SINGLE'
                      ? 'border-[#2563eb] bg-blue-50/50 text-[#2563eb] shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" /> Endereço Único
                    </span>
                    {deliveryMode === 'SINGLE' && <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />}
                  </div>
                  <p className="text-xs text-gray-500">Entrega centralizada de 100% da carga na Matriz ou Sede Central.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode('MULTI_BRANCH')}
                  className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                    deliveryMode === 'MULTI_BRANCH'
                      ? 'border-[#2563eb] bg-blue-50/50 text-[#2563eb] shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-500" /> Split Multi-Filiais
                    </span>
                    {deliveryMode === 'MULTI_BRANCH' && <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />}
                  </div>
                  <p className="text-xs text-gray-500">Distribua quantidades para diferentes filiais CNPJ com cálculo fiscal por UF.</p>
                </button>
              </div>

              {/* DETALHAMENTO DE MULTI-FILIAIS */}
              {deliveryMode === 'MULTI_BRANCH' ? (
                <div className="bg-[#f8fafc] p-5 rounded-3xl border border-gray-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-extrabold text-gray-900 text-sm">
                      Alocação de Quantidades por Filial:
                    </span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                      isAllocationComplete ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {allocatedSum} de {totalCartQty} un alocadas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {branchSplits.map((branch) => (
                      <div key={branch.branchId} className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-black text-gray-900 text-xs block">{branch.branchName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">CNPJ: {branch.cnpj} | {branch.address} ({branch.cityUF})</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <label className="font-bold text-gray-600 text-xs">Quantidade:</label>
                            <input
                              type="number"
                              min="0"
                              max={totalCartQty}
                              value={branch.allocatedQuantity}
                              onChange={(e) => handleUpdateBranchQuantity(branch.branchId, Number(e.target.value))}
                              className="w-16 bg-[#f5f6f6] border border-gray-200 rounded-lg p-1.5 text-center font-black text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                            />
                            <span className="text-gray-400 font-bold">un</span>
                          </div>
                        </div>

                        {branch.allocatedQuantity > 0 && (
                          <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between text-[11px] gap-2">
                            <span className="text-gray-600">
                              Subtotal: <strong>R$ {(branch.allocatedQuantity * unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                            </span>
                            <span className="text-gray-600">
                              Alíquota: <strong>ICMS {branch.icmsRate}%</strong>
                            </span>
                            {branch.icmsStAmount > 0 && (
                              <span className="text-amber-800 font-semibold">
                                ICMS-ST Destino: +R$ {branch.icmsStAmount.toFixed(2)}
                              </span>
                            )}
                            <span className="text-gray-600">
                              Prazo Frete: <strong>{branch.deliveryDays} dias úteis</strong> ({branch.freightCost === 0 ? 'FOB Isento' : `R$ ${branch.freightCost.toFixed(2)}`})
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isAllocationComplete && (
                    <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-2xl flex items-center gap-2 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Atenção: Você alocou {allocatedSum} unidades. Faltam {totalCartQty - allocatedSum} unidades para fechar o lote de {totalCartQty}.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* ENDEREÇO ÚNICO DA MATRIZ */
                <div className="bg-[#f8fafc] p-5 rounded-3xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">Endereço Principal de Entrega:</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingDelivery(!isEditingDelivery)}
                      className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                    >
                      {isEditingDelivery ? 'Salvar' : 'Editar'}
                    </button>
                  </div>

                  {isEditingDelivery ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white border rounded-xl p-2 text-xs" />
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="bg-white border rounded-xl p-2 text-xs" />
                    </div>
                  ) : (
                    <div className="font-semibold text-gray-800 leading-relaxed">
                      <p className="font-bold text-gray-900">{company?.razaoSocial} ({company?.cnpj})</p>
                      <p>{address} — {city} (CEP: {zipCode})</p>
                      <p className="text-gray-500 text-[11px] pt-1">Responsável pelo Recebimento: {name} ({mobile})</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. PROGRAMAÇÃO DE ENTREGAS / CRONOGRAMA FRACIONADO */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2563eb]" />
                <span>2. Cronograma de Expedição & Entrega</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  scheduleMode === 'IMMEDIATE' ? 'border-[#2563eb] bg-blue-50/50 text-[#2563eb]' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleMode === 'IMMEDIATE'}
                    onChange={() => setScheduleMode('IMMEDIATE')}
                    className="accent-[#2563eb]"
                  />
                  <div>
                    <span className="font-extrabold block">Expedição Imediata (Lote Total)</span>
                    <span className="text-[11px] text-gray-500">Envio de 100% dos itens em até 24h a 48h.</span>
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  scheduleMode === 'SCHEDULED' ? 'border-[#2563eb] bg-blue-50/50 text-[#2563eb]' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleMode === 'SCHEDULED'}
                    onChange={() => setScheduleMode('SCHEDULED')}
                    className="accent-[#2563eb]"
                  />
                  <div>
                    <span className="font-extrabold block">Entregas Programadas (50% + 50%)</span>
                    <span className="text-[11px] text-gray-500">Fracionamento em 2 datas para controle de estoque.</span>
                  </div>
                </label>
              </div>

              {scheduleMode === 'SCHEDULED' && (
                <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">1º Lote (50% - 5 un)</label>
                    <input
                      type="date"
                      value={scheduleDate1}
                      onChange={(e) => setScheduleDate1(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2 font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">2º Lote (50% - 5 un)</label>
                    <input
                      type="date"
                      value={scheduleDate2}
                      onChange={(e) => setScheduleDate2(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2 font-bold text-gray-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. REVISÃO DOS ITENS */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                3. Itens do Pedido ({totalCartQty} un)
              </h2>

              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[#f8fafc] border border-slate-200/80 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 bg-white rounded-xl p-1.5 relative flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-[11px] text-gray-500">
                          SKU: <span className="font-mono text-gray-800 font-bold">{item.sku}</span>
                          {item.ncm && <> | NCM: {item.ncm}</>}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5 shrink-0">
                      <div className="text-xs sm:text-sm font-black text-[#2563eb]">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-gray-500">Qtd: <strong className="text-gray-900">{item.quantity} un</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. cubagem e eficiencia logistica de carga */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2563eb]" />
                <span>4. Cubagem & Eficiência do Frete CIF</span>
              </h2>
              <CargoSimulator
                items={cartItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                }))}
              />
            </div>

          </div>

          {/* RIGHT COLUMN: RESUMO DO FATURAMENTO & PAGAMENTO */}
          <div className="lg:col-span-5 space-y-6">
            
            <form onSubmit={handleSubmitOrder} className="border border-gray-200 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs bg-white">
              
              <h2 className="text-xl font-black text-gray-900 tracking-tight border-b border-gray-100 pb-3">
                Resumo do Faturamento B2B
              </h2>

              {/* Condições de Pagamento */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-900 block">
                  Condições de Faturamento Corporativo
                </label>

                <div className="space-y-2 text-xs">
                  
                  {/* Boleto Faturado a Prazo */}
                  <label className="flex flex-col p-3.5 rounded-2xl border-2 border-blue-300 bg-blue-50/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'boleto_faturado'}
                          onChange={() => setPaymentMethod('boleto_faturado')}
                          className="accent-[#2563eb]"
                        />
                        <span>Boleto Bancário Faturado (À Prazo)</span>
                      </div>
                      <span className="bg-[#2563eb] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        Crédito Aprovado
                      </span>
                    </div>
                    <div className="pl-6 pt-2 space-y-1">
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value as '28_days' | '28_56_days' | '28_56_84_days')}
                        className="w-full bg-white border border-blue-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800"
                      >
                        <option value="28_days">1x em 28 Dias (Sem Juros)</option>
                        <option value="28_56_days">2x em 28 / 56 Dias (Sem Juros)</option>
                        <option value="28_56_84_days">3x em 28 / 56 / 84 Dias (Sem Juros - Recomendado)</option>
                      </select>
                      <span className="text-[10px] text-gray-500 block">
                        Limite disponível da empresa: R$ {company?.creditLimitAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </label>

                  {/* PIX com Desconto */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="accent-[#2563eb]"
                      />
                      <span>PIX B2B Instantâneo</span>
                    </div>
                    <span className="text-blue-700 font-bold text-[10px]">5% de Desconto À Vista</span>
                  </label>

                  {/* Cartão Corporativo */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#2563eb]"
                      />
                      <span>Cartão de Crédito Corporativo</span>
                    </div>
                    <span className="text-gray-400 font-bold text-[10px]">Até 6x</span>
                  </label>

                </div>
              </div>

              {/* Tabela de Fechamento de Preços e Impostos */}
              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal dos Produtos ({totalCartQty} un):</span>
                  <span className="font-semibold text-gray-900">
                    R$ {totals.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Crédito ICMS Destacado:</span>
                  <span className="font-mono text-blue-700 font-bold">
                    R$ {totals.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {totals.icmsSt > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>ICMS-ST (Substituição Tributária Destino):</span>
                    <span className="font-bold">
                      +R$ {totals.icmsSt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete {deliveryMode === 'MULTI_BRANCH' ? '(3 Destinos)' : '(FOB Dedicado)'}:</span>
                  <span className="font-bold text-blue-700">
                    {totals.freight === 0 ? 'Grátis (FOB)' : `R$ ${totals.freight.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-black text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Geral Faturado:</span>
                  <span className="text-xl text-[#2563eb]">
                    R$ {totals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-black py-4 rounded-full transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Confirmar & Emitir Pedido B2B</span>
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* Modais de Pagamento & Proposta */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        amount={totals.total}
        onConfirmSuccess={handleModalSuccess}
      />

      <BoletoModal
        isOpen={isBoletoModalOpen}
        onClose={() => setIsBoletoModalOpen(false)}
        invoiceNumber="FAT-2026-009873"
        originalAmount={totals.total}
        dueDate="10/09/2026"
      />

      <CommercialProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        items={[
          {
            id: 'prod-2',
            name: 'AirPods Max High-Fi Studio Edition',
            price: unitPrice,
            quantity: totalCartQty,
            sku: 'SKU-HEAD-02'
          }
        ]}
        subtotal={totals.subtotal}
      />

    </div>
  );
}
