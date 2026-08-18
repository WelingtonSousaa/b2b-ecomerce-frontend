'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  RefreshCw,
  Database,
  Loader2,
  Server,
  Zap,
  Radio,
  Clock,
  Eye,
  X,
  Code,
  Sparkles,
  Play
} from 'lucide-react';
import { integrationsService } from '@/services/integrations.service';
import { ErpIntegration, WebhookLog } from '@/types/b2b';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function IntegracoesErpPage() {
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<ErpIntegration[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEmittingTest, setIsEmittingTest] = useState(false);

  // Selected Log Modal State
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      integrationsService.getIntegrations(),
      integrationsService.getWebhookLogs(),
    ]).then(([intRes, logRes]) => {
      if (isMounted) {
        if (intRes.data) setIntegrations(intRes.data);
        if (logRes.data) setLogs(logRes.data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await integrationsService.triggerSync();
      const [intRes, logRes] = await Promise.all([
        integrationsService.getIntegrations(),
        integrationsService.getWebhookLogs(),
      ]);
      if (intRes.data) setIntegrations(intRes.data);
      if (logRes.data) setLogs(logRes.data);
      showToast('Sincronização com TOTVS, SAP e Bling concluída com sucesso!', 'success');
    } catch {
      showToast('Erro ao sincronizar com ERPs.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTriggerTestWebhook = () => {
    setIsEmittingTest(true);
    setTimeout(() => {
      const newLog: WebhookLog = {
        id: `wh-${Date.now()}`,
        event: 'ORDER_SYNC_MANUAL',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        responseStatus: 200,
        durationMs: Math.floor(40 + Math.random() * 80),
        payloadSummary: `Simulação de Webhook: Pedido PED-2026-${Math.floor(1000 + Math.random() * 9000)} enviado com sucesso ao TOTVS Protheus.`
      };
      setLogs(prev => [newLog, ...prev]);
      setIsEmittingTest(false);
      showToast('Webhook de teste disparado e processado com HTTP 200 OK!', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Monitor de Integrações ERP & Webhooks"
        subtitle="Conexão bidirecional em tempo real com TOTVS Protheus, SAP S/4HANA, Bling e Tiny para pedidos, faturamento e estoque."
        activeBadge={`${integrations.length} ERPs Conectados • ${logs.length} Webhooks`}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerTestWebhook}
              disabled={isEmittingTest}
              className="bg-white hover:bg-emerald-50 text-[#004e38] border border-emerald-300 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-amber-500 ${isEmittingTest ? 'animate-bounce' : ''}`} />
              <span>{isEmittingTest ? 'Disparando...' : 'Disparar Webhook Teste'}</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando ERPs...' : 'Sincronizar Todos os ERPs'}</span>
            </button>
          </div>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">
        
        {isLoading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500">Carregando conectores ERP e logs de webhooks...</p>
          </div>
        ) : (
          <>
            {/* ERP Connectors Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrations.map((erp) => (
                <div key={erp.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4 hover:border-[#004e38] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#004e38] flex items-center justify-center font-bold">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-black text-sm text-gray-900">{erp.displayName || erp.erpName}</h2>
                        <span className="text-[10px] text-gray-400 font-mono">{erp.erpName}</span>
                      </div>
                    </div>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3 font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className="bg-emerald-50 text-emerald-800 font-black text-[10px] px-2 py-0.5 rounded border border-emerald-200">
                        Online / Conectado
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Última Sincronização:</span>
                      <span className="text-gray-800 font-mono text-[11px] font-bold">{erp.lastSyncTimestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pedidos Sincronizados:</span>
                      <strong className="text-[#004e38] font-mono text-xs">{erp.syncedOrdersCount || 0} pedidos</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Webhook Activity Stream Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs space-y-4 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-base text-gray-900">Logs de Eventos & Webhooks em Tempo Real</h2>
                    <p className="text-xs text-gray-400">Clique em qualquer evento para inspecionar os cabeçalhos HTTP e o payload JSON.</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-500 font-bold bg-[#f5f6f6] px-3 py-1 rounded-full">
                  Total: {logs.length} eventos registrados
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="py-3.5 px-2 hover:bg-[#f8fafc] rounded-2xl transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[10px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          {log.event}
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          HTTP {log.responseStatus} OK
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs font-medium">{log.payloadSummary}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <span className="font-mono text-[11px] text-gray-400">{log.durationMs}ms</span>
                      <span className="text-[#004e38] font-bold text-xs hover:underline flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver JSON</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      {/* MODAL DE DETALHES DO WEBHOOK */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden relative p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                  <Code className="w-4 h-4 text-[#004e38]" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">Inspecionar Payload do Webhook</h3>
                  <p className="text-[10px] text-gray-400 font-mono">Evento: {selectedLog.event} • {selectedLog.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-3 gap-2 bg-[#f8fafc] p-3 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-gray-400 font-bold text-[10px] uppercase block">Status Code</span>
                  <span className="font-mono font-black text-emerald-700">HTTP {selectedLog.responseStatus} OK</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold text-[10px] uppercase block">Latência</span>
                  <span className="font-mono font-black text-gray-800">{selectedLog.durationMs} ms</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold text-[10px] uppercase block">Protocolo</span>
                  <span className="font-mono font-bold text-gray-800">TLS 1.3 / REST</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 block">Payload JSON Formatado</span>
                <pre className="bg-gray-950 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-gray-800">
{JSON.stringify({
  eventId: selectedLog.id,
  event: selectedLog.event,
  timestamp: selectedLog.timestamp,
  companyCnpj: '12.345.678/0001-95',
  targetErp: 'TOTVS_PROTHEUS_S4HANA',
  payload: {
    message: selectedLog.payloadSummary,
    syncStatus: 'SUCCESS',
    environment: 'PRODUCTION_ERP'
  }
}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all"
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
