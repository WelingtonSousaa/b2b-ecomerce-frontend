'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  RotateCcw,
  Search,
  Filter,
  Download,
  ArrowLeft,
  Loader2,
  Eye,
  X,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Package,
  Copy,
  Check,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { ordersService } from '@/services/orders.service';
import { OrderB2B } from '@/types/b2b';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function PedidosPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<OrderB2B[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [search, setSearch] = useState('');
  const [downloadingDanfe, setDownloadingDanfe] = useState<string | null>(null);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderB2B | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    ordersService.getOrders()
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredOrders = orders.filter(ord => {
    if (filterStatus !== 'TODOS' && ord.status !== filterStatus) return false;
    if (search.trim()) {
      return ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
             ord.id.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleDownloadDanfe = (orderNumber: string) => {
    setDownloadingDanfe(orderNumber);
    setTimeout(() => {
      setDownloadingDanfe(null);
      const content = `=====================================================
DANFE SIMPLIFICADA B2B - SHOPCART PLATFORM
Documento Fiscal Auxiliar de NF-e
=====================================================
Pedido: ${orderNumber}
Chave de Acesso NFe: 3526 0819 4820 0001 5500 1000 0048 2012 3948 1029
Status: Autorizada pelo SEFAZ-SP
Natureza da Operação: Venda de Mercadoria B2B por CNPJ
Ambiente: Produção Fiscal
Emitente: Shopcart Distribuição e Comércio LTDA - CNPJ: 10.987.654/0001-32
Destinatário: Tech Solutions & Tecnologia LTDA - CNPJ: 12.345.678/0001-95
=====================================================`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DANFE_NFe_${orderNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`DANFE da NF-e do pedido ${orderNumber} baixada com sucesso!`, 'success');
    }, 500);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Numero_Pedido', 'Data_Emissao', 'Status', 'Condicao_Pagamento', 'Total_Bruto', 'Desconto_Volume', 'Total_Liquido'],
      ...orders.map(o => [
        `"${o.orderNumber}"`,
        `"${o.createdAt}"`,
        `"${o.status}"`,
        `"Boleto (${o.payment?.termsDays?.join('/') || '30'} dias)"`,
        (o.summary?.subtotal || 0).toFixed(2),
        (o.summary?.discountTotal || 0).toFixed(2),
        (o.summary?.grandTotal || 0).toFixed(2)
      ])
    ];
    const csvContent = '\uFEFF' + csvRows.map(e => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Relatório de pedidos faturados exportado em CSV!', 'success');
  };

  const handleReorder = (ord: OrderB2B) => {
    if (typeof window !== 'undefined' && ord.items && ord.items.length > 0) {
      localStorage.setItem('b2b_checkout_items', JSON.stringify(ord.items));
    }
    showToast(`Itens do pedido ${ord.orderNumber} carregados para recompra!`, 'success');
    router.push('/checkout');
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    showToast('Código de rastreamento copiado!', 'success');
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Pedidos Faturados Corporativos"
        subtitle="Consulte seu histórico de compras faturadas, rastreamento de entregas nos CDs e download de DANFEs."
        activeBadge={`${orders.length} Pedidos Faturados`}
        actions={
          <button
            onClick={handleExportCSV}
            className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Exportar Relatório CSV</span>
          </button>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por número de pedido ou NFe..."
              className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 font-bold shrink-0">
            <Filter className="w-4 h-4 text-[#004e38]" />
            <span>Filtrar Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#f5f6f6] rounded-full px-4 py-2 font-bold text-gray-900 focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="DELIVERED">Entregues</option>
              <option value="APPROVED">Aprovados & Faturados</option>
              <option value="PENDING_APPROVAL">Aguardando Aprovação de Alçada</option>
              <option value="PROCESSING">Em Separação no CD</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
          {isLoading ? (
            <div className="p-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto" />
              <p className="text-xs font-bold text-gray-500">Carregando pedidos corporativos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <p className="text-sm font-bold text-gray-700">Nenhum pedido encontrado.</p>
              <p className="text-xs text-gray-400">Monte um novo pedido corporativo no catálogo de produtos.</p>
              <Link
                href="/produtos"
                className="inline-block mt-2 bg-[#004e38] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#033627] transition-colors"
              >
                Ir para o Catálogo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#004e38] text-white font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Nº do Pedido</th>
                    <th className="p-4">Data Emissão</th>
                    <th className="p-4">Condição Pagamento</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Valor Total Faturado</th>
                    <th className="p-4 text-center">DANFE & Detalhes</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#f5f6f6]/60 transition-colors">
                      <td className="p-4 font-bold font-mono text-gray-900">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="hover:underline text-[#004e38] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{ord.orderNumber}</span>
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </td>
                      <td suppressHydrationWarning className="p-4 text-gray-600">
                        {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-gray-700 font-semibold">
                        Boleto Faturado ({ord.payment?.termsDays?.join('/') || '30'} dias)
                      </td>
                      <td className="p-4 text-center">
                        {ord.status === 'DELIVERED' && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Entregue
                          </span>
                        )}
                        {ord.status === 'APPROVED' && (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Aprovado
                          </span>
                        )}
                        {ord.status === 'PENDING_APPROVAL' && (
                          <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md text-[10px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" /> Aguardando Alçada
                          </span>
                        )}
                        {ord.status === 'PROCESSING' && (
                          <span className="bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-md text-[10px] inline-flex items-center gap-1">
                            <Truck className="w-3 h-3 text-purple-600" /> Em Separação
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-black text-[#004e38] text-sm">
                        R$ {(ord.summary?.grandTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadDanfe(ord.orderNumber)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004e38] hover:underline cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{downloadingDanfe === ord.orderNumber ? 'Baixando...' : 'DANFE NF-e'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => handleReorder(ord)}
                          className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                          <span>Recomprar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL DE DETALHES DO PEDIDO COM STATUS TIMELINE */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#004e38] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-[#004e38] bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedOrder.orderNumber}
                  </span>
                  <h2 className="text-lg font-black text-gray-900 mt-0.5">Detalhes do Pedido Corporativo</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Status Timeline */}
            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-3">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Linha do Tempo de Rastreamento & Expedição Multi-CD
              </span>

              <div className="flex items-center justify-between text-xs font-bold relative">
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-7 h-7 rounded-full bg-[#004e38] text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="text-[10px] text-gray-800">1. Aprovado</span>
                </div>

                <div className="flex-1 h-1 bg-[#004e38] mx-2"></div>

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-7 h-7 rounded-full bg-[#004e38] text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="text-[10px] text-gray-800">2. Faturado NF-e</span>
                </div>

                <div className="flex-1 h-1 bg-[#004e38] mx-2"></div>

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-7 h-7 rounded-full bg-[#004e38] text-white flex items-center justify-center text-xs">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-[#004e38] font-black">3. Em Rota CD</span>
                </div>

                <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
                    4
                  </div>
                  <span className="text-[10px] text-gray-400">4. Entregue</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-500">Rastreamento Jadlog / Braspress:</span>
                <button
                  onClick={() => handleCopyTracking('BR-SP-2026-9812450')}
                  className="font-mono font-bold text-[#004e38] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>BR-SP-2026-9812450</span>
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Informações Gerais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f8fafc] p-4 rounded-2xl text-xs border border-gray-200">
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Data de Emissão</span>
                <strong className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Status</span>
                <strong className="text-[#004e38] font-bold">{selectedOrder.status}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Condição de Pagamento</span>
                <strong className="text-gray-900">Boleto ({selectedOrder.payment?.termsDays?.join('/') || '30'} dias)</strong>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">Itens e SKUs Faturados</h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Produto / SKU</th>
                      <th className="p-3 text-center">Qtd</th>
                      <th className="p-3 text-right">Unitário</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{item.product?.name || 'Produto Corporativo'}</p>
                          <span className="font-mono text-[10px] text-gray-400">{item.product?.sku || 'SKU'}</span>
                        </td>
                        <td className="p-3 text-center font-bold">{item.quantity} un.</td>
                        <td className="p-3 text-right text-gray-600">R$ {item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-black text-gray-900">
                          R$ {(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumo Financeiro e Fiscal */}
            <div className="bg-[#f8fafc] p-4 rounded-2xl space-y-2 text-xs border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal dos Produtos:</span>
                <span className="font-bold text-gray-900">R$ {(selectedOrder.summary?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Desconto de Volume B2B:</span>
                <span>- R$ {(selectedOrder.summary?.discountTotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tributos (ICMS-ST / DIFAL):</span>
                <span className="font-bold text-gray-900">Incluso na NF-e</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-black text-[#004e38]">
                <span>Total Geral Faturado:</span>
                <span>R$ {(selectedOrder.summary?.grandTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleDownloadDanfe(selectedOrder.orderNumber)}
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#004e38]" />
                <span>Imprimir DANFE Auxiliar</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
