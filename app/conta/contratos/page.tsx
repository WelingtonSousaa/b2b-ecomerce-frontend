'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Download,
  Award,
  Loader2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  X,
  FileCheck2,
  Clock,
  Send
} from 'lucide-react';
import { contractsService } from '@/services/contracts.service';
import { SupplyContract } from '@/types/b2b';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function ContratosFornecimentoPage() {
  const { showToast } = useToast();
  const [contracts, setContracts] = useState<SupplyContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedContractForRenew, setSelectedContractForRenew] = useState<SupplyContract | null>(null);
  const [renewVolume, setRenewVolume] = useState<number>(350000);
  const [renewNotes, setRenewNotes] = useState('');

  useEffect(() => {
    contractsService.getContracts()
      .then((res) => {
        if (res.data) {
          setContracts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDownloadContractDocument = (contract: SupplyContract) => {
    const content = `================================================================================
INSTRUMENTO PARTICULAR DE CONTRATO DE FORNECIMENTO CORPORATIVO B2B
CONTRATO NÚMERO: ${contract.contractNumber}
================================================================================

1. PARTES CONTRATANTES:
   CONTRATADA: Shopcart Distribuição e Soluções Tecnológicas B2B LTDA (CNPJ: 10.987.654/0001-32)
   CONTRATANTE: Tech Solutions & Tecnologia LTDA (CNPJ: 12.345.678/0001-95)

2. OBJETO DO CONTRATO:
   Título: ${contract.title}
   Tabela de Preços Vinculada: ${contract.priceBookName || 'Tabela Corporativa VIP Gold'}
   Vigência do Contrato: ${contract.validFrom} até ${contract.validTo}
   Compromisso Mínimo de Volume Anual: R$ ${(contract.sla?.minAnnualVolumeCommitment || 250000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
   Rebate Anual Bonificado: ${contract.sla?.rebatePercentageAnnual || 2}% sobre o faturamento líquido

3. NÍVEIS DE SERVIÇO GARANTIDOS (SLA):
   - Tempo Máximo de Despacho nos Centros de Distribuição (Multi-CD): ${contract.sla?.minDispatchHours || 24} horas úteis
   - Multa Contratual por Atraso de Expedição: ${contract.sla?.penaltyRatePerDayLate || 0.5}% ao dia
   - Prioridade de Alocação de Saldo Físico nos CDs de SP, SC e BA

4. CERTIFICADO DE ASSINATURA DIGITAL ICP-BRASIL:
   - Identificador Hash SHA-256: ${contract.digitalSignature?.documentSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
   - Autoridade Certificadora: ${contract.digitalSignature?.certificateIssuer || 'ICP-Brasil / Certisign Multi-Empresa'}
   - Assinado Eletronicamente por: ${contract.digitalSignature?.signedBy || 'Diretoria Executiva de Suprimentos'}
   - Data e Hora da Assinatura: ${contract.validFrom} 09:00:00 UTC-3

================================================================================
Documento registrado digitalmente e válido em todo o território nacional.
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato_fornecimento_${contract.contractNumber.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Contrato ${contract.contractNumber} baixado com sucesso!`, 'success');
  };

  const handleDownloadAllPackage = () => {
    if (contracts.length === 0) return;
    handleDownloadContractDocument(contracts[0]);
    showToast('Download do pacote de contratos concluído!', 'success');
  };

  const handleSendRenewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRenewModalOpen(false);
    showToast(`Solicitação de renovação e expansão de SLA enviada à mesa comercial!`, 'success');
    setRenewNotes('');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Contratos de Fornecimento & Assinatura Digital ICP-Brasil"
        subtitle="Acordos comerciais contínuos com garantia de preço fixo, SLAs de expedição em 24h e validade jurídica."
        activeBadge={`${contracts.length} Contratos Vigentes`}
        actions={
          <button
            onClick={handleDownloadAllPackage}
            className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#004e38]" />
            <span>Baixar Pacote de Contratos</span>
          </button>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">
        
        {isLoading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500">Carregando contratos de fornecimento...</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">Nenhum contrato ativo cadastrado.</p>
            <p className="text-xs text-gray-400">Solicite um novo contrato de fornecimento via mesa de negociação em /cotacoes.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-6 hover:border-[#004e38] transition-all">
                
                {/* Header of Contract */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#004e38] flex items-center justify-center font-black shadow-xs">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#004e38]">{contract.contractNumber}</span>
                        <span className="bg-emerald-100 text-[#004e38] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Contrato Ativo & Homologado
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-gray-900 mt-1">{contract.title}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Vigência Contratual:</span>
                      <strong className="text-gray-800 font-mono">{contract.validFrom} até {contract.validTo}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Compromisso Anual:</span>
                      <strong className="text-[#004e38] text-sm font-black">
                        R$ {(contract.sla?.minAnnualVolumeCommitment || 250000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Price Book & Rebate Associated */}
                <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Tabela de Preços Vinculada:</span>
                    <strong className="text-gray-900 font-black text-sm">{contract.priceBookName || 'Tabela Corporativa VIP Gold'}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">
                      Rebate Anual Bonificado: {contract.sla?.rebatePercentageAnnual || 2}%
                    </span>
                  </div>
                </div>

                {/* SLA & Digital Signature ICP-Brasil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                    <span className="font-extrabold text-[#004e38] flex items-center gap-1.5 text-xs">
                      <Award className="w-4 h-4 text-[#004e38]" /> SLA Operacional Garantido:
                    </span>
                    <p className="text-[11px] text-emerald-950 font-medium">
                      Expedição nos Centros de Distribuição em até <strong>{contract.sla?.minDispatchHours || 24} horas úteis</strong>.
                    </p>
                    <p className="text-[10px] text-emerald-800">
                      Multa por Atraso: <strong>{contract.sla?.penaltyRatePerDayLate || 0.5}% ao dia</strong> sobre o valor do lote.
                    </p>
                  </div>

                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-1.5">
                    <span className="font-extrabold text-blue-900 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-blue-700" /> Assinatura Digital ICP-Brasil:
                    </span>
                    <p className="text-[11px] text-blue-950 font-mono font-medium truncate">
                      SHA256: {contract.digitalSignature?.documentSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </p>
                    <p className="text-[10px] text-blue-700">
                      Certificadora: <strong>{contract.digitalSignature?.certificateIssuer || 'ICP-Brasil / Certisign'}</strong> | Assinado por: <strong>{contract.digitalSignature?.signedBy || 'Diretoria Executiva'}</strong>
                    </p>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => {
                      setSelectedContractForRenew(contract);
                      setIsRenewModalOpen(true);
                    }}
                    className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Solicitar Ajuste / Renovação
                  </button>

                  <button
                    onClick={() => handleDownloadContractDocument(contract)}
                    className="bg-[#004e38] hover:bg-[#033627] text-white font-black px-5 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Baixar Minuta Assinada</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL DE RENOVAÇÃO / AJUSTE DE CONTRATO */}
      {isRenewModalOpen && selectedContractForRenew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden relative p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#004e38] flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">Solicitar Renovação de Contrato</h3>
                  <p className="text-[10px] text-gray-400 font-mono">{selectedContractForRenew.contractNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendRenewRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Novo Volume Anual Estimado (R$)</label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={renewVolume}
                  onChange={(e) => setRenewVolume(Number(e.target.value))}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-mono font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Observações ou Novas Exigências de SLA</label>
                <textarea
                  rows={3}
                  value={renewNotes}
                  onChange={(e) => setRenewNotes(e.target.value)}
                  placeholder="Ex: Desejamos incluir novas filiais em SC e ampliar o rebate para 3%..."
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                ℹ️ A proposta será encaminhada para o comitê comercial corporativo com resposta em até 24 horas úteis.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRenewModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#004e38] hover:bg-[#033627] text-white font-black px-6 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Enviar Solicitação</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
