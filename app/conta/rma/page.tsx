'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  RotateCcw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Truck,
  Clock,
  Upload,
  X,
  Printer,
  Barcode,
  Package,
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { rmaService } from '@/services/rma.service';
import { RmaTicket, RmaReason, RmaStatus, DEFAULT_DISTRIBUTION_CENTERS } from '@/types/b2b';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function RmaDevolucoesPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<RmaTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Print Reverse Voucher Modal State
  const [selectedTicketForPrint, setSelectedTicketForPrint] = useState<RmaTicket | null>(null);

  // New RMA form state
  const [orderNumber, setOrderNumber] = useState('PED-2026-9871');
  const [selectedSku, setSelectedSku] = useState('DELL-R750-XS');
  const productName = 'Servidor PowerEdge R750 Xeon Silver';
  const [lotNumber, setLotNumber] = useState('LOT-2026-08A');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<RmaReason>('TRANSPORT_DAMAGE');
  const [description, setDescription] = useState('');
  const [cdDestination, setCdDestination] = useState('cd-sp');
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    rmaService.getRmaTickets()
      .then((res) => {
        if (res.data) {
          setTickets(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'TODOS' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.protocolNumber.toLowerCase().includes(q) ||
             t.orderNumber.toLowerCase().includes(q) ||
             (t.reverseTrackingCode && t.reverseTrackingCode.toLowerCase().includes(q)) ||
             t.items.some(i => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return true;
  });

  const getStatusBadge = (status: RmaStatus) => {
    switch (status) {
      case 'APPROVED_SHIPPING':
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-200 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-600" /> Código Reverso Emitido
          </span>
        );
      case 'CREDIT_ISSUED':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Carta de Crédito Emitida
          </span>
        );
      case 'INSPECTION_PENDING':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Em Triagem Técnica
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 font-bold text-[10px] px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Central de RMA, Garantias & Logística Reversa"
        subtitle="Gestão de devoluções de lotes por avaria em transporte, garantia de fábrica e emissão de autorização de postagem reversa."
        activeBadge={`${tickets.length} Protocolos`}
        actions={
          <Link
            href="/conta/rma/novo"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Solicitar RMA / Devolução de Lote</span>
          </Link>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 uppercase">Total de Tickets RMA</span>
            <div className="text-2xl font-black text-gray-900">{tickets.length} Protocolos</div>
            <span className="text-[10px] text-gray-500">Histórico de trocas e garantias</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-blue-200 bg-blue-50/40 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-blue-900 uppercase">Código Reverso Emitido</span>
            <div className="text-2xl font-black text-blue-950">
              {tickets.filter(t => t.status === 'APPROVED_SHIPPING').length} Protocolos
            </div>
            <span className="text-[10px] text-blue-800 font-medium">Mercadorias em trânsito de retorno</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-emerald-50/40 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-emerald-900 uppercase">Créditos Homologados</span>
            <div className="text-2xl font-black text-[#004e38]">
              R$ {tickets.reduce((acc, t) => acc + (t.creditVoucherAmount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-800 font-medium">Abatidos em faturas ou reembolsados</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 uppercase">SLA Médio de Resolução</span>
            <div className="text-2xl font-black text-gray-900">48 Horas</div>
            <span className="text-[10px] text-emerald-700 font-semibold">100% de laudos dentro do prazo</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por Protocolo RMA, Pedido, SKU ou Código Reverso..."
              className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 font-bold shrink-0">
            <Filter className="w-4 h-4 text-[#004e38]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f5f6f6] rounded-full px-4 py-2 font-bold text-gray-900 focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="APPROVED_SHIPPING">Código Reverso Emitido</option>
              <option value="CREDIT_ISSUED">Carta de Crédito Emitida</option>
              <option value="INSPECTION_PENDING">Em Triagem Técnica</option>
            </select>
          </div>
        </div>

        {/* RMA Tickets List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 shadow-2xs">
              <RotateCcw className="w-8 h-8 text-[#004e38] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">Carregando protocolos de devolução e RMA...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 shadow-2xs">
              <p className="text-sm font-bold text-gray-700">Nenhum protocolo RMA encontrado.</p>
              <p className="text-xs text-gray-400">Abra uma nova solicitação caso precise devolver um lote com avaria.</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4 hover:border-[#004e38] transition-all">
                
                {/* Card Top: Protocol & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-gray-900">{ticket.protocolNumber}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-500 font-bold">Pedido: {ticket.orderNumber}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">Aberto em: {ticket.createdAt} | Destino: {ticket.cdDestinationName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                {/* Items in RMA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {ticket.items.map((item, idx) => (
                    <div key={idx} className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-2 flex gap-3 items-start">
                      <div className="w-14 h-14 bg-white rounded-xl p-1 relative flex items-center justify-center shrink-0 border border-gray-200 shadow-2xs">
                        <Image src={item.evidenceImages[0] || '/media/img1.jpeg'} alt={item.productName} fill className="object-contain p-1" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="font-extrabold text-gray-900 block line-clamp-1">{item.productName}</span>
                        <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-semibold">
                          <span>SKU: <strong className="text-gray-800">{item.sku}</strong></span>
                          <span>Lote: <strong className="text-gray-800 font-mono">{item.lotNumber}</strong></span>
                          <span>Qtd: <strong className="text-[#004e38]">{item.quantity} un</strong></span>
                        </div>
                        <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                          Motivo: {item.reasonDescription}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Tracking & Resolution Details */}
                  <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-2 text-xs flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                        Instruções de Postagem & Resolução
                      </span>
                      <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                        {ticket.resolutionNotes}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                      {ticket.reverseTrackingCode && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Barcode className="w-4 h-4 text-[#004e38]" />
                          <span className="text-gray-500">Rastreio Reverso:</span>
                          <strong className="text-[#004e38]">{ticket.reverseTrackingCode}</strong>
                        </div>
                      )}

                      {ticket.creditVoucherAmount && (
                        <span className="font-black text-[#004e38] text-xs">
                          Valor Crédito: R$ {ticket.creditVoucherAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => setSelectedTicketForPrint(ticket)}
                    className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Visualizar & Imprimir Etiqueta Reversa</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* MODAL 2: IMPRESSÃO DE ETIQUETA REVERSA & MINUTA */}
      {selectedTicketForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden relative p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">Autorização de Postagem Reversa</h3>
                  <p className="text-[10px] text-gray-400 font-mono">Protocolo: {selectedTicketForPrint.protocolNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicketForPrint(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Reverse Voucher Preview */}
            <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-2xl space-y-4 shadow-inner">
              <div className="flex justify-between items-start border-b border-gray-200 pb-3 text-xs">
                <div>
                  <span className="font-black text-[#004e38] text-sm block">SHOPCART LOGÍSTICA REVERSA B2B</span>
                  <span className="text-[10px] text-gray-500 font-mono">CONTRATO ECT: 9912345678/2026</span>
                </div>
                <span className="bg-blue-50 text-blue-900 border border-blue-200 font-bold px-2 py-0.5 rounded text-[10px]">
                  PAC REVERSO
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Destinatário (Centro de Distribuição)</span>
                  <p className="font-bold text-gray-900">{selectedTicketForPrint.cdDestinationName}</p>
                  <p className="text-[11px] text-gray-600">A/C: Departamento de Triagem & Laudos RMA</p>
                </div>
              </div>

              {/* Barcode */}
              <div className="py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-1.5">
                <div className="flex items-end justify-center gap-0.5 h-14 w-full max-w-[260px]">
                  {[2, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 2, 1].map((w, idx) => (
                    <div key={idx} className="bg-gray-900 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <span className="font-mono text-xs font-black tracking-[0.2em] text-gray-900">
                  {selectedTicketForPrint.reverseTrackingCode}
                </span>
              </div>

              <div className="text-[10px] text-gray-500 space-y-1 border-t border-gray-100 pt-2">
                <p>• Apresente esta autorização em qualquer agência autorizada dos Correios ou Transportadora parceira.</p>
                <p>• Validade do código de postagem: <strong>15 dias corridos</strong>.</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTicketForPrint(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Fechar
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('Etiqueta reversa enviada para impressão!', 'success');
                  setSelectedTicketForPrint(null);
                }}
                className="bg-[#004e38] hover:bg-[#033627] text-white font-black text-xs px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Imprimir Autorização</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
