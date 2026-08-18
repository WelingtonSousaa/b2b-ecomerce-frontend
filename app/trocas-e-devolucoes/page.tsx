'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, FileText, Truck } from 'lucide-react';

export default function TrocasDevolucoesPage() {
  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Trocas & Devoluções (RMA)</span>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Regulamento de RMA Corporativo
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Política de Trocas, Devoluções & Garantia B2B
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Diretrizes formais para solicitações de devolução legal, avaria de transporte e garantia de fábrica para compras realizadas por CNPJ.
          </p>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-1">
            <div className="flex items-center gap-2 text-[#004e38] font-bold text-xs">
              <RotateCcw className="w-4 h-4" /> 30 Dias de Devolução
            </div>
            <p className="text-[11px] text-gray-600">Devolução garantida sem custos contratuais no prazo legal.</p>
          </div>

          <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-1">
            <div className="flex items-center gap-2 text-[#004e38] font-bold text-xs">
              <Truck className="w-4 h-4" /> Ressalva em Carga
            </div>
            <p className="text-[11px] text-gray-600">Avarias externas devem ser anotadas no CTE no ato da entrega.</p>
          </div>

          <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-1">
            <div className="flex items-center gap-2 text-[#004e38] font-bold text-xs">
              <FileText className="w-4 h-4" /> NF-e de Devolução
            </div>
            <p className="text-[11px] text-gray-600">Operação regularizada com emissão de nota de devolução pelo cliente.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-xs text-gray-700 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              1. Devolução por Desistência / Arrependimento (Até 30 dias)
            </h2>
            <p>
              Conforme as diretrizes comerciais da Shopcart B2B, aceitamos a devolução por desistência em até <strong>30 (trinta) dias corridos</strong> a contar da data de recebimento do pedido no estabelecimento do cliente.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>O produto deve ser devolvido em sua embalagem original, sem indícios de uso ou violação dos lacres de fábrica.</li>
              <li>A empresa compradora deverá emitir uma <strong>Nota Fiscal Eletrônica de Devolução (CFOP 5.202 / 6.202)</strong> correspondente à NF-e de origem.</li>
              <li>O estorno do valor ou abatimento na fatura em aberto será processado em até 3 (três) dias úteis após a conferência nos nossos Centros de Distribuição.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              2. Produto com Avaria de Transporte ou Divergência no Lote
            </h2>
            <p>
              O cliente corporativo deve inspecionar os volumes no ato da entrega pela transportadora (seja na modalidade CIF ou FOB).
            </p>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-950 font-medium space-y-1">
              <strong>Procedimento Obrigatório de Ressalva:</strong>
              <p className="text-[11px]">
                Caso a embalagem apresente amassados, lacre violado ou rasuras, o recebedor deve registrar a ressalva no verso do Conhecimento de Transporte Eletrônico (CT-e) e notificar nosso suporte de RMA imediatamente via e-mail (rma@shopcart.com.br).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-2">
              3. Garantia de Fábrica e Suporte Técnico (RMA)
            </h2>
            <p>
              Todos os produtos comercializados na Shopcart possuem garantia oficial de fábrica contra defeitos de fabricação (prazo mínimo de 12 meses para eletrônicos e equipamentos de áudio).
            </p>
            <p>
              Para acionar o RMA, envie um e-mail para <strong className="text-gray-900">rma@shopcart.com.br</strong> contendo o número da Nota Fiscal, número de série do produto e breve descrição/foto da falha apresentada.
            </p>
          </div>

        </div>

        {/* CTA Contact */}
        <div className="bg-[#f5f6f6] p-6 rounded-2xl flex items-center justify-between text-xs font-bold text-[#004e38] border border-gray-200">
          <span>Dúvidas sobre o preenchimento da NF-e de devolução?</span>
          <Link href="/contato" className="bg-[#004e38] text-white px-5 py-2.5 rounded-full hover:bg-[#033627] transition-colors">
            Falar com Suporte Fiscal
          </Link>
        </div>

      </div>
    </div>
  );
}
