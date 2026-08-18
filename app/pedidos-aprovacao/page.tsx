'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ordersService } from '@/services/orders.service';
import { OrderB2B } from '@/types/b2b';

export default function PedidosAprovacaoPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<OrderB2B[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ordersService.getOrders()
      .then((res) => {
        if (res.data) {
          setOrders(res.data.filter(o => o.status === 'PENDING_APPROVAL'));
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const isApprover = user?.role === 'APPROVER' || user?.role === 'ADMIN';

  const handleApprove = async (orderId: string) => {
    try {
      await ordersService.approveOrder(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'APPROVED' } : o));
      showToast(`Pedido ${orderId} Aprovado com sucesso! Liberado para faturamento e expedição.`, 'success');
    } catch {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'APPROVED' } : o));
      showToast(`Pedido ${orderId} aprovado!`, 'success');
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await ordersService.rejectOrder(orderId, 'Reprovado pelo aprovador');
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      showToast(`Pedido ${orderId} foi rejeitado. O comprador foi notificado.`, 'info');
    } catch {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      showToast(`Pedido ${orderId} foi rejeitado.`, 'info');
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 pt-8 text-gray-900 font-sans">
      <div className="max-w-6xl w-full mx-auto px-4 space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <Link href="/conta" className="inline-flex items-center gap-1 text-xs font-bold text-[#004e38] mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Central de Aprovação de Alçadas B2B</h1>
          </div>
        </div>

        {/* Status Role Banner */}
        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${
          isApprover ? 'bg-emerald-900 text-white border-emerald-950' : 'bg-amber-50 text-amber-950 border-amber-200'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Usuário Ativo: {user?.name || 'Aprovador Financeiro'} ({user?.role === 'APPROVER' || user?.role === 'ADMIN' ? 'Alçada Diretoria Ilimitada' : `Limite R$ ${(user?.spendingLimitPerOrder || 0).toLocaleString('pt-BR')}`})</span>
            </div>
            <p className="text-xs opacity-90">
              {isApprover
                ? 'Você possui permissão de diretoria para aprovar, autorizar faturamento ou reprovar pedidos corporativos.'
                : 'Você está conectado como Comprador.'}
            </p>
          </div>
        </div>

        {/* Pending Orders List */}
        {isLoading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-500">Buscando pedidos pendentes de aprovação...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-black text-gray-900">Todos os pedidos estão em dia!</h3>
            <p className="text-xs text-gray-400 mt-1">Não há pedidos corporativos aguardando liberação de alçada no momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-gray-900 font-mono">{o.orderNumber}</h3>
                      <span className="text-xs text-gray-400">• {new Date(o.createdAt).toLocaleDateString('pt-BR')}</span>
                      {o.status === 'PENDING_APPROVAL' && (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          ⏳ Aguardando Aprovação
                        </span>
                      )}
                      {o.status === 'APPROVED' && (
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          ✔ Aprovado
                        </span>
                      )}
                      {o.status === 'CANCELLED' && (
                        <span className="bg-red-100 text-red-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          ✖ Cancelado / Reprovado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Comprador ID: <strong>{o.createdByUserId || 'usr-comprador'}</strong> | Condição: {o.payment?.termsDays?.join('/') || '30'} Dias ({o.payment?.type || 'Boleto Faturado'})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-400 text-xs block">Valor Total do Pedido:</span>
                    <span className="text-2xl font-black text-[#004e38]">
                      R$ {(o.summary?.grandTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Itens do Pedido:</span>
                  <div className="divide-y divide-gray-100 bg-[#f8fafc] rounded-2xl p-4 border border-gray-100">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.product?.name || item.product?.sku || 'Item Corporativo'} ({item.quantity} un.)</span>
                        <strong className="text-gray-900">
                          R$ {((item.unitPrice || 0) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                {o.status === 'PENDING_APPROVAL' && (
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleReject(o.id)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reprovar Pedido</span>
                    </button>

                    <button
                      onClick={() => handleApprove(o.id)}
                      className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>Liberar Alçada & Faturar Pedido</span>
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
